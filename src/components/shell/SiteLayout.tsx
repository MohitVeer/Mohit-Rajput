import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { motion } from 'framer-motion'
import BackToTop from './BackToTop'
import Navbar from './Navbar'
import ClickConstellation from '../ClickConstellation'
import Footer from '../Footer'
import OverlayMenu from '../cinematic/OverlayMenu'
import Preloader from '../Preloader'
import RouteCurtain from './RouteCurtain'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { getLenisInstance } from '../../lib/lenisInstance'
import { startAnalytics, trackPageView } from '../../lib/analytics'

function PageFallback() {
  return (
    <div role="status" aria-live="polite" data-page-fallback className="grid min-h-[100svh] place-items-center">
      <span className="sr-only">Loading page</span>
      <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground" />
    </div>
  )
}

const SCROLL_STORE = 'mr:scroll'

function readScrollStore(): Record<string, number> {
  try {
    return JSON.parse(window.sessionStorage.getItem(SCROLL_STORE) ?? '{}') as Record<string, number>
  } catch {
    return {}
  }
}

function writeScrollStore(map: Record<string, number>) {
  try {
    window.sessionStorage.setItem(SCROLL_STORE, JSON.stringify(Object.fromEntries(Object.entries(map).slice(-40))))
  } catch {
    return
  }
}

function useScrollMemory(key: string) {
  const positions = useRef<Record<string, number>>(readScrollStore())
  const current = useRef(key)
  current.current = key

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    let frame = 0
    const record = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        positions.current[current.current] = Math.round(window.scrollY)
      })
    }
    const flush = () => writeScrollStore(positions.current)
    window.addEventListener('scroll', record, { passive: true })
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('scroll', record)
      window.removeEventListener('pagehide', flush)
      if (frame) window.cancelAnimationFrame(frame)
      flush()
    }
  }, [])

  return positions
}

function useRouteScroll(key: string, pathname: string, hash: string, navigationType: string) {
  const previousPath = useRef<string | null>(null)
  const memoryKey = `${key}|${pathname}`
  const positions = useScrollMemory(memoryKey)
  const pending = useRef<number | null>(null)

  useLayoutEffect(() => {
    const samePath = previousPath.current === pathname
    previousPath.current = pathname
    pending.current = null
    if (hash) return
    const saved = navigationType === 'POP' ? positions.current[memoryKey] : undefined
    if (saved !== undefined && saved > 0) {
      pending.current = saved
      return
    }
    if (samePath) return
    const lenis = getLenisInstance()
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [memoryKey, pathname, hash, navigationType, positions])

  useEffect(() => {
    const target = pending.current
    if (target === null) return
    pending.current = null
    let attempts = 0
    const apply = () => {
      const lenis = getLenisInstance()
      if (lenis) lenis.resize()
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      const y = Math.min(target, max)
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      window.scrollTo(0, y)
      return max >= target - 2
    }
    let timer = 0
    const stop = () => window.clearInterval(timer)
    timer = window.setInterval(() => {
      attempts += 1
      if (apply() || attempts > 30) stop()
    }, 100)
    apply()
    const cancel = ['wheel', 'touchstart', 'keydown']
    for (const name of cancel) window.addEventListener(name, stop, { passive: true, once: true })
    return () => {
      stop()
      for (const name of cancel) window.removeEventListener(name, stop)
    }
  }, [memoryKey])

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    const timers: number[] = []
    let attempts = 0
    let landedAt = 0

    const go = (target: HTMLElement) => {
      const lenis = getLenisInstance()
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 88)
      if (lenis) {
        lenis.resize()
        lenis.scrollTo(top, { immediate: true, force: true })
      } else {
        window.scrollTo({ top })
      }
      landedAt = window.scrollY
    }

    const poll = window.setInterval(() => {
      attempts += 1
      const target = document.getElementById(id)
      if (target) {
        window.clearInterval(poll)
        go(target)
        for (const delay of [350, 900, 1800]) {
          timers.push(
            window.setTimeout(() => {
              const userMoved = Math.abs(window.scrollY - landedAt) > 80
              if (!userMoved && Math.abs(target.getBoundingClientRect().top - 88) > 6) go(target)
            }, delay),
          )
        }
      } else if (attempts > 40) {
        window.clearInterval(poll)
      }
    }, 100)

    return () => {
      window.clearInterval(poll)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [pathname, hash])
}

export default function SiteLayout() {
  useSmoothScroll()
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    startAnalytics()
  }, [])

  useEffect(() => {
    trackPageView(pathname)
    setMenuOpen(false)
  }, [pathname])

  useRouteScroll(key, pathname, hash, navigationType)

  return (
    <div className="bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Preloader />
      <RouteCurtain />
      <ClickConstellation />
      <Navbar ref={menuTriggerRef} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuTriggerRef} />

      <main id="main-content">
        <Suspense fallback={<PageFallback />}>
          <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
            <Outlet />
          </motion.div>
        </Suspense>
      </main>

      <Footer />
      <BackToTop />
    </div>
  )
}
