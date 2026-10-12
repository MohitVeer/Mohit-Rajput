import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import BackToTop from './BackToTop'
import Navbar from './Navbar'
import ClickConstellation from '../ClickConstellation'
import Footer from '../Footer'
import OverlayMenu from '../cinematic/OverlayMenu'
import Preloader from '../Preloader'
import { useSmoothScroll } from '../../hooks/useSmoothScroll'
import { getLenisInstance } from '../../lib/lenisInstance'
import { initAnalytics, trackPageView } from '../../lib/analytics'

function PageFallback() {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[70vh] place-items-center">
      <span className="sr-only">Loading page</span>
      <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground" />
    </div>
  )
}

function useRouteScroll(pathname: string, hash: string) {
  const previousPath = useRef<string | null>(null)

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    if (hash) return
    const lenis = getLenisInstance()
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [pathname, hash])

  useEffect(() => {
    if (!hash) return
    let attempts = 0
    const id = decodeURIComponent(hash.slice(1))
    const timer = window.setInterval(() => {
      attempts += 1
      const target = document.getElementById(id)
      if (target) {
        window.clearInterval(timer)
        const lenis = getLenisInstance()
        if (lenis) lenis.scrollTo(target, { offset: -88, immediate: attempts === 1 })
        else target.scrollIntoView({ behavior: 'auto', block: 'start' })
      } else if (attempts > 40) {
        window.clearInterval(timer)
      }
    }, 100)
    return () => window.clearInterval(timer)
  }, [pathname, hash])
}

export default function SiteLayout() {
  useSmoothScroll()
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    trackPageView(pathname)
    setMenuOpen(false)
  }, [pathname])

  useRouteScroll(pathname, hash)

  return (
    <div className="bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Preloader />
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
