import { lazy, Suspense } from 'react'
import About from '../components/About'
import Hero from '../components/Hero'
import { useDeferredReady } from '../hooks/useDeferredReady'
import { usePageMeta } from '../hooks/usePageMeta'

const Skills = lazy(() => import('../components/Skills'))
const JourneyTimeline = lazy(() => import('../components/home/JourneyTimeline'))
const Certifications = lazy(() => import('../components/Certifications'))
const Trailblazer = lazy(() => import('../components/Trailblazer'))
const Projects = lazy(() => import('../components/Projects'))
const GithubShowcase = lazy(() => import('../components/github/GithubShowcase'))
const Articles = lazy(() => import('../components/Articles'))
const Contact = lazy(() => import('../components/Contact'))

export default function HomePage() {
  usePageMeta('/')
  const ready = useDeferredReady()

  return (
    <>
      <Hero />
      <About />
      {ready ? (
        <Suspense fallback={null}>
          <Skills />
          <Projects />
          <JourneyTimeline />
          <Certifications />
          <Trailblazer />
          <GithubShowcase />
          <Articles />
          <Contact />
        </Suspense>
      ) : (
        <div aria-hidden="true" className="min-h-[100svh]" />
      )}
    </>
  )
}
