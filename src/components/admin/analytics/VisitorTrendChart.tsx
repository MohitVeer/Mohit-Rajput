import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DailyPoint } from '../../../lib/adminApi'
import ChartCard from '../ChartCard'
import { ACCENT, BORDER, MUTED, tooltipStyle, tooltipLabelStyle, tooltipItemStyle } from './chartTheme'

export default function VisitorTrendChart({ data }: { data: DailyPoint[] }) {
  return (
    <ChartCard title="Visitors, sessions & page views">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
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
            labelStyle={tooltipLabelStyle}
            itemStyle={tooltipItemStyle}
            labelFormatter={(v) => new Date(v as string).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="visitors" name="Visitors" stroke={ACCENT} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="sessions" name="Sessions" stroke={MUTED} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="page_views" name="Page views" stroke="#e8c95f" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {data.length === 0 && <p className="mt-2 text-center text-sm text-muted-foreground">No visitor data yet</p>}
    </ChartCard>
  )
}
