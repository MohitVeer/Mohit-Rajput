import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HelloStroke from './shell/HelloStroke'
import { isPreloadingNow, markIntroSeen, setPreloading } from './shell/preloadState'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const HOLD_MS = 250
const EXIT_MS = 1100

export default function Preloader() {
  const [visible, setVisible] = useState(isPreloadingNow)
  const finished = useRef(false)

  useBodyScrollLock(visible)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    markIntroSeen()
    window.setTimeout(() => {
      setPreloading(false)
      setVisible(false)
    }, HOLD_MS)
  }, [])

  useEffect(() => {
    if (!visible) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, finish])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          role="status"
          aria-label="Loading"
          initial={{ y: 0 }}
          exit={{ y: '-100%', transition: { duration: EXIT_MS / 1000, ease: [0.7, 0, 0.3, 1] } }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-background will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] } }}
            className="relative flex w-full max-w-[25rem] flex-col items-center justify-center text-foreground"
          >
            <HelloStroke speed={0.6} onComplete={finish} className="h-16 text-foreground sm:h-20 md:h-24" />
          </motion.div>

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-10 rounded-full px-4 py-3 text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
