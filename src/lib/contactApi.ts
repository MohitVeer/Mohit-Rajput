export interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

async function viaFunction(payload: ContactPayload): Promise<'sent' | 'unavailable' | 'failed'> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) return 'sent'
    if (res.status === 503 || res.status === 404 || res.status === 405) return 'unavailable'
    return 'failed'
  } catch {
    return 'unavailable'
  }
}

async function viaNetlifyForms(payload: ContactPayload): Promise<boolean> {
  try {
    const body = new URLSearchParams({ 'form-name': 'contact', ...payload })
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function sendContact(payload: ContactPayload): Promise<boolean> {
  const first = await viaFunction(payload)
  if (first === 'sent') return true
  if (first === 'failed') return false
  return viaNetlifyForms(payload)
}
