import { useEffect, useState } from 'react'

export interface BreakpointValue<T> {
  sm: T
  md: T
  lg: T
}

function pick<T>(value: BreakpointValue<T>): T {
  if (window.matchMedia('(min-width: 1024px)').matches) return value.lg
  if (window.matchMedia('(min-width: 768px)').matches) return value.md
  return value.sm
}

export function useBreakpointValue<T>(value: BreakpointValue<T>): T {
  const [current, setCurrent] = useState<T>(() => (typeof window === 'undefined' ? value.lg : pick(value)))

  useEffect(() => {
    const update = () => setCurrent(pick(value))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [value.sm, value.md, value.lg])

  return current
}
