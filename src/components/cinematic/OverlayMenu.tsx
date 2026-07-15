import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { profile, sceneList } from '../../data/profile'

interface OverlayMenuProps {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

export default function OverlayMenu({ open, onClose, triggerRef }: OverlayMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const wasOpenRef = useRef(false)

  // Focus the panel when it opens, trap Tab within it, close on Escape,
  // and return focus to the trigger button when it closes.
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      const panel = panelRef.current
      const focusable = panel?.querySelectorAll<HTMLElement>('a, button')
      focusable?.[0]?.focus()

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
          return
        }
        if (e.key === 'Tab' && focusable && focusable.length > 0) {
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
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKeyDown)
        document.body.style.overflow = ''
      }
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false
      triggerRef.current?.focus()
    }
  }, [open, onClose, triggerRef])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="site-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          // data-lenis-prevent: tells the Lenis smooth-scroll library (which
          // otherwise hijacks wheel input on the whole window) to leave this
          // element alone so normal wheel/touch scrolling works inside it.
          data-lenis-prevent
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-background"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between px-5 py-5 sm:px-8 md:px-16 lg:px-24">
            <span className="scene-index" aria-hidden="true">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav
            aria-label="Scenes"
            className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:px-16 lg:px-24"
          >
            <ul className="w-full space-y-1">
              {sceneList.map((scene) => (
                <li key={scene.href} className="w-full border-b border-border">
                  <a
                    href={scene.href}
                    onClick={onClose}
                    className="flex w-full min-w-0 items-baseline gap-3 py-3.5 font-display text-2xl font-semibold text-muted-foreground transition-colors hover:text-foreground sm:gap-4 sm:text-4xl md:py-4 md:text-5xl"
                  >
                    <span className="shrink-0 font-mono text-xs text-accent sm:text-sm">
                      {scene.index}
                    </span>
                    <span className="min-w-0 break-words">{scene.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap gap-x-8 gap-y-3 px-5 py-6 font-mono text-sm text-muted-foreground sm:px-8 md:px-16 lg:px-24">
            <a href={`mailto:${profile.email}`} className="hover:text-foreground">
              {profile.email}
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              /{profile.linkedinHandle}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
