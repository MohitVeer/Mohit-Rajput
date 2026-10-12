import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Maximize2 } from 'lucide-react'
import { useGithub } from '../../hooks/useGithub'
import { useCountUp } from '../../hooks/useCountUp'
import { profile } from '../../data/profile'
import { trackEvent, trackExternalLink } from '../../lib/analytics'
import { GitHubMark } from '../icons/BrandMarks'
import FullscreenDialog from '../ui/FullscreenDialog'
import ContributionHeatmap from './ContributionHeatmap'
import GithubDashboard from './GithubDashboard'

function Metric({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? '—' : value.toLocaleString('en-US')
  const { ref, display } = useCountUp<HTMLSpanElement>(text)
  return (
    <div>
      <span ref={ref} className="block text-3xl font-black tabular-nums tracking-tight text-[#16a34a] dark:text-[#22c55e] md:text-4xl">
        {display}
      </span>
      <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    </div>
  )
}

export default function GithubShowcase() {
  const { data } = useGithub()
  const [open, setOpen] = useState(false)

  const contributions = data?.contributions ?? null

  return (
    <section id="github" aria-labelledby="github-heading" className="relative bg-background px-4 py-14 md:px-12 md:py-20 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2.5rem] border border-border bg-card/70 p-8 shadow-card md:p-14"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#22c55e]/10 blur-[100px]"
        />

        <div className="relative flex items-start justify-between gap-6">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-[#16a34a] dark:text-[#22c55e]">
              <GitHubMark className="h-6 w-6" />
              GitHub ecosystem
            </p>
            <h2 id="github-heading" className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Building in the open,
              <br />
              <span className="text-[#16a34a] dark:text-[#22c55e]">one commit at a time.</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(true)
              trackEvent('GitHub', 'github_expand')
            }}
            aria-label="Open full GitHub activity"
            className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-foreground text-background shadow-xl transition-transform hover:scale-110"
          >
            <Maximize2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <dl className="relative mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <Metric value={contributions?.total ?? null} label="Contributions this year" />
          <Metric value={data?.user?.publicRepos ?? null} label="Public repositories" />
          <Metric value={data?.user?.followers ?? null} label="Followers" />
          <Metric value={contributions?.currentStreak ?? null} label="Day streak" />
        </dl>

        {contributions && <ContributionHeatmap days={contributions.days} className="relative mt-12" />}

        <div className="relative mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setOpen(true)
              trackEvent('GitHub', 'github_expand')
            }}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
          >
            Explore live activity
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </button>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackExternalLink(profile.githubUrl, 'github_showcase')}
            className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
          >
            Visit GitHub
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Link to="/projects" className="text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
            See client projects →
          </Link>
        </div>
      </motion.div>

      <FullscreenDialog open={open} onClose={() => setOpen(false)} label="GitHub activity">
        <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-24 md:px-10">
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-[#16a34a] dark:text-[#22c55e]">
            <GitHubMark className="h-6 w-6" />
            GitHub ecosystem
          </p>
          <h2 className="mb-10 mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Live from <span className="text-[#16a34a] dark:text-[#22c55e]">@{data?.user?.login ?? 'MohitVeer'}</span>
          </h2>
          <GithubDashboard />
        </div>
      </FullscreenDialog>
    </section>
  )
}
