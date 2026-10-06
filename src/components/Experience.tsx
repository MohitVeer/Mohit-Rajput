import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { experience } from '../data/profile'
import { fetchExperience, type ExperienceRow } from '../lib/contentApi'
import { useLiveContent } from '../hooks/useLiveContent'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

const COLLAPSED_COUNT = 4

function JobCard({ job, isLast }: { job: ExperienceRow; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = job.bullets.length > COLLAPSED_COUNT
  const visibleBullets = expanded ? job.bullets : job.bullets.slice(0, COLLAPSED_COUNT)

  return (
    <li data-job className="relative w-[82vw] max-w-[30rem] shrink-0 snap-start sm:w-[28rem] lg:w-[30rem]">
      {/* Timeline track: a dot at this job's start, and a line running on to the next job's dot
          (the 1.5rem overshoot crosses the gap between cards). */}
      <div className="relative h-6" aria-hidden="true">
        <span className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-accent bg-background shadow-glow" />
        <span
          className={`absolute left-4 top-[10px] h-px bg-gradient-to-r from-accent/60 via-border to-border ${
            isLast ? 'right-0 to-transparent' : '-right-6'
          }`}
        />
      </div>
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

        {job.achievements && job.achievements.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Achievements
            </span>
            {job.achievements.map((achievement) => (
              <span
                key={achievement}
                className="rounded-full border border-accent-2/30 bg-accent-2/10 px-3 py-1 font-sans text-xs font-medium text-accent-2"
              >
                {achievement}
              </span>
            ))}
          </div>
        )}

        {job.clients.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Clients
            </span>
            {job.clients.map((client) => (
              <span
                key={client}
                className="rounded-full border border-border px-3 py-1 font-sans text-xs font-medium text-foreground"
              >
                {client}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
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
    <Scene id="experience" index="05" label="Experience" center>
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

      <Reveal delay={0.1}>
        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground" aria-live="polite">
            <span className="text-foreground">{pad2(Math.min(active + 1, count))}</span> / {pad2(count)}
            <span className="ml-3 hidden sm:inline">Swipe or use the arrows</span>
          </p>
          <div className="flex gap-2">
            <ArrowButton direction="prev" disabled={active <= 0} onClick={() => goTo(currentIndex() - 1)} />
            <ArrowButton direction="next" disabled={active >= count - 1} onClick={() => goTo(currentIndex() + 1)} />
          </div>
        </div>

        {/* Horizontal scroller (CSS scroll-snap — native touch/trackpad/keyboard scrolling, no
            scroll-jacking). Bleeds to the screen edge on mobile so the next card peeks in. The
            vertical padding keeps the dot glow from being clipped by overflow. */}
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
              <JobCard key={job.id} job={job} isLast={index === jobs.length - 1} />
            ))}
          </ol>
        </div>
      </Reveal>
    </Scene>
  )
}
