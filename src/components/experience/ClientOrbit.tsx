import { useId, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { cn } from '../../lib/cn'
import { rootScale } from '../../lib/scale'
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

interface Box {
  left: number
  right: number
  top: number
  bottom: number
}

const MARKER = 32
const GAP = 8
const SPACING = 8
const BOB = 6
const FALLBACK = { width: 628, height: 432 }
const MAX_WIDTH = 860
const MIN_PLACED = 8

let canvas: CanvasRenderingContext2D | null | undefined

function labelWidth(label: string, family: string, scale: number) {
  if (canvas === undefined) canvas = typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d')
  if (!canvas) return (MARKER + GAP) * scale + Math.ceil(label.length * 7 * scale)
  canvas.font = `700 ${12 * scale}px ${family}`
  return (MARKER + GAP) * scale + Math.ceil(canvas.measureText(label).width) + 2
}

function arrange(nodes: OrbitNode[], width: number, height: number, family: string, scale: number): { placed: Placed[]; overflow: OrbitNode[] } {
  const rings = [
    { rx: width * 0.44, ry: height * 0.4, start: -0.4 },
    { rx: width * 0.22, ry: height * 0.2, start: 0.5 },
  ]
  const cx = width / 2
  const cy = height / 2
  const taken: Box[] = []
  const placed: Placed[] = []
  const overflow: OrbitNode[] = []
  const cursor = [0, 0]

  nodes.forEach((node, index) => {
    const span = labelWidth(node.label, family, scale)
    const order = index % 2 === 0 ? [0, 1] : [1, 0]
    for (const ringIndex of order) {
      const ring = rings[ringIndex]
      for (let step = cursor[ringIndex]; step < 360; step += 1) {
        const angle = ring.start + (step / 360) * Math.PI * 2
        const x = cx + Math.cos(angle) * ring.rx
        const y = cy + Math.sin(angle) * ring.ry
        const flipped = x > cx
        const box: Box = { left: flipped ? x - span : x, right: flipped ? x : x + span, top: y - (MARKER / 2 + BOB) * scale, bottom: y + (MARKER / 2 + BOB) * scale }
        const inside = box.left >= 0 && box.right <= width && box.top >= 0 && box.bottom <= height
        const clear = taken.every(
          (other) =>
            box.right + SPACING * scale <= other.left || box.left - SPACING * scale >= other.right || box.bottom + SPACING * scale <= other.top || box.top - SPACING * scale >= other.bottom,
        )
        if (inside && clear) {
          taken.push(box)
          placed.push({ ...node, x: (x / width) * 100, y: (y / height) * 100 })
          cursor[ringIndex] = step + 10
          return
        }
      }
    }
    overflow.push(node)
  })

  return { placed, overflow }
}

function Detail({ node, rightSide }: { node: OrbitNode; rightSide: boolean }) {
  return (
    <motion.div
      role="tooltip"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn('pointer-events-none absolute bottom-[calc(100%+0.75rem)] z-50 w-[16.25rem] sm:w-[18.75rem]', rightSide ? 'right-0' : 'left-0')}
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
          <p className="flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-widest text-neutral-300 dark:text-neutral-700">
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
  const wrapper = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(FALLBACK)
  const [family, setFamily] = useState('sans-serif')
  const [scale, setScale] = useState(1)
  const [, refresh] = useReducer((tick: number) => tick + 1, 0)
  const [active, setActive] = useState<string | null>(null)

  useLayoutEffect(() => {
    const node = wrapper.current
    if (!node) return
    const measure = () => {
      const factor = rootScale()
      const width = Math.min(node.getBoundingClientRect().width, MAX_WIDTH * factor)
      setScale(factor)
      if (width > 0) setSize((current) => (Math.abs(current.width - width) < 1 ? current : { width, height: (width * 11) / 16 }))
      setFamily(getComputedStyle(node).fontFamily)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    void document.fonts?.ready.then(refresh)
    return () => observer.disconnect()
  }, [])

  const arranged = arrange(nodes, size.width, size.height, family, scale)
  const orbital = arranged.placed.length >= Math.min(nodes.length, MIN_PLACED)
  const placed = orbital ? arranged.placed : []
  const overflow = orbital ? arranged.overflow : nodes
  const chip = 'inline-flex rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground'

  return (
    <div ref={wrapper} className="w-full">
      {orbital && (
        <div className="relative mx-auto aspect-[16/11] w-full max-w-[53.75rem]" role="list" aria-label={label}>
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
                <span className={cn('whitespace-nowrap text-[0.625rem] font-bold text-foreground transition-opacity duration-300 sm:text-xs', open ? 'opacity-100' : 'opacity-70')}>{node.label}</span>
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
                className={cn('absolute', open ? 'z-50' : 'z-20')}
                style={{ left: `${node.x}%`, top: `${node.y}%`, x: rightSide ? '-100%' : '0%', y: '-50%' }}
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive((current) => (current === key ? null : current))}
                onFocus={() => setActive(key)}
                onBlur={() => setActive((current) => (current === key ? null : current))}
              >
                <div className="relative">
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
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {overflow.length > 0 && (
        <ul className={cn('flex flex-wrap justify-center gap-2', orbital && 'mt-6')} aria-label={orbital ? `More: ${label}` : label}>
          {overflow.map((node) => (
            <li key={node.label}>
              {node.href ? (
                <Link to={node.href} className={`${chip} transition-colors hover:border-foreground/40 hover:bg-foreground/5`}>
                  {node.label}
                </Link>
              ) : (
                <span className={chip}>{node.label}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
