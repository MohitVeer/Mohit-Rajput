import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import AboutHijack from './about/AboutHijack'
import AboutLeadIn from './about/AboutLeadIn'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: overlayRef, offset: ['start end', 'start start'] })
  const scale = useTransform(scrollYProgress, [0, 0.9], [1, 0.92])
  const opacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const pinned = useMediaQuery('(min-width: 768px) and (min-height: 640px)')

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative bg-background text-foreground transition-colors duration-500 dark:bg-black"
    >
      {pinned ? (
        <div className="pointer-events-none sticky top-0 z-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <motion.div style={{ scale, opacity, y }} className="relative mx-auto w-full max-w-[1700px] px-4 md:px-6">
            <AboutLeadIn />
          </motion.div>
        </div>
      ) : (
        <div className="relative z-0 flex w-full items-center justify-center px-4 pb-16 pt-24">
          <AboutLeadIn />
        </div>
      )}

      <div ref={overlayRef} className={pinned ? 'relative mt-[20vh]' : 'relative'}>
        <div className="relative bg-background transition-colors duration-500 dark:bg-black">
          <AboutHijack />
        </div>
      </div>
    </section>
  )
}
