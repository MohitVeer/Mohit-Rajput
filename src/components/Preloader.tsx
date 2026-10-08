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

const LINE_MS = 110
const FINISH_MS = 250
const SEEN_KEY = 'mr:intro-seen'

function introAlreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {}
}

export default function Preloader() {
  const [visible, setVisible] = useState(() => !introAlreadySeen())
  const [lineIndex, setLineIndex] = useState(0)
  const [skip, setSkip] = useState(false)

  useEffect(() => {
    if (!visible) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || skip) {
      markIntroSeen()
      setVisible(false)
      return
    }

    if (lineIndex >= BOOT_LINES.length - 1) {
      const finish = setTimeout(() => {
        markIntroSeen()
        setVisible(false)
      }, FINISH_MS)
      return () => clearTimeout(finish)
    }

    const advance = setTimeout(() => setLineIndex((i) => i + 1), LINE_MS)
    return () => clearTimeout(advance)
  }, [lineIndex, skip, visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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
