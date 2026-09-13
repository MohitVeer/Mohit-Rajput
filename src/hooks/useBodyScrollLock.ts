import { useEffect } from 'react'
import { getLenisInstance } from '../lib/lenisInstance'

/**
 * Locks page scroll while `active` is true — used by every full-screen
 * overlay (nav menu, résumé viewer, certificate viewer).
 *
 * `document.body.style.overflow = 'hidden'` alone isn't enough here: Lenis
 * drives scrolling itself (it captures wheel/touch input and calls
 * `window.scrollTo` directly), so it keeps scrolling the page behind an
 * open modal regardless of the body's overflow. `lenis.stop()` / `.start()`
 * is Lenis's own pause API for exactly this case, so both are needed —
 * the overflow toggle covers touch/reduced-motion visitors, who never get
 * a Lenis instance at all.
 */
export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    const lenis = getLenisInstance()
    lenis?.stop()
    document.body.style.overflow = 'hidden'

    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [active])
}
