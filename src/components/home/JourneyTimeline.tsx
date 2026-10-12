import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Award, MapPin } from 'lucide-react'
import type { ExperienceRow } from '../../lib/contentApi'
import { clientsForJob, jobSlug } from '../../lib/experienceUtils'
import { splitAward } from '../../lib/achievements'
import { cn } from '../../lib/cn'
import { useExperience } from '../../hooks/useExperience'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { trackEvent } from '../../lib/analytics'

function JobCard({ job, className }: { job: ExperienceRow; className?: string }) {
  const awards = job.achievements.slice(0, 2)
  const allClients = clientsForJob(job)
  const clients = allClients.slice(0, 3)
  const moreClients = Math.max(0, allClients.length - clients.length)

  return (
    <div
      className={cn(
        'flex w-[320px] flex-col gap-3 rounded-2xl border border-neutral-200 bg-white/85 p-6 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85 md:w-[400px]',
        className,
      )}
    >
      <div>
        <h3 className="text-lg font-bold leading-tight text-neutral-900 dark:text-white">{job.company}</h3>
        <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">{job.role}</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
          <span>{job.period}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {job.location}
          </span>
        </p>
      </div>

      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{job.bullets[0]}</p>

      {(awards.length > 0 || clients.length > 0) && (
        <ul className="flex flex-wrap gap-2" aria-label="Recognition and clients">
          {awards.map((award) => (
            <li
              key={award}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-400"
            >
              <Award className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{splitAward(award).title}</span>
            </li>
          ))}
          {clients.map((client) => (
            <li key={client} className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
              {client}
            </li>
          ))}
          {moreClients > 0 && (
            <li className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              +{moreClients} more
            </li>
          )}
        </ul>
      )}

      <Link
        to={`/experience#${jobSlug(job)}`}
        onClick={() => trackEvent('Navigation', 'journey_role_click', `${job.company} — ${job.role}`)}
        className="group/link mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-transform hover:scale-105 dark:bg-white dark:text-black"
      >
        Full role details
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:rotate-45" aria-hidden="true" />
      </Link>
    </div>
  )
}

function FitCard({ children, above }: { children: React.ReactNode; above: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const available = window.innerHeight / 2 - 36
      const height = node.offsetHeight
      setScale(height > available ? Math.max(0.5, available / height) : 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={ref} className="w-max" style={{ transform: `scale(${scale})`, transformOrigin: above ? 'bottom left' : 'top left' }}>
      {children}
    </div>
  )
}

function Heading() {
  return (
    <>
      <h2
        id="journey-heading"
        className="mb-6 bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text pb-2 text-[clamp(2rem,10vw,4.5rem)] font-black leading-[1.1] tracking-tight text-transparent dark:from-white dark:to-neutral-500"
      >
        Professional Journey
      </h2>
      <p className="max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-xl">
        A timeline of roles, responsibilities and professional growth — from front-end engineering to enterprise Salesforce consulting.
      </p>
    </>
  )
}

function ScreenReaderList({ jobs }: { jobs: ExperienceRow[] }) {
  return (
    <ul className="sr-only">
      {jobs.map((job) => (
        <li key={job.id}>
          <Link to={`/experience#${jobSlug(job)}`}>
            {job.role} at {job.company}, {job.period}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function StackedJourney({ jobs }: { jobs: ExperienceRow[] }) {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-20 lg:px-24">
      <Heading />
      <ol className="relative mt-12 space-y-8 border-l border-neutral-200 pl-6 dark:border-neutral-800">
        {jobs.map((job) => (
          <li key={job.id} className="relative">
            <span aria-hidden="true" className="absolute -left-[31px] top-6 h-3 w-3 rounded-full border border-neutral-400 bg-background dark:border-neutral-600" />
            <JobCard job={job} className="w-full" />
          </li>
        ))}
      </ol>
      <Link
        to="/experience"
        className="mt-10 inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
      >
        Explore all experience
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  )
}

function PinnedJourney({ jobs }: { jobs: ExperienceRow[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [dims, setDims] = useState({ track: 0, view: 0 })
  const [lefts, setLefts] = useState<number[]>([])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => {
      setDims({ track: track.scrollWidth, view: window.innerWidth })
      setLefts(itemRefs.current.map((el) => el?.offsetLeft ?? 0))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [jobs.length])

  const travel = Math.max(0, dims.track - dims.view + 200)
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])
  const lineProgress = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const lineOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const span = travel + dims.view
    let current = 0
    for (let i = 0; i < jobs.length; i++) {
      if (span > 0 && latest >= (lefts[i] ?? 0) / span) current = i
    }
    setActive(current)
  })

  const entries = [...jobs.map((job) => ({ kind: 'job' as const, job })), { kind: 'end' as const }]

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `calc(100vh + ${Math.round(travel * 1.15)}px)` }}>
      <ScreenReaderList jobs={jobs} />
      <div className="absolute left-0 top-12 z-20 w-full px-4 md:top-24 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Heading />
        </div>
      </div>

      <div className="sticky top-0 z-30 flex h-screen w-full max-w-[100vw] flex-col justify-center overflow-hidden">
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[linear-gradient(to_right,transparent,var(--tw-gradient-stops))] from-neutral-200 via-neutral-200 to-transparent [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] dark:from-neutral-700 dark:via-neutral-700" />
          <motion.div
            style={{ width: lineProgress, opacity: lineOpacity }}
            className="absolute left-0 top-1/2 z-10 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-transparent"
          />

          <motion.div
            ref={trackRef}
            style={{ x }}
            className="absolute left-0 top-1/2 z-20 flex w-max -translate-y-1/2 flex-row items-center gap-12 px-8 md:gap-24 md:px-32"
          >
            {entries.map((entry, index) => {
              const above = index % 2 === 1
              const isActive = active === index
              return (
                <div
                  key={entry.kind === 'job' ? entry.job.id : 'end'}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  className="relative h-0 w-[320px] shrink-0 md:w-[420px]"
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      'absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background transition-transform duration-500',
                      isActive && 'scale-125',
                    )}
                  >
                    <div
                      className={cn(
                        'h-4 w-4 rounded-full border transition-colors duration-500',
                        isActive ? 'border-primary bg-primary' : 'border-neutral-400 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800',
                      )}
                    />
                  </div>

                  {entry.kind === 'job' ? (
                    <>
                      <div className={cn('absolute left-8 z-20 w-[280px] transition-all duration-500 md:w-[350px]', above ? 'top-4' : 'bottom-4')}>
                        <h3
                          className={cn(
                            'text-xl font-bold tracking-tight text-neutral-800 transition-all duration-500 dark:text-neutral-400 md:text-2xl',
                            isActive && 'translate-x-2 opacity-0',
                          )}
                        >
                          {entry.job.role}
                        </h3>
                      </div>

                      <div
                        className={cn(
                          'pointer-events-none absolute left-8 z-20 transition-all duration-500',
                          above ? 'bottom-4' : 'top-4',
                          isActive ? 'opacity-100' : 'opacity-0',
                        )}
                      >
                        <span className="inline-block rounded-md border border-neutral-200 bg-neutral-100 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 md:text-xs">
                          {entry.job.period}
                        </span>
                      </div>

                      <div
                        aria-hidden={!isActive}
                        className={cn(
                          'absolute left-8 z-30 pr-4 transition-all duration-500 ease-out',
                          above ? 'bottom-2' : 'top-2',
                          isActive ? 'translate-y-0 opacity-100' : above ? 'pointer-events-none translate-y-4 opacity-0' : 'pointer-events-none -translate-y-4 opacity-0',
                        )}
                      >
                        <div className={cn('transition-[visibility] duration-500', !isActive && 'invisible')}>
                          <FitCard above={above}>
                            <JobCard job={entry.job} />
                          </FitCard>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/experience"
                      className={cn(
                        'group absolute left-10 top-1/2 z-30 flex h-[140px] w-[250px] -translate-y-1/2 items-center gap-4 transition-transform duration-500',
                        isActive && 'translate-x-2 scale-105',
                      )}
                    >
                      <span className="flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 p-4 shadow-sm transition-all duration-500 group-hover:border-primary group-hover:bg-primary dark:border-neutral-800 dark:bg-neutral-900">
                        <ArrowUpRight className="h-8 w-8 text-neutral-600 transition-all duration-500 group-hover:rotate-45 group-hover:scale-110 group-hover:text-primary-foreground dark:text-neutral-400" aria-hidden="true" />
                      </span>
                      <span className="whitespace-nowrap text-lg font-bold text-neutral-900 dark:text-white md:text-xl">Explore all experience</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function JourneyTimeline() {
  const jobs = useExperience()
  const pinned = useMediaQuery('(min-width: 768px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)')

  return (
    <section id="journey" aria-labelledby="journey-heading" className="relative bg-background">
      {pinned ? <PinnedJourney jobs={jobs} /> : <StackedJourney jobs={jobs} />}
    </section>
  )
}
