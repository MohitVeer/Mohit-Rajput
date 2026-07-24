import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { supabase } from '../../lib/supabaseClient'
import StatCard from './StatCard'
import ChartCard from './ChartCard'

const ACCENT = 'hsl(var(--accent))'
const MUTED = 'hsl(var(--muted-foreground))'
const BORDER = 'hsl(var(--border))'
const FOREGROUND = 'hsl(var(--foreground))'
const PIE_COLORS = [ACCENT, '#8b8cf6', '#5fb8e8', '#e8c95f', '#e88f5f', '#5fe89b']

interface DailyOverviewRow {
  day: string
  sessions: number
  unique_visitors: number
  avg_session_seconds: number | null
  bounced_sessions: number
}
interface CountRow {
  [key: string]: string | number | null
}

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  fontSize: 12,
  color: FOREGROUND,
}

export default function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [daily, setDaily] = useState<DailyOverviewRow[]>([])
  const [countries, setCountries] = useState<CountRow[]>([])
  const [devices, setDevices] = useState<CountRow[]>([])
  const [browsers, setBrowsers] = useState<CountRow[]>([])
  const [referrers, setReferrers] = useState<CountRow[]>([])
  const [resumeFunnel, setResumeFunnel] = useState<{ views: number; downloads: number } | null>(null)
  const [certifications, setCertifications] = useState<CountRow[]>([])
  const [articles, setArticles] = useState<CountRow[]>([])
  const [outboundLinks, setOutboundLinks] = useState<CountRow[]>([])
  const [sections, setSections] = useState<CountRow[]>([])

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      const client = supabase!
      const [
        dailyRes,
        countryRes,
        deviceRes,
        browserRes,
        referrerRes,
        resumeRes,
        certRes,
        articleRes,
        outboundRes,
        sectionRes,
      ] = await Promise.all([
        client.from('daily_overview').select('*').limit(30),
        client.from('country_breakdown').select('*').limit(8),
        client.from('device_breakdown').select('*'),
        client.from('browser_breakdown').select('*').limit(6),
        client.from('referrer_breakdown').select('*').limit(8),
        client.from('resume_funnel').select('*').single(),
        client.from('top_certifications').select('*').limit(8),
        client.from('top_articles').select('*').limit(8),
        client.from('outbound_link_breakdown').select('*').limit(8),
        client.from('section_engagement').select('*').limit(10),
      ])

      if (cancelled) return

      const firstError = [
        dailyRes,
        countryRes,
        deviceRes,
        browserRes,
        referrerRes,
        resumeRes,
        certRes,
        articleRes,
        outboundRes,
        sectionRes,
      ].find((r) => r.error)?.error

      if (firstError) {
        setError(firstError.message)
      }

      setDaily(((dailyRes.data as DailyOverviewRow[]) || []).slice().reverse())
      setCountries((countryRes.data as CountRow[]) || [])
      setDevices((deviceRes.data as CountRow[]) || [])
      setBrowsers((browserRes.data as CountRow[]) || [])
      setReferrers((referrerRes.data as CountRow[]) || [])
      setResumeFunnel((resumeRes.data as { views: number; downloads: number }) || { views: 0, downloads: 0 })
      setCertifications((certRes.data as CountRow[]) || [])
      setArticles((articleRes.data as CountRow[]) || [])
      setOutboundLinks((outboundRes.data as CountRow[]) || [])
      setSections((sectionRes.data as CountRow[]) || [])
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const totalSessions = daily.reduce((sum, d) => sum + d.sessions, 0)
  const totalUnique = daily.reduce((sum, d) => sum + d.unique_visitors, 0)
  const avgDuration = daily.length
    ? Math.round(
        daily.reduce((sum, d) => sum + (d.avg_session_seconds || 0), 0) /
          daily.filter((d) => d.avg_session_seconds !== null).length || 0,
      )
    : 0
  const bounceRate = totalSessions
    ? Math.round((daily.reduce((sum, d) => sum + d.bounced_sessions, 0) / totalSessions) * 100)
    : 0

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">Portfolio analytics</h1>
          <button
            type="button"
            onClick={() => supabase?.auth.signOut().then(onSignOut)}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
          >
            Sign out
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Sessions (30d)" value={totalSessions.toLocaleString()} />
          <StatCard label="Unique visitors (30d)" value={totalUnique.toLocaleString()} />
          <StatCard label="Avg. session" value={avgDuration ? `${Math.round(avgDuration / 60)}m ${avgDuration % 60}s` : '—'} />
          <StatCard label="Bounce rate" value={`${bounceRate}%`} />
          <StatCard label="Resume views" value={String(resumeFunnel?.views ?? 0)} />
          <StatCard
            label="Resume downloads"
            value={String(resumeFunnel?.downloads ?? 0)}
            hint={
              resumeFunnel && resumeFunnel.views
                ? `${Math.round((resumeFunnel.downloads / resumeFunnel.views) * 100)}% of views`
                : undefined
            }
          />
          <StatCard label="Top country" value={(countries[0]?.country as string) || '—'} />
          <StatCard label="Top device" value={(devices[0]?.device_type as string) || '—'} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ChartCard title="Sessions, last 30 days">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={daily}>
                <CartesianGrid stroke={BORDER} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  tick={{ fill: MUTED, fontSize: 11 }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                />
                <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(v) => new Date(v as string).toLocaleDateString()}
                />
                <Line type="monotone" dataKey="sessions" stroke={ACCENT} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="unique_visitors" stroke={MUTED} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top countries">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={countries} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid stroke={BORDER} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="country"
                  tick={{ fill: MUTED, fontSize: 11 }}
                  axisLine={{ stroke: BORDER }}
                  tickLine={false}
                  width={90}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sessions" fill={ACCENT} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Device breakdown">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={devices} dataKey="sessions" nameKey="device_type" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {devices.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Browsers">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={browsers}>
                <CartesianGrid stroke={BORDER} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="browser" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="sessions" fill={ACCENT} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ChartCard title="Referrers">
            <ul className="divide-y divide-border text-sm">
              {referrers.length === 0 && <li className="py-2 text-muted-foreground">No data yet</li>}
              {referrers.map((r, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-foreground">{(r.referrer as string) || 'Direct'}</span>
                  <span className="font-mono text-muted-foreground">{r.sessions}</span>
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard title="Outbound link clicks">
            <ul className="divide-y divide-border text-sm">
              {outboundLinks.length === 0 && <li className="py-2 text-muted-foreground">No data yet</li>}
              {outboundLinks.map((r, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-foreground">{r.label as string}</span>
                  <span className="font-mono text-muted-foreground">{r.clicks}</span>
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard title="Top certifications">
            <ul className="divide-y divide-border text-sm">
              {certifications.length === 0 && <li className="py-2 text-muted-foreground">No data yet</li>}
              {certifications.map((r, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-foreground">{r.certification as string}</span>
                  <span className="font-mono text-muted-foreground">{r.views}</span>
                </li>
              ))}
            </ul>
          </ChartCard>

          <ChartCard title="Top articles">
            <ul className="divide-y divide-border text-sm">
              {articles.length === 0 && <li className="py-2 text-muted-foreground">No data yet</li>}
              {articles.map((r, i) => (
                <li key={i} className="flex items-center justify-between py-2">
                  <span className="text-foreground">{r.article as string}</span>
                  <span className="font-mono text-muted-foreground">{r.clicks}</span>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>

        <div className="mt-6">
          <ChartCard title="Section engagement">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs font-mono uppercase text-muted-foreground">
                    <th className="pb-2 pr-4">Path</th>
                    <th className="pb-2 pr-4">Views</th>
                    <th className="pb-2 pr-4">Avg. scroll</th>
                    <th className="pb-2">Avg. time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sections.length === 0 && (
                    <tr>
                      <td className="py-2 text-muted-foreground" colSpan={4}>
                        No data yet
                      </td>
                    </tr>
                  )}
                  {sections.map((s, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 text-foreground">{s.path as string}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">{s.views}</td>
                      <td className="py-2 pr-4 font-mono text-muted-foreground">
                        {s.avg_scroll_pct ? `${Math.round(Number(s.avg_scroll_pct))}%` : '—'}
                      </td>
                      <td className="py-2 font-mono text-muted-foreground">
                        {s.avg_duration_seconds ? `${Math.round(Number(s.avg_duration_seconds))}s` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
