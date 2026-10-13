import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import type { ExperienceRow } from '../../lib/contentApi'
import { cn } from '../../lib/cn'
import CompanyLogo from '../ui/CompanyLogo'

const WIDE_RUN = 1500
const COMPACT_RUN = 800

const AURORA = [
  'radial-gradient(60% 55% at 22% 30%, hsl(var(--accent) / 0.45), transparent 70%)',
  'radial-gradient(55% 50% at 80% 22%, hsl(var(--accent-2) / 0.3), transparent 70%)',
  'radial-gradient(60% 60% at 58% 88%, hsl(280 80% 60% / 0.3), transparent 70%)',
].join(', ')

const MASK = 'radial-gradient(ellipse 90% 85% at center, black 65%, transparent 100%)'

interface Slot {
  className: string
  start: number
  end: number
  ratio: string
}

const SLOTS: Slot[] = [
  { className: 'col-span-3 col-start-2', start: 800, end: -1500, ratio: 'aspect-[4/3]' },
  { className: 'col-span-3 col-start-10 mb-32', start: 1000, end: -1500, ratio: 'aspect-square' },
  { className: 'col-span-4 col-start-5 mb-10', start: 900, end: -1800, ratio: 'aspect-video' },
  { className: 'col-span-3 col-start-1 mb-64', start: 1200, end: -2000, ratio: 'aspect-[3/4]' },
  { className: 'col-span-4 col-start-8 mb-40', start: 1100, end: -2000, ratio: 'aspect-video' },
]

function Stage({ scrollY, run }: { scrollY: MotionValue<number>; run: number }) {
  const scale = useTransform(scrollY, [0, run], [0.5, 1])
  const radius = useTransform(scrollY, [0, run], [24, 0])
  const backdropOpacity = useTransform(scrollY, [run + 1000, run + 1600], [1, 0])
  const textOpacity = useTransform(scrollY, [0, 200], [1, 0])
  const textScale = useTransform(scrollY, [0, 200], [1, 1.1])
  const textY = useTransform(scrollY, [0, 200], [0, 50])

  return (
    <div className="sticky top-0 z-0 flex h-screen h-svh w-full items-center justify-center overflow-hidden">
      <motion.div aria-hidden="true" style={{ scale, borderRadius: radius, opacity: backdropOpacity }} className="relative h-full w-full origin-center bg-background shadow-2xl">
        <div className="absolute inset-0" style={{ backgroundImage: AURORA }} />
        <div className="absolute inset-0 bg-background/30" />
      </motion.div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ opacity: textOpacity, scale: textScale, y: textY, maskImage: MASK, WebkitMaskImage: MASK }}
          className="relative flex w-[92vw] max-w-[1600px] flex-col items-center justify-center rounded-[clamp(2rem,6vw,4rem)] bg-white/50 px-[clamp(16px,5vw,128px)] py-[clamp(60px,15vh,240px)] backdrop-blur-3xl dark:bg-black/40 md:backdrop-blur-[80px]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[clamp(2rem,6vw,4rem)] bg-primary/[0.02]" />
          <h1 id="experience-heading" className="mb-[clamp(24px,4vh,48px)] text-center text-[clamp(2.6rem,12.5vw,5.5rem)] font-black uppercase leading-[0.8] tracking-[-0.06em] text-foreground md:-ml-2 md:text-[clamp(3.5rem,15vw,15rem)]">
            Experience
          </h1>
          <p className="w-full max-w-4xl text-center text-[clamp(10px,1.2vw,14px)] font-bold uppercase leading-relaxed tracking-[0.2em] text-foreground/60 md:leading-[2.2] md:tracking-[0.4em]">
            Merging front-end precision with enterprise Salesforce delivery.
            <br className="hidden md:block" /> A curated timeline of my professional journey — from foundational code to scalable platforms.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function RoleCard({ job, slot, scrollY, run }: { job: ExperienceRow; slot: Slot; scrollY: MotionValue<number>; run: number }) {
  const opacity = useTransform(scrollY, [0, run * 1.2], [1, 0])
  const scale = useTransform(scrollY, [0, run], [1, 1.2])
  const y = useTransform(scrollY, [0, run], [slot.start, slot.end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`

  return (
    <div className={slot.className}>
      <motion.div
        style={{ transform, opacity }}
        className={cn('flex w-full flex-col justify-between rounded-2xl border border-white/10 bg-card/70 p-5 shadow-2xl backdrop-blur-md', slot.ratio)}
      >
        <CompanyLogo company={job.company} size={52} />
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{job.period}</p>
          <p className="mt-2 text-xl font-bold leading-tight tracking-tight text-foreground">{job.role}</p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{job.company}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function ExperienceHero({ jobs }: { jobs: ExperienceRow[] }) {
  const calm = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const run = wide ? WIDE_RUN : COMPACT_RUN
  const { scrollY } = useScroll()
  const smooth = useSpring(scrollY, calm ? { stiffness: 400, damping: 60 } : { mass: 0.1, stiffness: 100, damping: 20 })
  const cards = jobs.length === 0 ? [] : SLOTS.map((slot, index) => ({ slot, job: jobs[index % jobs.length] }))

  return (
    <section aria-labelledby="experience-heading" className="experience-hero relative z-0 w-full bg-background" style={{ '--run': `${run}px` } as React.CSSProperties}>
      <Stage scrollY={smooth} run={run} />

      {wide && !calm && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 mx-auto grid h-full max-w-7xl grid-cols-12 items-end gap-4 px-4 pb-[10vh]">
          {cards.map(({ slot, job }, index) => (
            <RoleCard key={`${job.id}-${index}`} job={job} slot={slot} scrollY={smooth} run={run} />
          ))}
        </div>
      )}

      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-96 bg-gradient-to-b from-transparent to-background" />
    </section>
  )
}
