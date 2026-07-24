import type { Context } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

// Server-only client — SUPABASE_SERVICE_ROLE_KEY is set as a Netlify
// environment variable and is never sent to, or readable by, the browser.
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  { auth: { persistSession: false } },
)

type TrackBody =
  | { type: 'session_start'; visitorUid: string; sessionId: string; path: string; referrer: string; utm: { source?: string; medium?: string; campaign?: string }; timezone: string; language: string; colorScheme: string }
  | { type: 'page_view'; sessionId: string; path: string }
  | { type: 'page_view_end'; sessionId: string; path: string; durationSeconds: number; maxScrollPct: number }
  | { type: 'event'; sessionId: string; path: string; component: string; action: string; label?: string; meta?: Record<string, unknown> }
  | { type: 'session_end'; sessionId: string; exitPath: string; durationSeconds: number }

// Minimal, dependency-free UA parse — just enough for device/os/browser
// breakdown charts. Not used for fingerprinting or re-identification.
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

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body: TrackBody
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const ua = req.headers.get('user-agent') || ''
  const { device_type, os, browser, browser_version } = parseUA(ua)
  // City-level, IP-derived geo supplied by Netlify's edge network.
  // The raw IP address itself is never read or stored.
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

        await supabase
          .from('visitors')
          .update({ total_sessions: (visitor.total_sessions ?? 0) + 1 })
          .eq('id', visitor.id)

        const { error: sErr } = await supabase.from('sessions').insert({
          id: body.sessionId,
          visitor_id: visitor.id,
          entry_path: body.path,
          referrer: body.referrer || null,
          utm_source: body.utm?.source || null,
          utm_medium: body.utm?.medium || null,
          utm_campaign: body.utm?.campaign || null,
          country: geo?.country?.name || null,
          region: geo?.subdivision?.name || null,
          city: geo?.city || null,
          timezone: body.timezone || geo?.timezone || null,
          device_type,
          os,
          browser,
          browser_version,
          color_scheme: body.colorScheme,
          language: body.language,
        })
        if (sErr) throw sErr
        break
      }

      case 'page_view': {
        const { error } = await supabase.from('page_views').insert({
          session_id: body.sessionId,
          path: body.path,
        })
        if (error) throw error
        break
      }

      case 'page_view_end': {
        // Best-effort: update the most recent matching page_view row.
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
        const { error } = await supabase.from('events').insert({
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
    // Never let analytics failures surface to the visitor or break the UI.
    return new Response(null, { status: 204 })
  }
}

export const config = {
  path: '/api/track',
}
