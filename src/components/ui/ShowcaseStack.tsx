import { Children, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

interface StackCardProps {
  children: ReactNode
  index: number
  total: number
  progress: MotionValue<number>
}

const TOP_OFFSET = 80
const STEP = 16
const BOTTOM_GAP = 24

function StackCard({ children, index, total, progress }: StackCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [fits, setFits] = useState(true)
  const top = TOP_OFFSET + index * STEP
  const targetScale = 1 - (total - index - 1) * 0.04
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => setFits(node.offsetHeight + top + BOTTOM_GAP <= window.innerHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [top])

  const isLast = index === total - 1

  return (
    <div
      className={fits ? 'sticky' : 'relative'}
      style={{ top: fits ? top : undefined, zIndex: index + 1, marginBottom: isLast ? 0 : 'clamp(2rem, 9vh, 5rem)' }}
    >
      <motion.div ref={ref} style={fits ? { scale } : undefined} className="origin-top">
        {children}
      </motion.div>
    </div>
  )
}

export default function ShowcaseStack({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })
  const cards = Children.toArray(children)

  if (reduce) {
    return <div className="flex flex-col gap-6 px-4">{cards}</div>
  }

  return (
    <div ref={container} className="relative w-full px-4">
      {cards.map((card, i) => (
        <StackCard key={i} index={i} total={cards.length} progress={scrollYProgress}>
          {card}
        </StackCard>
      ))}
    </div>
  )
}
