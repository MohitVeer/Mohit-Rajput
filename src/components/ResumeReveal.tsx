import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { OPEN_RESUME_EVENT } from '../lib/resumeEvents'

const BOOT_LINES = ['opening dossier...', 'verifying credentials...', 'ready.']
const LINE_INTERVAL_MS = 320

export default function ResumeReveal() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<'boot' | 'reveal'>('boot')
  const [lineIndex, setLineIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // Any "View Résumé" button anywhere in the app calls openResume(), which
  // dispatches this event — keeps a single overlay/instance instead of one
  // per trigger button (avoiding duplicate ids/focus-trap conflicts).
  useEffect(() => {
    const handleOpen = () => {
      returnFocusRef.current = document.activeElement as HTMLElement
      setPhase(reduceMotion ? 'reveal' : 'boot')
      setLineIndex(0)
      setOpen(true)
    }
    window.addEventListener(OPEN_RESUME_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_RESUME_EVENT, handleOpen)
  }, [reduceMotion])

  // Advance the boot-sequence lines, then flip to the reveal phase.
  useEffect(() => {
    if (!open || phase !== 'boot') return
    if (lineIndex >= BOOT_LINES.length - 1) {
      const toReveal = setTimeout(() => setPhase('reveal'), LINE_INTERVAL_MS)
      return () => clearTimeout(toReveal)
    }
    const advance = setTimeout(() => setLineIndex((i) => i + 1), LINE_INTERVAL_MS)
    return () => clearTimeout(advance)
  }, [open, phase, lineIndex])

  const close = () => setOpen(false)

  // Focus management + focus trap + Escape-to-close, same pattern as the
  // scene menu overlay.
  useEffect(() => {
    if (!open) {
      returnFocusRef.current?.focus()
      return
    }

    document.body.style.overflow = 'hidden'
    const focusTimer = setTimeout(() => {
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>('a, button')
      focusable?.[0]?.focus()
    }, 50)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'Tab') {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>('a, button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Résumé"
          data-lenis-prevent
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 px-5 backdrop-blur-sm"
        >
          {phase === 'boot' ? (
            <p role="status" aria-live="polite" className="font-mono text-sm text-muted-foreground">
              {BOOT_LINES[lineIndex]}
            </p>
          ) : (
            <motion.div
              initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-sm"
            >
              <div className="flex items-center justify-between">
                <span className="scene-index">Resume</span>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
                <iframe
                src={`${profile.resumeUrl}#toolbar=0`}
                title="Resume preview"
  // No sandbox attribute here: this is a same-origin,
  // trusted static PDF, and Chrome's built-in PDF viewer
  // needs same-origin + script permissions to render at
  // all — a sandboxed iframe just shows a blank/broken
  // preview instead. referrerPolicy still applies since it
  // doesn't affect rendering.
                referrerPolicy="no-referrer"
                className="h-72 w-full sm:h-80"
                />
                <p className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
                  Preview not loading? Use the buttons below.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={profile.resumeUrl}
                  download
                  className="flex-1 rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-accent-foreground shadow-glow transition hover:opacity-90"
                >
                  Download PDF
                </a>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent"
                >
                  Open in new tab
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
