import type { Context } from '@netlify/functions'
import { PostgrestClient } from '@supabase/postgrest-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const configured = Boolean(supabaseUrl && serviceKey)
const supabase = new PostgrestClient(`${supabaseUrl ?? 'http://localhost'}/rest/v1`, {
  headers: { apikey: serviceKey ?? 'not-configured', Authorization: `Bearer ${serviceKey ?? 'not-configured'}` },
})

type TrackBody =
  | {
      type: 'session_start'
      visitorUid: string
      sessionId: string
      path: string
      referrer: string
      utm: { source?: string; medium?: string; campaign?: string }
      timezone: string
      language: string
      colorScheme: string
      screen?: { width: number; height: number }
    }
  | { type: 'page_view'; sessionId: string; path: string }
  | { type: 'page_view_end'; sessionId: string; path: string; durationSeconds: number; maxScrollPct: number }
  | { type: 'event'; sessionId: string; path: string; component: string; action: string; label?: string; meta?: Record<string, unknown> }
  | { type: 'heartbeat'; sessionId: string; path: string }
  | { type: 'session_end'; sessionId: string; exitPath: string; durationSeconds: number }

function parseUA(ua: string) {
  const device_type = /Mobi|Android(?!.*Tablet)/i.test(ua)
    ? 'mobile'
    : /Tablet|iPad/i.test(ua)
      ? 'tablet'
      : 'desktop'

  const os = /Windows/i.test(ua)
    ? 'Windows'
    : /Mac OS X/i.test(ua)
      ? 'macOS'
      : /Android/i.test(ua)
        ? 'Android'
        : /iPhone|iPad|iOS/i.test(ua)
          ? 'iOS'
          : /Linux/i.test(ua)
            ? 'Linux'
            : 'Unknown'

  let browser = 'Unknown'
  let browser_version = ''
  const m =
    ua.match(/Edg\/([\d.]+)/) ||
    ua.match(/OPR\/([\d.]+)/) ||
    ua.match(/Chrome\/([\d.]+)/) ||
    ua.match(/Firefox\/([\d.]+)/) ||
    ua.match(/Version\/([\d.]+).*Safari/)
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('OPR/')) browser = 'Opera'
  else if (ua.includes('Chrome/')) browser = 'Chrome'
  else if (ua.includes('Firefox/')) browser = 'Firefox'
  else if (ua.includes('Safari/') && ua.includes('Version/')) browser = 'Safari'
  if (m) browser_version = m[1]

  return { device_type, os, browser, browser_version }
}

function categorizeTrafficSource(referrer: string, utmSource?: string): string {
  if (utmSource) return `Campaign: ${utmSource}`
  if (!referrer) return 'Direct'

  let host = ''
  try {
    host = new URL(referrer).hostname.replace(/^www\./, '')
  } catch {
    return 'Referral'
  }

  const known: Record<string, string> = {
    'google.com': 'Google',
    'bing.com': 'Bing',
    'duckduckgo.com': 'DuckDuckGo',
    'yahoo.com': 'Yahoo',
    'linkedin.com': 'LinkedIn',
    'github.com': 'GitHub',
    'instagram.com': 'Instagram',
    'facebook.com': 'Facebook',
    'twitter.com': 'X / Twitter',
    'x.com': 'X / Twitter',
    't.co': 'X / Twitter',
  }
  for (const [domain, label] of Object.entries(known)) {
    if (host === domain || host.endsWith(`.${domain}`)) return label
  }
  return `Referral: ${host}`
}

async function insertRow(table: string, row: Record<string, unknown>) {
  let result = await supabase.from(table).insert(row)
  if (result.error?.code === '23503') {
    await new Promise((resolve) => setTimeout(resolve, 700))
    result = await supabase.from(table).insert(row)
  }
  return result
}

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!configured) {
    return new Response(null, { status: 204 })
  }

  let body: TrackBody
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const ua = req.headers.get('user-agent') || ''
  const { device_type, os, browser, browser_version } = parseUA(ua)

  const geo = context.geo

  try {
    switch (body.type) {
      case 'session_start': {
        const { data: visitor, error: vErr } = await supabase
          .from('visitors')
          .upsert(
            { visitor_uid: body.visitorUid, last_seen_at: new Date().toISOString() },
            { onConflict: 'visitor_uid' },
          )
          .select('id, total_sessions')
          .single()
        if (vErr || !visitor) throw vErr

        const { data: known } = await supabase.from('sessions').select('id').eq('id', body.sessionId).maybeSingle()
        if (known) {
          await supabase.from('sessions').update({ last_activity_at: new Date().toISOString() }).eq('id', body.sessionId)
          break
        }

        const isReturning = (visitor.total_sessions ?? 0) > 0

        await supabase
          .from('visitors')
          .update({ total_sessions: (visitor.total_sessions ?? 0) + 1 })
          .eq('id', visitor.id)

        const { error: sErr } = await supabase.from('sessions').insert({
          id: body.sessionId,
          visitor_id: visitor.id,
          entry_path: body.path,
          current_path: body.path,
          referrer: body.referrer || null,
          utm_source: body.utm?.source || null,
          utm_medium: body.utm?.medium || null,
          utm_campaign: body.utm?.campaign || null,
          traffic_source: categorizeTrafficSource(body.referrer, body.utm?.source),
          country: geo?.country?.name || null,
          country_code: geo?.country?.code || null,
          region: geo?.subdivision?.name || null,
          city: geo?.city || null,
          latitude: geo?.latitude ?? null,
          longitude: geo?.longitude ?? null,
          timezone: body.timezone || geo?.timezone || null,
          device_type,
          os,
          browser,
          browser_version,
          color_scheme: body.colorScheme,
          language: body.language,
          screen_width: body.screen?.width ?? null,
          screen_height: body.screen?.height ?? null,
          is_returning: isReturning,
        })
        if (sErr) throw sErr
        break
      }

      case 'page_view': {
        const { error } = await insertRow('page_views', {
          session_id: body.sessionId,
          path: body.path,
        })
        if (error) throw error

        await supabase.rpc('increment_page_view_count', { p_session_id: body.sessionId, p_path: body.path })
        break
      }

      case 'page_view_end': {
        const { data: row } = await supabase
          .from('page_views')
          .select('id')
          .eq('session_id', body.sessionId)
          .eq('path', body.path)
          .order('entered_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (row) {
          await supabase
            .from('page_views')
            .update({ duration_seconds: body.durationSeconds, max_scroll_pct: body.maxScrollPct })
            .eq('id', row.id)
        }
        break
      }

      case 'event': {
        const { error } = await insertRow('events', {
          session_id: body.sessionId,
          path: body.path,
          component: body.component,
          action: body.action,
          label: body.label || null,
          meta: body.meta || null,
        })
        if (error) throw error
        break
      }

      case 'heartbeat': {
        await supabase
          .from('sessions')
          .update({ last_activity_at: new Date().toISOString(), current_path: body.path })
          .eq('id', body.sessionId)
        break
      }

      case 'session_end': {
        const { error } = await supabase
          .from('sessions')
          .update({
            ended_at: new Date().toISOString(),
            exit_path: body.exitPath,
            duration_seconds: body.durationSeconds,
          })
          .eq('id', body.sessionId)
        if (error) throw error
        break
      }

      default:
        return new Response('Unknown event type', { status: 400 })
    }

    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('track function error', err)
    return new Response(null, { status: 204 })
  }
}

export const config = {
  path: '/api/track',
}
