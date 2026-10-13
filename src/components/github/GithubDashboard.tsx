import { motion } from 'framer-motion'
import { ArrowUpRight, CircleDot, GitCommit, GitPullRequest, MessageSquare, Plus } from 'lucide-react'
import { useGithub } from '../../hooks/useGithub'
import { useCountUp } from '../../hooks/useCountUp'
import { timeAgo, type GithubActivity } from '../../lib/githubApi'
import { trackExternalLink } from '../../lib/analytics'
import { profile } from '../../data/profile'
import { languageColor } from '../../lib/languageColors'
import { cn } from '../../lib/cn'
import ContributionHeatmap from './ContributionHeatmap'

const ACTIVITY_ICONS: Record<GithubActivity['type'], typeof GitCommit> = {
  push: GitCommit,
  pr: GitPullRequest,
  issue: CircleDot,
  comment: MessageSquare,
  create: Plus,
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

function activityVerb(item: GithubActivity) {
  if (item.type === 'push') return 'Pushed'
  if (item.type === 'comment') return 'Commented'
  if (item.type === 'create') return 'Created'
  return capitalize(item.detail)
}

function Card({ className, children, label }: { className?: string; children: React.ReactNode; label: string }) {
  return (
    <motion.section
      aria-label={label}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn('rounded-[2rem] border border-border bg-card/70 p-6 shadow-card backdrop-blur-sm md:p-8', className)}
    >
      {children}
    </motion.section>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block -rotate-1 rounded-full bg-[#22c55e] px-5 py-2 text-base font-extrabold tracking-tight text-black md:text-lg">
      {children}
    </span>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp<HTMLElement>(value)
  return (
    <div className="flex flex-col-reverse">
      <dt className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd ref={ref as React.RefObject<HTMLElement>} className="text-3xl font-black tabular-nums tracking-tight text-foreground md:text-4xl">
        {display}
      </dd>
    </div>
  )
}

function ActivityRow({ item }: { item: GithubActivity }) {
  const Icon = ACTIVITY_ICONS[item.type]
  const repoShort = item.repo.split('/').pop() ?? item.repo
  return (
    <li>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackExternalLink(item.url, `activity:${item.type}`)}
        className="group block rounded-xl border border-border bg-background/60 p-4 transition-colors hover:border-foreground/30"
      >
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#15803d] dark:text-[#22c55e]">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="min-w-0 break-words">
            {activityVerb(item)} · {repoShort}
          </span>
          <span className="ml-auto shrink-0 font-medium normal-case tracking-normal text-muted-foreground">{timeAgo(item.date)}</span>
        </span>
        <span className="mt-2 block text-sm font-medium leading-snug text-foreground">{item.title}</span>
        {item.type === 'push' && item.detail && <span className="mt-1 block font-mono text-[11px] text-muted-foreground">{item.detail}</span>}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>
  )
}

function Skeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3" aria-busy="true" aria-label="Loading GitHub activity">
      <div className="h-72 animate-pulse rounded-[2rem] bg-muted lg:col-span-2" />
      <div className="h-72 animate-pulse rounded-[2rem] bg-muted" />
      <div className="h-72 animate-pulse rounded-[2rem] bg-muted lg:col-span-2" />
      <div className="h-72 animate-pulse rounded-[2rem] bg-muted" />
    </div>
  )
}

export default function GithubDashboard() {
  const { data, loading, failed } = useGithub()

  if (loading && !data) return <Skeleton />

  if (!data) {
    return (
      <div className="rounded-[2rem] border border-border bg-card/70 p-8 text-center">
        <p className="text-lg font-semibold text-foreground">{failed ? 'GitHub activity is unavailable right now.' : 'No GitHub data yet.'}</p>
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackExternalLink(profile.githubUrl, 'github_dashboard_fallback')}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background"
        >
          Open GitHub profile
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    )
  }

  const { contributions, languages, activity, user } = data

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card label="Contribution heatmap" className="lg:col-span-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Yearly contributions</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <Pill>Activity Heatmap</Pill>
          {contributions && (
            <p className="text-sm font-semibold text-foreground">
              <span className="tabular-nums">{contributions.total.toLocaleString('en-US')}</span> contributions in the last year
            </p>
          )}
        </div>
        {contributions ? (
          <>
            <ContributionHeatmap days={contributions.days} className="mt-8" />
            <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 sm:grid-cols-4">
              <Stat value={String(contributions.thisWeek)} label="This week" />
              <Stat value={String(contributions.currentStreak)} label="Current streak (days)" />
              <Stat value={String(contributions.longestStreak)} label="Longest streak (days)" />
              <Stat value={String(contributions.bestDay.count)} label="Best day" />
            </dl>
          </>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">The contribution calendar is temporarily unavailable.</p>
        )}
      </Card>

      <Card label="Languages and totals">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Across public repositories</p>
        <div className="mt-3">
          <Pill>Top Languages</Pill>
        </div>
        <ul className="mt-8 space-y-4">
          {languages.map((language, i) => (
            <li key={language.name}>
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-foreground">
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: languageColor(language.name) }} />
                  {language.name}
                </span>
                <span className="text-muted-foreground">{language.pct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${language.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: languageColor(language.name) }}
                />
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
          <Stat value={String(user?.publicRepos ?? data.repos.length)} label="Repositories" />
          <Stat value={String(user?.followers ?? 0)} label="Followers" />
          <Stat value={String(data.stars)} label="Stars" />
        </dl>
      </Card>

      <Card label="Recent activity" className="lg:col-span-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Live from GitHub</p>
        <div className="mt-3">
          <Pill>Recent Activity</Pill>
        </div>
        {activity.length > 0 ? (
          <ul className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {activity.slice(0, 6).map((item) => (
              <ActivityRow key={`${item.type}-${item.url}-${item.date}`} item={item} />
            ))}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">No recent public activity.</p>
        )}
      </Card>
    </div>
  )
}
