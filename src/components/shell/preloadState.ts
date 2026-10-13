import { useSyncExternalStore } from 'react'

export const INTRO_SEEN_KEY = 'mr:intro-seen'

export function introAlreadySeen() {
  try {
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1')
  } catch {
    return
  }
}

const CRAWLER = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|whatsapp|pinterest|quora|linkedinbot|twitterbot|duckduck|yandex|baidu|lighthouse|pagespeed|gtmetrix/i

function shouldPreload() {
  if (typeof window === 'undefined') return false
  if (CRAWLER.test(window.navigator.userAgent)) return false
  if (window.location.pathname.replace(/\/+$/, '') !== '') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !introAlreadySeen()
}

let preloading = shouldPreload()
const listeners = new Set<() => void>()

export function setPreloading(value: boolean) {
  if (preloading === value) return
  preloading = value
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function usePreloading() {
  return useSyncExternalStore(
    subscribe,
    () => preloading,
    () => false,
  )
}

export function isPreloadingNow() {
  return preloading
}
