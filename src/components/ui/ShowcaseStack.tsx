import { Children, useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { rootScale } from '../../lib/scale'

interface StackMetrics {
  fits: boolean
  tallest: number
  topOffset: number
  step: number
  gap: number
}

interface StackCardProps {
  children: ReactNode
  index: number
  total: number
  progress: MotionValue<number>
  metrics: StackMetrics
  register: (index: number, node: HTMLDivElement | null) => void
}

const WIDE_TOP_OFFSET = 80
const WIDE_STEP = 16
const NARROW_TOP_OFFSET = 72
const NARROW_STEP = 10
const BOTTOM_GAP = 24
const HEIGHT_NOISE = 150

function StackCard({ children, index, total, progress, metrics, register }: StackCardProps) {
  const { fits, tallest, topOffset, step, gap } = metrics
  const targetScale = 1 - (total - index - 1) * 0.04
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])
  const isLast = index === total - 1
  const top = fits
    ? topOffset + index * step
    : `calc(100svh - ${tallest}px - ${gap + (total - 1 - index) * step}px)`

  return (
    <div className="sticky" style={{ top, zIndex: index + 1, marginBottom: isLast ? 0 : 'clamp(2rem, 9vh, 5rem)' }}>
      <motion.div ref={(node) => register(index, node)} style={fits ? { scale } : undefined} className="flex origin-top">
        {children}
      </motion.div>
    </div>
  )
}

export default function ShowcaseStack({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLDivElement | null)[]>([])
  const reduce = useReducedMotion()
  const [metrics, setMetrics] = useState<StackMetrics>({ fits: true, tallest: 0, topOffset: WIDE_TOP_OFFSET, step: WIDE_STEP, gap: BOTTOM_GAP })
  const cards = Children.toArray(children)
  const count = cards.length
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })

  const register = useCallback((index: number, node: HTMLDivElement | null) => {
    nodes.current[index] = node
  }, [])

  useLayoutEffect(() => {
    if (reduce) return
    let lastWidth = window.innerWidth
    let lastHeight = window.innerHeight

    const measure = () => {
      const list = nodes.current.slice(0, count).filter((node): node is HTMLDivElement => node !== null)
      if (list.length === 0) return
      for (const node of list) node.style.minHeight = ''
      const tallest = Math.max(...list.map((node) => node.offsetHeight))
      for (const node of list) node.style.minHeight = `${tallest}px`
      const narrow = window.innerWidth < 768
      const scale = rootScale()
      const topOffset = (narrow ? NARROW_TOP_OFFSET : WIDE_TOP_OFFSET) * scale
      const step = (narrow ? NARROW_STEP : WIDE_STEP) * scale
      const gap = BOTTOM_GAP * scale
      const fits = tallest + topOffset + (count - 1) * step + gap <= window.innerHeight
      setMetrics((previous) =>
        previous.fits === fits && previous.tallest === tallest && previous.topOffset === topOffset && previous.step === step && previous.gap === gap
          ? previous
          : { fits, tallest, topOffset, step, gap },
      )
    }

    const onResize = () => {
      const widthChanged = window.innerWidth !== lastWidth
      const heightChanged = Math.abs(window.innerHeight - lastHeight) > HEIGHT_NOISE
      if (!widthChanged && !heightChanged) return
      lastWidth = window.innerWidth
      lastHeight = window.innerHeight
      measure()
    }

    measure()
    const observer = new ResizeObserver(measure)
    for (const node of nodes.current) if (node) observer.observe(node)
    window.addEventListener('resize', onResize)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [count, reduce])

  if (reduce) {
    return <div className="flex flex-col gap-6 px-4">{cards}</div>
  }

  return (
    <div ref={container} className="relative w-full px-4">
      {cards.map((card, i) => (
        <StackCard key={i} index={i} total={count} progress={scrollYProgress} metrics={metrics} register={register}>
          {card}
        </StackCard>
      ))}
    </div>
  )
}
