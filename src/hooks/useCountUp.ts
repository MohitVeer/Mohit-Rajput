import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Animates a numeric string ("154,250", "~50%", "4.5+/5") from 0 up to its
 * real value once it scrolls into view. Non-numeric characters (%, +, /,
 * commas, the "~" prefix) are preserved verbatim; only the digit runs count
 * up, so "~50%" animates as "~0%" → "~50%" and "4.5+/5" ticks its "4.5" up
 * while "+/5" stays put.
 */
export function useCountUp(value: string, duration = 1.2) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? value : zeroed(value))

  useEffect(() => {
    if (!inView || reduceMotion) {
      if (reduceMotion) setDisplay(value)
      return
    }

    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(interpolate(value, eased))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [inView, reduceMotion, value, duration])

  return { ref, display }
}

/** Replaces every digit run in `value` with the same-length run of zeros. */
function zeroed(value: string) {
  return value.replace(/\d[\d,.]*\d|\d/g, (run) => run.replace(/\d/g, '0'))
}

/** Scales every digit run in `value` to `progress` of its final number. */
function interpolate(value: string, progress: number) {
  return value.replace(/\d[\d,.]*\d|\d/g, (run) => {
    const numeric = Number(run.replace(/,/g, ''))
    if (Number.isNaN(numeric)) return run
    const current = numeric * progress
    const hasDecimal = run.includes('.')
    const rounded = hasDecimal ? current.toFixed(1) : Math.round(current).toString()
    return hasDecimal ? rounded : Number(rounded).toLocaleString('en-US')
  })
}
