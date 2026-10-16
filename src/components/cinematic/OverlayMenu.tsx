import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { profile } from '../../data/profile'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { trackEvent } from '../../lib/analytics'
import { siteRoutes } from '../../lib/siteRoutes'
import AnimatedThemeToggler from '../ui/AnimatedThemeToggler'

const MENU_ROUTES = siteRoutes.filter((route) => route.id !== 'privacy')

interface OverlayMenuProps {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLButtonElement>
}

export default function OverlayMenu({ open, onClose, triggerRef }: OverlayMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const wasOpenRef = useRef(false)
  const { pathname } = useLocation()

  useBodyScrollLock(open)

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
      return () => {
        document.removeEventListener('keydown', onKeyDown)
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

data-lenis-prevent
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-background"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between px-5 py-5 sm:px-8 md:px-16 lg:px-24">
            <span className="font-mono text-[0.625rem] font-black uppercase tracking-[0.3em] text-muted-foreground" aria-hidden="true">
              Menu
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-muted text-foreground transition hover:scale-105 hover:bg-foreground hover:text-background"
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
            aria-label="Pages"
            className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 md:px-16 lg:px-24"
          >
            <ul className="w-full space-y-1">
              {MENU_ROUTES.map((route, index) => (
                <li key={route.path} className="w-full border-b border-border">
                  <Link
                    to={route.path}
                    aria-current={pathname === route.path ? 'page' : undefined}
                    onClick={() => {
                      trackEvent('Navigation', 'nav_click', route.label)
                      onClose()
                    }}
                    className="flex w-full min-w-0 items-baseline gap-3 py-3.5 font-display text-2xl font-black tracking-tight text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground sm:gap-4 sm:text-4xl md:py-4 md:text-5xl"
                  >
                    <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-muted-foreground sm:text-sm">
                      {String(index).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 break-words">{route.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-6 font-sans text-sm text-muted-foreground sm:px-8 md:px-16 lg:px-24">
            <AnimatedThemeToggler className="-ml-2 bg-muted" />
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
