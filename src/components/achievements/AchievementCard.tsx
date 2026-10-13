import { forwardRef, memo, useEffect, useRef, useState, type MouseEvent } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { Award, Building2, Calendar, ChevronRight, Eye, Medal, Mountain, Trophy, type LucideIcon } from 'lucide-react'
import { achievementDate, type Achievement, type AchievementKind } from '../../lib/achievements'
import { cn } from '../../lib/cn'

export type ViewMode = 'grid' | 'list'

const ICONS: Record<AchievementKind, LucideIcon> = {
  certification: Award,
  superbadge: Medal,
  trailhead: Mountain,
  award: Trophy,
}

interface AchievementCardProps {
  item: Achievement
  index: number
  view: ViewMode
  calm: boolean
  onOpen: (item: Achievement) => void
}

const SIZES = '(min-width: 1280px) 22vw, (min-width: 768px) 40vw, 90vw'

function CardMedia({ item }: { item: Achievement }) {
  const [failed, setFailed] = useState(false)
  const source = failed ? null : item.thumb ?? item.image

  if (source) {
    const srcSet = item.thumb && item.image && item.thumb !== item.image ? `${item.thumb} 640w, ${item.image} 1280w` : undefined
    return (
      <>
        <img
          src={source}
          srcSet={srcSet}
          sizes={srcSet ? SIZES : undefined}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute -left-[1%] -top-[1%] h-[102%] w-[102%] object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </>
    )
  }

  if (item.badge) {
    return (
      <>
        <img
          src={item.badge}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute left-1/2 top-1/2 h-[68%] w-auto max-w-[60%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-90 drop-shadow-[0_12px_20px_rgba(0,0,0,0.45)] transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </>
    )
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
    </>
  )
}

const AchievementCard = forwardRef<HTMLLIElement, AchievementCardProps>(function AchievementCard({ item, index, view, calm, onOpen }, ref) {
  const [hovered, setHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const frame = useRef(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const spotlight = useMotionTemplate`radial-gradient(350px circle at ${springX}px ${springY}px, var(--accent-spotlight, rgba(255, 255, 255, 0.08)), transparent 80%)`

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    },
    [],
  )

  const onMove = (event: MouseEvent<HTMLLIElement>) => {
    if (calm) return
    if (frame.current) cancelAnimationFrame(frame.current)
    const { clientX, clientY, currentTarget } = event
    const { left, top } = currentTarget.getBoundingClientRect()
    frame.current = requestAnimationFrame(() => {
      mouseX.set(clientX - left)
      mouseY.set(clientY - top)
    })
  }

  const Icon = ICONS[item.kind]
  const date = achievementDate(item)
  const listing = view === 'list'
  const caption = item.credentialId ?? (item.kind === 'award' ? 'Employer recognition' : 'Verified credential')

  return (
    <li
      ref={ref}
      className="group relative block h-full w-full list-none p-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
    >
      <AnimatePresence>
        {hovered && !calm && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 z-0 block h-full w-full rounded-3xl bg-foreground/[0.05] dark:bg-slate-800/[0.2]"
            layoutId="achievement-hover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout={!calm}
        initial={calm ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={calm ? undefined : { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        transition={{
          default: { delay: Math.min(index, 12) * 0.05, duration: 0.5, type: 'spring', stiffness: 100 },
          layout: { delay: 0, duration: 0.4, type: 'tween', ease: [0.16, 1, 0.3, 1] },
        }}
        whileHover={calm ? undefined : { y: -4 }}
        className={cn(
          'relative z-20 transform-gpu cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-card/90 shadow-xl transition-[border-color,box-shadow] duration-500 group-hover:border-black/20 group-hover:shadow-2xl has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent dark:border-white/10 dark:bg-card/40 dark:shadow-none dark:group-hover:border-white/20',
          listing ? 'flex h-auto flex-col sm:h-48 sm:flex-row' : 'flex h-full flex-col',
          !calm && 'backdrop-blur-md',
        )}
      >
        {!calm && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-30 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spotlight }}
          />
        )}

        <div
          className={cn(
            'relative w-full shrink-0 transform-gpu overflow-hidden bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 transition-all duration-500',
            listing ? 'h-48 sm:h-full sm:w-64' : 'h-44',
          )}
          style={{ clipPath: 'inset(0)', WebkitMaskImage: 'linear-gradient(black, black)', maskImage: 'linear-gradient(black, black)' }}
        >
          <CardMedia item={item} />

          <motion.div
            aria-hidden="true"
            className="absolute right-4 top-4 z-20 rounded-xl border border-black/5 bg-white/90 p-2.5 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-black/40"
            whileHover={calm ? undefined : { rotate: 15, scale: 1.1 }}
          >
            <Icon className="h-4 w-4 text-black dark:text-white" />
          </motion.div>

          <div className="absolute left-4 top-4 z-20 flex gap-2">
            <span className="rounded-lg border border-black/5 bg-white/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-black shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/40 dark:text-white">
              {item.label}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-4 z-20 flex flex-wrap items-end justify-between gap-x-2 gap-y-2">
            <div className="max-w-full break-all font-mono text-[10px] uppercase leading-tight tracking-widest text-white/70 drop-shadow-sm">{caption}</div>
            {date && (
              <div className="ml-auto rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-white/70" aria-hidden="true" />
                  <span className="whitespace-nowrap text-[10px] font-bold uppercase text-white/90 drop-shadow-sm">{date}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            'relative z-20 -mt-px flex flex-1 flex-col justify-between bg-gradient-to-b from-transparent to-card/20 p-6',
            listing
              ? 'border-t-[6px] border-[#333333] dark:border-[#050505] sm:mt-0 sm:-ml-px sm:border-l-[6px] sm:border-t-0 sm:border-[#333333] sm:dark:border-[#050505]'
              : 'border-t-[6px] border-[#333333] dark:border-[#050505]',
          )}
        >
          <div className="mb-4">
            <h3 className={cn('mb-3 font-bold leading-tight transition-colors', listing ? 'text-xl' : 'min-h-[3rem] text-lg')}>
              <button
                type="button"
                onClick={() => onOpen(item)}
                aria-haspopup="dialog"
                className="text-left outline-none after:absolute after:inset-0 after:z-40 after:content-['']"
              >
                {item.title}
                <span className="sr-only"> — {item.label}, {item.issuer}. Open details</span>
              </button>
            </h3>
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground/70" aria-hidden="true" />
              <span className="text-[11px] font-medium text-muted-foreground">{item.issuer}</span>
            </div>
          </div>

          <div className={cn('mt-auto flex items-center justify-between border-border/20', listing ? 'border-0 pt-0' : 'border-t pt-4')}>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">Expand Archive</span>
            </div>
            <motion.div aria-hidden="true" animate={{ x: hovered && !calm ? [0, 4, 0] : 0 }} transition={{ duration: 1.2, repeat: Infinity }}>
              <ChevronRight className="h-4 w-4 text-muted-foreground/70" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </li>
  )
})

export default memo(AchievementCard)
