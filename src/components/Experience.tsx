import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { experience } from '../data/profile'
import Reveal from './cinematic/Reveal'

function JobPanel({ job, index }: { job: (typeof experience)[number]; index: number }) {
  return (
    <div className="flex h-full w-screen shrink-0 flex-col justify-center px-6 md:px-16 lg:px-24">
      <span className="font-mono text-xs text-muted-foreground">
        {String(index + 1).padStart(2, '0')} / {String(experience.length).padStart(2, '0')}
      </span>
      <h3 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight md:text-5xl">
        {job.role} · <span className="text-accent">{job.company}</span>
      </h3>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        {job.period} · {job.location}
      </p>

      <ul className="mt-8 max-w-2xl space-y-3 text-base text-muted-foreground md:text-lg">
        {job.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {job.clients.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Clients
          </span>
          {job.clients.map((client) => (
            <span key={client} className="font-mono text-xs text-foreground">
              {client}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(experience.length - 1) * 100}%`])

  // With reduced motion requested, skip the scroll-jacked horizontal gallery
  // entirely and fall back to a plain, fully-accessible stacked list — the
  // signature interaction is a nice-to-have, not a requirement to read the
  // content.
  if (prefersReducedMotion) {
    return (
      <section
        id="experience"
        data-scene
        data-index="05"
        data-label="Route History"
        aria-labelledby="experience-heading"
        className="border-t border-border px-6 py-28 md:px-16 lg:px-24"
      >
        <span className="scene-index">05 — Route History</span>
        <h2
          id="experience-heading"
          className="mt-6 max-w-4xl font-display text-4xl font-semibold md:text-6xl"
        >
          Where I&apos;ve <span className="text-gradient">moved the needle.</span>
        </h2>
        <ol className="mt-14 space-y-16">
          {experience.map((job, index) => (
            <li key={`${job.company}-${job.period}`}>
              <Reveal delay={index * 0.06}>
                <JobPanel job={job} index={index} />
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    )
  }

  return (
    <section
      id="experience"
      ref={containerRef}
      data-scene
      data-index="05"
      data-label="Route History"
      aria-labelledby="experience-heading"
      style={{ height: `${experience.length * 100}vh` }}
      className="relative border-t border-border"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
        <div className="px-6 md:px-16 lg:px-24">
          <span className="scene-index">05 — Route History</span>
          <h2
            id="experience-heading"
            className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight md:text-5xl"
          >
            Where I&apos;ve <span className="text-gradient">moved the needle.</span>
          </h2>
          <p className="mt-2 font-mono text-xs text-muted-foreground" aria-hidden="true">
            Scroll to travel the route →
          </p>
        </div>

        <motion.div style={{ x }} className="mt-4 flex h-full">
          {experience.map((job, index) => (
            <JobPanel key={`${job.company}-${job.period}`} job={job} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
