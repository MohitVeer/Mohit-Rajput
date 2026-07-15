import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Wires up Lenis smooth scrolling for the whole page — desktop/mouse only.
 * Skipped when:
 * - The person has requested reduced motion (native instant scroll is the
 *   correct, accessible default there).
 * - The device is touch/coarse-pointer. Native mobile scroll and tap
 *   handling is already correct on phones/tablets; Lenis's touch handling
 *   was intercepting taps on interactive elements (e.g. the game grid),
 *   making them unresponsive.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (prefersReducedMotion || isTouchDevice) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
