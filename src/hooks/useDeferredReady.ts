import { useEffect, useState } from 'react'
import { usePreloading } from '../components/shell/preloadState'

type IdleHandle = number

function whenIdle(callback: () => void, timeout: number): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const handle: IdleHandle = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(handle)
  }
  const handle = window.setTimeout(callback, timeout)
  return () => window.clearTimeout(handle)
}

export function useDeferredReady(timeout = 1200): boolean {
  const preloading = usePreloading()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (preloading || ready) return
    return whenIdle(() => setReady(true), timeout)
  }, [preloading, ready, timeout])

  return ready || (typeof window !== 'undefined' && window.location.hash.length > 1)
}
