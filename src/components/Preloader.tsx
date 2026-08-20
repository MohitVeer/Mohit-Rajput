import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  'initializing profile...',
  'loading Salesforce credentials...',
  'checking Trailhead rank: Triple Star Ranger...',
  'validating 9x Salesforce certifications...',
  'checking 5x Superbadges...',
  'loading Agentforce expertise...',
  'compiling front-end stack...',
  'ready.'
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
