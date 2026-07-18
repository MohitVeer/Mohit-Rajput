import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hoveringLink, setHoveringLink] = useState(false)
  const positionRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>()

  useEffect(() => {
    const canUseCustomCursor =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(canUseCustomCursor)
  }, [])

  useEffect(() => {
    if (!enabled) return

    // mousemove only records the latest position (cheap) — the actual DOM
    // write happens at most once per animation frame below, instead of
    // once per raw mouse event (which can fire far faster than the screen
    // refreshes on high-poll-rate mice/trackpads).
    const moveCursor = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      const target = e.target as HTMLElement
      setHoveringLink(Boolean(target.closest('a, button, [role="button"]')))
    }
    window.addEventListener('mousemove', moveCursor, { passive: true })

    const applyPosition = () => {
      if (dotRef.current) {
        const { x, y } = positionRef.current
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
      rafRef.current = requestAnimationFrame(applyPosition)
    }
    rafRef.current = requestAnimationFrame(applyPosition)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[300] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary mix-blend-normal transition-[width,height] duration-150 will-change-transform ${
        hoveringLink ? 'h-10 w-10 bg-primary/10' : 'h-3 w-3 bg-primary'
      }`}
    />
  )
}
