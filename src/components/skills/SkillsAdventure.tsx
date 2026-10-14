import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import CubeLoader from '../ui/CubeLoader'
import FitToParent from '../ui/FitToParent'
import HoverScrambleText from '../ui/HoverScrambleText'
import MagneticTag from './MagneticTag'
import { FEATURES, type Feature } from './features'
import { LOOP_VIEWPORT } from '../../lib/loop'

const BRIDGE = 'See how I turn requirements into \nproduction-ready Salesforce experiences'
const TOTAL = FEATURES.length + 1

function Visual({ feature, side }: { feature: Feature; side: 'left' | 'right' }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-background dark:bg-black">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-full w-full scale-[1.8]">
          <CubeLoader faces={feature.faces} />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 hidden bg-black dark:block"
        style={{
          WebkitMaskImage: side === 'left' ? 'linear-gradient(to right, transparent, black)' : 'linear-gradient(to left, transparent, black)',
          maskImage: side === 'left' ? 'linear-gradient(to right, transparent, black)' : 'linear-gradient(to left, transparent, black)',
        }}
      />
    </div>
  )
}

function Editorial({ feature, index }: { feature: Feature; index: number }) {
  return (
    <div className="relative z-10 flex w-full max-w-2xl flex-col items-start space-y-12 text-left">
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-60">Feature — 0{index + 1}</span>
          <span aria-hidden="true" className="h-px w-12 bg-primary/20" />
        </div>
        <h3 className="pointer-events-auto origin-left cursor-default text-4xl font-bold uppercase leading-tight tracking-tighter text-foreground transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-x-6 hover:text-foreground/50 md:text-5xl lg:text-6xl">
          {feature.heading}
        </h3>
        <p className="max-w-lg text-xl font-medium leading-tight text-muted-foreground md:text-2xl">{feature.description}</p>
      </div>
      <ul className="flex flex-wrap gap-4 pt-6" aria-label={`${feature.heading} skills`}>
        {feature.skills.map((skill, i) => (
          <MagneticTag key={skill} text={skill} index={i} />
        ))}
      </ul>
    </div>
  )
}

function FeatureSlide({ feature, index, progress }: { feature: Feature; index: number; progress: MotionValue<number> }) {
  const visualOnLeft = index % 2 === 0
  const step = 1 / TOTAL
  const base = index * step

  let enterStart = index === 0 ? -0.1 : base - step / 4
  let enterEnd = index === 0 ? -0.05 : base + step / 4
  let exitStart = base + step * 0.75
  let exitEnd = base + step * 1.25

  if (index === 0) {
    exitStart = 0.125
    exitEnd = 0.3125
  } else if (index === 1) {
    enterStart = 0.125
    enterEnd = 0.3125
  }

  const keys = [enterStart, enterEnd, exitStart, exitEnd]
  const visualY = useTransform(progress, keys, ['-120%', '0%', '0%', '-120%'])
  const textY = useTransform(progress, keys, ['120%', '0%', '0%', '120%'])
  const zIndex = useTransform(progress, keys, [10, 20, 20, 10])

  const visual = (side: 'left' | 'right') => (
    <motion.div
      style={{ y: visualY }}
      className={cn('relative z-10 h-full w-1/2 overflow-hidden bg-background dark:bg-black', side === 'left' ? 'rounded-l-3xl' : 'rounded-r-3xl')}
    >
      <Visual feature={feature} side={side} />
    </motion.div>
  )

  const text = (side: 'left' | 'right') => (
    <motion.div
      style={{ y: textY }}
      className={cn('relative z-10 h-full w-1/2 overflow-hidden bg-background dark:bg-black', side === 'left' ? 'rounded-l-3xl' : 'rounded-r-3xl')}
    >
      <div className="group relative flex h-full w-full items-center justify-start p-8 md:p-16 lg:p-24">
        <motion.div
          aria-hidden="true"
          className={cn('absolute inset-0 z-0', feature.hoverColor)}
          initial={{ height: 0 }}
          whileHover={{ height: '100%' }}
          transition={{ duration: 0.4 }}
        />
        <FitToParent>
          <Editorial feature={feature} index={index} />
        </FitToParent>
      </div>
    </motion.div>
  )

  return (
    <motion.div style={{ zIndex }} className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="pointer-events-auto relative flex h-full w-full max-w-[1600px]">
        {visualOnLeft ? visual('left') : text('left')}
        {visualOnLeft ? text('right') : visual('right')}
      </div>
    </motion.div>
  )
}

function BridgeSlide({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  const step = 1 / TOTAL
  const base = FEATURES.length * step
  const opacity = useTransform(progress, [base - step / 4, base + step / 4, 0.98, 1], [0, 1, 1, 0])
  const y = useTransform(progress, [base - step / 4, base + step / 4, 0.98, 1], [50, 0, 0, -50])

  return (
    <motion.div
      style={{ opacity, zIndex: 30 }}
      className={cn('absolute inset-0 flex flex-col items-center justify-center bg-background p-12 text-center dark:bg-black', active ? 'pointer-events-auto' : 'pointer-events-none')}
    >
      <motion.div style={{ y }} className="w-full max-w-[1200px] space-y-16 px-[5%]">
        <p className="font-sans text-4xl font-medium leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-7xl">
          <HoverScrambleText text={BRIDGE} />
        </p>
        <div className="flex flex-col items-center gap-6 pt-10 opacity-30">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.5em] text-foreground">Scroll to explore</span>
          <motion.span whileInView={{ y: [0, 8, 0], transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }} viewport={LOOP_VIEWPORT}>
            <ChevronDown className="h-6 w-6 text-foreground" aria-hidden="true" />
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function SkillsAdventure() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(1)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.1, restDelta: 0.001 })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const index = Math.min(Math.floor(latest / (1 / TOTAL)) + 1, TOTAL)
    if (index !== current) setCurrent(index)
  })

  const { scrollYProgress: enterRaw } = useScroll({ target: containerRef, offset: ['start end', 'start start'] })
  const enter = useSpring(enterRaw, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const enterScale = useTransform(enter, [0, 1], [0.85, 1])
  const enterOpacity = useTransform(enter, [0, 1], [0, 1])
  const enterRadius = useTransform(enter, [0, 1], ['40px', '0px'])

  return (
    <div ref={containerRef} className="pointer-events-none relative h-[800vh] w-full">
      <motion.div
        style={{ scale: enterScale, opacity: enterOpacity, borderRadius: enterRadius }}
        className="pointer-events-auto sticky top-0 h-screen w-full origin-center overflow-hidden bg-background dark:bg-black"
      >
        {FEATURES.map((feature, i) => (
          <FeatureSlide key={feature.heading} feature={feature} index={i} progress={progress} />
        ))}
        <BridgeSlide progress={progress} active={current === TOTAL} />
      </motion.div>
    </div>
  )
}
