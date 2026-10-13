import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { ProjectItem } from '../../hooks/useProjects'
import InfiniteMarquee from '../ui/InfiniteMarquee'

const TONES = ['#4c76ff', '#22c55e', '#f59e0b', '#a855f7', '#ef4444', '#06b6d4']

function Tile({ item, index }: { item: ProjectItem; index: number }) {
  const color = TONES[index % TONES.length]
  return (
    <Link
      to={`/projects/${item.slug}`}
      state={{ from: 'projects' }}
      tabIndex={-1}
      aria-hidden="true"
      className="mx-3 flex h-44 w-64 flex-col justify-between gap-3 whitespace-normal rounded-2xl border border-border p-5 shadow-xl backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03] md:h-52 md:w-72"
      style={{ background: `linear-gradient(135deg, ${color}2e, transparent 70%)` }}
    >
      <span className="flex items-start gap-2 font-mono text-[10px] uppercase leading-snug tracking-widest text-muted-foreground">
        <span className="mt-[3px] h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="min-w-0 break-words">{item.sector ?? 'Project'}</span>
      </span>
      <span className="min-w-0 break-words text-xl font-bold leading-tight text-foreground [text-wrap:balance] md:text-2xl">{item.title}</span>
    </Link>
  )
}

export default function ProjectsHero({ items }: { items: ProjectItem[] }) {
  const reduce = useReducedMotion()
  const tiles = items.slice(0, 14)
  const first = tiles.filter((_, i) => i % 2 === 0)
  const second = tiles.filter((_, i) => i % 2 === 1)

  return (
    <section aria-labelledby="projects-heading" className="relative flex min-h-[92svh] flex-col justify-between overflow-hidden pt-28 md:pt-32">
      <div className="relative z-10 px-6 md:px-12 lg:px-20">
        <motion.h1
          id="projects-heading"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl text-[clamp(2.4rem,7vw,6.5rem)] font-semibold leading-[1.02] tracking-tight text-foreground"
        >
          Architecting
          <br />
          Digital Reality
        </motion.h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          Enterprise Salesforce front-end work delivered for global brands — from{' '}
          <strong className="font-semibold text-foreground">Experience Cloud</strong> portals to{' '}
          <strong className="font-semibold text-foreground">OmniStudio</strong> journeys across telecom, banking, healthcare and automotive.
        </motion.p>
      </div>

      {tiles.length > 0 && (
        <div aria-hidden="true" className="relative mt-12 pb-10 [mask-image:linear-gradient(to_bottom,transparent,black_18%)]">
          <InfiniteMarquee items={first.map((item, i) => <Tile key={item.id} item={item} index={i * 2} />)} speed={60} />
          <InfiniteMarquee items={second.map((item, i) => <Tile key={item.id} item={item} index={i * 2 + 1} />)} speed={70} direction="right" />
        </div>
      )}
    </section>
  )
}
