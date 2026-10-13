import { useEffect, useState } from 'react'

interface ViewportSize {
  w: number
  h: number
}

const read = (): ViewportSize => (typeof window === 'undefined' ? { w: 1440, h: 900 } : { w: window.innerWidth, h: window.innerHeight })

export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<ViewportSize>(read)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let frame = 0
    const update = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const next = read()
        setSize((current) => {
          const heightOnly = current.w === next.w
          if (heightOnly && Math.abs(current.h - next.h) < (coarse ? 150 : 1)) return current
          return next
        })
      })
    }
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return size
}
