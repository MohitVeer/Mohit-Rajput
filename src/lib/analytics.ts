const VISITOR_KEY = 'mr_visitor_uid'
const SESSION_KEY = 'mr_session_id'
const DNT_KEY = 'mr_dnt'
const ENDPOINT = '/api/track'
const HEARTBEAT_INTERVAL_MS = 20_000
const SCROLL_MILESTONES = [25, 50, 75, 90, 100]

let sessionStartedAt = 0
let currentPath = ''
let pageEnteredAt = 0
let maxScrollPct = 0
let initialized = false
let trackingDisabledInMemory = false
let heartbeatTimer: ReturnType<typeof setInterval> | undefined
let cleanupAnalytics: (() => void) | undefined
const firedMilestones = new Set<number>()

function uuid() {
  return crypto.randomUUID()
}

export function isTrackingDisabled(): boolean {
  if (trackingDisabledInMemory) return true
  try {
    return localStorage.getItem(DNT_KEY) === '1'
  } catch {
    return false
  }
}

export function setTrackingDisabled(disabled: boolean) {
  trackingDisabledInMemory = disabled
  try {
    localStorage.setItem(DNT_KEY, disabled ? '1' : '0')
  } catch {
    if (disabled) {
      cleanupAnalytics?.()
      cleanupAnalytics = undefined
      initialized = false
      return
    }
  }

  if (disabled) {
    cleanupAnalytics?.()
    cleanupAnalytics = undefined
    initialized = false
    return
  }

  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {}
  initAnalytics()
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
    return
  }

  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => undefined)
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
  }
}

export function initAnalytics() {
  if (initialized || isTrackingDisabled()) return

  initialized = true
  sessionStartedAt = Date.now()
  currentPath = window.location.pathname
  pageEnteredAt = sessionStartedAt
  maxScrollPct = 0
  firedMilestones.clear()

  const sessionId = getSessionId()
  send({
    type: 'session_start',
    visitorUid: getVisitorUid(),
    sessionId,
    path: currentPath,
    referrer: document.referrer || '',
    utm: getUtmParams(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    screen: { width: window.screen.width, height: window.screen.height },
  })
  send({ type: 'page_view', sessionId, path: currentPath })

  const onScroll = () => {
    const doc = document.documentElement
    const total = doc.scrollHeight - doc.clientHeight
    if (total <= 0) return

    const pct = Math.min(100, Math.round((doc.scrollTop / total) * 100))
    maxScrollPct = Math.max(maxScrollPct, pct)

    for (const milestone of SCROLL_MILESTONES) {
      if (pct >= milestone && !firedMilestones.has(milestone)) {
        firedMilestones.add(milestone)
        trackEvent('Scroll', 'scroll_depth', undefined, { milestone })
      }
    }
  }

  const sendHeartbeat = () => send({ type: 'heartbeat', sessionId: getSessionId(), path: currentPath })
  const startHeartbeat = () => {
    if (heartbeatTimer) return
    sendHeartbeat()
    heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
  }
  const stopHeartbeat = () => {
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    heartbeatTimer = undefined
  }

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

  let sessionEnded = false
  const endSession = () => {
    if (sessionEnded) return
    sessionEnded = true
    stopHeartbeat()
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

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') startHeartbeat()
    else stopHeartbeat()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pagehide', endSession)
  document.addEventListener('visibilitychange', onVisibilityChange)
  startHeartbeat()

  cleanupAnalytics = () => {
    stopHeartbeat()
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pagehide', endSession)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
}

export function trackPageView(path: string) {
  if (isTrackingDisabled()) return
  if (!currentPath) {
    currentPath = path
    return
  }
  if (path === currentPath) return

  send(
    {
      type: 'page_view_end',
      sessionId: getSessionId(),
      path: currentPath,
      durationSeconds: Math.round((Date.now() - pageEnteredAt) / 1000),
      maxScrollPct,
    },
  )

  currentPath = path
  pageEnteredAt = Date.now()
  maxScrollPct = 0
  firedMilestones.clear()
  send({ type: 'page_view', sessionId: getSessionId(), path })
}

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
