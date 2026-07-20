import { experience } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

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

      <ol className="mt-14 space-y-14">
        {experience.map((job, index) => (
          <li key={`${job.company}-${job.period}`}>
            <Reveal delay={index * 0.06} className="border-t border-border pt-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="font-display text-2xl font-semibold leading-snug md:text-3xl">
                  {job.role} · <span className="text-accent">{job.company}</span>
                </h3>
                <span className="shrink-0 font-mono text-xs text-muted-foreground sm:text-sm">
                  {job.period} · {job.location}
                </span>
              </div>

              <ul className="mt-5 max-w-3xl space-y-3 text-base text-muted-foreground">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2.5 h-1.5 w-1 shrink-0 rounded-[1px] bg-accent" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {job.achievements && job.achievements.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Achievements
                  </span>
                  {job.achievements.map((achievement) => (
                    <span key={achievement} className="font-mono text-sm text-foreground">
                      {achievement}
                    </span>
                  ))}
                </div>
              )}

              {job.clients.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Clients
                  </span>
                  {job.clients.map((client) => (
                    <span key={client} className="font-mono text-sm text-foreground">
                      {client}
                    </span>
                  ))}
                </div>
              )}
            </Reveal>
          </li>
        ))}
      </ol>
    </Scene>
  )
}
