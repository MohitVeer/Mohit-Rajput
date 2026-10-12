import { motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../../lib/cn'

interface Node {
  label: string
  x: number
  y: number
}

function place(items: string[], rx: number, ry: number, offset: number): Node[] {
  return items.map((label, i) => {
    const angle = offset + (i / items.length) * Math.PI * 2
    return { label, x: 50 + Math.cos(angle) * rx, y: 50 + Math.sin(angle) * ry }
  })
}

function layout(labels: string[]): Node[] {
  const outer = labels.filter((_, i) => i % 2 === 0)
  const inner = labels.filter((_, i) => i % 2 === 1)
  return [...place(outer, 44, 40, -0.4), ...place(inner, 22, 20, 0.5)]
}

export default function ClientOrbit({ labels }: { labels: string[] }) {
  const reduce = useReducedMotion()
  const nodes = layout(labels)

  return (
    <div className="relative mx-auto aspect-[16/11] w-full max-w-[860px]" role="list" aria-label="Clients and products I have shipped for">
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <ellipse cx="50" cy="50" rx="44" ry="40" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.25" strokeDasharray="1.2 1.6" className="text-foreground" />
        <ellipse cx="50" cy="50" rx="22" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.25" strokeDasharray="1.2 1.6" className="text-foreground" />
      </svg>

      {nodes.map((node, i) => {
        const rightSide = node.x > 50
        return (
          <motion.div
            key={node.label}
            role="listitem"
            initial={reduce ? false : { opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            className={cn('absolute -translate-y-1/2', rightSide ? '-translate-x-full' : 'translate-x-0')}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <motion.span
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              className={cn('flex items-center gap-2', rightSide && 'flex-row-reverse')}
            >
              <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border bg-muted text-foreground sm:h-7 sm:w-7">
                <Plus className="h-3 w-3" />
              </span>
              <span className="whitespace-nowrap text-[10px] font-bold text-foreground/80 sm:text-xs">{node.label}</span>
            </motion.span>
          </motion.div>
        )
      })}
    </div>
  )
}
