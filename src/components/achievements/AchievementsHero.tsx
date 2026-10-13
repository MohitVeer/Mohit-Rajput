import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useViewportSize } from '../../hooks/useViewportSize'
import { pickShowcase, type Achievement } from '../../lib/achievements'
import { getLenisInstance } from '../../lib/lenisInstance'

interface Rect {
  top: number
  left: number
  width: number
  height: number
  radius: number
}

interface HeroLayout {
  from: Rect[]
  to: Rect[]
}

const SHOWCASE = 6
const SHOWCASE_SIZES = '(min-width: 768px) 34vw, 45vw'
const MORPH_END = 0.5
const FADE_END = 0.1

const mix = (a: number, b: number, t: number) => a + (b - a) * t
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)
const tilt = (index: number) => (index % 2 === 0 ? -5 : 5)

function computeLayout(vw: number, vh: number): HeroLayout {
  if (vw < 768) {
    const gap = 10
    const gridWidth = vw * 0.9
    const column = (gridWidth - gap) / 2
    const height = 160
    const x0 = (vw - gridWidth) / 2
    const y0 = vh * 0.2
    const scatter: [number, number][] = [
      [vh * 0.05, vw * 0.04],
      [vh * 0.1, vw * 0.52],
      [vh * 0.71, vw * 0.06],
      [vh * 0.75, vw * 0.5],
      [vh * 0.3, -vw * 0.34],
      [vh * 0.5, vw * 0.88],
    ]
    return {
      from: scatter.map(([top, left]) => ({ top, left, width: column, height, radius: 8 })),
      to: scatter.map((_, i) => ({
        top: y0 + Math.floor(i / 2) * (height + gap),
        left: x0 + (i % 2) * (column + gap),
        width: column,
        height,
        radius: 8,
      })),
    }
  }

  const box = (top: number, left: number, width: number, height: number, radius: number): Rect => ({ top, left, width, height, radius })
  const from = [
    box(vh * 0.15, vw * 0.05, vw * 0.22, vh * 0.22, 12),
    box(vh * 0.12, vw * 0.38, vw * 0.2, vh * 0.2, 12),
    box(vh * 0.18, vw * 0.72, vw * 0.22, vh * 0.22, 12),
    box(vh * 0.7, vw * 0.08, vw * 0.2, vh * 0.25, 12),
    box(vh * 0.75, vw * 0.42, vw * 0.2, vh * 0.18, 12),
    box(vh * 0.65, vw * 0.75, vw * 0.18, vh * 0.25, 12),
  ]

  const gap = 16
  const gridWidth = Math.min(vw * 0.85, 1400)
  const gridHeight = vh * 0.7
  const x0 = (vw - gridWidth) / 2
  const y0 = (vh - gridHeight) / 2 + vh * 0.05
  const usable = gridWidth - 2 * gap
  const first = usable * 0.4
  const second = usable * 0.3
  const third = usable * 0.3
  const rows = gridHeight - gap
  const xSecond = x0 + first + gap
  const xThird = x0 + first + second + 2 * gap
  const to = [
    box(y0, x0, first, rows * 0.55, 8),
    box(y0 + rows * 0.55 + gap, x0, first, rows * 0.45, 8),
    box(y0, xSecond, second, rows * 0.4, 8),
    box(y0 + rows * 0.4 + gap, xSecond, second, rows * 0.6, 8),
    box(y0, xThird, third, rows * 0.65, 8),
    box(y0 + rows * 0.65 + gap, xThird, third, rows * 0.35, 8),
  ]

  return { from, to }
}

const HIGH_PRIORITY = { fetchpriority: 'high' } as Record<string, string>

function ShowcaseImage({ item, priority }: { item: Achievement; priority: boolean }) {
  const small = item.thumb ?? item.image ?? ''
  const full = item.image ?? small
  const responsive = small !== full
  return (
    <img
      {...(priority ? HIGH_PRIORITY : undefined)}
      src={small}
      srcSet={responsive ? `${small} 640w, ${full} 1280w` : undefined}
      sizes={responsive ? SHOWCASE_SIZES : undefined}
      alt=""
      width={1280}
      height={720}
      decoding="async"
      className="h-full w-full object-cover opacity-90"
    />
  )
}

function HeroCopy({ onExplore, animated }: { onExplore: () => void; animated: boolean }) {
  const rise = (delay: number) =>
    animated
      ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } }
      : {}

  return (
    <>
      <motion.div {...rise(0)} className="mb-6 inline-block rounded-full border border-border/50 bg-secondary/50 px-4 py-1.5 text-xs font-medium backdrop-blur-md">
        Professional Milestones
      </motion.div>
      <motion.h1
        {...rise(0.1)}
        id="achievements-heading"
        className="mb-6 bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-5xl font-black tracking-tighter text-transparent md:text-7xl lg:text-8xl"
      >
        Certificates
        <br />
        &amp; Awards
      </motion.h1>
      <motion.p {...rise(0.2)} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
        A visual journey through certifications and achievements.
      </motion.p>
      <motion.button
        {...rise(0.3)}
        type="button"
        onClick={onExplore}
        className="pointer-events-auto flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>Scroll to Explore</span>
        <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </motion.button>
    </>
  )
}

function HeroImage({ item, index, register }: { item: Achievement; index: number; register: (index: number, node: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={(node) => register(index, node)}
      className="absolute h-[10px] w-[10px] overflow-hidden rounded-lg border border-border/20 bg-card opacity-0 shadow-2xl will-change-[transform,opacity]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: index * 0.03, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative h-full w-full"
      >
        <ShowcaseImage item={item} priority={index < 3} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
      </motion.div>
    </div>
  )
}

function PinnedHero({ picks, layout }: { picks: Achievement[]; layout: HeroLayout }) {
  const spacerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nodes = useRef<(HTMLDivElement | null)[]>([])
  const layoutRef = useRef(layout)

  const { scrollYProgress } = useScroll({ target: spacerRef, offset: ['start start', 'end end'] })
  const { scrollYProgress: leaving } = useScroll({ target: spacerRef, offset: ['start start', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 26, mass: 0.4, restDelta: 0.0005 })

  const register = useCallback((index: number, node: HTMLDivElement | null) => {
    nodes.current[index] = node
  }, [])

  const apply = useCallback(() => {
    const p = progress.get()
    const { from, to } = layoutRef.current
    const t = easeInOutCubic(clamp01(p / MORPH_END))
    nodes.current.forEach((node, index) => {
      const a = from[index]
      const b = to[index]
      if (!node || !a || !b) return
      const { style } = node
      style.top = `${mix(a.top, b.top, t)}px`
      style.left = `${mix(a.left, b.left, t)}px`
      style.width = `${mix(a.width, b.width, t)}px`
      style.height = `${mix(a.height, b.height, t)}px`
      style.borderRadius = `${mix(a.radius, b.radius, t)}px`
      style.opacity = String(mix(0.8, 1, t))
      style.transform = `rotate(${mix(tilt(index), 0, t)}deg)`
    })
    const content = contentRef.current
    if (content) {
      const fade = easeOutQuad(clamp01(p / FADE_END))
      content.style.opacity = String(1 - fade)
      content.style.transform = `scale(${1 - 0.1 * fade})`
      content.style.visibility = p >= FADE_END ? 'hidden' : 'visible'
    }
  }, [progress])

  const syncFrame = useCallback((value: number) => {
    if (frameRef.current) frameRef.current.style.visibility = value >= 1 ? 'hidden' : 'visible'
  }, [])

  useMotionValueEvent(progress, 'change', apply)
  useMotionValueEvent(leaving, 'change', syncFrame)

  useLayoutEffect(() => {
    layoutRef.current = layout
    apply()
    syncFrame(leaving.get())
  }, [layout, apply, syncFrame, leaving])

  const explore = useCallback(() => {
    const target = Math.round(window.innerHeight * 1.2)
    const lenis = getLenisInstance()
    if (lenis) lenis.scrollTo(target)
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }, [])

  return (
    <>
      <div ref={spacerRef} aria-hidden="true" className="pointer-events-none relative z-10 h-[350vh] w-full" />
      <div ref={frameRef} className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        <div ref={contentRef} className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4 pb-32 pt-10 text-center will-change-transform">
          <HeroCopy onExplore={explore} animated />
        </div>
        <div aria-hidden="true">
          {picks.map((item, index) => (
            <HeroImage key={item.id} item={item} index={index} register={register} />
          ))}
        </div>
      </div>
    </>
  )
}

function StaticHero({ picks, layout }: { picks: Achievement[]; layout: HeroLayout }) {
  const explore = useCallback(() => {
    document.getElementById('archive')?.scrollIntoView({ block: 'start' })
  }, [])

  return (
    <section aria-labelledby="achievements-heading" className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center px-4 pb-32 pt-10 text-center">
        <HeroCopy onExplore={explore} animated={false} />
      </div>
      <div aria-hidden="true">
        {picks.map((item, index) => {
          const rect = layout.from[index]
          if (!rect) return null
          return (
            <div
              key={item.id}
              className="absolute overflow-hidden border border-border/20 bg-card shadow-2xl"
              style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: rect.radius, opacity: 0.8, transform: `rotate(${tilt(index)}deg)` }}
            >
              <ShowcaseImage item={item} priority={index < 3} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function AchievementsHero({ items }: { items: Achievement[] }) {
  const reduce = useReducedMotion()
  const { w, h } = useViewportSize()
  const [seed] = useState(() => Math.floor(Math.random() * 2147483647))
  const picks = useMemo(() => pickShowcase(items, SHOWCASE, seed), [items, seed])
  const layout = useMemo(() => computeLayout(w, h), [w, h])

  return reduce ? <StaticHero picks={picks} layout={layout} /> : <PinnedHero picks={picks} layout={layout} />
}
