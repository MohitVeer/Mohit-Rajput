// First-party, privacy-scoped analytics client.
//
// - visitor_uid: random id in localStorage, purely so "returning visitor"
//   can be counted. Disclosed in /privacy. No device fingerprinting.
// - session_id: random id in sessionStorage, one per tab session.
// - Fully opt-outable via setTrackingDisabled(true) — the toggle exposed
//   on the /privacy page.
// - Never sends IP, coordinates, or anything used to identify a specific
//   employer/organization. Geo is derived server-side from Netlify's
//   edge context, not from anything the client reports.

const VISITOR_KEY = 'mr_visitor_uid'
const SESSION_KEY = 'mr_session_id'
const DNT_KEY = 'mr_dnt'
const ENDPOINT = '/api/track'

function uuid() {
  return crypto.randomUUID()
}

export function isTrackingDisabled(): boolean {
  try {
    return localStorage.getItem(DNT_KEY) === '1'
  } catch {
    return false
  }
}

export function setTrackingDisabled(disabled: boolean) {
  try {
    localStorage.setItem(DNT_KEY, disabled ? '1' : '0')
  } catch {
    /* ignore */
  }
}

function getVisitorUid(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = uuid()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return uuid()
  }
}

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = uuid()
      sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return uuid()
  }
}

function send(body: unknown, useBeacon = false) {
  if (isTrackingDisabled()) return
  const payload = JSON.stringify(body)
  if (useBeacon && navigator.sendBeacon) {
    navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }))
  } else {
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* analytics must never break the UI */
    })
  }
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
  }
}

let sessionStartedAt = 0
let currentPath = ''
let pageEnteredAt = 0
let maxScrollPct = 0

/** Call once, near app mount. Starts the session and wires page-lifecycle tracking. */
export function initAnalytics() {
  if (isTrackingDisabled()) return

  sessionStartedAt = Date.now()
  currentPath = window.location.pathname
  pageEnteredAt = sessionStartedAt

  send({
    type: 'session_start',
    visitorUid: getVisitorUid(),
    sessionId: getSessionId(),
    path: currentPath,
    referrer: document.referrer || '',
    utm: getUtmParams(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  })

  send({ type: 'page_view', sessionId: getSessionId(), path: currentPath })

  const onScroll = () => {
    const doc = document.documentElement
    const scrolled = doc.scrollTop
    const total = doc.scrollHeight - doc.clientHeight
    if (total > 0) {
      maxScrollPct = Math.max(maxScrollPct, Math.min(100, Math.round((scrolled / total) * 100)))
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const flushPageEnd = () => {
    send(
      {
        type: 'page_view_end',
        sessionId: getSessionId(),
        path: currentPath,
        durationSeconds: Math.round((Date.now() - pageEnteredAt) / 1000),
        maxScrollPct,
      },
      true,
    )
  }

  const endSession = () => {
    flushPageEnd()
    send(
      {
        type: 'session_end',
        sessionId: getSessionId(),
        exitPath: currentPath,
        durationSeconds: Math.round((Date.now() - sessionStartedAt) / 1000),
      },
      true,
    )
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') endSession()
  })
  window.addEventListener('pagehide', endSession)
}

/** Track a UI interaction, e.g. trackEvent('ProjectCard', 'project_click', 'CRM Dashboard'). */
export function trackEvent(component: string, action: string, label?: string, meta?: Record<string, unknown>) {
  send({ type: 'event', sessionId: getSessionId(), path: currentPath, component, action, label, meta })
}

export function trackResumeView() {
  trackEvent('Resume', 'resume_view')
}

export function trackResumeDownload() {
  trackEvent('Resume', 'resume_download')
}

export function trackProjectView(projectName: string) {
  trackEvent('ProjectCard', 'project_view', projectName)
}

export function trackProjectClick(projectName: string, destination?: string) {
  trackEvent('ProjectCard', 'project_click', projectName, destination ? { destination } : undefined)
}

export function trackExternalLink(destination: string, label: string) {
  trackEvent('ExternalLink', 'click', label, { destination })
}
