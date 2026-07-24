import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import About from './components/About'
import ClickConstellation from './components/ClickConstellation'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Metrics from './components/Metrics'
import Preloader from './components/Preloader'
import ResumeReveal from './components/ResumeReveal'
import MinimalBar from './components/cinematic/MinimalBar'
import OverlayMenu from './components/cinematic/OverlayMenu'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { initAnalytics } from './lib/analytics'

// Below-the-fold sections: code-split so their JS (and, for Experience/
// LightningRush, their heavier animation/game logic) isn't parsed until the
// browser actually needs it, instead of shipping it all in the initial
// bundle up front.
const Trailblazer = lazy(() => import('./components/Trailblazer'))
const Skills = lazy(() => import('./components/Skills'))
const Experience = lazy(() => import('./components/Experience'))
const Certifications = lazy(() => import('./components/Certifications'))
const Articles = lazy(() => import('./components/Articles'))
const LightningRush = lazy(() => import('./components/LightningRush'))
const Contact = lazy(() => import('./components/Contact'))

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    initAnalytics()
  }, [])

  const [menuOpen, setMenuOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Preloader />
      <ClickConstellation />
      <CustomCursor />
      <MinimalBar ref={menuTriggerRef} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuTriggerRef} />
      <ResumeReveal />

      <div ref={contentRef}>
        <main id="main-content">
          <Hero />
          <Metrics />
          <About />
          {/* A null fallback is intentional: these chunks are small and load
              quickly, so a loading spinner would just flash distractingly.
              Nothing here is above the fold, so a brief blank gap while a
              chunk fetches is preferable to layout-shifting content in. */}
          <Suspense fallback={null}>
            <Trailblazer />
            <Skills />
            <Experience />
            <Certifications />
            <Articles />
            <LightningRush />
            <Contact />
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  )
}
