import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, LayoutGrid, List, Search } from 'lucide-react'
import { EMPLOYER_LABEL } from '../../data/clientProjects'
import { useRoleSlugs } from '../../hooks/useExperience'
import type { ProjectItem } from '../../hooks/useProjects'
import { trackProjectClick } from '../../lib/analytics'
import { cn } from '../../lib/cn'

type Sort = 'recent' | 'name'

function Chip({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'live' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest',
        tone === 'live' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border bg-muted text-muted-foreground',
      )}
    >
      {tone === 'live' && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {children}
    </span>
  )
}

function Meta({ item }: { item: ProjectItem }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      {item.current && <Chip tone="live">Current</Chip>}
      {item.employerKey && <Chip>{EMPLOYER_LABEL[item.employerKey] ?? item.employer}</Chip>}
      {item.sector && <Chip>{item.sector}</Chip>}
      {item.kind === 'case-study' && <Chip>Case study</Chip>}
    </span>
  )
}

function Stack({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null
  return (
    <span className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      {tags.map((tag) => (
        <span key={tag}>#{tag.replace(/\s+/g, '')}</span>
      ))}
    </span>
  )
}

interface LinkTarget {
  to?: string
  href?: string
  label: string
}

function Target({ target, className, children, title }: { target: LinkTarget; className: string; children: React.ReactNode; title: string }) {
  if (target.to) {
    return (
      <Link to={target.to} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={target.href} target="_blank" rel="noopener noreferrer" onClick={() => trackProjectClick(title, target.href)} className={className}>
      {children}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

function Row({ item, index, target }: { item: ProjectItem; index: number; target: LinkTarget | null }) {
  const body = (
    <>
      <span className="font-mono text-2xl font-light text-muted-foreground/50 transition-colors group-hover:text-foreground md:text-4xl">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-bold tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">{item.title}</span>
        <span className="mt-2 block">
          <Meta item={item} />
        </span>
        <span className="mt-3 block max-w-3xl text-sm leading-relaxed text-muted-foreground">{item.description}</span>
        <Stack tags={item.tags} />
      </span>
      {target ? (
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
          <span className="hidden sm:inline">{target.label}</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      ) : (
        <span aria-hidden="true" />
      )}
    </>
  )
  const className =
    'group grid grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-4 border-b border-border py-7 transition-colors hover:bg-muted/30 md:grid-cols-[5rem_minmax(0,1fr)_auto] md:px-4'

  return (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {target ? (
        <Target target={target} className={className} title={item.title}>
          {body}
        </Target>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.li>
  )
}

function Card({ item, target }: { item: ProjectItem; target: LinkTarget | null }) {
  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <Meta item={item} />
        {target && <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />}
      </span>
      <span className="mt-5 block text-2xl font-bold tracking-tight text-foreground">{item.title}</span>
      <span className="mt-2 block flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</span>
      <Stack tags={item.tags} />
    </>
  )
  const className = 'group flex h-full flex-col rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl'

  return (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {target ? (
        <Target target={target} className={className} title={item.title}>
          {body}
        </Target>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.li>
  )
}

export default function ProjectsArchive({ items }: { items: ProjectItem[] }) {
  const roleSlugs = useRoleSlugs()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState<Sort>('recent')
  const [view, setView] = useState<'list' | 'grid'>('list')

  const chips = useMemo(() => {
    const keys = Array.from(new Set(items.map((item) => item.employerKey).filter((key): key is string => Boolean(key))))
    return [
      { id: 'all', label: 'All Realms' },
      ...keys.map((key) => ({ id: key, label: EMPLOYER_LABEL[key] ?? key })),
      ...(items.some((item) => item.kind === 'case-study') ? [{ id: 'case-study', label: 'Case studies' }] : []),
    ]
  }, [items])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = items.filter((item) => {
      if (filter === 'case-study' && item.kind !== 'case-study') return false
      if (filter !== 'all' && filter !== 'case-study' && item.employerKey !== filter) return false
      if (!needle) return true
      return `${item.title} ${item.sector ?? ''} ${item.employer ?? ''} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(needle)
    })
    return sort === 'name' ? [...filtered].sort((a, b) => a.title.localeCompare(b.title)) : filtered
  }, [items, query, filter, sort])

  const targetFor = (item: ProjectItem): LinkTarget | null => {
    if (item.url) return { href: item.url, label: 'Visit' }
    const slug = item.employerKey ? roleSlugs.get(item.employerKey) : undefined
    return slug ? { to: `/experience#${slug}`, label: 'Role' } : null
  }

  return (
    <section id="archive" aria-labelledby="archive-heading" className="relative mx-auto max-w-[1500px] scroll-mt-24 px-6 pb-16 md:px-12 md:pb-24">
      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
        <h2 id="archive-heading" className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-foreground">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Projects Archive
          <span className="rounded bg-muted px-2 py-0.5 text-muted-foreground">{items.length}</span>
        </h2>
        <div className="relative w-full md:max-w-xs">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clients, sectors, stack…"
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by employer">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              aria-pressed={filter === chip.id}
              onClick={() => setFilter(chip.id)}
              className={cn(
                'rounded-lg border px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors',
                filter === chip.id ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
            >
              {chip.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="project-sort" className="sr-only">
            Sort projects
          </label>
          <select
            id="project-sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="rounded-lg border border-border bg-card px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-foreground"
          >
            <option value="recent">Recent</option>
            <option value="name">A–Z</option>
          </select>
          <div className="flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label="View mode">
            {(['list', 'grid'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                aria-label={mode === 'list' ? 'List view' : 'Grid view'}
                className={cn('grid h-8 w-8 place-items-center rounded-md transition-colors', view === mode ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground')}
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
        <p className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No projects match that search.</p>
      ) : view === 'list' ? (
        <ul className="mt-4 border-t border-border">
          <AnimatePresence initial={false}>
            {visible.map((item, i) => (
              <Row key={item.id} item={item} index={i} target={targetFor(item)} />
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {visible.map((item) => (
              <Card key={item.id} item={item} target={targetFor(item)} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  )
}
