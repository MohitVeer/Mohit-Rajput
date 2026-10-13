import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { getLenisInstance } from '../../lib/lenisInstance'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const visibleRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 120, damping: 14, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 120, damping: 14, mass: 0.1 })

  useEffect(() => {
    const onScroll = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      if (visibleRef.current) {
        visibleRef.current = false
        setVisible(false)
      }
      timeoutRef.current = window.setTimeout(() => {
        const enough = window.scrollY > 100
        if (enough !== visibleRef.current) {
          visibleRef.current = enough
          setVisible(enough)
        }
      }, 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const onMouseMove = (event: React.MouseEvent) => {
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (!rect) return
    x.set(event.clientX - (rect.left + rect.width / 2))
    y.set(event.clientY - (rect.top + rect.height / 2))
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const scrollToTop = () => {
    const lenis = getLenisInstance()
    if (lenis) lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <div
          ref={wrapperRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className="pointer-events-none fixed bottom-[calc(2.5rem+env(safe-area-inset-bottom,0px))] right-3 z-[60] flex h-16 w-16 items-center justify-center md:bottom-4 md:right-4 md:h-24 md:w-24"
        >
          <motion.button
            type="button"
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            style={{ x: springX, y: springY }}
            className="group pointer-events-auto relative flex h-12 w-12 items-center justify-center rounded-full border border-background/20 bg-foreground text-background shadow-2xl backdrop-blur-md md:h-14 md:w-14"
          >
            <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 md:h-6 md:w-6" aria-hidden="true" />
            <span aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-foreground/10 blur-xl transition-all group-hover:blur-2xl" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
