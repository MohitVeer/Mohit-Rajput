import { useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, ChevronLeft, ChevronRight, Clock, Code, Layers, Sparkles, Terminal, Users, Zap } from 'lucide-react'
import { useArticles } from '../../hooks/useArticles'
import { useRoleSlugs } from '../../hooks/useExperience'
import { projectSlugFor, type ProjectItem } from '../../hooks/useProjects'
import { topicsIn, articleTopics } from '../../lib/articleUtils'
import { trackProjectClick } from '../../lib/analytics'
import { cn } from '../../lib/cn'
import { toneFor } from '../../lib/projectTone'
import SkillIcon from '../skillspage/SkillIcon'
import { hasSalesforceContext } from '../../lib/techIcons'
import Typewriter from '../ui/Typewriter'
import ProjectCover from './ProjectCover'

const sectionTitle = 'text-2xl font-bold text-foreground'
const sidebarTitle = 'mb-6 border-b border-border pb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground'

function SectionHeading({ id, icon: Icon, tint, children }: { id: string; icon: typeof Box; tint: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className={cn('rounded-lg p-2', tint)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 id={id} className={sectionTitle}>
        {children}
      </h2>
    </div>
  )
}

function MoreProjects({ current, items }: { current: ProjectItem; items: ProjectItem[] }) {
  const track = useRef<HTMLUListElement>(null)
  const others = items.filter((entry) => entry.id !== current.id).slice(0, 8)
  if (others.length === 0) return null

  const scroll = (direction: 1 | -1) => {
    const node = track.current
    if (node) node.scrollBy({ left: (direction * node.clientWidth) / 3, behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="more-projects-heading" className="mt-20">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 id="more-projects-heading" className="text-2xl font-bold">
          More Projects
        </h2>
        <div className="flex gap-2">
          {([-1, 1] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              onClick={() => scroll(direction)}
              aria-label={direction === -1 ? 'Previous projects' : 'Next projects'}
              className="rounded-full border border-border bg-foreground/5 p-2 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              {direction === -1 ? <ChevronLeft className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </div>

      <ul ref={track} className="-mx-6 flex snap-x gap-6 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {others.map((entry) => (
          <li key={entry.id} className="w-[85vw] flex-none snap-center md:w-[calc(33.333%-1rem)]">
            <Link to={`/projects/${entry.slug}`} className="group relative block aspect-video overflow-hidden rounded-xl border border-border shadow-md md:aspect-[4/3] xl:aspect-video">
              <ProjectCover item={entry} size="compact" className="absolute inset-0 transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute right-3 top-3 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium backdrop-blur-md',
                    entry.status === 'ongoing' ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-300' : 'border-blue-500/30 bg-blue-500/20 text-blue-300',
                  )}
                >
                  {entry.status === 'ongoing' ? 'In progress' : 'Completed'}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function ProjectDetail({ item, items }: { item: ProjectItem; items: ProjectItem[] }) {
  const location = useLocation()
  const navigate = useNavigate()
  const roleSlugs = useRoleSlugs()
  const articles = useArticles()
  const ongoing = item.status === 'ongoing'
  const roleSlug = item.employerKey ? roleSlugs.get(item.employerKey) : undefined
  const fromList = (location.state as { from?: string } | null)?.from === 'projects'
  const employerName = item.employerLabel

  const projectTopics = topicsIn(`${item.tags.join(' ')} ${item.description} ${item.engagementTitle ?? ''}`)
  const reading = articles.filter((article) => articleTopics(article).some((topic) => projectTopics.includes(topic))).slice(0, 2)

  const meta = [
    item.role ? { icon: Code, label: 'Role', value: item.role } : null,
    { icon: Clock, label: 'Timeline', value: item.period ?? (ongoing ? 'In progress' : 'Delivered') },
    item.sector ? { icon: Users, label: 'Sector', value: item.sector } : { icon: Users, label: 'Type', value: 'Case study' },
    item.tags.length > 0 ? { icon: Layers, label: 'Tech stack', value: `${item.tags.length} ${item.tags.length === 1 ? 'Technology' : 'Technologies'}` } : null,
  ].filter((cell): cell is { icon: typeof Code; label: string; value: string } => cell !== null)

  const sections = [
    { id: 'mission', label: item.kind === 'case-study' ? 'Project Brief' : 'Engagement Brief', show: true },
    { id: 'highlights', label: 'Delivery Highlights', show: item.highlights.length > 0 },
    { id: 'stack', label: 'Stack & Tooling', show: item.tags.length > 0 },
    { id: 'alongside', label: 'Delivered Alongside', show: item.peers.length > 0 },
    { id: 'reading', label: 'Related Reading', show: reading.length > 0 },
  ].filter((section) => section.show)

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!fromList) return
    event.preventDefault()
    navigate(-1)
  }

  const statusLabel = item.kind === 'case-study' ? 'Case study' : ongoing ? 'Current engagement' : 'Completed engagement'
  const phrases = ['Initiating project overview…', 'Loading engagement details…', 'Compiling delivery highlights…']

  return (
    <div className="min-h-screen bg-background pb-24 pt-28 text-foreground sm:pt-32">
      <header className="mx-auto mb-12 w-full max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/projects" onClick={goBack} className="mb-4 inline-flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Projects
          </Link>

          <div className="mb-6 flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', ongoing ? 'animate-pulse bg-emerald-500' : 'bg-blue-500')} />
              {statusLabel}
            </span>
          </div>

          <h1 className="mb-6 break-words text-4xl font-black uppercase leading-[1.0] tracking-tight md:text-5xl lg:text-7xl">{item.title}</h1>
          <p className="mb-8 max-w-3xl text-xl font-light leading-relaxed text-muted-foreground/90 md:text-2xl">{item.description}</p>
          <p className="flex h-6 items-center font-mono text-sm text-emerald-600 dark:text-emerald-400">
            <Typewriter phrases={phrases} />
          </p>
        </motion.div>
      </header>

      <div className="mx-auto mb-16 w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border shadow-2xl sm:aspect-video md:aspect-[2/1]"
        >
          <ProjectCover item={item} size="banner" className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" />
        </motion.div>
      </div>

      <div className="mx-auto mb-20 w-full max-w-7xl px-6">
        <dl className={cn('grid grid-cols-2 gap-x-4 gap-y-8 border-y border-border py-8', meta.length >= 4 ? 'md:grid-cols-4' : meta.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
          {meta.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-w-0 flex-col gap-2">
              <dt className="flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                <Icon className="h-3 w-3" aria-hidden="true" />
                {label}
              </dt>
              <dd className="break-words font-bold text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="min-w-0 space-y-20 lg:col-span-8">
            <section id="mission" aria-labelledby="mission-heading" className="scroll-mt-28">
              <SectionHeading id="mission-heading" icon={Box} tint="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                {item.kind === 'case-study' ? 'Project Brief' : 'Engagement Brief'}
              </SectionHeading>
              <div className="space-y-5 text-lg leading-loose text-muted-foreground">
                <p>{item.description}</p>
                {item.employer && (
                  <p>
                    Delivered through {employerName}
                    {item.engagementTitle ? ` as part of ${item.engagementTitle}` : ''}
                    {item.role ? `, in the role of ${item.role}` : ''}.
                  </p>
                )}
              </div>
            </section>

            {item.highlights.length > 0 && (
              <section id="highlights" aria-labelledby="highlights-heading" className="scroll-mt-28">
                <SectionHeading id="highlights-heading" icon={Terminal} tint="bg-amber-500/10 text-amber-600 dark:text-amber-500">
                  Delivery Highlights
                </SectionHeading>
                <p className="mb-8 text-sm text-muted-foreground">Results from the {employerName} engagement this project belongs to.</p>
                <ol className="relative ml-3 space-y-10 border-l border-border pb-2 pl-8">
                  {item.highlights.map((highlight, i) => (
                    <li key={highlight} className="group relative">
                      <span aria-hidden="true" className="absolute -left-[2.5625rem] top-1 h-4 w-4 rounded-full border-2 border-border bg-background transition-colors group-hover:border-amber-500" />
                      <p className="mb-1 font-mono text-[0.625rem] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Highlight {String(i + 1).padStart(2, '0')}</p>
                      <p className="text-base leading-relaxed text-foreground/90 transition-colors group-hover:text-foreground">{highlight}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {item.tags.length > 0 && (
              <section id="stack" aria-labelledby="stack-heading" className="scroll-mt-28">
                <SectionHeading id="stack-heading" icon={Zap} tint="bg-blue-500/10 text-blue-600 dark:text-blue-500">
                  Stack &amp; Tooling
                </SectionHeading>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="group flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-foreground/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground/[0.06] hover:shadow-lg"
                      style={{ '--tone': toneFor(tag) } as React.CSSProperties}
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background transition-colors group-hover:border-[var(--tone)]">
                        <SkillIcon name={tag} size={20} context={hasSalesforceContext(item.tags) ? 'salesforce' : undefined} />
                      </span>
                      <span className="min-w-0 break-words text-sm font-bold text-foreground">{tag}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {item.peers.length > 0 && (
              <section id="alongside" aria-labelledby="alongside-heading" className="scroll-mt-28">
                <SectionHeading id="alongside-heading" icon={Users} tint="bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Delivered Alongside
                </SectionHeading>
                <ul className="flex flex-wrap gap-3">
                  {item.peers.map((peer) => {
                    const slug = projectSlugFor(items, peer)
                    const chip = 'inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground'
                    return (
                      <li key={peer}>
                        {slug ? (
                          <Link to={`/projects/${slug}`} className={cn(chip, 'transition-colors hover:border-foreground/40 hover:bg-foreground/5')}>
                            {peer}
                            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                          </Link>
                        ) : (
                          <span className={chip}>{peer}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}

            {reading.length > 0 && (
              <section id="reading" aria-labelledby="reading-heading" className="scroll-mt-28">
                <SectionHeading id="reading-heading" icon={Sparkles} tint="bg-pink-500/10 text-pink-600 dark:text-pink-400">
                  Related Reading
                </SectionHeading>
                <ul className="grid gap-4 md:grid-cols-2">
                  {reading.map((article) => (
                    <li key={article.id}>
                      <Link to={`/blog/${article.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-foreground/[0.03] p-6 transition-all hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl">
                        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                          {article.published_on}
                          {article.read_time ? ` · ${article.read_time}` : ''}
                        </span>
                        <span className="mt-3 text-lg font-bold leading-snug text-foreground">{article.title}</span>
                        <span className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{article.summary}</span>
                        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                          Read article
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="relative lg:col-span-4" aria-label="Project details">
            <div className="space-y-8 [@media(min-width:1024px)_and_(min-height:860px)]:sticky [@media(min-width:1024px)_and_(min-height:860px)]:top-24">
              <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur-sm">
                <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-muted-foreground">Project Access</h2>
                <div className="flex flex-col gap-3">
                  <Link to="/contact" className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-bold text-background shadow-lg transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]">
                    Discuss a similar project
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackProjectClick(item.title, item.url ?? undefined)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                    >
                      Live demo
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                  {item.repoUrl && (
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackProjectClick(item.title, item.repoUrl ?? undefined)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                    >
                      Source code
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                  {roleSlug && (
                    <Link to={`/experience#${roleSlug}`} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10">
                      Role at {employerName}
                    </Link>
                  )}
                  <Link to="/resume" className="flex items-center justify-center gap-2 rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10">
                    View résumé
                  </Link>
                </div>
                {item.employer && !item.url && !item.repoUrl && (
                  <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Client engagement — there is no public demo or repository for this work.</p>
                )}
              </div>

              {item.tags.length > 0 && (
                <div>
                  <h2 className={sidebarTitle}>Technologies</h2>
                  <ul className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li key={tag} className="rounded-lg border border-border bg-foreground/[0.04] px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <nav aria-label="Table of contents" className="hidden lg:block">
                <h2 className={sidebarTitle}>Table of Contents</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="block transition-all duration-200 hover:translate-x-1 hover:text-foreground">
                        • {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>

        <div className="mt-28 border-t border-border pt-16">
          <Link to="/projects" onClick={goBack} className="group inline-flex items-center gap-2 py-2 font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            Back to Projects
          </Link>
          <MoreProjects current={item} items={items} />
        </div>
      </div>
    </div>
  )
}
