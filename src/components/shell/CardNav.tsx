import { useEffect, useRef, useState, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, BookOpen, Briefcase, ChevronDown, FileText, Layers, Mail, Rocket } from 'lucide-react'
import { cn } from '../../lib/cn'
import { trackEvent } from '../../lib/analytics'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { statValue } from '../../lib/siteSettings'
import { GitHubMark } from '../icons/BrandMarks'

type IconType = ComponentType<{ className?: string }>

interface MegaItem {
  id: string
  to: string
  icon?: IconType
  image?: string
  title: string
  desc: string
}

const BIG: MegaItem[] = [
  { id: 'projects', to: '/projects', icon: Rocket, title: 'Projects', desc: 'Client work for global brands' },
  { id: 'experience', to: '/experience', icon: Briefcase, title: 'Experience', desc: 'My professional journey' },
]

const smallItems = (certCount: string, rank: string): MegaItem[] => [
  { id: 'skills', to: '/skills', icon: Layers, title: 'Skills', desc: 'Technical expertise' },
  { id: 'achievements', to: '/achievements', icon: Award, title: 'Achievements', desc: `${certCount} certificates, ${rank}` },
  { id: 'blog', to: '/blog', icon: BookOpen, title: 'Articles', desc: 'Insights and write-ups' },
]

const SIDE: MegaItem[] = [
  { id: 'github', to: '/projects#open-source', icon: GitHubMark, title: 'GitHub', desc: 'Live activity and heatmap' },
  { id: 'resume', to: '/resume', icon: FileText, title: 'Resume', desc: 'View or download my CV' },
  { id: 'contact', to: '/contact', icon: Mail, title: 'Contact', desc: 'Let’s work together' },
]

function ActiveDot() {
  return (
    <span className="ml-2 inline-flex -translate-y-px align-middle" aria-hidden="true">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D1FF4D] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D1FF4D] shadow-[0_0_5px_rgba(209,255,77,0.8)]" />
      </span>
    </span>
  )
}

function GridSnake() {
  const [path, setPath] = useState<{ x: number[]; y: number[] } | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cols = 11
    const rows = 6
    const size = 24
    let x = Math.floor(Math.random() * cols) * size
    let y = Math.floor(Math.random() * rows) * size
    const xs = [x]
    const ys = [y]
    for (let i = 0; i < 40; i++) {
      const horizontal = Math.random() > 0.5
      const step = (Math.random() > 0.5 ? 1 : -1) * size
      if (horizontal) {
        x += step
        if (x < 0) x = (cols - 1) * size
        else if (x >= cols * size) x = 0
      } else {
        y += step
        if (y < 0) y = (rows - 1) * size
        else if (y >= rows * size) y = 0
      }
      xs.push(x)
      ys.push(y)
    }
    setPath({ x: xs, y: ys })
  }, [])

  if (!path) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 transition-opacity duration-700 group-hover:opacity-100"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={cn('absolute left-0 top-0 h-6 w-6', i === 0 ? 'bg-black/20 dark:bg-white/20' : 'bg-black/10 dark:bg-white/10')}
          animate={{ x: path.x, y: path.y }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

interface BoxProps {
  item: MegaItem
  active: boolean
  onSelect: () => void
}

function MegaIcon({ item, className }: { item: MegaItem; className: string }) {
  if (item.image) {
    return <img src={item.image} alt="" width={28} height={28} loading="lazy" decoding="async" className={cn('object-contain', className)} />
  }
  const Icon = item.icon
  return Icon ? (
    <span aria-hidden="true" className="contents">
      <Icon className={className} />
    </span>
  ) : null
}

const surface = (active: boolean) =>
  cn(
    'border bg-black/[0.02] hover:bg-white hover:shadow-xl hover:shadow-black/10 dark:bg-[#161616] dark:hover:bg-[#1f1f1f] dark:hover:shadow-black/50',
    active
      ? 'border-[#D1FF4D]/80 bg-white shadow-md shadow-[#D1FF4D]/10 dark:border-[#D1FF4D]/50 dark:bg-[#161616]'
      : 'border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20',
  )

const titleTone = (active: boolean) => (active ? 'text-[#5d7a0a] dark:text-[#D1FF4D]' : 'text-black dark:text-white')
const iconTone = (active: boolean) =>
  active ? 'text-[#5d7a0a] dark:text-[#D1FF4D]' : 'text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white'
const descTone = 'text-black/60 group-hover:text-black/80 dark:text-white/60 dark:group-hover:text-white/80'

function renderTarget(item: MegaItem, onSelect: () => void, className: string, children: React.ReactNode) {
  return (
    <Link
      to={item.to}
      data-curtain-label={item.title}
      onClick={() => {
        trackEvent('Navigation', 'nav_click', item.title)
        onSelect()
      }}
      className={className}
    >
      {children}
    </Link>
  )
}

function MegaBoxBig({ item, active, onSelect }: BoxProps) {
  return renderTarget(
    item,
    onSelect,
    cn(
      'group relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]',
      surface(active),
    ),
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <GridSnake />
      <MegaIcon item={item} className={cn('relative z-10 h-6 w-6 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110', iconTone(active))} />
      <div className="relative z-10 mt-auto">
        <h4 className={cn('mb-1.5 flex items-center text-[0.9375rem] font-bold transition-colors duration-300', titleTone(active))}>
          {item.title}
          {active && <ActiveDot />}
        </h4>
        <p className={cn('text-xs font-medium leading-relaxed transition-colors duration-300', descTone)}>{item.desc}</p>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-black/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:via-white/5"
      />
    </>,
  )
}

function MegaBoxSmall({ item, active, onSelect }: BoxProps) {
  return renderTarget(
    item,
    onSelect,
    cn(
      'group relative flex flex-col justify-center overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]',
      surface(active),
    ),
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <h4 className={cn('mb-1.5 flex items-center text-sm font-bold transition-colors duration-300', titleTone(active))}>
          {item.title}
          {active && <ActiveDot />}
        </h4>
        <p className={cn('text-[0.6875rem] font-medium leading-relaxed transition-colors duration-300', descTone)}>{item.desc}</p>
      </div>
      <div className="rounded-xl p-1.5 transition-colors duration-300 group-hover:bg-black/5 dark:group-hover:bg-white/10">
        <MegaIcon
          item={item}
          className={cn(
            'mt-0.5 h-4 w-4 flex-shrink-0 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125',
            active ? iconTone(true) : 'text-black/40 group-hover:text-black/80 dark:text-white/40 dark:group-hover:text-white/80',
          )}
        />
      </div>
    </div>,
  )
}

function SidebarLink({ item, active, onSelect }: BoxProps) {
  return renderTarget(
    item,
    onSelect,
    cn(
      'group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:-translate-x-1 hover:scale-[1.02] hover:shadow-xl',
      surface(active),
    ),
    <>
      <div className="relative z-10 flex-1">
        <h4 className={cn('mb-1.5 flex items-center text-sm font-bold transition-colors duration-300', titleTone(active))}>
          {item.title}
          {active && <ActiveDot />}
        </h4>
        <p className={cn('text-[0.6875rem] font-medium transition-colors duration-300', descTone)}>{item.desc}</p>
      </div>
      <MegaIcon
        item={item}
        className={cn(
          'relative z-10 h-5 w-5 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-125',
          active ? iconTone(true) : 'text-black/40 group-hover:text-black/80 dark:text-white/40 dark:group-hover:text-white/80',
        )}
      />
    </>,
  )
}

interface CardNavProps {
  activeId: string
}

export default function CardNav({ activeId }: CardNavProps) {
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setExpanded(false), 180)
  }

  useEffect(() => cancelClose, [])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setExpanded(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const { stats, trailhead } = useSiteSettings()
  const SMALL = smallItems(statValue(stats, 'Salesforce Certifications'), trailhead.rank)
  const ids = [...BIG, ...SMALL, ...SIDE].map((item) => item.id).filter((id) => id !== 'contact')
  const sectionActive = ids.includes(activeId)
  const close = () => {
    cancelClose()
    setExpanded(false)
  }

  return (
    <div ref={containerRef} className="relative" onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="explore-menu"
        onMouseEnter={() => {
          cancelClose()
          if (window.matchMedia('(hover: hover)').matches) setExpanded(true)
        }}
        onClick={(event) => {
          const hoverCapable = window.matchMedia('(hover: hover)').matches
          if (hoverCapable && event.detail > 0) setExpanded(true)
          else setExpanded((v) => !v)
        }}
        className={cn(
          'group relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300',
          sectionActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        <span className="relative z-10 flex items-center gap-2">
          {sectionActive && expanded && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-[#D1FF4D] shadow-[0_0_8px_rgba(209,255,77,0.6)]"
            />
          )}
          Explore
        </span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="relative z-10">
          <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            id="explore-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 8, scale: 0.98, x: '-50%' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto absolute left-1/2 top-full z-[100] pt-4"
          >
            <div className="relative flex w-[53.125rem] max-w-[calc(100vw-3rem)] overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/95 shadow-2xl shadow-black/5 backdrop-blur-2xl dark:border-white/10 dark:bg-[#0a0a0a]/95 dark:shadow-black/80">
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  {BIG.map((item) => (
                    <MegaBoxBig key={item.id} item={item} active={activeId === item.id} onSelect={close} />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {SMALL.map((item) => (
                    <MegaBoxSmall key={item.id} item={item} active={activeId === item.id} onSelect={close} />
                  ))}
                </div>
              </div>
              <div className="flex w-[17.5rem] flex-col justify-center gap-4 border-l border-black/5 p-4 dark:border-white/5">
                {SIDE.map((item) => (
                  <SidebarLink key={item.id} item={item} active={activeId === item.id} onSelect={close} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
