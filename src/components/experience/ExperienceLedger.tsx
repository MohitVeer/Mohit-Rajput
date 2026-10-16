import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Award, Briefcase, ChevronRight, ExternalLink, FileText, GraduationCap, type LucideIcon } from 'lucide-react'
import { projectSlugFor, useProjects } from '../../hooks/useProjects'
import { trackEvent } from '../../lib/analytics'
import type { ExperienceDocument, ExperienceRow } from '../../lib/contentApi'
import { cn } from '../../lib/cn'
import { clientsForJob, extractTech, formatDuration, isInternship, jobSlug, periodMonths } from '../../lib/experienceUtils'
import CompanyLogo from '../ui/CompanyLogo'

type CategoryId = 'professional' | 'internship'

interface Category {
  id: CategoryId
  label: string
  icon: LucideIcon
  tile: string
}

const CATEGORIES: Category[] = [
  { id: 'professional', label: 'Professional Experience', icon: Briefcase, tile: 'bg-blue-600' },
  { id: 'internship', label: 'Internship', icon: GraduationCap, tile: 'bg-purple-600' },
]

interface LedgerItem {
  id: string
  title: string
  subtitle: string
  meta: string[]
  company?: string
  icon: LucideIcon
  tasks: string[]
  recognition: string[]
  clients: string[]
  skills: string[]
  documents: ExperienceDocument[]
}

const DOCUMENT_LABEL: Record<string, string> = {
  'experience-letter': 'Experience letter',
  'relieving-letter': 'Relieving letter',
  'offer-letter': 'Offer letter',
  certificate: 'Certificate',
  other: 'Document',
}

function ledgerFromJob(job: ExperienceRow, clients: string[]): LedgerItem {
  const months = periodMonths(job.period)
  return {
    id: jobSlug(job),
    title: job.role,
    subtitle: job.company,
    meta: [job.period, months ? formatDuration(months) : '', job.location].filter(Boolean),
    company: job.company,
    icon: Briefcase,
    tasks: job.bullets,
    recognition: job.achievements,
    clients,
    skills: extractTech(job, 12),
    documents: (job.documents ?? []).filter((document) => document.url.trim() && document.label.trim()),
  }
}

function SectionLabel({ tone, children }: { tone: string; children: string }) {
  return (
    <h5 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', tone)} />
      {children}
    </h5>
  )
}

function LedgerCard({ item, index, open, onToggle, projectHref }: { item: LedgerItem; index: number; open: boolean; onToggle: () => void; projectHref: (name: string) => string | undefined }) {
  const Icon = item.icon
  const slug = item.id.replace(/[^a-z0-9]+/gi, '-')
  const panelId = `ledger-panel-${slug}`

  return (
    <motion.div
      id={`ledger-card-${slug}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.1 }}
      className={cn(
        'group relative overflow-hidden rounded-[2rem] border border-neutral-200 bg-white transition-all duration-500 dark:border-neutral-800 dark:bg-neutral-900',
        'hover:z-10 hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] dark:hover:border-blue-400/50',
        open && 'shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-700',
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={panelId} className="relative z-10 block w-full cursor-pointer p-6 text-left md:p-8">
        <span className="flex items-start gap-4 md:gap-6">
          {item.company ? (
            <CompanyLogo company={item.company} size={64} className="transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110" />
          ) : (
            <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-neutral-100 bg-white shadow-sm transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110 dark:border-neutral-800 md:h-16 md:w-16">
              <Icon className="h-8 w-8 text-neutral-400" />
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col space-y-3">
            <span className="block">
              <span className="mb-1 block text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 md:text-2xl">{item.title}</span>
              <span className="block text-base font-medium text-neutral-600 dark:text-neutral-400">{item.subtitle}</span>
            </span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {item.meta.map((entry, position) => (
                <span key={`${entry}-${position}`} className="flex items-center gap-3">
                  {position > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />}
                  <span className={position === 0 ? 'text-neutral-700 dark:text-neutral-300' : undefined}>{entry}</span>
                </span>
              ))}
            </span>
            {!open && (
              <span className="flex items-center gap-1 pt-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                Show Detail
              </span>
            )}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={panelId} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <div className="mt-4 space-y-8 border-t border-neutral-100 px-6 pb-8 pt-0 dark:border-neutral-800/50 md:px-8">
              {item.tasks.length > 0 && (
                <div className="pt-6">
                  <SectionLabel tone="bg-blue-500">Tasks</SectionLabel>
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {item.tasks.map((task) => (
                      <li key={task} className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.recognition.length > 0 && (
                <div>
                  <SectionLabel tone="bg-emerald-500">Recognition</SectionLabel>
                  <ul className="space-y-3">
                    {item.recognition.map((entry) => (
                      <li key={entry} className="flex items-center gap-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </span>
                        <span>{entry}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.clients.length > 0 && (
                <div>
                  <SectionLabel tone="bg-purple-500">Clients and products</SectionLabel>
                  <ul className="flex flex-wrap gap-2">
                    {item.clients.map((client) => {
                      const href = projectHref(client)
                      const chip = 'inline-flex items-center gap-1.5 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-300'
                      return (
                        <li key={client}>
                          {href ? (
                            <Link to={href} className={cn(chip, 'transition-colors hover:border-foreground/40')}>
                              {client}
                              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                            </Link>
                          ) : (
                            <span className={chip}>{client}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {item.skills.length > 0 && (
                <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800/50">
                  <ul className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <li key={skill} className="rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.documents.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {item.documents.map((document) => (
                    <li key={`${document.kind}-${document.url}`}>
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('Document', 'document_open', `${item.subtitle} — ${document.label}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[0.625rem] font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:border-foreground/40 hover:bg-foreground/5 dark:border-neutral-700 dark:text-neutral-300"
                      >
                        <FileText className="h-3 w-3" aria-hidden="true" />
                        {document.label}
                        <span className="text-neutral-500 dark:text-neutral-400">· {DOCUMENT_LABEL[document.kind] ?? 'Document'}</span>
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-center pt-2">
                <button type="button" onClick={onToggle} className="rounded-full bg-neutral-100 px-6 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:bg-neutral-800 dark:hover:text-white">
                  Hide Detail
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface ExperienceLedgerProps {
  jobs: ExperienceRow[]
  focusJobId: string | null
  onFocusHandled: () => void
}

export default function ExperienceLedger({ jobs, focusJobId, onFocusHandled }: ExperienceLedgerProps) {
  const projects = useProjects()
  const [category, setCategory] = useState<CategoryId | null>(null)
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set())

  const items = useMemo(() => {
    const clientsOf = (job: ExperienceRow) => clientsForJob(job, projects)
    const professional = jobs.filter((job) => !isInternship(job)).map((job) => ledgerFromJob(job, clientsOf(job)))
    const internship = jobs.filter(isInternship).map((job) => ledgerFromJob(job, clientsOf(job)))
    return { professional, internship } as Record<CategoryId, LedgerItem[]>
  }, [jobs, projects])

  const categories = CATEGORIES.filter((entry) => items[entry.id].length > 0)

  useEffect(() => {
    if (!focusJobId) return
    const job = jobs.find((entry) => jobSlug(entry) === focusJobId)
    if (!job) {
      onFocusHandled()
      return
    }
    setCategory(isInternship(job) ? 'internship' : 'professional')
    setOpenIds((current) => new Set(current).add(focusJobId))
    onFocusHandled()
    const timer = window.setTimeout(() => document.getElementById(`ledger-card-${focusJobId.replace(/[^a-z0-9]+/gi, '-')}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 450)
    return () => window.clearTimeout(timer)
  }, [focusJobId, jobs, onFocusHandled])

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const projectHref = (name: string) => {
    const slug = projectSlugFor(projects, name)
    return slug ? `/projects/${slug}` : undefined
  }

  const active = category ? categories.find((entry) => entry.id === category) : undefined

  return (
    <div className="space-y-12">
      <AnimatePresence mode="wait" initial={false}>
        {!active ? (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 items-center gap-12 lg:min-h-[37.5rem] lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-5">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="mb-6 text-5xl font-black leading-[0.9] tracking-tighter text-neutral-900 dark:text-white md:text-7xl">
                  SELECT <br />
                  <span className="bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-400 bg-clip-text text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-500">ARCHIVE</span>
                </h2>
                <p className="max-w-md text-xl leading-relaxed text-neutral-500 dark:text-neutral-400">Navigate through the timeline of my career. Choose a lens to filter the experience database.</p>
              </motion.div>
              <div aria-hidden="true" className="hidden h-1 w-24 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-400 dark:from-white dark:to-neutral-600 lg:block" />
            </div>

            <ul className="flex flex-col gap-4 lg:col-span-7">
              {categories.map((entry, index) => {
                const Icon = entry.icon
                return (
                  <motion.li key={entry.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }}>
                    <button
                      type="button"
                      onClick={() => setCategory(entry.id)}
                      className="group relative flex w-full items-center gap-6 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:bg-neutral-800 dark:hover:shadow-neutral-900/50"
                    >
                      <span aria-hidden="true" className={cn('absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10', entry.tile)} />
                      <span aria-hidden="true" className={cn('flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110', entry.tile)}>
                        <Icon className="h-8 w-8" />
                      </span>
                      <span className="relative z-10 min-w-0 flex-1">
                        <span className="mb-1 block text-xl font-bold text-neutral-900 transition-colors group-hover:text-neutral-700 dark:text-white dark:group-hover:text-neutral-200 sm:text-2xl">{entry.label}</span>
                        <span className="block text-sm font-medium text-neutral-500 transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200">
                          Tap to explore {entry.label.toLowerCase()} records ({items[entry.id].length})
                        </span>
                      </span>
                      <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 transition-all duration-300 group-hover:border-neutral-400 group-hover:text-neutral-900 dark:border-neutral-700 dark:bg-black dark:group-hover:border-neutral-600 dark:group-hover:text-white">
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>
        ) : (
          <motion.div key="ledger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-8 pb-32 lg:grid-cols-12">
            <div className="h-fit space-y-8 lg:sticky lg:top-32 lg:col-span-4">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className="group -ml-4 flex w-fit items-center gap-3 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-800/50 dark:hover:text-white"
              >
                <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                <span>Back to Selection</span>
              </button>

              <div className="space-y-2">
                <h2 className="text-4xl font-black leading-tight tracking-tighter text-neutral-900 dark:text-white md:text-5xl">{active.label}</h2>
                <div aria-hidden="true" className="h-1.5 w-20 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-600" />
              </div>

              <div className="hidden flex-col gap-2 lg:flex">
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Filter View</p>
                {categories.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setCategory(entry.id)}
                    aria-pressed={entry.id === active.id}
                    className={cn(
                      'rounded-xl border border-transparent px-4 py-3 text-left text-sm font-bold transition-all duration-300',
                      entry.id === active.id
                        ? 'border-neutral-200 bg-white text-black shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-white'
                        : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-300',
                    )}
                  >
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>

            <ul className="space-y-6 lg:col-span-8">
              {items[active.id].map((item, index) => (
                <li key={item.id}>
                  <LedgerCard item={item} index={index} open={openIds.has(item.id)} onToggle={() => toggle(item.id)} projectHref={projectHref} />
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
