import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { cn } from '../../lib/cn'

interface FullscreenDialogProps {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
  className?: string
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function FullscreenDialog({ open, onClose, label, children, className }: FullscreenDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
    const timer = window.setTimeout(() => focusables()[0]?.focus(), 60)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const nodes = focusables()
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      returnFocus.current?.focus()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          data-lenis-prevent
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn('fixed inset-0 z-[150] overflow-y-auto overscroll-contain bg-background', className)}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="fixed right-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-foreground text-background shadow-2xl transition-transform hover:scale-110 md:right-8 md:top-8"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
