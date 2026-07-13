import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { sceneList } from '../../data/profile'

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
          className="fixed inset-0 z-50 flex flex-col justify-center bg-background px-6 md:px-16 lg:px-24"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <nav aria-label="Scenes">
            <ul className="space-y-2">
              {sceneList.map((scene) => (
                <li key={scene.href}>
                  <a
                    href={scene.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-2 font-display text-4xl font-semibold text-muted-foreground transition-colors hover:text-foreground md:text-6xl"
                  >
                    <span className="font-mono text-sm text-accent">{scene.index}</span>
                    {scene.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="mt-10 font-mono text-xs text-muted-foreground">Press Esc to close</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
