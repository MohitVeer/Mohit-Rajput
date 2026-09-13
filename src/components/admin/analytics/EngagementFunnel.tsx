import type { ConversionFunnelRow, EngagementRow } from '../../../lib/adminApi'
import ChartCard from '../ChartCard'
import { formatSeconds } from './chartTheme'

function FunnelStep({ label, value, pctOfFirst }: { label: string; value: number; pctOfFirst: number | null }) {
  return (
    <div className="flex-1">
      <div className="flex items-baseline justify-between">
        <p className="font-display text-2xl font-semibold">{value.toLocaleString()}</p>
        {pctOfFirst !== null && <p className="text-xs text-muted-foreground">{pctOfFirst}%</p>}
      </div>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 h-1.5 rounded-full bg-secondary">
        <div
          className="h-1.5 rounded-full bg-accent transition-all"
          style={{ width: `${pctOfFirst ?? 100}%` }}
        />
      </div>
    </div>
  )
}

export default function EngagementFunnel({
  engagement,
  funnel,
}: {
  engagement: EngagementRow
  funnel: ConversionFunnelRow
}) {
  const base = funnel.visitors || 1
  const pct = (n: number) => (funnel.visitors === 0 ? null : Math.round((n / base) * 100))

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Engagement">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Avg. engagement time</dt>
            <dd className="mt-1 font-display text-2xl font-semibold">{formatSeconds(engagement.avg_engagement_seconds)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Pages / session</dt>
            <dd className="mt-1 font-display text-2xl font-semibold">
              {engagement.avg_pages_per_session ? engagement.avg_pages_per_session.toFixed(1) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Resume interaction rate</dt>
            <dd className="mt-1 font-display text-2xl font-semibold">{engagement.resume_interaction_rate}%</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Contact interaction rate</dt>
            <dd className="mt-1 font-display text-2xl font-semibold">{engagement.contact_interaction_rate}%</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">CTA click rate</dt>
            <dd className="mt-1 font-display text-2xl font-semibold">{engagement.cta_click_rate}%</dd>
          </div>
        </dl>
      </ChartCard>

      <ChartCard title="Visitors → Contact conversion">
        {funnel.visitors === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No visitor data yet</p>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <FunnelStep label="Visitors" value={funnel.visitors} pctOfFirst={100} />
            <FunnelStep label="Engaged" value={funnel.engaged_visitors} pctOfFirst={pct(funnel.engaged_visitors)} />
            <FunnelStep label="Contact intent" value={funnel.contact_intent} pctOfFirst={pct(funnel.contact_intent)} />
            <FunnelStep label="Contact submitted" value={funnel.contact_submissions} pctOfFirst={pct(funnel.contact_submissions)} />
          </div>
        )}
      </ChartCard>
    </div>
  )
}
