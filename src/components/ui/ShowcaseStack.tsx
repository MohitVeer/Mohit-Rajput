import { Children, useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

interface StackCardProps {
  children: ReactNode
  index: number
  total: number
  progress: MotionValue<number>
}

function StackCard({ children, index, total, progress }: StackCardProps) {
  const targetScale = 1 - (total - index) * 0.05
  const scale = useTransform(progress, [index * (1 / total), 1], [1, targetScale])

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center" style={{ zIndex: index + 1 }}>
      <motion.div style={{ scale, top: `calc(-5vh + ${index * 25}px)` }} className="relative w-full origin-top">
        {children}
      </motion.div>
    </div>
  )
}

export default function ShowcaseStack({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })
  const cards = Children.toArray(children)

  return (
    <div ref={container} className="relative w-full">
      {cards.map((card, i) => (
        <StackCard key={i} index={i} total={cards.length} progress={scrollYProgress}>
          {card}
        </StackCard>
      ))}
    </div>
  )
}
