import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { siteRoutes } from '../../lib/siteRoutes'
import { preloadRoute } from '../../routes'
import { isPreloadingNow } from './preloadState'

type Phase = 'idle' | 'covering' | 'holding' | 'revealing'

const EASE: [number, number, number, number] = [0.7, 0, 0.3, 1]
const WRITE_EASE: [number, number, number, number] = [0.35, 0, 0.35, 1]
const COVER_SECONDS = 0.7
const REVEAL_SECONDS = 0.7
const BEAT_MS = 200
const READY_TIMEOUT_MS = 4000
const HOLD_LIMIT_MS = 6500
const FONT_QUERY = '4rem "Alex Brush"'
const FEATHER = 16

function cleanPath(pathname: string) {
  return pathname.replace(/\/+$/, '') || '/'
}

function readableSlug(slug: string) {
  let decoded = slug
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    decoded = slug
  }
  return decoded
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function labelFor(pathname: string): string {
  const clean = cleanPath(pathname)
  const [section, slug] = clean.split('/').filter(Boolean)
  if (slug && (section === 'projects' || section === 'blog')) return readableSlug(slug)
  return siteRoutes.find((route) => route.path === clean)?.label ?? 'Not found'
}

function eligibleUrl(event: MouseEvent): URL | null {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null
  const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!anchor) return null
  if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download') || anchor.dataset.noCurtain !== undefined) return null
  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return null
  }
  if (url.origin !== window.location.origin) return null
  if (url.pathname === window.location.pathname) return null
  if (url.pathname.startsWith('/admin')) return null
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return null
  const from = cleanPath(window.location.pathname)
  const to = cleanPath(url.pathname)
  if ((from.startsWith('/projects/') && to === '/projects') || (from.startsWith('/blog/') && to === '/blog')) return null
  return url
}

function whenReady(path: string): Promise<void> {
  return new Promise((resolve) => {
    const started = performance.now()
    const check = () => {
      const settled = window.location.pathname === path && !document.querySelector('[data-page-fallback]')
      if (settled || performance.now() - started > READY_TIMEOUT_MS) {
        resolve()
        return
      }
      window.requestAnimationFrame(check)
    }
    check()
  })
}

function loadCursive() {
  return document.fonts ? document.fonts.load(FONT_QUERY).then(() => undefined) : Promise.resolve()
}

function arcFor(progress: number) {
  if (progress <= 1) {
    const top = 110 - progress * 110
    const control = top - 30 * Math.sin(progress * Math.PI)
    return `M 0 ${top} Q 50 ${control} 100 ${top} L 100 110 L 0 110 Z`
  }
  const t = progress - 1
  const bottom = 110 - t * 110
  const control = bottom - 30 * Math.sin(t * Math.PI)
  return `M 0 0 L 100 0 L 100 ${bottom} Q 50 ${control} 0 ${bottom} Z`
}

function CursiveWord({ word, clock, from, to }: { word: string; clock: MotionValue<number>; from: number; to: number }) {
  const edge = useTransform(clock, [from, to], [-FEATHER, 100 + FEATHER / 2], { clamp: true })
  const mask = useTransform(edge, (value) => `linear-gradient(100deg, #000 ${value}%, transparent ${value + FEATHER}%)`)
  return (
    <motion.span className="inline-block px-[0.22em] py-[0.2em]" style={{ WebkitMaskImage: mask, maskImage: mask }}>
      {word}
    </motion.span>
  )
}

function Cursive({ text, onWritten }: { text: string; onWritten: () => void }) {
  const clock = useMotionValue(0)
  const words = text.split(/\s+/).filter(Boolean)
  const letters = words.reduce((sum, word) => sum + word.length, 0) || 1
  const duration = Math.min(1, 0.4 + letters * 0.05)
  let cursor = 0
  const windows = words.map((word) => {
    const from = cursor / letters
    cursor += word.length
    return { word, from, to: cursor / letters }
  })

  useEffect(() => {
    let started = false
    let controls: ReturnType<typeof animate> | undefined
    const begin = () => {
      if (started) return
      started = true
      controls = animate(clock, 1, { duration, ease: WRITE_EASE, onComplete: onWritten })
    }
    const fallback = window.setTimeout(begin, 1200)
    loadCursive().then(begin, begin)
    return () => {
      started = true
      window.clearTimeout(fallback)
      controls?.stop()
    }
  }, [clock, duration, onWritten])

  return (
    <motion.div exit={{ opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] } }} className="absolute inset-0 flex items-center justify-center px-4">
      <h2
        aria-hidden="true"
        className="flex max-w-full select-none flex-wrap justify-center text-center font-signature text-[clamp(3.25rem,15vw,9rem)] leading-[1.15] text-white"
      >
        {windows.map((entry) => (
          <CursiveWord key={entry.word + entry.from} word={entry.word} clock={clock} from={entry.from} to={entry.to} />
        ))}
      </h2>
    </motion.div>
  )
}

export default function RouteCurtain() {
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState('')
  const phaseRef = useRef<Phase>('idle')
  const target = useRef<URL | null>(null)
  const timers = useRef<number[]>([])
  const session = useRef(0)
  const ready = useRef(false)
  const written = useRef(false)
  const progress = useMotionValue(0)
  const arcPath = useTransform(progress, arcFor)

  useBodyScrollLock(phase !== 'idle')

  const go = useCallback((next: Phase) => {
    phaseRef.current = next
    setPhase(next)
  }, [])

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }, [])

  const finish = useCallback(() => {
    clearTimers()
    target.current = null
    go('idle')
  }, [clearTimers, go])

  const settle = useCallback(() => {
    if (phaseRef.current === 'holding' && ready.current && written.current) go('revealing')
  }, [go])

  const markWritten = useCallback(() => {
    const token = session.current
    timers.current.push(
      window.setTimeout(() => {
        if (session.current !== token) return
        written.current = true
        settle()
      }, BEAT_MS),
    )
  }, [settle])

  const arrive = useCallback(() => {
    const url = target.current
    if (!url) {
      finish()
      return
    }
    const token = session.current
    ready.current = false
    written.current = false
    navigateRef.current(`${url.pathname}${url.search}${url.hash}`)
    go('holding')
    void whenReady(url.pathname).then(() => {
      if (session.current !== token) return
      ready.current = true
      settle()
    })
    timers.current.push(
      window.setTimeout(() => {
        if (session.current !== token) return
        ready.current = true
        written.current = true
        settle()
      }, HOLD_LIMIT_MS),
    )
  }, [finish, go, settle])

  useEffect(() => {
    if (reduce) return
    const warmed = new Set<string>()
    const warm = (event: Event) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor) return
      try {
        const url = new URL(anchor.href, window.location.href)
        if (url.origin !== window.location.origin || warmed.has(url.pathname)) return
        warmed.add(url.pathname)
        preloadRoute(url.pathname)
        void loadCursive()
      } catch {
        return
      }
    }
    const onClick = (event: MouseEvent) => {
      if (isPreloadingNow()) return
      const url = eligibleUrl(event)
      if (!url) return
      event.preventDefault()
      if (phaseRef.current !== 'idle') {
        event.stopPropagation()
        return
      }
      preloadRoute(url.pathname)
      void loadCursive()
      session.current += 1
      target.current = url
      setLabel(labelFor(url.pathname))
      go('covering')
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerover', warm, { passive: true })
    document.addEventListener('focusin', warm)
    document.addEventListener('touchstart', warm, { passive: true })
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerover', warm)
      document.removeEventListener('focusin', warm)
      document.removeEventListener('touchstart', warm)
    }
  }, [go, reduce])

  useEffect(() => {
    if (phase === 'covering') {
      progress.set(0)
      const controls = animate(progress, 1, {
        duration: COVER_SECONDS,
        ease: EASE,
        onComplete: () => {
          if (phaseRef.current === 'covering') arrive()
        },
      })
      const failsafe = window.setTimeout(() => {
        if (phaseRef.current === 'covering') arrive()
      }, COVER_SECONDS * 1000 + 900)
      return () => {
        controls.stop()
        window.clearTimeout(failsafe)
      }
    }
    if (phase === 'revealing') {
      const controls = animate(progress, 2, {
        duration: REVEAL_SECONDS,
        ease: EASE,
        onComplete: () => {
          if (phaseRef.current === 'revealing') finish()
        },
      })
      const failsafe = window.setTimeout(() => {
        if (phaseRef.current === 'revealing') finish()
      }, REVEAL_SECONDS * 1000 + 900)
      return () => {
        controls.stop()
        window.clearTimeout(failsafe)
      }
    }
  }, [phase, progress, arrive, finish])

  useEffect(() => clearTimers, [clearTimers])

  if (phase === 'idle') return null

  return (
    <div role="status" aria-live="polite" data-route-curtain className="fixed inset-0 z-[190] overflow-hidden">
      <span className="sr-only">Loading {label}</span>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path d={arcPath} className="fill-foreground dark:fill-[#262626]" />
      </svg>
      <AnimatePresence>{phase === 'holding' && <Cursive key={`${session.current}-${label}`} text={label} onWritten={markWritten} />}</AnimatePresence>
    </div>
  )
}
