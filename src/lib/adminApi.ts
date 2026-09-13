import { supabase } from './supabaseClient'

export interface DateRange {
  start: Date
  end: Date
  label: string
}

export interface Overview {
  visitors: number
  sessions: number
  page_views: number
  avg_session_seconds: number | null
  max_session_seconds: number | null
  min_session_seconds: number | null
  avg_pages_per_session: number | null
  bounce_rate: number
  returning_pct: number
  new_pct: number
}

export interface DailyPoint {
  day: string
  visitors: number
  sessions: number
  page_views: number
}

export interface CountryRow {
  country: string
  country_code: string
  visitors: number
  sessions: number
  page_views: number
  avg_seconds: number | null
  bounce_rate: number
}

export interface CityRow {
  city: string
  region: string
  country: string
  visitors: number
  sessions: number
  avg_seconds: number | null
  avg_pages_per_session: number | null
  latitude: number | null
  longitude: number | null
}

export interface NamedCount {
  [key: string]: string | number | null
}

export interface TrafficSourceRow {
  source: string
  visitors: number
  sessions: number
  avg_pages_per_session: number | null
  avg_seconds: number | null
}

export interface PopularPageRow {
  path: string
  views: number
  unique_visitors: number
  avg_seconds: number | null
  max_seconds: number | null
  entries: number
  exits: number
  bounce_rate: number
}

export interface LabeledEventRow {
  label: string
  total: number
  unique_sessions: number
}

export interface EventTypeRow {
  component: string
  action: string
  total: number
  unique_sessions: number
}

export interface EngagementRow {
  avg_pages_per_session: number | null
  avg_engagement_seconds: number | null
  resume_interaction_rate: number
  contact_interaction_rate: number
  cta_click_rate: number
}

export interface ConversionFunnelRow {
  visitors: number
  engaged_visitors: number
  contact_intent: number
  contact_submissions: number
}

export interface LiveVisitorRow {
  session_id: string
  visitor_short: string
  country: string | null
  city: string | null
  device_type: string | null
  current_path: string | null
  entry_path: string | null
  started_at: string
  last_activity_at: string
}

export interface TimelineRow {
  at: string
  kind: 'page_view' | 'event'
  path: string | null
  label: string | null
  duration_seconds: number | null
}

function iso(d: Date) {
  return d.toISOString()
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T[]> {
  if (!supabase) return []
  const { data, error } = await supabase.rpc(fn, args)
  if (error) throw error
  return (data as T[]) || []
}

export async function fetchOverview(range: DateRange): Promise<Overview> {
  const rows = await rpc<Overview>('fn_overview', { start_date: iso(range.start), end_date: iso(range.end) })
  return (
    rows[0] || {
      visitors: 0,
      sessions: 0,
      page_views: 0,
      avg_session_seconds: null,
      max_session_seconds: null,
      min_session_seconds: null,
      avg_pages_per_session: null,
      bounce_rate: 0,
      returning_pct: 0,
      new_pct: 0,
    }
  )
}

export const fetchDailySeries = (range: DateRange) =>
  rpc<DailyPoint>('fn_daily_series', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchCountryBreakdown = (range: DateRange) =>
  rpc<CountryRow>('fn_country_breakdown', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchCityBreakdown = (range: DateRange) =>
  rpc<CityRow>('fn_city_breakdown', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchDeviceBreakdown = (range: DateRange) =>
  rpc<NamedCount>('fn_device_breakdown', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchBrowserBreakdown = (range: DateRange) =>
  rpc<NamedCount>('fn_browser_breakdown', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchOsBreakdown = (range: DateRange) =>
  rpc<NamedCount>('fn_os_breakdown', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchTrafficSources = (range: DateRange) =>
  rpc<TrafficSourceRow>('fn_traffic_source_breakdown', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchPopularPages = (range: DateRange) =>
  rpc<PopularPageRow>('fn_popular_pages', { start_date: iso(range.start), end_date: iso(range.end) })

export const fetchTopLabeledEvents = (
  range: DateRange,
  component: string,
  action: string,
  limit = 10,
) =>
  rpc<LabeledEventRow>('fn_top_labeled_events', {
    p_component: component,
    p_action: action,
    start_date: iso(range.start),
    end_date: iso(range.end),
    p_limit: limit,
  })

export const fetchEventTypeBreakdown = (range: DateRange) =>
  rpc<EventTypeRow>('fn_event_type_breakdown', { start_date: iso(range.start), end_date: iso(range.end) })

export async function fetchEngagement(range: DateRange): Promise<EngagementRow> {
  const rows = await rpc<EngagementRow>('fn_engagement', { start_date: iso(range.start), end_date: iso(range.end) })
  return (
    rows[0] || {
      avg_pages_per_session: null,
      avg_engagement_seconds: null,
      resume_interaction_rate: 0,
      contact_interaction_rate: 0,
      cta_click_rate: 0,
    }
  )
}

export async function fetchConversionFunnel(range: DateRange): Promise<ConversionFunnelRow> {
  const rows = await rpc<ConversionFunnelRow>('fn_conversion_funnel', {
    start_date: iso(range.start),
    end_date: iso(range.end),
  })
  return rows[0] || { visitors: 0, engaged_visitors: 0, contact_intent: 0, contact_submissions: 0 }
}

export const fetchLiveVisitors = (minutes = 5) => rpc<LiveVisitorRow>('fn_live_visitors', { minutes })

export const fetchSessionTimeline = (sessionId: string) =>
  rpc<TimelineRow>('fn_session_timeline', { p_session_id: sessionId })

export function exportAsJson(filename: string, rows: unknown[]) {
  downloadBlob(filename, JSON.stringify(rows, null, 2), 'application/json')
}

export function exportAsCsv<T extends object>(filename: string, rows: T[]) {
  if (rows.length === 0) {
    downloadBlob(filename, '', 'text/csv')
    return
  }
  const headers = Object.keys(rows[0]) as (keyof T)[]
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))]
  downloadBlob(filename, lines.join('\n'), 'text/csv')
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
