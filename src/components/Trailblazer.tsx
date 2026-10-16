import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { profile, superbadges } from '../data/profile'
import { fetchSuperbadges, type SuperbadgeRow } from '../lib/contentApi'
import { useLiveContent } from '../hooks/useLiveContent'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { trackExternalLink } from '../lib/analytics'
import { useCountUp } from '../hooks/useCountUp'
import { SalesforceMark } from './icons/BrandMarks'
import Section from './shell/Section'
import ShowcaseStack from './ui/ShowcaseStack'
import ZoomParallax from './ui/ZoomParallax'
import { buildTrailTiles } from './trail/TrailTiles'

function Counter({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp<HTMLElement>(value)
  return (
    <div>
      <dd ref={ref as React.RefObject<HTMLElement>} className="whitespace-nowrap text-4xl font-black tabular-nums tracking-tighter text-foreground md:text-6xl">
        {display}
      </dd>
      <dt className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
    </div>
  )
}

function Card({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="mx-auto flex w-[min(92vw,75rem)] flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-2xl dark:border-neutral-800 dark:bg-zinc-950 md:p-14">
      <p className="mb-8 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.4em] text-muted-foreground">{label}</p>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  )
}

export default function Trailblazer() {
  const { trailhead, stats } = useSiteSettings()
  const fallback = useMemo<SuperbadgeRow[]>(() => superbadges.map((s, i) => ({ ...s, id: `static-${i}`, sort_order: i })), [])
  const badges = useLiveContent(fetchSuperbadges, fallback)

  return (
    <Section id="trailblazer" index="06" label="Trailblazer" className="relative bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center space-y-4 px-6 pb-10 pt-16 text-center md:pt-24">
        <motion.h2
          id="trailblazer-heading"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
        >
          Salesforce Trailblazer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground md:text-xl"
        >
          {trailhead.rank} and {trailhead.status} — verified rank, badges, and points from my Salesforce Trailblazer profile.
        </motion.p>
        <Link
          to="/achievements"
          className="inline-flex items-center gap-2 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          See every certificate and badge →
        </Link>
      </div>

      <div className="w-full">
        <ZoomParallax tiles={buildTrailTiles(trailhead, stats)}>
          <a
            href={profile.trailblazerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackExternalLink(profile.trailblazerUrl, 'trailblazer_zoom')}
            className="group flex items-center gap-3 rounded-full border border-border/10 bg-foreground px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-background shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Open Trailblazer
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </ZoomParallax>
      </div>

      <div className="relative pb-16 md:pb-24">
        <ShowcaseStack>
          <Card label="Trailhead">
            <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
              <img src={trailhead.rankImage} alt={`${trailhead.rank} badge`} width={150} height={129} className="mx-auto h-auto w-40 md:w-56" />
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">{trailhead.rank}</h3>
                <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
                  <Counter value={String(trailhead.badges)} label="Badges" />
                  <Counter value={trailhead.points} label="Points" />
                  <Counter value={String(trailhead.trails)} label="Trails" />
                </dl>
                <a
                  href={profile.trailblazerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLink(profile.trailblazerUrl, 'trailblazer_verify')}
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
                >
                  <SalesforceMark className="h-4 w-4 text-[#00A1E0]" />
                  Verify on Trailblazer
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
          </Card>

          <Card label="Agentforce status">
            <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
              <div className="relative mx-auto h-48 w-60">
                <img src={trailhead.agentblazerChampionImage} alt="" width={192} height={192} className="absolute left-0 top-4 h-36 w-36 opacity-60 md:h-44 md:w-44" />
                <img src={trailhead.agentblazerImage} alt={`${trailhead.status} badge`} width={192} height={192} className="absolute left-16 top-0 h-40 w-40 drop-shadow-xl md:left-20 md:h-48 md:w-48" />
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">{trailhead.status}</h3>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Earned the {trailhead.status} recognition through Salesforce Trailhead by completing all required
                  learning paths. Currently building hands-on Agentforce experience while continuing to deepen my expertise in
                  Salesforce AI.
                </p>
              </div>
            </div>
          </Card>

          <Card label={`${badges.length} Trailhead superbadges`}>
            <ul className="mx-auto flex w-full max-w-5xl flex-wrap justify-center gap-x-6 gap-y-10">
              {badges.map((badge) => (
                <li key={badge.id} className="w-[calc(50%-0.75rem)] min-[520px]:w-[calc(33.333%-1rem)] md:w-[calc(20%-1.2rem)]">
                  <a
                    href={badge.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackExternalLink(badge.url, `superbadge:${badge.title}`)}
                    className="group flex h-full flex-col items-center gap-4 text-center"
                  >
                    <span className="grid h-24 w-24 shrink-0 place-items-center md:h-28 md:w-28">
                      <img
                        src={badge.image ?? undefined}
                        alt=""
                        loading="lazy"
                        width={120}
                        height={120}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-foreground [text-wrap:balance]">
                      {badge.title.replace('Superbadge: ', '')}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </ShowcaseStack>
      </div>
    </Section>
  )
}
