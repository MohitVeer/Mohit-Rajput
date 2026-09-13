import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import {
  fetchConversionFunnel,
  fetchCountryBreakdown,
  fetchCityBreakdown,
  fetchDailySeries,
  fetchDeviceBreakdown,
  fetchBrowserBreakdown,
  fetchOsBreakdown,
  fetchEngagement,
  fetchEventTypeBreakdown,
  fetchOverview,
  fetchPopularPages,
  fetchTopLabeledEvents,
  fetchTrafficSources,
  type ConversionFunnelRow,
  type CountryRow,
  type CityRow,
  type DailyPoint,
  type EngagementRow,
  type EventTypeRow,
  type LabeledEventRow,
  type NamedCount,
  type Overview,
  type PopularPageRow,
  type TrafficSourceRow,
} from '../../lib/adminApi'
import { useDateRange } from '../../hooks/useDateRange'
import DateRangeBar from './analytics/DateRangeBar'
import OverviewCards from './analytics/OverviewCards'
import VisitorTrendChart from './analytics/VisitorTrendChart'
import GeoTables from './analytics/GeoTables'
import TrafficAndDevices from './analytics/TrafficAndDevices'
import PopularContent from './analytics/PopularContent'
import EngagementFunnel from './analytics/EngagementFunnel'
import LiveVisitors from './analytics/LiveVisitors'

interface DashboardData {
  overview: Overview
  daily: DailyPoint[]
  countries: CountryRow[]
  cities: CityRow[]
  devices: NamedCount[]
  browsers: NamedCount[]
  os: NamedCount[]
  sources: TrafficSourceRow[]
  pages: PopularPageRow[]
  certifications: LabeledEventRow[]
  articles: LabeledEventRow[]
  outboundLinks: LabeledEventRow[]
  resumeViews: LabeledEventRow[]
  resumeDownloads: LabeledEventRow[]
  allEvents: EventTypeRow[]
  engagement: EngagementRow
  funnel: ConversionFunnelRow
}

export default function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)
  const dateRange = useDateRange('30d')

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all([
      fetchOverview(dateRange.range),
      fetchDailySeries(dateRange.range),
      fetchCountryBreakdown(dateRange.range),
      fetchCityBreakdown(dateRange.range),
      fetchDeviceBreakdown(dateRange.range),
      fetchBrowserBreakdown(dateRange.range),
      fetchOsBreakdown(dateRange.range),
      fetchTrafficSources(dateRange.range),
      fetchPopularPages(dateRange.range),
      fetchTopLabeledEvents(dateRange.range, 'Certification', 'cert_view'),
      fetchTopLabeledEvents(dateRange.range, 'Article', 'article_click'),
      fetchTopLabeledEvents(dateRange.range, 'ExternalLink', 'click'),
      fetchTopLabeledEvents(dateRange.range, 'Resume', 'resume_view', 1),
      fetchTopLabeledEvents(dateRange.range, 'Resume', 'resume_download', 1),
      fetchEventTypeBreakdown(dateRange.range),
      fetchEngagement(dateRange.range),
      fetchConversionFunnel(dateRange.range),
    ])
      .then(
        ([
          overview,
          daily,
          countries,
          cities,
          devices,
          browsers,
          os,
          sources,
          pages,
          certifications,
          articles,
          outboundLinks,
          resumeViews,
          resumeDownloads,
          allEvents,
          engagement,
          funnel,
        ]) => {
          if (cancelled) return
          setData({
            overview,
            daily,
            countries,
            cities,
            devices,
            browsers,
            os,
            sources,
            pages,
            certifications,
            articles,
            outboundLinks,
            resumeViews,
            resumeDownloads,
            allEvents,
            engagement,
            funnel,
          })
          setLoading(false)
        },
      )
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load analytics.')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }

}, [dateRange.preset, dateRange.customStart, dateRange.customEnd])

  return (
    <div className="min-h-screen bg-background px-6 py-10 text-foreground md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold">Portfolio analytics</h1>
            <p className="text-sm text-muted-foreground">Visitor intelligence for {dateRange.range.label.toLowerCase()}</p>
          </div>
          <button
            type="button"
            onClick={() => supabase?.auth.signOut().then(onSignOut)}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
          >
            Sign out
          </button>
        </div>

        <div className="mt-6">
          <DateRangeBar
            preset={dateRange.preset}
            onPresetChange={dateRange.setPreset}
            customStart={dateRange.customStart}
            customEnd={dateRange.customEnd}
            onCustomStartChange={dateRange.setCustomStart}
            onCustomEndChange={dateRange.setCustomEnd}
            presetLabels={dateRange.presetLabels}
            isDefault={dateRange.isDefault}
            onReset={dateRange.reset}
          />
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>
        )}

        {loading && <p className="mt-10 text-center text-muted-foreground">Loading…</p>}

        {!loading && data && (
          <div className="mt-6 space-y-6">
            <OverviewCards overview={data.overview} />

            <LiveVisitors />

            <VisitorTrendChart data={data.daily} />

            <GeoTables countries={data.countries} cities={data.cities} />

            <TrafficAndDevices sources={data.sources} devices={data.devices} browsers={data.browsers} os={data.os} />

            <EngagementFunnel engagement={data.engagement} funnel={data.funnel} />

            <PopularContent
              pages={data.pages}
              certifications={data.certifications}
              articles={data.articles}
              outboundLinks={data.outboundLinks}
              resumeViews={data.resumeViews[0]?.total ?? 0}
              resumeDownloads={data.resumeDownloads[0]?.total ?? 0}
              allEvents={data.allEvents}
            />
          </div>
        )}
      </div>
    </div>
  )
}
