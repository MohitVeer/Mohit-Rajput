import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { fetchLiveVisitors, type LiveVisitorRow } from '../../../lib/adminApi'
import ChartCard from '../ChartCard'
import VisitorTimelineModal from './VisitorTimelineModal'

const ACTIVE_WINDOW_MINUTES = 5
const POLL_INTERVAL_MS = 15_000

function timeSince(iso: string, now: number): string {
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export default function LiveVisitors() {
  const [visitors, setVisitors] = useState<LiveVisitorRow[]>([])
  const [now, setNow] = useState(() => Date.now())
  const [selectedSession, setSelectedSession] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      fetchLiveVisitors(ACTIVE_WINDOW_MINUTES)
        .then((rows) => {
          if (!cancelled) setVisitors(rows)
        })
        .catch(() => {
          /* transient — next poll or realtime event will retry */
        })
    }

    load()
    const poll = setInterval(load, POLL_INTERVAL_MS)

    const channel = supabase
      ?.channel('admin-live-sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, load)
      .subscribe()

    return () => {
      cancelled = true
      clearInterval(poll)
      if (channel) supabase?.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <ChartCard title={`Live now: ${visitors.length}`}>
      {visitors.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No one's on the site right now</p>
      ) : (
        <ul className="divide-y divide-border">
          {visitors.map((v) => (
            <li key={v.session_id}>
              <button
                type="button"
                onClick={() => setSelectedSession(v.session_id)}
                className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:bg-accent/5"
              >
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    Visitor #{v.visitor_short}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {[v.city, v.country].filter(Boolean).join(', ') || 'Unknown location'} ·{' '}
                    {v.entry_path} → {v.current_path} · {v.device_type || 'unknown device'}
                  </p>
                </div>
                <div className="shrink-0 text-right font-mono text-xs text-muted-foreground">
                  <p>Active {timeSince(v.started_at, now)}</p>
                  <p>Last seen {timeSince(v.last_activity_at, now)} ago</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <VisitorTimelineModal sessionId={selectedSession} onClose={() => setSelectedSession(null)} />
    </ChartCard>
  )
}
