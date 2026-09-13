import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Thin gradient bar under the top nav that fills as you scroll the page —
 * a quick "how much is left" cue for a page with 10 full-height sections.
 * `useSpring` smooths the raw scroll fraction so it doesn't feel like a
 * literal 1:1 scrollbar clone.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-accent via-accent to-accent-2"
      style={{ scaleX }}
    />
  )
}
