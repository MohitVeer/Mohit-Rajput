import { useEffect, useState, type ReactNode } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { cn } from '../../lib/cn'

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

interface InfiniteRibbonProps {
  children: ReactNode
  baseVelocity?: number
  rotation?: number
  reverse?: boolean
  className?: string
  background?: string
  textColor?: string
}

export default function InfiniteRibbon({
  children,
  baseVelocity = 2,
  rotation = 0,
  reverse = false,
  className,
  background = 'bg-primary',
  textColor = 'text-primary-foreground',
}: InfiniteRibbonProps) {
  const baseX = useMotionValue(reverse ? -50 : 0)
  const { scrollY } = useScroll()
  const smoothVelocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })
  const [compact, setStatic] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px), (prefers-reduced-motion: reduce)')
    const update = () => setStatic(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (compact) return
    let move = baseVelocity * (delta / 1000)
    if (reverse) move = -move
    move += move * velocityFactor.get()
    baseX.set(baseX.get() - move)
  })

  return (
    <div
      aria-hidden="true"
      className={cn('absolute left-1/2 top-1/2 z-10 w-[200vw] overflow-hidden whitespace-nowrap py-3 opacity-90', background, className)}
      style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)`, transformOrigin: 'center center' }}
    >
      <motion.div
        className={cn(
          'flex w-max items-center whitespace-nowrap text-sm font-bold uppercase tracking-widest',
          textColor,
          compact && (reverse ? 'animate-marquee-right [--duration:40s]' : 'animate-marquee-left [--duration:40s]'),
        )}
        style={compact ? undefined : { x }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="flex items-center pr-10">
            {children}
            <span className="ml-10 h-1.5 w-1.5 rounded-full bg-current opacity-50" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
