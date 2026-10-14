import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useNearScreen } from '../../lib/loop'

interface SpotlightBeamsProps {
  gradientFirst?: string
  gradientSecond?: string
  gradientThird?: string
  translateY?: number
  width?: number
  height?: number
  smallWidth?: number
  duration?: number
  xOffset?: number
}

export default function SpotlightBeams({
  gradientFirst = 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0, 0%, 100%, .15) 0, hsla(0, 0%, 100%, .05) 50%, transparent 80%)',
  gradientSecond = 'radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .1) 0, hsla(0, 0%, 100%, .02) 80%, transparent 100%)',
  gradientThird = 'radial-gradient(50% 50% at 50% 50%, hsla(0, 0%, 100%, .08) 0, hsla(0, 0%, 100%, 0) 80%, transparent 100%)',
  translateY = -300,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 10,
  xOffset = 120,
}: SpotlightBeamsProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const near = useNearScreen(leftRef)
  const beam = (side: 'left' | 'right') => {
    const sign = side === 'left' ? 1 : -1
    const rotate = side === 'left' ? -45 : 45
    const origin = side === 'left' ? 'origin-top-left' : 'origin-top-right'
    const pos = side === 'left' ? 'left-0' : 'right-0'
    return (
      <motion.div
        key={side}
        ref={side === 'left' ? leftRef : undefined}
        animate={near ? { x: [0, xOffset * sign, 0] } : { x: 0 }}
        transition={near ? { duration, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } : { duration: 0 }}
        className={`pointer-events-none absolute top-0 ${pos} h-screen w-screen`}
      >
        <div
          style={{ transform: `translateY(${translateY}px) rotate(${rotate}deg)`, background: gradientFirst, width, height }}
          className={`absolute top-0 ${pos}`}
        />
        <div
          style={{
            transform: `rotate(${rotate}deg) translate(${5 * sign}%, -50%)`,
            background: gradientSecond,
            width: smallWidth,
            height,
          }}
          className={`absolute top-0 ${pos} ${origin}`}
        />
        <div
          style={{
            transform: `rotate(${rotate}deg) translate(${-180 * sign}%, -70%)`,
            background: gradientThird,
            width: smallWidth,
            height,
          }}
          className={`absolute top-0 ${pos} ${origin}`}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {beam('left')}
      {beam('right')}
    </motion.div>
  )
}
