import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { GithubDay } from '../../lib/githubApi'
import { cn } from '../../lib/cn'

const LEVELS = [
  'bg-[#ebedf0] dark:bg-[#1c2128]',
  'bg-[#9be9a8] dark:bg-[#0e4429]',
  'bg-[#40c463] dark:bg-[#006d32]',
  'bg-[#30a14e] dark:bg-[#26a641]',
  'bg-[#216e39] dark:bg-[#39d353]',
]

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short' })

function parseDay(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

interface TooltipState {
  left: number
  top: number
  text: string
}

interface ContributionHeatmapProps {
  days: GithubDay[]
  weeksToShow?: number
  className?: string
  animate?: boolean
}

export default function ContributionHeatmap({ days, weeksToShow, className, animate = true }: ContributionHeatmapProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const columns = useMemo(() => {
    if (days.length === 0) return []
    const cols: (GithubDay | null)[][] = []
    let col: (GithubDay | null)[] = Array.from({ length: parseDay(days[0].d).getDay() }, () => null)
    for (const day of days) {
      col.push(day)
      if (col.length === 7) {
        cols.push(col)
        col = []
      }
    }
    if (col.length > 0) {
      while (col.length < 7) col.push(null)
      cols.push(col)
    }
    return weeksToShow ? cols.slice(-weeksToShow) : cols
  }, [days, weeksToShow])

  const monthLabels = useMemo(() => {
    const labels: { index: number; text: string }[] = []
    let lastMonth = -1
    columns.forEach((col, index) => {
      const first = col.find((cell): cell is GithubDay => cell !== null)
      if (!first) return
      const date = parseDay(first.d)
      if (date.getMonth() !== lastMonth && (index === 0 || date.getDate() <= 7)) {
        lastMonth = date.getMonth()
        labels.push({ index, text: monthFormat.format(date) })
      }
    })
    return labels
  }, [columns])

  const total = days.reduce((sum, day) => sum + day.c, 0)

  useEffect(() => {
    const wrap = wrapRef.current
    if (wrap) wrap.scrollLeft = wrap.scrollWidth
  }, [columns.length])

  const show = (event: React.PointerEvent<HTMLElement>, day: GithubDay) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const cell = event.currentTarget.getBoundingClientRect()
    const box = wrap.getBoundingClientRect()
    const label = day.c === 0 ? 'No contributions' : `${day.c} contribution${day.c === 1 ? '' : 's'}`
    setTooltip({
      left: cell.left - box.left + cell.width / 2 + wrap.scrollLeft,
      top: cell.top - box.top - 8,
      text: `${label} on ${dateFormat.format(parseDay(day.d))}`,
    })
  }

  return (
    <div className={cn('relative [container-type:inline-size]', className)}>
      <div
        ref={wrapRef}
        className="relative overflow-x-auto pb-2 [--cell:clamp(11px,calc((100cqw-3px*var(--cols))/var(--cols)),22px)] [scrollbar-width:thin]"
        style={{ '--cols': Math.max(columns.length, 1) } as React.CSSProperties}
      >
        <div role="img" aria-label={`${total} contributions in the last year`} className="relative w-max pt-6" onMouseLeave={() => setTooltip(null)}>
          <div aria-hidden="true" className="absolute left-0 top-0 h-5 w-full text-[11px] font-medium text-muted-foreground">
            {monthLabels.map((label) => (
              <span key={`${label.index}-${label.text}`} className="absolute" style={{ left: `calc(${label.index} * (var(--cell) + 3px))` }}>
                {label.text}
              </span>
            ))}
          </div>

          <div aria-hidden="true" className="flex gap-[3px]">
            {columns.map((col, colIndex) => (
              <motion.div
                key={colIndex}
                initial={animate ? { opacity: 0, scale: 0.6 } : false}
                whileInView={animate ? { opacity: 1, scale: 1 } : undefined}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.35, delay: Math.min(colIndex * 0.012, 0.7), ease: 'easeOut' }}
                className="flex flex-col gap-[3px]"
              >
                {col.map((day, rowIndex) =>
                  day ? (
                    <span
                      key={day.d}
                      onPointerEnter={(event) => show(event, day)}
                      onPointerDown={(event) => show(event, day)}
                      className={cn('block rounded-[3px] transition-transform duration-150 hover:scale-125', LEVELS[day.l])}
                      style={{ width: 'var(--cell)', height: 'var(--cell)' }}
                    />
                  ) : (
                    <span key={`empty-${colIndex}-${rowIndex}`} style={{ width: 'var(--cell)', height: 'var(--cell)' }} />
                  ),
                )}
              </motion.div>
            ))}
          </div>

          {tooltip && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-semibold text-background shadow-xl"
              style={{ left: tooltip.left, top: tooltip.top }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-[11px] font-medium text-muted-foreground" aria-hidden="true">
        <span>Less</span>
        {LEVELS.map((level) => (
          <span key={level} className={cn('h-[11px] w-[11px] rounded-[3px]', level)} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
