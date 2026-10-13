import { motion } from 'framer-motion'
import { ArrowDownWideNarrow, ArrowUpNarrowWide, LayoutGrid, List, Search, X } from 'lucide-react'
import type { SortOrder } from '../../lib/achievements'
import { cn } from '../../lib/cn'
import type { ViewMode } from './AchievementCard'

interface ArchiveControlsProps {
  compact?: boolean
  query: string
  onQuery: (value: string) => void
  sort: SortOrder
  onToggleSort: () => void
  view: ViewMode
  onView: (mode: ViewMode) => void
}

const surface = 'border border-zinc-200 bg-white shadow-sm dark:border-border/40 dark:bg-secondary/20'

export default function ArchiveControls({ compact = false, query, onQuery, sort, onToggleSort, view, onView }: ArchiveControlsProps) {
  const SortIcon = sort === 'newest' ? ArrowDownWideNarrow : ArrowUpNarrowWide

  return (
    <div className={cn('flex items-center gap-2', compact ? 'w-full flex-col' : 'w-full sm:w-auto')}>
      <div className={cn('group/search relative', compact ? 'h-10 w-10' : 'flex-1 sm:min-w-[200px]')}>
        {compact ? (
          <>
            <div
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl text-muted-foreground transition-opacity group-focus-within/search:opacity-0 group-hover/search:opacity-0',
                surface,
              )}
            >
              <Search className="h-4 w-4" />
            </div>
            <div
              className={cn(
                'absolute left-0 top-0 z-50 h-10 w-10 overflow-hidden rounded-xl shadow-lg transition-all duration-300 ease-out focus-within:border-foreground/30 group-focus-within/search:w-[250px] group-hover/search:w-[250px]',
                surface,
              )}
            >
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/search:text-foreground" aria-hidden="true" />
              <input
                type="text"
                inputMode="search"
                autoComplete="off"
                aria-label="Search achievements"
                placeholder="Search archive..."
                value={query}
                onChange={(event) => onQuery(event.target.value)}
                className="h-full w-full bg-transparent pl-9 pr-8 text-sm outline-none placeholder:text-muted-foreground/70"
              />
              {query && (
                <button type="button" aria-label="Clear search" onClick={() => onQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within/search:text-foreground" aria-hidden="true" />
            <input
              type="text"
              inputMode="search"
              autoComplete="off"
              aria-label="Search achievements"
              placeholder="Search..."
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              className={cn(
                'w-full rounded-xl py-2.5 pl-10 pr-8 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-foreground/30 focus:shadow-md',
                surface,
              )}
            />
            {query && (
              <motion.button
                type="button"
                aria-label="Clear search"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => onQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.button>
            )}
          </>
        )}
      </div>

      <motion.button
        type="button"
        onClick={onToggleSort}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Sort order"
        aria-label={sort === 'newest' ? 'Sorted newest first. Switch to oldest first' : 'Sorted oldest first. Switch to newest first'}
        className={cn(
          'rounded-xl p-2.5 text-muted-foreground transition-all hover:text-foreground hover:shadow-md dark:hover:bg-secondary/40',
          surface,
          compact && 'flex h-10 w-10 items-center justify-center',
        )}
      >
        <SortIcon className="h-4 w-4" aria-hidden="true" />
      </motion.button>

      <div role="group" aria-label="Layout" className={cn('flex rounded-xl p-1', surface, compact && 'flex-col')}>
        {(['grid', 'list'] as const).map((mode) => (
          <motion.button
            key={mode}
            type="button"
            onClick={() => onView(mode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={view === mode}
            aria-label={mode === 'grid' ? 'Grid view' : 'List view'}
            title={mode === 'grid' ? 'Grid view' : 'List view'}
            className={cn('rounded-lg p-1.5 transition-all', view === mode ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-secondary/10 hover:text-foreground dark:hover:bg-secondary/40')}
          >
            {mode === 'grid' ? <LayoutGrid className="h-4 w-4" aria-hidden="true" /> : <List className="h-4 w-4" aria-hidden="true" />}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
