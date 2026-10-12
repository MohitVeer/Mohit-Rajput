import type { Config } from '@netlify/functions'

const RECIPIENT = 'rajput.mohit.veer@gmail.com'
const SENDER = 'Portfolio Contact <onboarding@resend.dev>'
const LIMITS = { name: 120, email: 200, subject: 200, message: 5000 }

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.replace(/\r/g, '').trim().slice(0, max) : ''
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  if (clean(body['bot-field'], 50)) return json({ ok: true }, 200)

  const name = clean(body.name, LIMITS.name)
  const email = clean(body.email, LIMITS.email)
  const subject = clean(body.subject, LIMITS.subject)
  const message = clean(body.message, LIMITS.message)

  if (!name || !subject || !message || !isEmail(email)) return json({ error: 'invalid' }, 400)

  const apiKey = typeof process !== 'undefined' ? process.env.RESEND_API_KEY : undefined
  if (!apiKey) return json({ error: 'not_configured' }, 503)

  const text = `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`
  const html = `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: SENDER, to: [RECIPIENT], reply_to: email, subject: `[Portfolio] ${subject}`, text, html }),
    })
    if (!response.ok) return json({ error: 'send_failed' }, 502)
    return json({ ok: true }, 200)
  } catch {
    return json({ error: 'send_failed' }, 502)
  }
}

export const config: Config = {
  path: '/api/contact',
}
