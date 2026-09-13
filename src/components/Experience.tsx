import { useState } from 'react'
import { experience } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

const COLLAPSED_COUNT = 4

function JobCard({ job, index }: { job: (typeof experience)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const hasMore = job.bullets.length > COLLAPSED_COUNT
  const visibleBullets = expanded ? job.bullets : job.bullets.slice(0, COLLAPSED_COUNT)

  return (
    <li className="relative pl-10 sm:pl-14">
      {/* Timeline rail + node — the connecting vertical line lives on the
          <ol>'s ::before via the wrapper below; each item just draws its
          own dot at the top of its card. */}
      <span
        aria-hidden="true"
        className="absolute left-[5px] top-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-accent bg-background shadow-glow sm:left-[9px]"
      />

      <Reveal delay={index * 0.06} className="glass-card p-6 transition-colors hover:border-accent/40 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h3 className="font-display text-2xl font-semibold leading-snug md:text-3xl">
            {job.role} · <span className="text-accent">{job.company}</span>
          </h3>
          <span className="shrink-0 font-mono text-xs text-muted-foreground sm:text-sm">
            {job.period} · {job.location}
          </span>
        </div>

        <ul className="mt-5 max-w-3xl space-y-3 text-base text-muted-foreground">
          {visibleBullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-4 font-mono text-xs uppercase tracking-widest text-accent transition hover:opacity-80"
          >
            {expanded ? '− Show less' : `+ Show ${job.bullets.length - COLLAPSED_COUNT} more`}
          </button>
        )}

        {job.achievements && job.achievements.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Achievements
            </span>
            {job.achievements.map((achievement) => (
              <span
                key={achievement}
                className="rounded-full border border-accent-2/30 bg-accent-2/10 px-3 py-1 font-mono text-xs text-accent-2"
              >
                {achievement}
              </span>
            ))}
          </div>
        )}

        {job.clients.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Clients
            </span>
            {job.clients.map((client) => (
              <span
                key={client}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground"
              >
                {client}
              </span>
            ))}
          </div>
        )}
      </Reveal>
    </li>
  )
}

export default function Experience() {
  return (
    <Scene id="experience" index="05" label="Experience" center>
      <Reveal>
        <h2
          id="experience-heading"
          className="max-w-4xl mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Professional <span className="text-gradient">Experience.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Enterprise Salesforce consulting across Wipro, Mphasis Silverline, and product studios —
          delivering scalable solutions from UI engineering to AI-powered experiences.
        </p>
      </Reveal>

      <ol className="relative mt-14 space-y-8 before:absolute before:left-[5px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-accent/60 before:via-border before:to-transparent sm:before:left-[9px]">
        {experience.map((job, index) => (
          <JobCard key={`${job.company}-${job.period}`} job={job} index={index} />
        ))}
      </ol>
    </Scene>
  )
}
