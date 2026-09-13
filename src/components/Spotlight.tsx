import { useEffect } from 'react'

/**
 * A soft radial glow that tracks the pointer across the whole page —
 * pure atmosphere, no interaction target. Writes straight to CSS custom
 * properties (read by `.cursor-spotlight` in index.css) via rAF-throttled
 * mousemove, the same pattern CustomCursor uses, so this adds one more
 * cheap listener rather than a second render loop.
 *
 * Fine-pointer, motion-OK devices only: touch has no hover, and reduced-
 * motion users get a static page instead of a light chasing their finger.
 */
export default function Spotlight() {
  useEffect(() => {
    const canShow =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canShow) return

    const root = document.documentElement
    let raf: number
    let latest: { x: number; y: number } | null = null

    const onMove = (e: MouseEvent) => {
      latest = { x: e.clientX, y: e.clientY }
    }
    const onEnter = () => root.style.setProperty('--spotlight-opacity', '1')
    const onLeave = () => root.style.setProperty('--spotlight-opacity', '0')

    const apply = () => {
      if (latest) {
        root.style.setProperty('--spotlight-x', `${latest.x}px`)
        root.style.setProperty('--spotlight-y', `${latest.y}px`)
      }
      raf = requestAnimationFrame(apply)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(apply)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div className="cursor-spotlight" aria-hidden="true" />
}
