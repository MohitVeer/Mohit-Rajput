import type { PopularPageRow } from '../../../lib/adminApi'
import { exportAsCsv, exportAsJson } from '../../../lib/adminApi'
import ChartCard from '../ChartCard'
import ExportMenu from './ExportMenu'
import { formatSeconds } from './chartTheme'

interface CoverageRow {
  path: string
  views: number
  unique_visitors: number
  avg_seconds: number | null
  listed: boolean
}

function coverageRows(inventory: string[], pages: PopularPageRow[]): CoverageRow[] {
  const seen = new Map(pages.map((page) => [page.path, page]))
  const listed = new Set(inventory)
  const rows: CoverageRow[] = inventory.map((path) => {
    const page = seen.get(path)
    return { path, views: page?.views ?? 0, unique_visitors: page?.unique_visitors ?? 0, avg_seconds: page?.avg_seconds ?? null, listed: true }
  })
  for (const page of pages) {
    if (!listed.has(page.path)) rows.push({ path: page.path, views: page.views, unique_visitors: page.unique_visitors, avg_seconds: page.avg_seconds, listed: false })
  }
  return rows.sort((a, b) => b.views - a.views || a.path.localeCompare(b.path))
}

export default function PageCoverage({ inventory, pages }: { inventory: string[]; pages: PopularPageRow[] }) {
  const rows = coverageRows(inventory, pages)
  const visited = rows.filter((row) => row.listed && row.views > 0).length
  const total = rows.filter((row) => row.listed).length

  return (
    <ChartCard
      title="Every page on the site"
      action={<ExportMenu onCsv={() => exportAsCsv('page-coverage.csv', rows)} onJson={() => exportAsJson('page-coverage.json', rows)} />}
    >
      <p className="mb-3 text-[11px] text-muted-foreground">
        {visited} of {total} pages in the sitemap were visited in this period. Pages nobody opened show 0, and any other path that was tracked is listed as not in the sitemap.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-mono uppercase text-muted-foreground">
              <th className="pb-2 pr-4">Page</th>
              <th className="pb-2 pr-4">Views</th>
              <th className="pb-2 pr-4">Unique</th>
              <th className="pb-2 pr-4">Avg. time</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.path}>
                <td className="py-2 pr-4 text-foreground">{row.path}</td>
                <td className="py-2 pr-4 font-mono text-muted-foreground">{row.views}</td>
                <td className="py-2 pr-4 font-mono text-muted-foreground">{row.unique_visitors}</td>
                <td className="py-2 pr-4 font-mono text-muted-foreground">{formatSeconds(row.avg_seconds)}</td>
                <td className="py-2 text-xs text-muted-foreground">{!row.listed ? 'Not in sitemap' : row.views === 0 ? 'No visits yet' : 'Visited'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}
