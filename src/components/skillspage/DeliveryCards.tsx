import { useEffect, useRef, useState, type ComponentType } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { CalendarCheck, ClipboardList, Handshake, History, ListChecks, Presentation, RefreshCw, Sparkles, Users, Workflow } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { rootScale } from '../../lib/scale'

type Icon = ComponentType<{ className?: string }>

const ICONS: [RegExp, Icon][] = [
  [/agile|scrum/i, RefreshCw],
  [/waterfall/i, Workflow],
  [/planning/i, CalendarCheck],
  [/backlog/i, ListChecks],
  [/review/i, Presentation],
  [/retro/i, History],
  [/requirement/i, ClipboardList],
  [/stakeholder/i, Handshake],
  [/team|cross/i, Users],
]

function iconFor(label: string): Icon {
  return ICONS.find(([pattern]) => pattern.test(label))?.[1] ?? Sparkles
}

function Card({ label, index, className }: { label: string; index: number; className?: string }) {
  const Icon = iconFor(label)
  return (
    <li
      className={`group relative flex h-[46vh] min-h-[18.75rem] w-[17.5rem] shrink-0 flex-col justify-between rounded-sm border border-border bg-card/40 p-6 transition-colors hover:border-foreground/40 hover:bg-card md:w-[21.25rem] ${className ?? ''}`}
    >
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <div>
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-border text-foreground">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-mono text-[0.625rem] text-muted-foreground">#{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="text-2xl font-black uppercase leading-tight tracking-tight text-foreground md:text-3xl">{label}</h3>
      </div>
    </li>
  )
}

export default function DeliveryCards({ title, items }: { title: string; items: string[] }) {
  const pinned = useMediaQuery('(min-width: 768px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)')
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const [travel, setTravel] = useState(0)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !pinned) return
    const measure = () => setTravel(Math.max(0, track.scrollWidth - window.innerWidth + 96 * rootScale()))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned, items.length])

  const header = (
    <div className="max-w-3xl">
      <h2 id="delivery-heading" className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text pb-2 text-[clamp(2.25rem,12vw,3rem)] font-black tracking-tighter text-transparent md:text-7xl">
        {title}
      </h2>
      <div aria-hidden="true" className="mt-4 h-1 w-14 bg-foreground" />
      <p className="mt-5 max-w-lg text-sm text-muted-foreground md:text-base">
        How I plan, ship and communicate with cross-functional teams — from first requirement to the final retrospective.
      </p>
    </div>
  )

  if (!pinned) {
    return (
      <section aria-labelledby="delivery-heading" className="px-6 py-20">
        {header}
        <ul className="-mx-6 mt-10 flex snap-x gap-4 overflow-x-auto px-6 pb-4">
          {items.map((item, i) => (
            <Card key={item} label={item} index={i} className="snap-start" />
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section aria-labelledby="delivery-heading" ref={containerRef} className="relative" style={{ height: `calc(var(--vh) + ${travel * 1.1}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-12 overflow-hidden px-12 lg:px-24">
        {header}
        <motion.ul ref={trackRef} style={{ x }} className="flex w-max gap-6 will-change-transform">
          {items.map((item, i) => (
            <Card key={item} label={item} index={i} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
