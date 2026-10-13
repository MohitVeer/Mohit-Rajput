import { Children, useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

interface StackCardProps {
  children: ReactNode
  index: number
  total: number
  progress: MotionValue<number>
  fits: boolean
  register: (index: number, node: HTMLDivElement | null) => void
}

const TOP_OFFSET = 80
const STEP = 16
const BOTTOM_GAP = 24
const HEIGHT_NOISE = 150

function StackCard({ children, index, total, progress, fits, register }: StackCardProps) {
  const top = TOP_OFFSET + index * STEP
  const targetScale = 1 - (total - index - 1) * 0.04
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])
  const isLast = index === total - 1

  return (
    <div
      className={fits ? 'sticky' : 'relative'}
      style={{ top: fits ? top : undefined, zIndex: index + 1, marginBottom: isLast ? 0 : 'clamp(2rem, 9vh, 5rem)' }}
    >
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
  const [fits, setFits] = useState(true)
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
      setFits(tallest + TOP_OFFSET + (count - 1) * STEP + BOTTOM_GAP <= window.innerHeight)
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
        <StackCard key={i} index={i} total={count} progress={scrollYProgress} fits={fits} register={register}>
          {card}
        </StackCard>
      ))}
    </div>
  )
}
