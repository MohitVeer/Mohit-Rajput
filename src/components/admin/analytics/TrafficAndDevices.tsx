import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { NamedCount, TrafficSourceRow } from '../../../lib/adminApi'
import { exportAsCsv, exportAsJson } from '../../../lib/adminApi'
import ChartCard from '../ChartCard'
import ExportMenu from './ExportMenu'
import { ACCENT, BORDER, MUTED, PIE_COLORS, formatSeconds, tooltipStyle, tooltipLabelStyle, tooltipItemStyle } from './chartTheme'

export default function TrafficAndDevices({
  sources,
  devices,
  browsers,
  os,
}: {
  sources: TrafficSourceRow[]
  devices: NamedCount[]
  browsers: NamedCount[]
  os: NamedCount[]
}) {
  const totalDeviceSessions = devices.reduce((sum, d) => sum + Number(d.sessions || 0), 0)

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        title="Traffic sources"
        action={
          <ExportMenu
            onCsv={() => exportAsCsv('traffic-sources.csv', sources)}
            onJson={() => exportAsJson('traffic-sources.json', sources)}
          />
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-mono uppercase text-muted-foreground">
                <th className="pb-2 pr-4">Source</th>
                <th className="pb-2 pr-4">Visitors</th>
                <th className="pb-2 pr-4">Sessions</th>
                <th className="pb-2 pr-4">Pages/session</th>
                <th className="pb-2">Avg. time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-muted-foreground">
                    No visitor data yet
                  </td>
                </tr>
              )}
              {sources.map((s) => (
                <tr key={s.source}>
                  <td className="py-2 pr-4 text-foreground">{s.source}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{s.visitors}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">{s.sessions}</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">
                    {s.avg_pages_per_session ? s.avg_pages_per_session.toFixed(1) : '—'}
                  </td>
                  <td className="py-2 font-mono text-muted-foreground">{formatSeconds(s.avg_seconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <ChartCard title="Devices">
        {totalDeviceSessions === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No visitor data yet</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={devices} dataKey="sessions" nameKey="device_type" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {devices.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              {devices.map((d, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-foreground">{d.device_type}</span>
                  <span className="font-mono text-muted-foreground">
                    {Math.round((Number(d.sessions) / totalDeviceSessions) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </ChartCard>

      <ChartCard title="Browsers">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={browsers}>
            <CartesianGrid stroke={BORDER} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="browser" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
            <Bar dataKey="sessions" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {browsers.length === 0 && <p className="text-center text-sm text-muted-foreground">No visitor data yet</p>}
      </ChartCard>

      <ChartCard title="Operating systems">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={os}>
            <CartesianGrid stroke={BORDER} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="os" tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} />
            <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={{ stroke: BORDER }} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
            <Bar dataKey="sessions" fill={ACCENT} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {os.length === 0 && <p className="text-center text-sm text-muted-foreground">No visitor data yet</p>}
      </ChartCard>
    </div>
  )
}
