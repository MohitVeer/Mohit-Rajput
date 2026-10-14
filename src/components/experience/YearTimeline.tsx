import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Award, Building2, ChevronDown, ExternalLink, FileText } from 'lucide-react'
import { projectSlugFor, useProjects, type ProjectItem } from '../../hooks/useProjects'
import type { ExperienceDocument, ExperienceRow } from '../../lib/contentApi'
import { trackEvent } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { clientsForJob, extractTech, groupByYear, jobSlug } from '../../lib/experienceUtils'
import CompanyLogo from '../ui/CompanyLogo'

const VISIBLE_BULLETS = 3

const DOCUMENT_KIND: Record<string, string> = {
  'experience-letter': 'Experience letter',
  'relieving-letter': 'Relieving letter',
  'offer-letter': 'Offer letter',
  certificate: 'Certificate',
  other: 'Document',
}

function TagList({ items, tone, hrefFor }: { items: string[]; tone: 'tech' | 'award' | 'client'; hrefFor?: (item: string) => string | undefined }) {
  if (items.length === 0) return null
  const base = 'inline-flex max-w-full items-start gap-1.5 rounded-lg px-3 py-1.5 text-left text-[10px] font-bold uppercase leading-snug tracking-wider transition-all duration-300'
  const styles = {
    tech: 'cursor-default border border-neutral-200 bg-neutral-50 text-neutral-600 shadow-sm hover:-translate-y-0.5 hover:bg-neutral-200 hover:text-neutral-900 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white',
    award: 'border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    client: 'border border-neutral-200 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300',
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        const href = hrefFor?.(item)
        const content = (
          <>
            {tone === 'award' && <Award className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />}
            {tone === 'client' && <Building2 className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />}
            <span className="min-w-0 break-words">{item}</span>
            {href && <ArrowUpRight className="mt-px h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />}
          </>
        )
        return (
          <li key={item} className="max-w-full">
            {href ? (
              <Link to={href} className={cn(base, styles[tone], 'hover:border-foreground/40 hover:bg-foreground/5')}>
                {content}
              </Link>
            ) : (
              <span className={cn(base, styles[tone])}>{content}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function DocumentCard({ job, document }: { job: ExperienceRow; document: ExperienceDocument }) {
  return (
    <motion.a
      layout
      href={document.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => trackEvent('Document', 'document_open', `${job.company} — ${document.label}`)}
      className="group relative flex min-h-24 w-full flex-col justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 md:min-h-32"
    >
      <div className="relative z-10 flex w-full items-center gap-4">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-1 flex items-center gap-2">
            <span className="shrink-0 rounded bg-primary/10 p-1 text-primary">
              <FileText className="h-2.5 w-2.5" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{DOCUMENT_KIND[document.kind] ?? 'Document'}</span>
          </div>
          <span className="mb-0.5 text-xs font-bold leading-tight text-neutral-900 dark:text-white">{document.label}</span>
          <span className="text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400">Issued by {job.company}. Opens as a PDF.</span>
        </div>
        <CompanyLogo company={job.company} size={48} className="shrink-0" />
      </div>
      <div aria-hidden="true" className="absolute inset-0 z-20 flex items-center justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/5">
        <span className="flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-black/80 backdrop-blur-sm transition-transform duration-300 group-hover:scale-100 dark:bg-white/90">
          <ExternalLink className="h-5 w-5 text-white dark:text-black" />
        </span>
      </div>
      <span className="sr-only"> (opens in a new tab)</span>
    </motion.a>
  )
}

function Attachments({ job, documents }: { job: ExperienceRow; documents: ExperienceDocument[] }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? documents.slice(0, 4) : documents.slice(0, 2)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnimatePresence initial={false}>
          {visible.map((document) => (
            <DocumentCard key={`${document.kind}-${document.url}`} job={job} document={document} />
          ))}
        </AnimatePresence>
      </div>
      {documents.length > 2 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="flex items-center gap-1.5 pl-1 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 transition-colors hover:text-primary"
        >
          {expanded ? 'Show Less' : `+${documents.length - 2} More Attachments`}
          <ChevronDown className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

function Entry({ job, projects, onOpenDetail }: { job: ExperienceRow; projects: ProjectItem[]; onOpenDetail: (job: ExperienceRow) => void }) {
  const [lead, ...rest] = job.bullets
  const shown = rest.slice(0, VISIBLE_BULLETS)
  const hidden = rest.length - shown.length
  const tech = extractTech(job)
  const clients = clientsForJob(job, projects)
  const documents = (job.documents ?? []).filter((document) => document.url.trim() && document.label.trim())
  const hrefFor = (name: string) => {
    const slug = projectSlugFor(projects, name)
    return slug ? `/projects/${slug}` : undefined
  }
  const titleId = `${jobSlug(job)}-title`

  return (
    <article id={jobSlug(job)} aria-labelledby={titleId} className="group/timeline relative scroll-mt-32 border-l-2 border-neutral-200 pl-8 dark:border-neutral-800">
      <span aria-hidden="true" className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-neutral-200 dark:border-black dark:bg-neutral-800" />

      <div aria-hidden="true" className="pointer-events-none absolute right-full top-0 mr-6 hidden h-16 w-40 -translate-x-4 items-center justify-end opacity-0 transition-all duration-300 group-hover/timeline:translate-x-0 group-hover/timeline:opacity-100 md:flex">
        <CompanyLogo company={job.company} size={64} />
      </div>

      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h4 id={titleId} className="text-xl font-bold leading-tight text-neutral-900 dark:text-white">
            {job.role}
          </h4>
          <p className="text-lg font-medium text-primary">{job.company}</p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{job.location}</p>
        </div>
        <span className="w-fit shrink-0 rounded bg-neutral-100 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">{job.period}</span>
      </div>

      {lead && <p className="mb-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-justify md:text-base">{lead}</p>}

      {shown.length > 0 && (
        <ul className="mb-8 space-y-3">
          {shown.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-xs text-neutral-500 dark:text-neutral-400 md:text-justify md:text-sm">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => onOpenDetail(job)}
          className="-mt-6 mb-6 flex items-center gap-1.5 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 transition-colors hover:text-primary"
        >
          +{hidden} more in Experience
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </button>
      )}

      <div className="space-y-6">
        {tech.length > 0 && <TagList items={tech} tone="tech" />}
        {job.achievements.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Recognition</p>
            <TagList items={job.achievements} tone="award" />
          </div>
        )}
        {clients.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">Clients and products</p>
            <TagList items={clients} tone="client" hrefFor={hrefFor} />
          </div>
        )}
        {documents.length > 0 && <Attachments job={job} documents={documents} />}
      </div>
    </article>
  )
}

export default function YearTimeline({ jobs, onOpenDetail }: { jobs: ExperienceRow[]; onOpenDetail: (job: ExperienceRow) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const groups = groupByYear(jobs)
  const projects = useProjects()

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    const update = () => setHeight(node.getBoundingClientRect().height)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 10%', 'end 50%'] })
  const fillHeight = useTransform(scrollYProgress, [0, 1], [0, height])
  const fillOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div ref={containerRef} className="w-full bg-background font-sans md:px-10">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-20 md:px-8 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} viewport={{ once: true }}>
          <motion.h2
            id="journey-heading"
            className="mb-6 bg-gradient-to-b from-neutral-900 to-neutral-500 bg-clip-text pb-2 text-[clamp(2rem,10vw,4.5rem)] font-black leading-[1.1] tracking-tight text-transparent dark:from-white dark:to-neutral-500"
            whileHover={{ scale: 1.02, originX: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            Changelog from my journey
          </motion.h2>
          <motion.p
            className="max-w-2xl text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-xl"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A timeline of roles, responsibilities, and professional growth across various organizations.
          </motion.p>
        </motion.div>
      </div>

      <div ref={listRef} className="relative mx-auto max-w-7xl pb-20">
        {groups.map((group) => (
          <div key={group.year} className="flex justify-start pt-10 md:gap-10 md:pt-20">
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div aria-hidden="true" className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background md:left-3">
                <div className="h-4 w-4 rounded-full border border-neutral-300 bg-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800" />
              </div>
              <h3 className="hidden text-xl font-bold text-neutral-500 dark:text-neutral-400 md:block md:pl-20 md:text-5xl">{group.year}</h3>
            </div>

            <div className="relative w-full min-w-0 pl-12 pr-4 md:pl-4">
              <h3 className="mb-4 block text-left text-2xl font-bold text-neutral-500 dark:text-neutral-400 md:hidden">{group.year}</h3>
              <div className="space-y-12">
                {group.jobs.map((job) => (
                  <Entry key={job.id} job={job} projects={projects} onOpenDetail={onOpenDetail} />
                ))}
              </div>
            </div>
          </div>
        ))}

        <div
          aria-hidden="true"
          style={{ height: `${height}px` }}
          className="absolute left-4 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_80%,transparent_100%)] dark:via-neutral-700 md:left-8"
        >
          <motion.div style={{ height: fillHeight, opacity: fillOpacity }} className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-purple-500 from-[0%] via-blue-500 via-[10%] to-transparent" />
        </div>
      </div>
    </div>
  )
}
