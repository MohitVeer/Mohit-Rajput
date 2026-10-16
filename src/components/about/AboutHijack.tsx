import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import IdentitySequence from './IdentitySequence'
import IdentityStatic from './IdentityStatic'
import ImpactPanel from './ImpactPanel'

function StackedAbout() {
  return (
    <div id="metrics" aria-labelledby="metrics-heading" className="relative">
      <ImpactPanel compact />
      <IdentityStatic />
    </div>
  )
}

export default function AboutHijack() {
  const pinned = useMediaQuery('(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)')
  return pinned ? <PinnedAbout /> : <StackedAbout />
}

function PinnedAbout() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, mass: 0.5 })
  const [showBorder, setShowBorder] = useState(true)

  const borderOpacity = useTransform(progress, [0.1, 0.15], [1, 0])
  const xShift = useTransform(progress, [0, 0.1, 0.4, 1], ['0vw', '0vw', '-100vw', '-100vw'])

  useMotionValueEvent(progress, 'change', (v) => {
    if (v >= 0.2 && showBorder) setShowBorder(false)
    if (v < 0.15 && !showBorder) setShowBorder(true)
  })

  const { scrollYProgress: exitRaw } = useScroll({ target: sectionRef, offset: ['end end', 'end start'] })
  const exit = useSpring(exitRaw, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const exitScale = useTransform(exit, [0, 1], [1, 0.85])
  const exitOpacity = useTransform(exit, [0, 1], [1, 0])
  const exitRadius = useTransform(exit, [0, 1], ['0px', '40px'])

  return (
    <div id="metrics" aria-labelledby="metrics-heading" ref={sectionRef} className="relative h-[600vh]">
      <div className="sticky top-0 z-10 h-screen w-full overflow-hidden">
        <motion.div style={{ scale: exitScale, opacity: exitOpacity, borderRadius: exitRadius }} className="relative h-full w-full origin-center">
          <AnimatePresence>
            {showBorder && (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                style={{
                  opacity: borderOpacity,
                  maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
                }}
                className="pointer-events-none absolute left-0 right-0 top-0 z-[100] h-48 rounded-t-[3.125rem] border-x-2 border-t-2 border-neutral-200 dark:border-zinc-800 md:rounded-t-[5rem]"
              />
            )}
          </AnimatePresence>
          <motion.div className="flex h-full" style={{ width: '200vw', x: xShift }}>
            <div className="h-full w-screen flex-shrink-0">
              <div className="flex h-full w-screen items-center justify-center overflow-hidden bg-background transition-colors duration-500">
                <ImpactPanel />
              </div>
            </div>
            <div className="h-full w-screen flex-shrink-0">
              <IdentitySequence scrollYProgress={progress} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
