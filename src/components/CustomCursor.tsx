import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hoveringLink, setHoveringLink] = useState(false)

  useEffect(() => {
    const canUseCustomCursor =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(canUseCustomCursor)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const moveCursor = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
      const target = e.target as HTMLElement
      setHoveringLink(Boolean(target.closest('a, button, [role="button"]')))
    }

    window.addEventListener('mousemove', moveCursor, { passive: true })
    return () => window.removeEventListener('mousemove', moveCursor)
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[300] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary mix-blend-normal transition-[width,height] duration-150 ${
        hoveringLink ? 'h-10 w-10 bg-primary/10' : 'h-3 w-3 bg-primary'
      }`}
    />
  )
}
