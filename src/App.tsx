import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import About from './components/About'
import ClickConstellation from './components/ClickConstellation'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Metrics from './components/Metrics'
import Preloader from './components/Preloader'
import ResumeReveal from './components/ResumeReveal'
import ScrollProgress from './components/ScrollProgress'
import Spotlight from './components/Spotlight'
import MinimalBar from './components/cinematic/MinimalBar'
import OverlayMenu from './components/cinematic/OverlayMenu'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { initAnalytics } from './lib/analytics'

const Trailblazer = lazy(() => import('./components/Trailblazer'))
const Skills = lazy(() => import('./components/Skills'))
const Experience = lazy(() => import('./components/Experience'))
const Certifications = lazy(() => import('./components/Certifications'))
const Projects = lazy(() => import('./components/Projects'))
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
      <div className="grain-overlay" aria-hidden="true" />
      <Spotlight />
      <ClickConstellation />
      <CustomCursor />
      <ScrollProgress />
      <MinimalBar ref={menuTriggerRef} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} triggerRef={menuTriggerRef} />
      <ResumeReveal />

      <div ref={contentRef}>
        <main id="main-content">
          <Hero />
          <Metrics />
          <About />

          <Suspense fallback={null}>
            <Trailblazer />
            <Skills />
            <Experience />
            <Certifications />
            <Projects />
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
