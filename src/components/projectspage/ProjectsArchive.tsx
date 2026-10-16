import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, ArrowUpRight, LayoutGrid, Layers, List, Search, X } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import type { ProjectItem, ProjectStatus } from '../../hooks/useProjects'
import { cn } from '../../lib/cn'
import { toneFor } from '../../lib/projectTone'
import MagneticFillButton from '../ui/MagneticFillButton'
import ProjectCover from './ProjectCover'

type StatusFilter = 'all' | ProjectStatus
type ViewMode = 'list' | 'grid'

const PAGE_SIZE = 10
const VIEW_KEY = 'mr:projects-view'
const COUNT_KEY = 'mr:projects-count'

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'completed', label: 'Completed' },
]

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = window.sessionStorage.getItem(key)
    return allowed.includes(value as T) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

function readCount(): number {
  try {
    const value = Number(window.sessionStorage.getItem(COUNT_KEY))
    return Number.isFinite(value) && value >= PAGE_SIZE ? value : PAGE_SIZE
  } catch {
    return PAGE_SIZE
  }
}

function store(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    return
  }
}

function StatusPill({ status }: { status: ProjectStatus }) {
  const ongoing = status === 'ongoing'
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wider sm:text-xs',
        ongoing
          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
          : 'border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-400',
      )}
    >
      {ongoing && <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />}
      {ongoing ? 'Ongoing' : 'Done'}
    </span>
  )
}

function metaLine(item: ProjectItem): string {
  return [item.sector, item.employerLabel].filter(Boolean).join(' · ')
}

function FloatingPreview({ item, x, y }: { item: ProjectItem; x: MotionValue<number>; y: MotionValue<number> }) {
  return createPortal(
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed z-50 hidden lg:block"
      style={{ left: x, top: y, x: '-50%', y: '-50%' }}
    >
      <ProjectCover item={item} size="preview" className="h-[18.75rem] w-[31.25rem] shadow-2xl" />
    </motion.div>,
    document.body,
  )
}

function ProjectRow({ item, index, fx }: { item: ProjectItem; index: number; fx: boolean }) {
  const tone = toneFor(item.slug)
  const ref = useRef<HTMLAnchorElement>(null)
  const [pointerOver, setPointerOver] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = pointerOver || focused
  const localX = useMotionValue(0)
  const localY = useMotionValue(0)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const cursorX = useSpring(rawX, { stiffness: 420, damping: 42, mass: 0.6 })
  const cursorY = useSpring(rawY, { stiffness: 420, damping: 42, mass: 0.6 })
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${localX}px ${localY}px, hsl(var(--foreground) / 0.07), transparent 42%)`

  const track = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!fx || !ref.current || event.pointerType !== 'mouse') return
    const rect = ref.current.getBoundingClientRect()
    localX.set(event.clientX - rect.left)
    localY.set(event.clientY - rect.top)
    rawX.set(event.clientX)
    rawY.set(event.clientY)
  }

  const enter = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!fx || event.pointerType !== 'mouse') return
    cursorX.jump(event.clientX)
    cursorY.jump(event.clientY)
    track(event)
    setPointerOver(true)
  }

  const stackText = item.tags.join(' • ')

  return (
    <motion.li initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05 }}>
      <Link
        ref={ref}
        to={`/projects/${item.slug}`}
        state={{ from: 'projects' }}
        onPointerEnter={enter}
        onPointerMove={track}
        onPointerLeave={() => setPointerOver(false)}
        onFocus={(event) => event.currentTarget.matches(':focus-visible') && setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'group relative block overflow-hidden rounded-xl border-b border-border outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-foreground/40',
          active ? 'bg-foreground/[0.03]' : 'md:hover:bg-foreground/[0.015]',
        )}
      >
        {fx && <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300" style={{ opacity: pointerOver ? 1 : 0, background: spotlight }} />}

        <span className="relative z-10 flex items-start gap-4 px-4 py-6 sm:items-center sm:gap-8 sm:px-8 sm:py-9">
          <motion.span
            aria-hidden="true"
            className="w-12 shrink-0 text-2xl font-black tabular-nums sm:w-16 sm:text-4xl md:w-20 md:text-5xl"
            animate={{ scale: active ? 1.1 : 1, x: active ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className={cn('transition-colors duration-500', !active && 'text-muted-foreground/30')} style={{ color: active ? tone : undefined }}>
              {String(index + 1).padStart(2, '0')}
            </span>
          </motion.span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <motion.span className="block text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl lg:text-4xl" animate={{ x: active ? 8 : 0 }} transition={{ duration: 0.3 }}>
                {item.title}
              </motion.span>
              <StatusPill status={item.status} />
            </span>
            <span className="mt-2 block font-mono text-[0.625rem] font-bold uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">{metaLine(item)}</span>
            <span className="mt-2 block max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">{item.description}</span>
            <span className={cn('mt-3 block font-mono text-[0.625rem] uppercase leading-relaxed tracking-widest text-muted-foreground', fx && '[@media(hover:hover)_and_(pointer:fine)]:hidden')}>
              {stackText}
            </span>
          </span>

          <motion.span className="hidden shrink-0 items-center gap-2 sm:flex" animate={{ x: active ? -5 : 0, opacity: active ? 1 : 0.5 }} transition={{ duration: 0.3 }}>
            <span className={cn('text-sm font-medium transition-colors', active ? 'text-foreground' : 'text-muted-foreground')}>view</span>
            <motion.span animate={{ x: active ? 5 : 0 }} transition={{ duration: 0.3 }}>
              <ArrowRight className="h-5 w-5 transition-colors" style={{ color: active ? tone : undefined }} aria-hidden="true" />
            </motion.span>
          </motion.span>
          <ArrowUpRight className="mt-1.5 h-5 w-5 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
        </span>

        {fx && (
          <AnimatePresence initial={false}>
            {active && stackText && (
              <motion.span
                aria-hidden="true"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative block overflow-hidden border-t border-border bg-foreground/[0.02]"
              >
                <span className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
                <span className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
                <span className="flex gap-[var(--gap)] overflow-hidden" style={{ '--gap': '2rem', '--duration': '20s' } as React.CSSProperties}>
                  {[0, 1].map((copy) => (
                    <span key={copy} className="flex min-w-full shrink-0 animate-marquee-left items-center justify-around gap-8 whitespace-nowrap py-3 motion-reduce:animate-none">
                      {Array.from({ length: 3 }, (_, i) => (
                        <span key={i} className="font-mono text-sm tracking-wider" style={{ color: tone }}>
                          {stackText} •
                        </span>
                      ))}
                    </span>
                  ))}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </Link>
      {fx && <AnimatePresence>{pointerOver && <FloatingPreview key="preview" item={item} x={cursorX} y={cursorY} />}</AnimatePresence>}
    </motion.li>
  )
}

function ProjectCard({ item, index, fx }: { item: ProjectItem; index: number; fx: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const lift = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 220, damping: 22 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 220, damping: 22 })
  const coverZ = useSpring(useTransform(lift, [0, 1], [0, 30]), { stiffness: 220, damping: 22 })
  const bodyZ = useSpring(useTransform(lift, [0, 1], [0, 15]), { stiffness: 220, damping: 22 })
  const scale = useSpring(useTransform(lift, [0, 1], [1, 1.02]), { stiffness: 220, damping: 22 })
  const tone = toneFor(item.slug)

  const move = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!fx || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set(Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5)))
    py.set(Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5)))
  }

  const enter = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== 'mouse') return
    setHovered(true)
    if (fx) {
      lift.set(1)
      move(event)
    }
  }

  const leave = () => {
    setHovered(false)
    px.set(0)
    py.set(0)
    lift.set(0)
  }

  const lit = (key: string) => (hovered ? { borderColor: `${toneFor(key)}80`, backgroundColor: `${toneFor(key)}1f`, color: toneFor(key) } : undefined)

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: 0.1 * (index % 2) }}
    >
      <Link
        ref={ref}
        to={`/projects/${item.slug}`}
        state={{ from: 'projects' }}
        onPointerEnter={enter}
        onPointerMove={move}
        onPointerLeave={leave}
        className="group block h-full rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <motion.span className="flex h-full flex-col gap-6" style={fx ? { transformPerspective: 1000, rotateX, rotateY, scale, transformStyle: 'preserve-3d', willChange: 'transform' } : undefined}>
          <motion.span
            className="relative block aspect-[4/3] overflow-hidden rounded-3xl border border-foreground/10 shadow-sm transition-shadow duration-300 group-hover:shadow-2xl sm:aspect-[16/10]"
            style={fx ? { translateZ: coverZ } : undefined}
          >
            <ProjectCover item={item} size="card" className="absolute inset-0" />
            <span aria-hidden="true" className="absolute inset-0 bg-foreground/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black/20" />
          </motion.span>

          <motion.span className="flex flex-1 flex-col px-1 md:px-0" style={fx ? { translateZ: bodyZ } : undefined}>
            <span className="mb-3 flex items-start justify-between gap-4">
              <span className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">{item.title}</span>
              <StatusPill status={item.status} />
            </span>
            <span className="mb-2 block font-mono text-[0.625rem] font-bold uppercase leading-relaxed tracking-[0.2em] text-muted-foreground">{metaLine(item)}</span>
            <span className="mb-6 block leading-relaxed text-muted-foreground md:text-lg">{item.description}</span>
            <span className="mt-auto flex flex-wrap items-center gap-2 sm:gap-2.5">
              {item.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[0.6875rem] font-medium text-muted-foreground transition-all duration-300 sm:px-4 sm:py-2 sm:text-xs" style={lit(tag)}>
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hovered ? toneFor(tag) : tone }} />
                  {tag}
                </span>
              ))}
              {item.tags.length > 4 && <span className="ml-1 font-mono text-xs text-muted-foreground/70">+{item.tags.length - 4}</span>}
            </span>
          </motion.span>
        </motion.span>
      </Link>
    </motion.li>
  )
}

export default function ProjectsArchive({ items }: { items: ProjectItem[] }) {
  const reduce = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const fx = finePointer && !reduce
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [employer, setEmployer] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [view, setView] = useState<ViewMode>(() => readStored<ViewMode>(VIEW_KEY, ['list', 'grid'], 'list'))
  const [count, setCount] = useState(readCount)
  const firstRun = useRef(true)

  useEffect(() => {
    store(VIEW_KEY, view)
  }, [view])

  useEffect(() => {
    store(COUNT_KEY, String(count))
  }, [count])

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setCount(PAGE_SIZE)
  }, [query, employer, status])

  const chips = useMemo(() => {
    const labels = new Map<string, string>()
    for (const item of items) {
      if (item.employerKey && !labels.has(item.employerKey)) labels.set(item.employerKey, item.employerLabel ?? item.employerKey)
    }
    return [
      { id: 'all', label: 'All Realms' },
      ...Array.from(labels, ([id, label]) => ({ id, label })),
      ...(items.some((item) => item.kind === 'case-study') ? [{ id: 'case-study', label: 'Case studies' }] : []),
    ]
  }, [items])

  const incoming = params.get('employer')

  useEffect(() => {
    if (!incoming) return
    if (chips.some((chip) => chip.id === incoming)) setEmployer(incoming)
  }, [incoming, chips])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      if (employer === 'case-study' && item.kind !== 'case-study') return false
      if (employer !== 'all' && employer !== 'case-study' && item.employerKey !== employer) return false
      if (status !== 'all' && item.status !== status) return false
      if (!needle) return true
      return `${item.title} ${item.sector ?? ''} ${item.employer ?? ''} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(needle)
    })
  }, [items, query, employer, status])

  const shown = visible.slice(0, count)
  const allShown = count >= visible.length

  return (
    <section id="archive" aria-labelledby="archive-heading" className="relative mx-auto max-w-[93.75rem] scroll-mt-24 px-4 pb-16 sm:px-6 md:px-8 md:pb-24">
      <div className="flex flex-col gap-4 px-2 md:flex-row md:items-center md:justify-between">
        <h2 id="archive-heading" className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
          <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Projects Archive
          <span className="rounded-md border border-border bg-foreground/5 px-2 py-0.5 text-[0.625rem] text-muted-foreground">{String(visible.length).padStart(2, '0')}</span>
        </h2>
        <div className="group relative w-full md:w-80">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" aria-hidden="true" />
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clients, sectors, stack…"
            className="w-full rounded-xl border border-transparent bg-transparent py-2.5 pl-9 pr-8 text-sm [@media(pointer:coarse)]:text-base text-foreground transition-colors placeholder:text-muted-foreground/60 hover:bg-foreground/5 focus:border-foreground/30 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground">
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 px-2" role="group" aria-label="Filter by employer">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              aria-pressed={employer === chip.id}
              onClick={() => setEmployer(chip.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-300 sm:text-sm',
                employer === chip.id ? 'border-foreground/20 bg-foreground/10 text-foreground' : 'border-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
              )}
            >
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              {chip.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 self-end px-2 xl:self-auto">
          <div className="flex items-center rounded-xl border border-foreground/10 bg-foreground/5 p-1" role="group" aria-label="Filter by status">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                aria-pressed={status === filter.key}
                onClick={() => setStatus(filter.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[0.6875rem] font-medium transition-all duration-300 sm:text-xs',
                  status === filter.key ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:bg-foreground/10 hover:text-foreground',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5 rounded-xl border border-foreground/10 bg-foreground/5 p-1" role="group" aria-label="View mode">
            {(['list', 'grid'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                aria-label={mode === 'list' ? 'List view' : 'Grid view'}
                className={cn('rounded-lg p-1.5 transition-all duration-200', view === mode ? 'bg-foreground text-background shadow-sm' : 'text-muted-foreground hover:bg-foreground/10 hover:text-foreground')}
              >
                {mode === 'list' ? <List className="h-4 w-4" aria-hidden="true" /> : <LayoutGrid className="h-4 w-4" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} projects shown
      </p>

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <Layers className="mx-auto mb-4 h-14 w-14 text-muted-foreground/30" aria-hidden="true" />
          <p className="text-lg text-muted-foreground">No projects found</p>
        </div>
      ) : view === 'list' ? (
        <ul className="mt-10 border-t border-border">
          {shown.map((item, i) => (
            <ProjectRow key={item.id} item={item} index={i} fx={fx} />
          ))}
        </ul>
      ) : (
        <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20">
          {shown.map((item, i) => (
            <ProjectCard key={item.id} item={item} index={i} fx={fx} />
          ))}
        </ul>
      )}

      {visible.length > PAGE_SIZE && (
        <div className="mt-14 flex justify-center">
          <MagneticFillButton onClick={() => setCount(allShown ? PAGE_SIZE : visible.length)} flipArrow={allShown} expanded={allShown}>
            {allShown ? 'View Less' : 'View All Projects'}
          </MagneticFillButton>
        </div>
      )}
    </section>
  )
}
