import { forwardRef, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { FileText, Menu, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import { routeFor } from '../../lib/siteRoutes'
import AnimatedThemeToggler from '../ui/AnimatedThemeToggler'
import CardNav from './CardNav'
import { usePreloading } from './preloadState'

function Clock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`)
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span
      className="font-mono text-xl font-black tracking-widest transition-all duration-300 hover:tracking-[0.2em] md:text-2xl"
      aria-hidden="true"
    >
      <span className="text-gradient-mono">{time || '00:00:00'}</span>
    </span>
  )
}

interface NavbarProps {
  menuOpen: boolean
  onToggleMenu: () => void
}

const Navbar = forwardRef<HTMLButtonElement, NavbarProps>(function Navbar({ menuOpen, onToggleMenu }, menuButtonRef) {
  const { scrollY } = useScroll()
  const preloading = usePreloading()
  const { pathname } = useLocation()
  const activeId = routeFor(pathname).id
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [lastY, setLastY] = useState(0)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (menuOpen) return
    setScrolled(latest > 50)
    setVisible(!(latest > lastY && latest > 100))
    setLastY(latest)
  })

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative rounded-full px-5 py-2 text-sm font-bold transition-all duration-300',
      isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
    )

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={!preloading && (visible || menuOpen) ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-3 md:px-12 md:py-6 lg:px-24">
        <motion.div
          layout
          className={cn(
            'flex items-center justify-between rounded-full transition-all duration-500',
            scrolled ? 'glass-strong px-4 py-2 md:px-6 md:py-3' : 'py-2',
          )}
        >
          <Link to="/" className="group relative flex min-h-11 min-w-[120px] items-center">
            <span className="sr-only">Mohit Rajput — home</span>
            <Clock />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <CardNav activeId={activeId} />
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center gap-1 md:gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/resume"
                aria-label="View resume"
                className="grid rounded-full bg-muted/80 p-2.5 text-foreground transition-colors hover:bg-muted md:p-3"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>

            <AnimatedThemeToggler className="bg-muted/80 hover:bg-muted md:p-3" />

            <motion.button
              ref={menuButtonRef}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleMenu}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="rounded-full bg-muted/80 p-2.5 text-foreground transition-colors hover:bg-muted md:p-3 lg:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
})

export default Navbar
