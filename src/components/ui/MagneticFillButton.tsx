import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'

interface MagneticFillButtonProps {
  children: ReactNode
  onClick: () => void
  flipArrow?: boolean
  expanded?: boolean
}

export default function MagneticFillButton({ children, onClick, flipArrow = false, expanded }: MagneticFillButtonProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const pullX = useMotionValue(0)
  const pullY = useMotionValue(0)
  const x = useSpring(pullX, { stiffness: 300, damping: 22 })
  const y = useSpring(pullY, { stiffness: 300, damping: 22 })

  const onMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduce || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    pullX.set((event.clientX - (rect.left + rect.width / 2)) * 0.35)
    pullY.set((event.clientY - (rect.top + rect.height / 2)) * 0.35)
  }

  const release = () => {
    setHovered(false)
    pullX.set(0)
    pullY.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      onPointerMove={onMove}
      onPointerEnter={(event) => event.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={release}
      onFocus={() => setHovered(true)}
      onBlur={release}
      style={{ x, y }}
      className="relative overflow-hidden rounded-full border border-foreground bg-foreground px-8 py-3.5 text-sm font-semibold text-background outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-left rounded-full bg-background"
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className={cn('relative z-10 flex items-center gap-2 transition-colors duration-300', hovered ? 'text-foreground' : 'text-background')}>
        {children}
        <ArrowRight className={cn('h-4 w-4 transition-transform duration-300', flipArrow && 'rotate-180')} aria-hidden="true" />
      </span>
    </motion.button>
  )
}
