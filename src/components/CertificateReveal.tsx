import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

export interface CertificateData {
  name: string
  image: string
  fileUrl?: string
}

interface CertificateRevealProps {
  cert: CertificateData | null
  onClose: () => void
  returnFocusRef: React.RefObject<HTMLElement>
}

const BOOT_LINES = ['loading credential...', 'checking Trailhead record...', 'ready.']
const LINE_INTERVAL_MS = 260

export default function CertificateReveal({ cert, onClose, returnFocusRef }: CertificateRevealProps) {
  const [phase, setPhase] = useState<'boot' | 'reveal'>('boot')
  const [lineIndex, setLineIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  const open = cert !== null

  // Reset to the start of the boot sequence every time a different
  // certificate is opened (skip straight to reveal under reduced motion).
  useEffect(() => {
    if (open) {
      setPhase(reduceMotion ? 'reveal' : 'boot')
      setLineIndex(0)
    }
  }, [open, cert?.name, reduceMotion])

  useEffect(() => {
    if (!open || phase !== 'boot') return
    if (lineIndex >= BOOT_LINES.length - 1) {
      const toReveal = setTimeout(() => setPhase('reveal'), LINE_INTERVAL_MS)
      return () => clearTimeout(toReveal)
    }
    const advance = setTimeout(() => setLineIndex((i) => i + 1), LINE_INTERVAL_MS)
    return () => clearTimeout(advance)
  }, [open, phase, lineIndex])

  // Focus trap + Escape-to-close + focus return, same pattern as the other
  // overlays in this app.
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
        onClose()
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
  }, [open, onClose, returnFocusRef])

  return (
    <AnimatePresence>
      {open && cert && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={cert.name}
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
              <div className="flex items-center justify-between gap-4">
                <span className="scene-index truncate">{cert.name}</span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
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

              <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-6 py-10">
                <img
                  src={cert.image}
                  alt={`${cert.name} badge`}
                  className="h-24 w-24"
                  width={96}
                  height={96}
                />
                <p className="text-center text-sm text-muted-foreground">{cert.name}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={profile.trailblazerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full bg-accent px-6 py-3 text-center text-sm font-semibold text-accent-foreground shadow-glow transition hover:opacity-90"
                >
                  Verify on Trailhead
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {cert.fileUrl ? (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full border border-border px-6 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent"
                  >
                    Open in new tab
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
