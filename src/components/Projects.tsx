import { Link } from 'react-router-dom'
import { ArrowUpRight, Building2 } from 'lucide-react'
import { useRoleSlugs } from '../hooks/useExperience'
import { projectSlugFor, usePortfolio, type EngagementItem, type ProjectItem } from '../hooks/useProjects'
import { trackProjectClick } from '../lib/analytics'
import { TONES } from '../lib/projectTone'
import Section from './shell/Section'
import CompanyLogo from './ui/CompanyLogo'
import ScrollRevealText from './ui/ScrollRevealText'
import ShowcaseStack from './ui/ShowcaseStack'

const CARD_TONES = TONES.slice(0, 4)

const shell =
  'mx-auto flex w-[min(92vw,75rem)] flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-zinc-950'

const pill =
  'inline-flex h-11 items-center rounded-full px-5 text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105 md:h-12 md:px-7'

const MOBILE_HIGHLIGHTS = 2
const MOBILE_CLIENTS = 3

function EngagementCard({ engagement, index, total, slug, hrefFor }: { engagement: EngagementItem; index: number; total: number; slug?: string; hrefFor: (client: string) => string | undefined }) {
  const tone = CARD_TONES[index % CARD_TONES.length]
  return (
    <article aria-label={engagement.title} className={shell}>
      <div className="grid flex-1 md:grid-cols-[1fr_1.2fr]">
        <div
          className="relative flex flex-row items-center justify-between gap-3 overflow-hidden p-5 md:flex-col md:items-stretch md:justify-between md:p-12"
          style={{ background: `linear-gradient(140deg, ${tone}40, transparent 65%)` }}
        >
          <span className="flex items-center gap-3">
            <CompanyLogo company={engagement.employer} size={40} />
            <span className="font-mono text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </span>
          <span aria-hidden="true" className="relative hidden text-[clamp(2.2rem,4.6vw,4rem)] font-black leading-[0.95] tracking-tighter text-neutral-900 dark:text-white md:block">
            {engagement.employer}
          </span>
          <span className="relative inline-flex w-fit items-center gap-2 rounded-full border border-neutral-300 px-3 py-1.5 font-mono text-[0.625rem] font-bold uppercase tracking-widest text-neutral-700 dark:border-neutral-700 dark:text-neutral-300">
            {engagement.current && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" />}
            {engagement.period}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-5 p-5 md:justify-start md:gap-8 md:p-12">
          <div>
            <p className="font-mono text-[0.6875rem] font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
              {engagement.employer} · {engagement.role}
            </p>
            <h3 className="mt-2 text-xl font-black leading-tight tracking-tight text-neutral-900 dark:text-white sm:text-2xl md:mt-3 md:text-4xl">{engagement.title}</h3>
            <ul className="mt-4 space-y-2.5 md:mt-6 md:space-y-3">
              {engagement.highlights.map((highlight, position) => (
                <li
                  key={highlight}
                  className={`gap-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:flex md:text-base ${position < MOBILE_HIGHLIGHTS ? 'flex' : 'hidden'}`}
                >
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-2 font-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400 md:mb-3">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {engagement.clients.length > 1 ? 'Clients' : 'Client'}
            </p>
            <ul className="flex flex-wrap gap-2">
              {engagement.clients.map((client, position) => {
                const href = hrefFor(client)
                const chip = 'inline-flex rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-200'
                return (
                  <li key={client} className={position < MOBILE_CLIENTS ? undefined : 'hidden md:block'}>
                    {href ? (
                      <Link to={href} className={`${chip} transition-colors hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black`}>
                        {client}
                      </Link>
                    ) : (
                      <span className={chip}>{client}</span>
                    )}
                  </li>
                )
              })}
              {engagement.clients.length > MOBILE_CLIENTS && (
                <li className="md:hidden">
                  <span className="inline-flex rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                    +{engagement.clients.length - MOBILE_CLIENTS} more
                  </span>
                </li>
              )}
            </ul>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2.5 md:gap-3">
            <Link to={`/projects?employer=${engagement.employerKey}#archive`} className={`${pill} bg-neutral-900 text-white dark:bg-white dark:text-black`}>
              View projects
            </Link>
            {slug && (
              <Link
                to={`/experience#${slug}`}
                className={`${pill} border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:text-white dark:hover:bg-white dark:hover:text-black`}
              >
                Role details
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function CaseStudyCard({ item, index, total }: { item: ProjectItem; index: number; total: number }) {
  return (
    <article aria-label={item.title} className={shell}>
      <div className="grid flex-1 md:grid-cols-[1fr_1.2fr]">
        <div className="relative flex min-h-[12.5rem] flex-col justify-between gap-4 overflow-hidden bg-gradient-to-br from-sky-500/20 to-transparent p-6 md:p-12">
          <span className="font-mono text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-400">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          {item.image ? (
            <img src={item.image} alt={`Screenshot of ${item.title}`} loading="lazy" width={640} height={360} className="w-full rounded-xl object-cover shadow-2xl" />
          ) : (
            <span aria-hidden="true" className="text-[clamp(2.2rem,4.6vw,4rem)] font-black leading-[0.95] tracking-tighter text-neutral-900 dark:text-white">
              {item.title}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-6 p-6 md:p-12">
          <h3 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white md:text-4xl">{item.title}</h3>
          <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{item.description}</p>
          {item.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
                  {tag}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto flex flex-wrap gap-3">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackProjectClick(item.title, item.url ?? undefined)}
                className={`${pill} gap-2 bg-neutral-900 text-white dark:bg-white dark:text-black`}
              >
                Visit project
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <Link to="/projects" className={`${pill} border-2 border-neutral-300 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:text-white dark:hover:bg-white dark:hover:text-black`}>
              All projects
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { items, engagements } = usePortfolio()
  const slugs = useRoleSlugs()
  const cases = items.filter((item) => item.kind === 'case-study').slice(0, 3)
  const hrefFor = (client: string) => {
    const target = projectSlugFor(items, client)
    return target ? `/projects/${target}` : undefined
  }
  const total = cases.length + engagements.length

  return (
    <Section id="projects" index="07" label="Projects" className="relative bg-background">
      <div className="flex min-h-[55vh] items-center justify-center px-6 py-16 text-center md:min-h-[70vh] md:py-24">
        <h2 id="projects-heading" className="max-w-5xl text-4xl font-medium leading-[1.15] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <ScrollRevealText text="Discover my latest work and creative solutions that bring ideas to life" />
        </h2>
      </div>

      <ShowcaseStack>
        {[
          ...cases.map((item, i) => <CaseStudyCard key={item.id} item={item} index={i} total={total} />),
          ...engagements.map((engagement, i) => (
            <EngagementCard key={engagement.id} engagement={engagement} index={cases.length + i} total={total} slug={slugs.get(engagement.employerKey)} hrefFor={hrefFor} />
          )),
        ]}
      </ShowcaseStack>

      <div className="flex justify-center px-6 pb-16 pt-10 md:pb-24">
        <Link
          to="/projects"
          className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
        >
          View all projects
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  )
}
