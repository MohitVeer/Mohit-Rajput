import { useRef, useState } from 'react'
import About from './components/About'
import Articles from './components/Articles'
import Certifications from './components/Certifications'
import ClickConstellation from './components/ClickConstellation'
import Contact from './components/Contact'
import CustomCursor from './components/CustomCursor'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import LightningRush from './components/LightningRush'
import Metrics from './components/Metrics'
import ResumeReveal from './components/ResumeReveal'
import Preloader from './components/Preloader'
import Skills from './components/Skills'
import Trailblazer from './components/Trailblazer'
import MinimalBar from './components/cinematic/MinimalBar'
import OverlayMenu from './components/cinematic/OverlayMenu'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()
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
          <Trailblazer />
          <Skills />
          <Experience />
          <Certifications />
          <Articles />
          <LightningRush />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  )
}
