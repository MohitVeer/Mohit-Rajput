import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { fetchSessionTimeline, type TimelineRow } from '../../../lib/adminApi'
import { formatSeconds } from './chartTheme'

interface SessionMeta {
  entry_path: string | null
  exit_path: string | null
  referrer: string | null
  traffic_source: string | null
  country: string | null
  city: string | null
  device_type: string | null
  browser: string | null
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

/**
 * A single anonymous session's timeline — entry → pages → events → exit —
 * for the "what did this visitor actually do" view. No personally
 * identifying information is shown; the only identifier is the session's
 * own short id, same as the live-visitors list.
 */
export default function VisitorTimelineModal({
  sessionId,
  onClose,
}: {
  sessionId: string | null
  onClose: () => void
}) {
  const [meta, setMeta] = useState<SessionMeta | null>(null)
  const [rows, setRows] = useState<TimelineRow[]>([])
  const [loading, setLoading] = useState(false)

  // Escape-to-close, same convention as the other overlays in this app
  // (CertificateReveal, ResumeReveal) — no click-outside-to-close, so
  // there's no backdrop click handler to reconcile with a11y rules about
  // non-interactive elements carrying click handlers.
  useEffect(() => {
    if (!sessionId) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [sessionId, onClose])

  useEffect(() => {
    if (!sessionId || !supabase) return
    let cancelled = false
    setLoading(true)

    Promise.all([
      supabase
        .from('sessions')
        .select(
          'entry_path, exit_path, referrer, traffic_source, country, city, device_type, browser, started_at, ended_at, duration_seconds',
        )
        .eq('id', sessionId)
        .single(),
      fetchSessionTimeline(sessionId),
    ]).then(([sessionRes, timeline]) => {
      if (cancelled) return
      setMeta((sessionRes.data as SessionMeta) || null)
      setRows(timeline)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [sessionId])

  if (!sessionId) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visitor timeline"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm"
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Visitor timeline</p>
            {meta && (
              <p className="mt-1 text-sm text-muted-foreground">
                {[meta.city, meta.country].filter(Boolean).join(', ') || 'Unknown location'} ·{' '}
                {meta.device_type || 'unknown device'} · {meta.browser || 'unknown browser'}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
          >
            ×
          </button>
        </div>

        {loading && <p className="mt-6 text-sm text-muted-foreground">Loading…</p>}

        {!loading && meta && (
          <ol className="mt-6 space-y-0">
            <TimelineEntry
              time={fmtTime(meta.started_at)}
              label={`Entered from ${meta.traffic_source || 'Direct'}`}
              sub={meta.entry_path || undefined}
            />
            {rows.map((r, i) => (
              <TimelineEntry
                key={i}
                time={fmtTime(r.at)}
                label={r.kind === 'page_view' ? `Viewed ${r.path}` : r.label || 'Event'}
                sub={r.duration_seconds ? `${formatSeconds(r.duration_seconds)} on page` : undefined}
              />
            ))}
            {meta.ended_at && (
              <TimelineEntry time={fmtTime(meta.ended_at)} label="Left website" sub={meta.exit_path || undefined} last />
            )}
          </ol>
        )}

        {!loading && !meta && <p className="mt-6 text-sm text-muted-foreground">Session not found.</p>}
      </div>
    </div>
  )
}

function TimelineEntry({ time, label, sub, last }: { time: string; label: string; sub?: string; last?: boolean }) {
  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!last && <span className="absolute left-[5px] top-3 h-full w-px bg-border" aria-hidden="true" />}
      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-accent bg-background" aria-hidden="true" />
      <div className="min-w-0">
        <p className="font-mono text-xs text-muted-foreground">{time}</p>
        <p className="mt-0.5 text-sm text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </li>
  )
}
