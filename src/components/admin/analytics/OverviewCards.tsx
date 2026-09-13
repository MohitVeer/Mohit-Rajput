import type { Overview } from '../../../lib/adminApi'
import { formatSeconds } from './chartTheme'
import StatCard from '../StatCard'

export default function OverviewCards({ overview }: { overview: Overview }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      <StatCard label="Visitors" value={overview.visitors.toLocaleString()} />
      <StatCard label="Sessions" value={overview.sessions.toLocaleString()} />
      <StatCard label="Page views" value={overview.page_views.toLocaleString()} />
      <StatCard label="Avg. session" value={formatSeconds(overview.avg_session_seconds)} />
      <StatCard label="Bounce rate" value={`${overview.bounce_rate}%`} />
      <StatCard
        label="Returning visitors"
        value={`${overview.returning_pct}%`}
        hint={`${overview.new_pct}% new`}
      />
    </div>
  )
}
