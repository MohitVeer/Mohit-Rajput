import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import type { EducationEntry } from '../../data/education'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import type { ExperienceRow } from '../../lib/contentApi'
import CompanyLogo from '../ui/CompanyLogo'

const WIDE_RUN = 87.5

const AURORA = [
  'radial-gradient(60% 55% at 22% 30%, hsl(var(--accent) / 0.45), transparent 70%)',
  'radial-gradient(55% 50% at 80% 22%, hsl(var(--accent-2) / 0.3), transparent 70%)',
  'radial-gradient(60% 60% at 58% 88%, hsl(280 80% 60% / 0.3), transparent 70%)',
].join(', ')

const MASK = 'radial-gradient(ellipse 90% 85% at center, black 65%, transparent 100%)'

interface HeroCard {
  id: string
  kind: 'role' | 'study'
  title: string
  organisation: string
  period: string
  note?: string
  company?: string
}

interface Slot {
  left: string
  top: number
  from: number
  to: number
}

const SLOTS: Slot[] = [
  { left: '7%', top: 20, from: 0.02, to: 0.56 },
  { left: '69%', top: 30, from: 0.1, to: 0.64 },
  { left: '38%', top: 12, from: 0.2, to: 0.74 },
  { left: '13%', top: 38, from: 0.3, to: 0.82 },
  { left: '62%', top: 14, from: 0.4, to: 0.9 },
  { left: '30%', top: 34, from: 0.46, to: 0.96 },
  { left: '74%', top: 36, from: 0.5, to: 1 },
]

function buildCards(jobs: ExperienceRow[], studies: EducationEntry[]): HeroCard[] {
  const roles: HeroCard[] = jobs.map((job) => ({ id: job.id, kind: 'role', title: job.role, organisation: job.company, period: job.period, company: job.company }))
  const degrees: HeroCard[] = studies.map((entry) => ({
    id: entry.id,
    kind: 'study',
    title: `${entry.short} · ${entry.degree}`,
    organisation: entry.institution,
    period: entry.period,
    note: entry.mode,
  }))
  const order: HeroCard[] = []
  const total = roles.length + degrees.length
  let role = 0
  let study = 0
  for (let index = 0; index < total; index++) {
    const takeStudy = study < degrees.length && (role >= roles.length || (index + 1) % 3 === 0)
    order.push(takeStudy ? degrees[study++] : roles[role++])
  }
  return order
}

function Stage({ scrollY, run, still }: { scrollY: MotionValue<number>; run: number; still: boolean }) {
  const span = Math.max(run, 1)
  const scale = useTransform(scrollY, [0, span], still ? [1, 1] : [0.5, 1])
  const radius = useTransform(scrollY, [0, span], still ? [0, 0] : [24, 0])
  const backdropOpacity = useTransform(scrollY, [span + 1000, span + 1600], [1, 0])
  const textOpacity = useTransform(scrollY, [0, 200], [1, 0])
  const textScale = useTransform(scrollY, [0, 200], [1, 1.1])
  const textY = useTransform(scrollY, [0, 200], [0, 50])

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
      <motion.div aria-hidden="true" style={{ scale, borderRadius: radius, opacity: backdropOpacity }} className="relative h-full w-full origin-center bg-background shadow-2xl">
        <div className="absolute inset-0" style={{ backgroundImage: AURORA }} />
        <div className="absolute inset-0 bg-background/30" />
      </motion.div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={still ? { maskImage: MASK, WebkitMaskImage: MASK } : { opacity: textOpacity, scale: textScale, y: textY, maskImage: MASK, WebkitMaskImage: MASK }}
          className="relative flex w-[92vw] max-w-[100rem] flex-col items-center justify-center rounded-[clamp(2rem,6vw,4rem)] bg-white/50 px-[clamp(1rem,5vw,8rem)] py-[clamp(3.75rem,15vh,15rem)] backdrop-blur-3xl dark:bg-black/40 md:backdrop-blur-[80px]"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[clamp(2rem,6vw,4rem)] bg-primary/[0.02]" />
          <h1 id="experience-heading" className="mb-[clamp(1.5rem,4vh,3rem)] text-center text-[clamp(2.6rem,12.5vw,5.5rem)] font-black uppercase leading-[0.8] tracking-[-0.06em] text-foreground md:-ml-2 md:text-[clamp(3.5rem,15vw,15rem)]">
            Experience
          </h1>
          <p className="w-full max-w-4xl text-center text-[clamp(0.625rem,1.2vw,0.875rem)] font-bold uppercase leading-relaxed tracking-[0.2em] text-foreground/60 md:leading-[2.2] md:tracking-[0.4em]">
            Merging front-end precision with enterprise Salesforce delivery.
            <br className="hidden md:block" /> A curated timeline of my professional journey — from foundational code to scalable platforms.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function FloatingCard({ card, slot, progress }: { card: HeroCard; slot: Slot; progress: MotionValue<number> }) {
  const y = useTransform(progress, [slot.from, slot.to], ['108vh', `${-(slot.top + 46)}vh`])
  const opacity = useTransform(progress, [slot.from, slot.from + 0.05, slot.to - 0.06, slot.to], [0, 1, 1, 0])
  const study = card.kind === 'study'

  return (
    <motion.article
      style={{ left: slot.left, top: `${slot.top}vh`, y, opacity }}
      className="absolute w-[clamp(15rem,22vw,20rem)] rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-3">
        {study ? (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" aria-hidden="true" />
          </span>
        ) : (
          <CompanyLogo company={card.company ?? card.organisation} size={48} />
        )}
        <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">{study ? 'Education' : 'Experience'}</span>
      </div>
      <p className="mt-6 font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">{card.period}</p>
      <p className="mt-2 text-lg font-bold leading-tight tracking-tight text-foreground">{card.title}</p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{card.organisation}</p>
      {card.note && <p className="mt-3 text-xs font-semibold text-primary">{card.note}</p>}
    </motion.article>
  )
}

function Floaters({ cards, scrollY, run }: { cards: HeroCard[]; scrollY: MotionValue<number>; run: number }) {
  const progress = useTransform(scrollY, [0, run], [0, 1])
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      {cards.slice(0, SLOTS.length).map((card, index) => (
        <FloatingCard key={card.id} card={card} slot={SLOTS[index]} progress={progress} />
      ))}
    </div>
  )
}

export default function ExperienceHero({ jobs, studies }: { jobs: ExperienceRow[]; studies: EducationEntry[] }) {
  const calm = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const floating = wide && !calm
  const run = floating ? WIDE_RUN : 0
  const { scrollY } = useScroll()
  const smooth = useSpring(scrollY, calm ? { stiffness: 400, damping: 60 } : { mass: 0.1, stiffness: 100, damping: 20 })
  const cards = buildCards(jobs, studies)

  return (
    <section aria-labelledby="experience-heading" className="experience-hero relative z-0 w-full bg-background" style={{ '--run': `${run}rem` } as React.CSSProperties}>
      <div className="sticky top-0 z-0 h-screen h-svh w-full overflow-hidden">
        <Stage scrollY={smooth} run={run} still={!floating} />
        {floating && <Floaters cards={cards} scrollY={smooth} run={run} />}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-96 bg-gradient-to-b from-transparent to-background" />
    </section>
  )
}
