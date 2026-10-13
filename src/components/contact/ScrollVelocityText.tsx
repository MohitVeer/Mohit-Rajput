import { useEffect, useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { cn } from '../../lib/cn'

const COPIES = 6

const wrap = (min: number, max: number, value: number) => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

interface VelocityRowProps {
  text: string
  velocity: number
  className?: string
}

function VelocityRow({ text, velocity, className }: VelocityRowProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })
  const rowRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLSpanElement>(null)
  const visible = useRef(true)
  const direction = useRef(1)
  const [copyWidth, setCopyWidth] = useState(0)

  useEffect(() => {
    const node = copyRef.current
    if (!node) return
    const measure = () => setCopyWidth(node.offsetWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = rowRef.current
    if (!node) return
    const watcher = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting
    })
    watcher.observe(node)
    return () => watcher.disconnect()
  }, [])

  const x = useTransform(baseX, (value) => (copyWidth === 0 ? '0px' : `${wrap(-copyWidth, 0, value)}px`))

  useAnimationFrame((_, delta) => {
    if (!visible.current) return
    const factor = boost.get()
    if (factor < 0) direction.current = -1
    else if (factor > 0) direction.current = 1
    let step = direction.current * velocity * (delta / 1000)
    step += direction.current * step * factor
    baseX.set(baseX.get() + step)
  })

  return (
    <div ref={rowRef} className="relative overflow-hidden">
      <motion.div className="flex whitespace-nowrap text-center font-bold tracking-[-0.02em] drop-shadow-sm" style={{ x }}>
        {Array.from({ length: COPIES }, (_, index) => (
          <span key={index} ref={index === 0 ? copyRef : undefined} className={cn('shrink-0', className)}>
            {text}
            {' '}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function ScrollVelocityText({ texts, velocity = 20, className }: { texts: string[]; velocity?: number; className?: string }) {
  const calm = useReducedMotion()

  if (calm) {
    return (
      <div className="w-full overflow-hidden">
        {texts.map((text) => (
          <div key={text} className={cn('whitespace-nowrap text-center font-bold tracking-[-0.02em]', className)}>
            {text}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {texts.map((text, index) => (
        <VelocityRow key={text} text={text} velocity={index % 2 !== 0 ? -velocity : velocity} className={className} />
      ))}
    </div>
  )
}
