import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { Achievement } from '../../lib/achievements'
import { cn } from '../../lib/cn'
import AchievementThumb from './AchievementThumb'

const SLOTS = [
  'left-[3%] top-[16%] w-[34vw] -rotate-[8deg] md:left-[4%] md:top-[14%] md:w-[22vw]',
  'left-[33%] top-[11%] hidden w-[16vw] rotate-[4deg] md:block',
  'right-[3%] top-[26%] w-[32vw] rotate-[8deg] md:right-[3%] md:top-[18%] md:w-[22vw]',
  'bottom-[9%] left-[4%] w-[32vw] rotate-[6deg] md:bottom-[8%] md:left-[6%] md:w-[20vw]',
  'bottom-[3%] left-[40%] hidden w-[17vw] -rotate-[4deg] md:block',
  'bottom-[7%] right-[5%] w-[34vw] -rotate-[7deg] md:bottom-[10%] md:right-[8%] md:w-[21vw]',
]

export default function AchievementsHero({ items }: { items: Achievement[] }) {
  const reduce = useReducedMotion()
  const certs = items.filter((item) => item.image).slice(0, SLOTS.length)

  return (
    <section aria-labelledby="achievements-heading" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {certs.map((item, i) => (
        <motion.div
          key={item.id}
          initial={reduce ? false : { opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn('absolute', SLOTS[i])}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            className="aspect-video overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
          >
            <AchievementThumb item={item} priority />
          </motion.div>
        </motion.div>
      ))}

      <div className="relative z-10 max-w-3xl text-center">
        <h1 id="achievements-heading" className="text-[clamp(2.6rem,9vw,7rem)] font-black leading-[0.95] tracking-tighter text-foreground [text-shadow:0_4px_40px_hsl(var(--background))]">
          Certificates
          <br />
          <span className="text-muted-foreground">&amp; Awards</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base font-medium text-muted-foreground [text-shadow:0_2px_20px_hsl(var(--background))] md:text-lg">
          A visual journey through certifications and achievements — the original certificates, not just logos.
        </p>
        <a href="#archive" className="mt-10 inline-flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground">
          Scroll to explore
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
