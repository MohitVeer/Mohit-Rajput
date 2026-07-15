import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  'mounting trail...',
  'loading badges (319)...',
  'checking rank: Triple Star Ranger...',
  'checking superbadges: 5x Superbadge...',
  'checking agentblazer rank: Agentblazer Innovator 2026...',
  'ready.',
]

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const [lineIndex, setLineIndex] = useState(0)
  const [skip, setSkip] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || skip) {
      setVisible(false)
      return
    }

    if (lineIndex >= BOOT_LINES.length - 1) {
      const finish = setTimeout(() => setVisible(false), 450)
      return () => clearTimeout(finish)
    }

    const advance = setTimeout(() => setLineIndex((i) => i + 1), 260)
    return () => clearTimeout(advance)
  }, [lineIndex, skip])

  // Body stays scrollable/interactive the whole time — this is a purely
  // decorative overlay, not a modal, so it never traps focus or blocks the
  // real content underneath from being reached (e.g. by screen readers or
  // by someone tabbing before the animation finishes). It does hold one
  // real control (Skip), so the overlay itself is NOT aria-hidden — hiding
  // a focusable control from assistive tech would be a worse problem than
  // the loading animation being announced.
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <div className="pointer-events-auto text-center">
            <p className="font-mono text-sm text-muted-foreground">{BOOT_LINES[lineIndex]}</p>
            <button
              type="button"
              onClick={() => setSkip(true)}
              className="mt-6 rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
            >
              Skip intro
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
