import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

interface FitToParentProps {
  children: ReactNode
  origin?: string
  minScale?: number
}

export default function FitToParent({ children, origin = 'left center', minScale = 0.55 }: FitToParentProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const node = ref.current
    const parent = node?.parentElement
    if (!node || !parent) return
    const measure = () => {
      const style = getComputedStyle(parent)
      const available = parent.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      const needed = node.offsetHeight
      setScale(available > 0 && needed > available ? Math.max(minScale, available / needed) : 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    observer.observe(parent)
    return () => observer.disconnect()
  }, [minScale])

  return (
    <div ref={ref} className="w-full" style={{ transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: origin }}>
      {children}
    </div>
  )
}

interface FitToViewportProps {
  children: ReactNode
  margin?: number
  minScale?: number
}

export function FitToViewport({ children, margin = 24, minScale = 0.6 }: FitToViewportProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const available = window.innerHeight - margin
      const needed = node.offsetHeight
      setScale(needed > available ? Math.max(minScale, available / needed) : 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [margin, minScale])

  return (
    <div ref={ref} className="w-full" style={{ transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: 'center center' }}>
      {children}
    </div>
  )
}
