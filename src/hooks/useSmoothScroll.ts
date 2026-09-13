import { useEffect } from 'react'
import Lenis from 'lenis'
import { setLenisInstance } from '../lib/lenisInstance'

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

    if (prefersReducedMotion) return

    if (isTouchDevice) {
      // No Lenis here, so nothing fights the browser's own anchor-jump
      // animation — safe to let CSS `scroll-behavior: smooth` handle it.
      document.documentElement.style.scrollBehavior = 'smooth'
      return () => {
        document.documentElement.style.scrollBehavior = ''
      }
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    setLenisInstance(lenis)

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Once Lenis is driving the page, it owns window.scrollY on every
    // frame — a plain in-page anchor jump (nav menu links, "Back to top",
    // the corner scene nav) fights that write and gets silently snapped
    // back to wherever Lenis last was, so the click appears to do nothing.
    // Intercept same-page hash-link clicks ourselves and route them
    // through lenis.scrollTo instead of letting the browser's default
    // jump run at all. `-88` roughly matches the fixed top bar's height so
    // the target's heading doesn't land underneath it.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash.length < 2) return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -88 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      setLenisInstance(null)
      lenis.destroy()
    }
  }, [])
}
