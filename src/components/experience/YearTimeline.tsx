import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Award, Building2, MapPin } from 'lucide-react'
import { projectSlugFor, useProjects, type ProjectItem } from '../../hooks/useProjects'
import type { ExperienceRow } from '../../lib/contentApi'
import { clientsForJob, extractTech, groupByYear, jobSlug } from '../../lib/experienceUtils'

function Chips({ items, tone, hrefFor }: { items: string[]; tone: 'tech' | 'award' | 'client'; hrefFor?: (item: string) => string | undefined }) {
  if (items.length === 0) return null
  const base = 'inline-flex max-w-full items-start gap-1.5 rounded-md px-3 py-1.5 text-left text-[10px] font-bold uppercase leading-snug tracking-wider'
  const styles = {
    tech: 'bg-muted text-muted-foreground',
    award: 'border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    client: 'border border-border text-foreground',
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        const href = hrefFor?.(item)
        const content = (
          <>
            {tone === 'award' && <Award className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />}
            {tone === 'client' && <Building2 className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />}
            <span>{item}</span>
            {href && <ArrowUpRight className="mt-px h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />}
          </>
        )
        return href ? (
          <li key={item} className="max-w-full">
            <Link to={href} className={`${base} ${styles[tone]} transition-colors hover:border-foreground/40 hover:bg-foreground/5`}>
              {content}
            </Link>
          </li>
        ) : (
          <li key={item} className={`${base} ${styles[tone]}`}>
            {content}
          </li>
        )
      })}
    </ul>
  )
}

function JobBlock({ job, projects }: { job: ExperienceRow; projects: ProjectItem[] }) {
  const [lead, ...rest] = job.bullets
  const tech = extractTech(job)
  const clients = clientsForJob(job)
  const hrefFor = (name: string) => {
    const slug = projectSlugFor(projects, name)
    return slug ? `/projects/${slug}` : undefined
  }

  return (
    <article id={jobSlug(job)} className="relative scroll-mt-32 pb-14 last:pb-4" aria-labelledby={`${jobSlug(job)}-title`}>
      <span aria-hidden="true" className="absolute -left-[39px] top-2 h-3 w-3 rounded-full border border-neutral-500 bg-background" />

      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 id={`${jobSlug(job)}-title`} className="text-2xl font-bold tracking-tight text-foreground">
            {job.role}
          </h3>
          <p className="mt-1 text-lg font-medium text-foreground/85">{job.company}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {job.location}
          </p>
        </div>
        <span className="w-fit shrink-0 rounded-md bg-muted px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {job.period}
        </span>
      </header>

      {lead && <p className="mt-6 text-lg leading-relaxed text-foreground/90">{lead}</p>}

      {rest.length > 0 && (
        <ul className="mt-6 space-y-4">
          {rest.map((bullet) => (
            <li key={bullet} className="flex gap-4 text-[15px] leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 space-y-4">
        {tech.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Worked with</p>
            <Chips items={tech} tone="tech" />
          </div>
        )}
        {job.achievements.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Recognition</p>
            <Chips items={job.achievements} tone="award" />
          </div>
        )}
        {clients.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Clients and products</p>
            <Chips items={clients} tone="client" hrefFor={hrefFor} />
          </div>
        )}
      </div>
    </article>
  )
}

export default function YearTimeline({ jobs }: { jobs: ExperienceRow[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 70%', 'end 70%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const groups = groupByYear(jobs)
  const projects = useProjects()

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-12">
      <div aria-hidden="true" className="absolute bottom-0 left-6 top-0 w-px bg-border md:left-[calc(3rem+216px)]">
        <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-gradient-to-b from-blue-500 via-purple-500 to-fuchsia-500" />
      </div>

      {groups.map((group) => (
        <div key={group.year} className="relative grid gap-x-16 pb-12 md:grid-cols-[216px_1fr] md:pb-20">
          <div className="relative mb-8 pl-10 md:sticky md:top-32 md:mb-0 md:self-start md:pl-0">
            <span aria-hidden="true" className="absolute left-0 top-7 h-4 w-4 -translate-x-[8.5px] rounded-full border border-neutral-500 bg-background md:left-auto md:right-0 md:top-6 md:translate-x-[8.5px]" />
            <h2 className="text-5xl font-black tracking-tighter text-muted-foreground/70 md:pr-12 md:text-right md:text-6xl">{group.year}</h2>
          </div>
          <div className="relative ml-10 border-l border-border pl-8 md:ml-0">
            {group.jobs.map((job) => (
              <JobBlock key={job.id} job={job} projects={projects} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
