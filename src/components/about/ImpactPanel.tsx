import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useStats } from '../../hooks/useSiteSettings'
import type { StatItem } from '../../lib/siteSettings'
import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../lib/cn'

const HEADLINE = [
  { text: 'Front-end that performs.', color: '#6366f1', delay: 0 },
  { text: 'Platforms that scale.', color: '#10b981', delay: 0.15 },
  { text: 'Accessibility by default,', color: '#f59e0b', delay: 0.3 },
  { text: 'and the numbers behind the work.', color: '#ef4444', delay: 0.45 },
]

const PRIMARY_SPEC = [
  { label: 'Salesforce Certifications', href: '/achievements', cta: 'View certifications' },
  { label: 'Trailhead Badges', href: '/achievements', cta: 'Open achievements' },
  { label: 'Faster LWC portal load time', href: '/experience', cta: 'See the work' },
  { label: 'Client CSAT sustained', href: '/experience', cta: 'Read the roles' },
]

const SECONDARY_LABELS = ['Salesforce Superbadges', 'Trailhead Points', 'Shorter delivery cycles']

function figures(stats: StatItem[]) {
  const byLabel = (label: string) => stats.find((s) => s.label === label)
  return {
    primary: PRIMARY_SPEC.map((item) => ({ ...item, value: byLabel(item.label)?.value ?? '' })).filter((item) => item.value),
    secondary: SECONDARY_LABELS.map((label) => ({ label, value: byLabel(label)?.value ?? '' })).filter((item) => item.value),
  }
}

function Counter({ value }: { value: string }) {
  const { ref, display } = useCountUp<HTMLSpanElement>(value)
  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  )
}

export default function ImpactPanel({ compact = false }: { compact?: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const stats = useStats()
  const { primary: PRIMARY, secondary: SECONDARY } = figures(stats)

  return (
    <div className={cn('relative grid w-full place-content-center bg-white px-4 py-16 dark:bg-black md:px-8 lg:px-16', !compact && 'min-h-screen')}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2.5 rounded-full border border-neutral-200 bg-[#f1efec] px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-black shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <motion.span
                animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inline-flex h-full w-full rounded-full bg-green-400/60"
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            </span>
            Impact &amp; Results
          </div>
        </div>

        <h2 id="metrics-heading" className="relative mx-auto max-w-5xl space-y-1 px-4 text-center text-neutral-900 dark:text-white md:space-y-2">
          {HEADLINE.map((line, i) => (
            <span key={line.text} className="relative block overflow-hidden py-1.5">
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ delay: line.delay + 0.35, duration: 0.01 }}
                className="block text-3xl font-black leading-tight tracking-tighter md:text-5xl lg:text-6xl"
              >
                {line.text}
              </motion.span>
              <motion.span
                aria-hidden="true"
                initial={{ clipPath: i % 2 === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }}
                whileInView={{
                  clipPath:
                    i % 2 === 0
                      ? ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0 0 100%)']
                      : ['inset(0 0 0 100%)', 'inset(0 0% 0 0)', 'inset(0 0% 0 0)', 'inset(0 100% 0 0)'],
                }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.75, times: [0, 0.45, 0.55, 1], delay: line.delay, ease: [0.85, 0, 0.15, 1] }}
                className="absolute inset-0 z-10"
                style={{ backgroundColor: line.color }}
              />
            </span>
          ))}
        </h2>

        <ul className="relative mt-12 grid w-full grid-cols-2 gap-8 overflow-hidden rounded-2xl border border-white/20 bg-white/40 px-8 py-10 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-zinc-900/40 sm:flex">
          <li aria-hidden="true" className="pointer-events-none absolute left-1/4 top-0 -z-0 h-full w-1/2 bg-blue-500/5 blur-[100px]" />
          {PRIMARY.map((stat, index) => (
            <li key={stat.label} className="relative flex-1">
              <Link
                to={stat.href}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                className="group relative flex h-full flex-col items-center justify-center"
              >
                {index !== 0 && (
                  <span aria-hidden="true" className="absolute -left-4 hidden h-12 w-0.5 border border-dashed border-neutral-200 dark:border-zinc-700 sm:block" />
                )}
                <span className="flex flex-col items-center text-center transition-all duration-300 group-hover:opacity-40">
                  <span className="mb-2 text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-zinc-400 sm:text-xs">{stat.label}</span>
                  <span className="flex items-baseline text-2xl font-black tracking-tighter text-neutral-900 dark:text-white sm:text-3xl">
                    <Counter value={stat.value} />
                  </span>
                </span>

                <AnimatePresence>
                  {hovered === index && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="pointer-events-none absolute inset-[-20px] z-20 flex items-center justify-center"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-white backdrop-blur-[50px] dark:bg-zinc-950"
                        style={{
                          maskImage: 'radial-gradient(circle, black 45%, transparent 95%)',
                          WebkitMaskImage: 'radial-gradient(circle, black 45%, transparent 95%)',
                        }}
                      />
                      <span className="relative z-30 flex items-center gap-1.5 text-xs font-bold text-neutral-900 drop-shadow-md dark:text-white">
                        {stat.cta}
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          {SECONDARY.map((stat) => (
            <li key={stat.label} className="flex items-baseline gap-2 text-sm text-neutral-500 dark:text-zinc-400">
              <span className="text-lg font-black tracking-tighter text-neutral-900 dark:text-white">
                <Counter value={stat.value} />
              </span>
              <span className="text-xs uppercase tracking-wider">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
