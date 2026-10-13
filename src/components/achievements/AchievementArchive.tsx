import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, LayoutGrid, List, Search } from 'lucide-react'
import { achievementDate, KIND_LABEL, KIND_PLURAL, type Achievement, type AchievementKind } from '../../lib/achievements'
import { cn } from '../../lib/cn'
import AchievementThumb from './AchievementThumb'
import AchievementViewer from './AchievementViewer'

type Filter = 'all' | AchievementKind

const KINDS: AchievementKind[] = ['certification', 'superbadge', 'trailhead', 'award']

function GridCard({ item, onOpen, index }: { item: Achievement; onOpen: () => void; index: number }) {
  const date = achievementDate(item)
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-2xl"
      >
        <span className="relative block aspect-[16/10] overflow-hidden bg-muted">
          <span className="block h-full w-full transition-transform duration-700 group-hover:scale-105">
            <AchievementThumb item={item} />
          </span>
          <span className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white backdrop-blur">
            {KIND_LABEL[item.kind]}
          </span>
          {date && (
            <span className="absolute right-3 top-3 rounded-md bg-black/70 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur">
              {date}
            </span>
          )}
        </span>
        <span className="flex flex-1 flex-col p-5">
          <span className="text-base font-bold leading-snug text-foreground">{item.title}</span>
          <span className="mt-2 text-sm text-muted-foreground">{item.issuer}</span>
          <span className="mt-4 flex items-center justify-between border-t border-border pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground">
            Expand archive
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </span>
      </button>
    </motion.li>
  )
}

function ListRow({ item, onOpen }: { item: Achievement; onOpen: () => void }) {
  const date = achievementDate(item)
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full items-center gap-5 border-b border-border py-4 text-left transition-colors hover:bg-muted/40"
      >
        <span className="block aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
          <AchievementThumb item={item} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-foreground">{item.title}</span>
          <span className="block text-sm text-muted-foreground">
            {item.issuer} · {KIND_LABEL[item.kind]}
          </span>
        </span>
        {date && <span className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground sm:block">{date}</span>}
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </button>
    </li>
  )
}

export default function AchievementArchive({ items }: { items: Achievement[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      if (filter !== 'all' && item.kind !== filter) return false
      if (!needle) return true
      return `${item.title} ${item.issuer} ${item.group ?? ''} ${item.description ?? ''}`.toLowerCase().includes(needle)
    })
  }, [items, filter, query])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length }
    for (const kind of KINDS) map[kind] = items.filter((item) => item.kind === kind).length
    return map
  }, [items])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All Entries' },
    ...KINDS.filter((kind) => counts[kind] > 0).map((kind) => ({ id: kind as Filter, label: KIND_PLURAL[kind] })),
  ]

  return (
    <section id="archive" aria-labelledby="archive-heading" className="relative mx-auto max-w-[1700px] scroll-mt-20 px-4 pb-16 pt-8 md:px-10 md:pb-24">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:flex lg:h-[calc(100vh-9rem)] lg:flex-col lg:self-start">
          <div className="flex items-center justify-between">
            <h2 id="archive-heading" className="font-mono text-[11px] font-black uppercase tracking-[0.35em] text-foreground">
              The Archive
            </h2>
            <div className="flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label="View mode">
              {(['grid', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  aria-pressed={view === mode}
                  aria-label={mode === 'grid' ? 'Grid view' : 'List view'}
                  className={cn('grid h-8 w-8 place-items-center rounded-md transition-colors', view === mode ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground')}
                >
                  {mode === 'grid' ? <LayoutGrid className="h-4 w-4" aria-hidden="true" /> : <List className="h-4 w-4" aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-6">
            <label htmlFor="archive-search" className="sr-only">
              Search achievements
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
            />
          </div>

          <nav aria-label="Filter achievements" className="mt-8">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {filters.map((entry) => {
                const active = filter === entry.id
                return (
                  <li key={entry.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setFilter(entry.id)}
                      aria-pressed={active}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-xl font-bold tracking-tight transition-all lg:text-3xl',
                        active ? 'bg-muted text-foreground' : 'text-muted-foreground/70 hover:text-foreground',
                      )}
                    >
                      {active && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-foreground" />}
                      <span>{entry.label}</span>
                      <span className="ml-auto pl-2 font-mono text-xs font-medium text-muted-foreground">{counts[entry.id]}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="mt-auto hidden pt-8 lg:block" aria-hidden="true">
            <p data-count={visible.length} className="text-[clamp(5rem,8vw,8rem)] font-black leading-none tracking-tighter text-muted-foreground/25 before:content-[attr(data-count)]" />
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground">Achievements</p>
          </div>
        </aside>

        <div>
          <p className="sr-only" role="status" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'entry' : 'entries'} shown
          </p>
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">Nothing matches that search.</p>
          ) : view === 'grid' ? (
            <ul className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
              {visible.map((item, i) => (
                <GridCard key={item.id} item={item} index={i} onOpen={() => setOpenIndex(i)} />
              ))}
            </ul>
          ) : (
            <ul className="border-t border-border">
              {visible.map((item, i) => (
                <ListRow key={item.id} item={item} onOpen={() => setOpenIndex(i)} />
              ))}
            </ul>
          )}
        </div>
      </div>

      <AchievementViewer items={visible} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
    </section>
  )
}
