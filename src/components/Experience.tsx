import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { experience } from '../data/profile'
import { fetchExperience, type ExperienceRow } from '../lib/contentApi'
import { getLenisInstance } from '../lib/lenisInstance'
import { useLiveContent } from '../hooks/useLiveContent'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

const COLLAPSED_COUNT = 4

// Share of the pinned scroll distance spent holding on the first / last role before / after
// the cards start / stop moving, so each end gets a moment to be read.
const HOLD = 0.06
const NAV_HEIGHT = 72 // fixed top bar the pinned view has to clear

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function Pills({
  label,
  items,
  amber = false,
  max,
}: {
  label: string
  items: string[]
  amber?: boolean
  max?: number
}) {
  if (items.length === 0) return null
  const hidden = max ? Math.max(0, items.length - max) : 0
  const pill = amber
    ? 'border-accent-2/30 bg-accent-2/10 text-accent-2'
    : 'border-border text-foreground'
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
      <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {items.map((item, i) => (
        <span
          key={item}
          className={`max-w-full truncate rounded-full border px-3 py-1 font-sans text-xs font-medium ${pill} ${
            max && i >= max ? 'hidden' : ''
          }`}
        >
          {item}
        </span>
      ))}
      {hidden > 0 && (
        <span className="font-sans text-xs font-medium text-muted-foreground" aria-hidden="true">
          +{hidden} more
        </span>
      )}
    </div>
  )
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous role' : 'Next role'}
      className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-foreground"
    >
      <span aria-hidden="true">{direction === 'prev' ? '←' : '→'}</span>
    </button>
  )
}

/** Dot on the timeline + a line running on to the next role's dot. `gapClass` is the overshoot
 *  that crosses the space between two cards. */
function TimelineMarker({ isLast, gapClass }: { isLast: boolean; gapClass: string }) {
  return (
    <div className="relative h-6" aria-hidden="true">
      <span className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-accent bg-background shadow-glow" />
      <span
        className={`absolute left-4 top-[10px] h-px bg-gradient-to-r from-accent/60 via-border to-border ${
          isLast ? 'right-0 to-transparent' : gapClass
        }`}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pinned, scroll-linked timeline                                      */
/*                                                                     */
/* The section is a tall scroll track with a sticky one-screen window  */
/* inside it. Scrolling down slides the cards sideways; when the last  */
/* role has been reached the sticky window releases and the page       */
/* carries on to the next section.                                     */
/* ------------------------------------------------------------------ */

function PinnedJobCard({
  job,
  isLast,
  onOpen,
}: {
  job: ExperienceRow
  isLast: boolean
  onOpen: () => void
}) {
  return (
    <>
      <TimelineMarker isLast={isLast} gapClass="-right-6 md:-right-8" />
      <p className="mb-3 mt-3 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {job.period}
      </p>

      <div className="glass-card p-5 transition-colors hover:border-accent/40 sm:p-6">
        <h3 className="font-display text-xl font-semibold leading-snug sm:text-2xl">
          {job.role} · <span className="text-accent">{job.company}</span>
        </h3>
        <p className="mt-1 font-sans text-xs text-muted-foreground sm:text-sm">{job.location}</p>

        <ul className="mt-4 space-y-3 text-[15px] text-muted-foreground">
          {job.bullets.map((bullet, i) => (
            <li
              key={bullet}
              className={`flex gap-3 ${i >= 3 ? 'hidden' : i === 2 ? '[@media(max-height:740px)]:hidden' : ''}`}
            >
              <span className="mt-2 h-1.5 w-1 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
              <span className="line-clamp-3">{bullet}</span>
            </li>
          ))}
        </ul>

        <Pills label="Achievements" items={job.achievements ?? []} amber max={1} />
        {/* Clients drop out first on shorter windows (still in the DOM and in "Full details"). */}
        <div className="[@media(max-height:840px)]:hidden">
          <Pills label="Clients" items={job.clients} max={3} />
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="-mb-2 mt-3 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-accent transition hover:opacity-80"
        >
          Full details →
        </button>
      </div>
    </>
  )
}

function JobDialog({ job, onClose }: { job: ExperienceRow | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (job && !dialog.open) {
      dialog.showModal()
      getLenisInstance()?.stop()
    }
    if (!job && dialog.open) dialog.close()
  }, [job])

  // If the pinned view unmounts while the dialog is open, don't leave smooth scrolling stopped.
  useEffect(() => () => getLenisInstance()?.start(), [])

  const handleClose = () => {
    getLenisInstance()?.start()
    onClose()
  }

  return (
    <dialog
      ref={ref}
      onClose={handleClose}
      aria-label={job ? `${job.role} at ${job.company}` : undefined}
      className="m-auto max-h-[88vh] w-[min(92vw,44rem)] overflow-hidden rounded-2xl border border-border bg-card p-0 text-foreground shadow-card backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {job && (
        <div data-lenis-prevent className="max-h-[88vh] overflow-y-auto overscroll-contain p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {job.period} · {job.location}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-snug">
                {job.role} · <span className="text-accent">{job.company}</span>
              </h3>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close details"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-foreground transition hover:border-accent hover:text-accent"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <ul className="mt-6 space-y-3 text-base text-muted-foreground">
            {job.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
          <Pills label="Achievements" items={job.achievements ?? []} amber />
          <Pills label="Clients" items={job.clients} />
        </div>
      )}
    </dialog>
  )
}

function PinnedTimeline({ jobs, onDoesNotFit }: { jobs: ExperienceRow[]; onDoesNotFit: () => void }) {
  const count = jobs.length
  const outerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)

  const travelRef = useRef(0)
  const padRef = useRef(20)
  const [layout, setLayout] = useState({ travel: 0, padLeft: 20 })
  const [active, setActive] = useState(0)
  const [openJob, setOpenJob] = useState<ExperienceRow | null>(null)

  const x = useMotionValue(0)
  const progress = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] })

  // Vertical scroll progress -> horizontal position of the card track.
  const apply = useCallback(
    (p: number) => {
      const t = Math.min(1, Math.max(0, (p - HOLD) / (1 - 2 * HOLD)))
      x.set(-t * travelRef.current)
      progress.set(t)
      setActive(Math.round(t * (count - 1)))
    },
    [x, progress, count],
  )
  useMotionValueEvent(scrollYProgress, 'change', apply)

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const content = contentRef.current
    if (!viewport || !track || !content) return

    // Line the first card up with the section heading (which lives in the centered column).
    const heading = document.getElementById('experience-heading')
    const padLeft = heading ? Math.max(0, Math.round(heading.getBoundingClientRect().left)) : 20
    const trackContent = track.scrollWidth - 2 * padRef.current
    const travel = Math.max(0, Math.round(trackContent + 2 * padLeft - viewport.clientWidth))

    padRef.current = padLeft
    travelRef.current = travel
    setLayout((prev) => (prev.travel === travel && prev.padLeft === padLeft ? prev : { travel, padLeft }))
    apply(scrollYProgress.get())

    // Everything has to fit on one screen for pinning to make sense — otherwise hand back to
    // the swipe carousel rather than clip content.
    if (content.offsetHeight + NAV_HEIGHT + 16 > window.innerHeight) onDoesNotFit()
  }, [apply, scrollYProgress, onDoesNotFit])

  useLayoutEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (viewportRef.current) observer.observe(viewportRef.current)
    if (trackRef.current) observer.observe(trackRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // Scroll the page to the position where role `index` is in view (arrows, keyboard focus).
  const jumpTo = useCallback(
    (index: number) => {
      const outer = outerRef.current
      if (!outer) return
      const clamped = Math.max(0, Math.min(count - 1, index))
      const t = count > 1 ? clamped / (count - 1) : 0
      const range = outer.offsetHeight - window.innerHeight
      const y = outer.getBoundingClientRect().top + window.scrollY + (HOLD + t * (1 - 2 * HOLD)) * range
      const lenis = getLenisInstance()
      if (lenis) lenis.scrollTo(y)
      else window.scrollTo({ top: y, behavior: 'smooth' })
    },
    [count],
  )

  const scrollRange = layout.travel / (1 - 2 * HOLD)
  const pad2 = (n: number) => String(n).padStart(2, '0')

  return (
    <div ref={outerRef} style={{ height: `calc(100svh + ${scrollRange}px)` }} className="relative">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-clip pt-[4.5rem]">
        <div ref={contentRef}>
          <div
            className="flex items-center justify-between gap-4"
            style={{ paddingLeft: layout.padLeft, paddingRight: layout.padLeft }}
          >
            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              aria-live="polite"
            >
              <span className="text-foreground">{pad2(Math.min(active + 1, count))}</span> / {pad2(count)}
              <span className="ml-3 hidden sm:inline">Keep scrolling</span>
            </p>
            <div className="flex gap-2">
              <ArrowButton direction="prev" disabled={active <= 0} onClick={() => jumpTo(active - 1)} />
              <ArrowButton direction="next" disabled={active >= count - 1} onClick={() => jumpTo(active + 1)} />
            </div>
          </div>

          <div
            className="mt-3 h-px bg-border"
            style={{ marginLeft: layout.padLeft, marginRight: layout.padLeft }}
            aria-hidden="true"
          >
            <motion.div className="h-px origin-left bg-accent" style={{ scaleX: progress }} />
          </div>

          <div ref={viewportRef} className="mt-6 overflow-clip">
            <motion.ol
              ref={trackRef}
              style={{ x, paddingLeft: layout.padLeft, paddingRight: layout.padLeft }}
              className="flex w-max items-start gap-6 md:gap-8"
            >
              {jobs.map((job, index) => (
                <li
                  key={job.id}
                  data-job
                  className="w-[min(86vw,34rem)] shrink-0"
                  onFocus={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    if (rect.left < 0 || rect.right > window.innerWidth) jumpTo(index)
                  }}
                >
                  <PinnedJobCard job={job} isLast={index === count - 1} onOpen={() => setOpenJob(job)} />
                </li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>

      <JobDialog job={openJob} onClose={() => setOpenJob(null)} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Swipe carousel — fallback for reduced motion, browsers without      */
/* sticky/clip/svh, and screens too short to pin the cards            */
/* ------------------------------------------------------------------ */

function CarouselJobCard({ job, isLast }: { job: ExperienceRow; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = job.bullets.length > COLLAPSED_COUNT
  const visibleBullets = expanded ? job.bullets : job.bullets.slice(0, COLLAPSED_COUNT)

  return (
    <li data-job className="relative w-[82vw] max-w-[30rem] shrink-0 snap-start sm:w-[28rem] lg:w-[30rem]">
      <TimelineMarker isLast={isLast} gapClass="-right-6" />
      <p className="mb-3 mt-3 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {job.period}
      </p>

      <div className="glass-card p-6 transition-colors hover:border-accent/40 sm:p-8">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-2xl font-semibold leading-snug">
            {job.role} · <span className="text-accent">{job.company}</span>
          </h3>
          <span className="font-sans text-xs text-muted-foreground sm:text-sm">{job.location}</span>
        </div>

        <ul className="mt-5 space-y-3 text-base text-muted-foreground">
          {visibleBullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="-mb-3 mt-1 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-accent transition hover:opacity-80"
          >
            {expanded ? '− Show less' : `+ Show ${job.bullets.length - COLLAPSED_COUNT} more`}
          </button>
        )}

        <div className="mt-2">
          <Pills label="Achievements" items={job.achievements ?? []} amber />
          <Pills label="Clients" items={job.clients} />
        </div>
      </div>
    </li>
  )
}

function CarouselTimeline({ jobs }: { jobs: ExperienceRow[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const itemsOf = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('[data-job]'))
  const leftPad = (el: HTMLElement) => parseFloat(getComputedStyle(el).paddingLeft) || 0

  // Which role is currently at the left edge — drives the counter and arrow states.
  const syncActive = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const items = itemsOf(el)
    if (items.length === 0) return
    // The last card can't always reach the left edge, so treat "scrolled to the end" as last.
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
      setActive(items.length - 1)
      return
    }
    const pad = leftPad(el)
    let best = 0
    let bestDist = Infinity
    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - pad - el.scrollLeft)
      if (dist < bestDist) {
        best = i
        bestDist = dist
      }
    })
    setActive(best)
  }, [])

  useEffect(() => {
    syncActive()
    window.addEventListener('resize', syncActive)
    return () => window.removeEventListener('resize', syncActive)
  }, [syncActive, jobs.length])

  // While a smooth scroll is still animating, `active` lags behind (it follows scroll position),
  // so a quick second tap on an arrow would re-target the same card. Remember where we're headed.
  const pending = useRef<{ index: number; until: number } | null>(null)
  const currentIndex = () =>
    pending.current && performance.now() < pending.current.until ? pending.current.index : active

  const goTo = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    const items = itemsOf(el)
    const clamped = Math.max(0, Math.min(items.length - 1, index))
    const target = items[clamped]
    if (!target) return
    pending.current = { index: clamped, until: performance.now() + 800 }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: target.offsetLeft - leftPad(el), behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  const count = jobs.length
  const pad2 = (n: number) => String(n).padStart(2, '0')

  return (
    <Reveal delay={0.1}>
      <div className="mt-10 flex items-center justify-between gap-4">
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          aria-live="polite"
        >
          <span className="text-foreground">{pad2(Math.min(active + 1, count))}</span> / {pad2(count)}
          <span className="ml-3 hidden sm:inline">Swipe or use the arrows</span>
        </p>
        <div className="flex gap-2">
          <ArrowButton direction="prev" disabled={active <= 0} onClick={() => goTo(currentIndex() - 1)} />
          <ArrowButton direction="next" disabled={active >= count - 1} onClick={() => goTo(currentIndex() + 1)} />
        </div>
      </div>

      {/* Horizontal scroller (CSS scroll-snap — native touch/trackpad/keyboard scrolling). Bleeds
          to the screen edge on mobile so the next card peeks in. The vertical padding keeps the
          dot glow from being clipped by overflow. */}
      <div
        ref={scrollerRef}
        onScroll={syncActive}
        // Keyboard users need to focus the scroller to move it with the arrow keys
        // (axe: scrollable-region-focusable) — it can hold no focusable child.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="region"
        aria-label="Work history — scrolls horizontally"
        className="relative -mx-5 mt-6 snap-x snap-mandatory overflow-x-auto overflow-y-hidden px-5 py-3 [scrollbar-color:hsl(var(--border))_transparent] [scrollbar-width:thin] scroll-pl-5 sm:-mx-8 sm:px-8 sm:scroll-pl-8 md:mx-0 md:px-0 md:scroll-pl-0"
      >
        <ol className="flex items-start gap-6 pb-4">
          {jobs.map((job, index) => (
            <CarouselJobCard key={job.id} job={job} isLast={index === jobs.length - 1} />
          ))}
        </ol>
      </div>
    </Reveal>
  )
}

/* ------------------------------------------------------------------ */

function canPinTimeline() {
  if (typeof window === 'undefined') return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const supported =
    CSS.supports('position: sticky') && CSS.supports('overflow-x: clip') && CSS.supports('height: 100svh')
  return supported && !reduce
}

export default function Experience() {
  const fallback = useMemo<ExperienceRow[]>(
    () =>
      experience.map((job, i) => ({
        ...job,
        achievements: job.achievements ?? [],
        id: `static-${i}`,
        sort_order: i,
      })),
    [],
  )
  const jobs = useLiveContent(fetchExperience, fallback)

  const [capable] = useState(canPinTimeline)
  const [fits, setFits] = useState(true)
  const pinned = capable && fits && jobs.length > 1
  const markDoesNotFit = useCallback(() => setFits(false), [])

  // A taller / wider window may make pinning possible again — try once per resize.
  useEffect(() => {
    if (fits) return
    const retry = () => setFits(true)
    window.addEventListener('resize', retry, { once: true })
    return () => window.removeEventListener('resize', retry)
  }, [fits])

  return (
    <Scene
      id="experience"
      index="05"
      label="Experience"
      center
      bleed={pinned ? <PinnedTimeline jobs={jobs} onDoesNotFit={markDoesNotFit} /> : undefined}
    >
      <Reveal>
        <h2
          id="experience-heading"
          className="max-w-4xl mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Professional <span className="text-gradient">Experience.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Enterprise Salesforce consulting across Wipro, Mphasis Silverline, and product studios —
          delivering scalable solutions from UI engineering to AI-powered experiences.
        </p>
      </Reveal>

      {!pinned && <CarouselTimeline jobs={jobs} />}
    </Scene>
  )
}
