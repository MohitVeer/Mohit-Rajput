import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from 'framer-motion'
import { Award, Medal, PanelLeftClose, PanelLeftOpen, Search, Trophy } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { countByKind, KIND_PLURAL, sortAchievements, type Achievement, type AchievementKind, type SortOrder } from '../../lib/achievements'
import { cn } from '../../lib/cn'
import AchievementCard, { type ViewMode } from './AchievementCard'
import AchievementModal from './AchievementModal'
import ArchiveControls from './ArchiveControls'

type Filter = 'all' | AchievementKind

const KINDS: AchievementKind[] = ['certification', 'superbadge', 'trailhead', 'award']
const EASE = [0.16, 1, 0.3, 1] as const
const pad = (value: number) => String(value).padStart(2, '0')

interface NavItemProps {
  label: string
  count: number
  active: boolean
  collapsed: boolean
  onSelect: () => void
}

const NavItem = memo(function NavItem({ label, count, active, collapsed, onSelect }: NavItemProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ x: collapsed ? 0 : 6 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={active}
      aria-label={collapsed ? `${label}, ${count}` : undefined}
      className={cn(
        'group relative w-full text-left transition-all duration-500',
        active ? 'bg-foreground/[0.03]' : 'hover:bg-foreground/[0.015]',
        collapsed ? 'px-0 py-8' : 'px-6 py-5 lg:px-8 lg:py-6',
      )}
    >
      <div className={cn('relative z-10 flex w-full items-center', collapsed ? 'justify-center' : 'justify-between')}>
        <div className="flex items-center gap-3">
          <motion.div
            layout
            transition={{ duration: 0.4, ease: EASE }}
            aria-hidden="true"
            className={cn(
              'relative h-2 w-2 shrink-0 rounded-full transition-colors duration-300',
              active ? 'scale-125 bg-foreground shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-muted-foreground/40 group-hover:bg-muted-foreground/60',
            )}
          />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={cn(
                  'block overflow-hidden whitespace-nowrap text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground dark:text-muted-foreground/60 dark:group-hover:text-muted-foreground/80',
                )}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {collapsed && hovered && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 5, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="pointer-events-none absolute left-[70%] z-[100] ml-4 whitespace-nowrap rounded-lg bg-foreground px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-background shadow-2xl"
            >
              <div className="flex items-center gap-2">
                {label}
                <span className="text-[8px] opacity-60">{pad(count)}</span>
              </div>
              <div className="absolute left-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className={cn('block overflow-hidden text-xs font-bold tabular-nums', active ? 'text-foreground/80' : 'text-muted-foreground')}
            >
              {pad(count)}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            aria-hidden="true"
            layoutId="achievement-nav-bar"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute bottom-0 left-0 top-0 w-1.5 origin-center bg-foreground"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
})

export default function AchievementArchive({ items }: { items: Achievement[] }) {
  const calm = useReducedMotion() ?? false
  const wide = useMediaQuery('(min-width: 1024px)')
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOrder>('newest')
  const [view, setView] = useState<ViewMode>('grid')
  const [collapsed, setCollapsed] = useState(false)
  const [spread, setSpread] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const controlsRef = useRef<HTMLDivElement>(null)
  const controlsVisible = useInView(controlsRef, { margin: '0px' })

  const counts = useMemo(() => countByKind(items), [items])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matches = items.filter((item) => {
      if (filter !== 'all' && item.kind !== filter) return false
      if (!needle) return true
      return `${item.title} ${item.issuer} ${item.label} ${item.group ?? ''} ${item.description ?? ''}`.toLowerCase().includes(needle)
    })
    return sortAchievements(matches, sort)
  }, [items, filter, query, sort])

  const navigation = useMemo(
    () => [
      { id: 'all' as Filter, label: 'All Entries', count: items.length },
      ...KINDS.filter((kind) => counts[kind] > 0).map((kind) => ({ id: kind as Filter, label: KIND_PLURAL[kind], count: counts[kind] })),
    ],
    [items.length, counts],
  )

  useEffect(() => {
    if (!collapsed) {
      setSpread(false)
      return
    }
    const timer = window.setTimeout(() => setSpread(true), 450)
    return () => window.clearTimeout(timer)
  }, [collapsed])

  useEffect(() => {
    if (!wide && collapsed) setCollapsed(false)
  }, [wide, collapsed])

  const openIndex = openId === null ? -1 : visible.findIndex((item) => item.id === openId)
  const open = useCallback((item: Achievement) => setOpenId(item.id), [])
  const close = useCallback(() => setOpenId(null), [])
  const navigate = useCallback((index: number) => setOpenId(visible[index]?.id ?? null), [visible])
  const toggleSort = useCallback(() => setSort((current) => (current === 'newest' ? 'oldest' : 'newest')), [])

  const gridClass =
    view === 'list'
      ? spread
        ? 'grid-cols-1 xl:grid-cols-2'
        : 'grid-cols-1'
      : spread
        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-2'

  const controls = (compact: boolean) => (
    <ArchiveControls compact={compact} query={query} onQuery={setQuery} sort={sort} onToggleSort={toggleSort} view={view} onView={setView} />
  )

  return (
    <section id="archive" aria-label="Achievement archive" className="relative flex scroll-mt-20 flex-col items-start lg:flex-row">
      <motion.aside
        initial={false}
        animate={{ width: wide ? (collapsed ? 80 : '33.333333%') : '100%' }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ willChange: 'width' }}
        className={cn(
          'z-40 flex w-full flex-col border-r border-border/10 bg-background/95 py-12 backdrop-blur-sm lg:sticky lg:top-0 lg:h-screen lg:bg-transparent lg:py-4 lg:backdrop-blur-none xl:py-10',
          collapsed && 'items-center',
        )}
      >
        <div className={cn('order-1 mb-10 flex w-full shrink-0 items-center justify-between px-6 lg:px-10', collapsed && 'justify-center px-0')}>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-2 flex items-center gap-3">
                <div aria-hidden="true" className="h-2 w-2 rounded-full bg-foreground" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">The Archive</h2>
              </div>
              <div aria-hidden="true" className="h-1.5 w-20 bg-foreground" />
            </motion.div>
          )}

          {wide && (
            <motion.button
              type="button"
              onClick={() => setCollapsed((current) => !current)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-pressed={collapsed}
              aria-label={collapsed ? 'Expand archive panel' : 'Collapse archive panel'}
              className="rounded-xl border border-foreground/10 bg-foreground/10 p-2.5 text-foreground transition-all hover:bg-foreground/20"
            >
              {collapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden="true" /> : <PanelLeftClose className="h-5 w-5" aria-hidden="true" />}
            </motion.button>
          )}
        </div>

        <motion.nav
          aria-label="Filter achievements"
          className="order-3 w-full flex-1"
          initial="hidden"
          animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
        >
          {navigation.map((entry) => (
            <motion.div key={entry.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <NavItem label={entry.label} count={entry.count} active={filter === entry.id} collapsed={collapsed} onSelect={() => setFilter(entry.id)} />
            </motion.div>
          ))}
        </motion.nav>

        <div className={cn('hidden w-full shrink-0 lg:block', collapsed ? 'order-4' : 'order-2')}>
          <AnimatePresence>
            {!controlsVisible && wide && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={cn('mb-8 w-full overflow-visible', collapsed ? 'flex justify-center px-0' : 'px-6 lg:px-10')}
              >
                {controls(collapsed)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!collapsed && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="group order-5 hidden shrink-0 cursor-default px-6 py-4 lg:block lg:px-10"
          >
            <div
              data-count={pad(items.length)}
              className="select-none text-[9rem] font-black leading-none text-foreground/[0.18] transition-colors duration-500 before:content-[attr(data-count)] group-hover:text-foreground/[0.35] dark:text-foreground/20 dark:group-hover:text-foreground/40"
            />
            <div className="-mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors duration-500 group-hover:text-foreground">
              <Award className="h-3 w-3" aria-hidden="true" />
              Achievements
            </div>
          </motion.div>
        )}
      </motion.aside>

      <div className="flex w-full flex-1 flex-col overflow-x-clip px-6 pb-20 pt-8 lg:px-10 lg:pt-4 xl:pt-10">
        <motion.div
          ref={controlsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-[76px] z-30 -mx-6 mb-6 flex shrink-0 flex-col items-stretch justify-between gap-3 bg-background/90 px-6 py-2 backdrop-blur-md sm:top-20 sm:mb-8 sm:flex-row sm:items-center sm:py-3 lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
        >
          <div className="hidden flex-wrap gap-2 sm:flex">
            {[
              { icon: Trophy, value: items.length, label: 'achievements in total' },
              { icon: Medal, value: counts.award, label: 'awards' },
              { icon: Award, value: counts.certification, label: 'certifications' },
            ].map(({ icon: Icon, value, label }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.05 }}
                title={`${value} ${label}`}
                className="flex items-center gap-2 rounded-full border border-border/40 bg-secondary/20 px-3 py-1.5 text-xs font-bold"
              >
                <Icon className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <span aria-hidden="true">{value}</span>
                <span className="sr-only">
                  {value} {label}
                </span>
              </motion.div>
            ))}
          </div>
          {controls(false)}
        </motion.div>

        <p className="sr-only" role="status" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'entry' : 'entries'} shown
        </p>

        <LayoutGroup id="achievements-gallery">
          <ul className={cn('relative grid gap-5', gridClass)}>
            <AnimatePresence>
              {visible.map((item, index) => (
                <AchievementCard key={item.id} item={item} index={index} view={view} calm={calm} onOpen={open} />
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>

        {visible.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-4 rounded-3xl border-2 border-dashed border-border/20 bg-foreground/5 py-20 text-center backdrop-blur-3xl"
          >
            <div className="rounded-full bg-foreground/5 p-5">
              <Search className="h-10 w-10 text-muted-foreground/60" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight text-foreground/80">No Archive Entries Found</h3>
              <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground/70">[ error 404: resource_not_found ]</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
              className="rounded-xl bg-foreground px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-background transition-all hover:scale-105 active:scale-95"
            >
              $ reset --query
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {openIndex >= 0 && <AchievementModal key="achievement-modal" items={visible} index={openIndex} onClose={close} onNavigate={navigate} />}
      </AnimatePresence>
    </section>
  )
}
