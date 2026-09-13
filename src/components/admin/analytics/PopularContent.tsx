import type { EventTypeRow, LabeledEventRow, PopularPageRow } from '../../../lib/adminApi'
import { exportAsCsv, exportAsJson } from '../../../lib/adminApi'
import ChartCard from '../ChartCard'
import ExportMenu from './ExportMenu'
import { formatSeconds } from './chartTheme'

function LabeledList({ rows, unit = 'views' }: { rows: LabeledEventRow[]; unit?: string }) {
  if (rows.length === 0) return <p className="py-2 text-sm text-muted-foreground">No data yet</p>
  return (
    <ul className="divide-y divide-border text-sm">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center justify-between py-2">
          <span className="text-foreground">{r.label}</span>
          <span className="font-mono text-muted-foreground">
            {r.total} {unit}
          </span>
        </li>
      ))}
    </ul>
  )
}

export default function PopularContent({
  pages,
  certifications,
  articles,
  outboundLinks,
  resumeViews,
  resumeDownloads,
  allEvents,
}: {
  pages: PopularPageRow[]
  certifications: LabeledEventRow[]
  articles: LabeledEventRow[]
  outboundLinks: LabeledEventRow[]
  resumeViews: number
  resumeDownloads: number
  allEvents: EventTypeRow[]
}) {
  return (
    <div className="space-y-4">
      <ChartCard
        title="Most viewed pages"
        action={<ExportMenu onCsv={() => exportAsCsv('pages.csv', pages)} onJson={() => exportAsJson('pages.json', pages)} />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-mono uppercase text-muted-foreground">
                <th className="pb-2 pr-4">Page</th>
                <th className="pb-2 pr-4">Views</th>
                <th className="pb-2 pr-4">Unique</th>
                <th className="pb-2 pr-4">Avg. time</th>
                <th className="pb-2 pr-4">Entries</th>
                <th className="pb-2">Bounce</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pages.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-3 text-muted-foreground">
                    No visitor data yet
                  </td>
                </tr>
              )}
              {pages.map((p) => (
                <tr key={p.path}>
                  <td className="py-2 pr-4 text-foreground">{p.path}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{p.views}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{p.unique_visitors}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{formatSeconds(p.avg_seconds)}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{p.entries}</td>
                  <td className="py-2 font-mono text-muted-foreground">{p.bounce_rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="grid gap-4 md:grid-cols-3">
        <ChartCard title="Resume">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="font-display text-3xl font-semibold">{resumeViews}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-semibold text-accent">{resumeDownloads}</p>
              <p className="text-xs text-muted-foreground">Downloads</p>
            </div>
          </div>
          {resumeViews > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.round((resumeDownloads / resumeViews) * 100)}% of viewers download
            </p>
          )}
        </ChartCard>

        <ChartCard title="Top certifications viewed">
          <LabeledList rows={certifications} />
        </ChartCard>

        <ChartCard title="Top articles clicked">
          <LabeledList rows={articles} />
        </ChartCard>
      </div>

      <ChartCard title="Most clicked outbound links">
        <LabeledList rows={outboundLinks} unit="clicks" />
      </ChartCard>

      <ChartCard title="All tracked interactions">
        <p className="mb-2 text-[11px] text-muted-foreground">
          Every event type tracked via trackEvent() — new event types appear here automatically.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-mono uppercase text-muted-foreground">
                <th className="pb-2 pr-4">Component</th>
                <th className="pb-2 pr-4">Action</th>
                <th className="pb-2 pr-4">Total</th>
                <th className="pb-2">Unique sessions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allEvents.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-muted-foreground">
                    No visitor data yet
                  </td>
                </tr>
              )}
              {allEvents.map((e) => (
                <tr key={`${e.component}-${e.action}`}>
                  <td className="py-2 pr-4 text-foreground">{e.component}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{e.action}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{e.total}</td>
                  <td className="py-2 font-mono text-muted-foreground">{e.unique_sessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
