import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import CompanyLogo from '../ui/CompanyLogo'

export interface OrbitNode {
  label: string
  description?: string
  href?: string
  company?: string
}

interface Placed extends OrbitNode {
  x: number
  y: number
}

function place(items: OrbitNode[], rx: number, ry: number, offset: number): Placed[] {
  return items.map((item, index) => {
    const angle = offset + (index / items.length) * Math.PI * 2
    return { ...item, x: 50 + Math.cos(angle) * rx, y: 50 + Math.sin(angle) * ry }
  })
}

function layout(nodes: OrbitNode[]): Placed[] {
  const outer = nodes.filter((_, index) => index % 2 === 0)
  const inner = nodes.filter((_, index) => index % 2 === 1)
  return [...place(outer, 44, 40, -0.4), ...place(inner, 22, 20, 0.5)]
}

function Detail({ node, rightSide }: { node: OrbitNode; rightSide: boolean }) {
  return (
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn('pointer-events-none absolute bottom-[calc(100%+12px)] z-50 w-[260px] sm:w-[300px]', rightSide ? 'right-0' : 'left-0')}
    >
      <div className="relative space-y-3 rounded-2xl border border-white/10 bg-neutral-950/95 p-4 text-left shadow-2xl backdrop-blur-xl dark:border-black/5 dark:bg-neutral-50/95 md:p-5">
        <div className="flex items-start gap-3">
          {node.company && <CompanyLogo company={node.company} size={44} />}
          <div className="min-w-0 space-y-1">
            <p className="text-lg font-bold leading-tight text-neutral-100 dark:text-neutral-900">{node.label}</p>
            {node.description && <p className="text-sm leading-relaxed text-neutral-400 dark:text-neutral-500">{node.description}</p>}
          </div>
        </div>
        {node.href && (
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-neutral-300 dark:text-neutral-700">
            View project
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function ClientOrbit({ nodes, label }: { nodes: OrbitNode[]; label: string }) {
  const calm = useReducedMotion()
  const group = useId()
  const [active, setActive] = useState<string | null>(null)
  const placed = layout(nodes)

  return (
    <div className="relative mx-auto aspect-[16/11] w-full max-w-[860px]" role="list" aria-label={label}>
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <ellipse cx="50" cy="50" rx="44" ry="40" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.25" strokeDasharray="1.2 1.6" className="text-foreground" />
        <ellipse cx="50" cy="50" rx="22" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.25" strokeDasharray="1.2 1.6" className="text-foreground" />
      </svg>

      {placed.map((node, index) => {
        const rightSide = node.x > 50
        const key = `${group}-${node.label}`
        const open = active === key
        const body = (
          <>
            <span aria-hidden="true" className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border bg-muted text-foreground transition-all duration-300 sm:h-8 sm:w-8', open && 'scale-110 border-foreground/30 bg-foreground text-background shadow-lg')}>
              <Plus className={cn('h-3 w-3 transition-transform duration-500 sm:h-4 sm:w-4', open && 'rotate-45')} />
            </span>
            <span className={cn('whitespace-nowrap text-[10px] font-bold text-foreground transition-opacity duration-300 sm:text-xs', open ? 'opacity-100' : 'opacity-70')}>{node.label}</span>
          </>
        )
        const classes = cn('flex items-center gap-2', rightSide && 'flex-row-reverse')

        return (
          <motion.div
            key={key}
            role="listitem"
            initial={calm ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.07 }}
            className={cn('absolute -translate-y-1/2', rightSide ? '-translate-x-full' : 'translate-x-0', open ? 'z-50' : 'z-20')}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onMouseEnter={() => setActive(key)}
            onMouseLeave={() => setActive((current) => (current === key ? null : current))}
            onFocus={() => setActive(key)}
            onBlur={() => setActive((current) => (current === key ? null : current))}
          >
            <motion.div
              animate={calm ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4 + (index % 4), repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
              className="relative"
            >
              {node.href ? (
                <Link to={node.href} className={classes}>
                  {body}
                </Link>
              ) : (
                <button type="button" className={classes} aria-describedby={open ? `${key}-detail` : undefined}>
                  {body}
                </button>
              )}
              <AnimatePresence>
                {open && (node.description || node.href || node.company) && (
                  <span id={`${key}-detail`}>
                    <Detail node={node} rightSide={rightSide} />
                  </span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}
