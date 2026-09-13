import { profile, trailhead } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'
import { trackExternalLink } from '../lib/analytics'
import { useCountUp } from '../hooks/useCountUp'

function TrailStat({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp(value)
  return (
    <div className="min-w-[4.5rem]">
      <dd ref={ref} className="whitespace-nowrap text-2xl font-semibold tabular-nums text-accent">
        {display}
      </dd>
      <dt className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{label}</dt>
    </div>
  )
}

export default function Trailblazer() {
  return (
    <Scene id="trailblazer" index="03" label="Trailblazer" center>
      <Reveal>
        <h2
          id="trailblazer-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl mt-2"
        >
          Salesforce <span className="text-gradient">Trailblazer.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Triple Star Ranger and Agentblazer Innovator 2026 — verified rank, badges, and points from
          my Salesforce Trailblazer profile.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal delay={0.1} className="glass-card flex flex-wrap items-center gap-x-8 gap-y-6 p-8">
          <img
            loading="lazy"
            src={trailhead.rankImage}
            alt=""
            className="h-20 w-20 shrink-0"
            width={80}
            height={80}
          />
          <dl className="flex flex-wrap gap-x-8 gap-y-4 font-mono">
            <TrailStat value={String(trailhead.badges)} label="Badges" />
            <TrailStat value={trailhead.points} label="Points" />
            <TrailStat value={String(trailhead.trails)} label="Trails" />
          </dl>
        </Reveal>

        <Reveal delay={0.2} className="glass-card flex items-start gap-6 p-8">
          <div className="relative h-24 w-28 shrink-0">
            <img
              src={trailhead.agentblazerChampionImage}
              alt=""
              loading="lazy"
              className="absolute left-0 top-2 h-20 w-20 opacity-70"
              width={80}
              height={80}
            />
            <img
              src={trailhead.agentblazerImage}
              alt="Agentblazer Innovator badge"
              loading="lazy"
              className="absolute left-8 top-0 h-24 w-24 drop-shadow-md"
              width={96}
              height={96}
            />
          </div>
          <div>
            <span className="scene-index">Agentforce status</span>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              Earned the Agentblazer Innovator 2026 recognition through Salesforce Trailhead by
              completing all required learning paths. Currently building hands-on Agentforce
              experience while continuing to deepen my expertise in Salesforce AI.
            </p>
            <a
              href={profile.trailblazerUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackExternalLink(profile.trailblazerUrl, 'trailblazer_verify')}
              className="mt-4 inline-flex items-center gap-1 border-b border-accent text-base font-semibold text-accent"
            >
              Verify on Trailblazer →<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </Reveal>
      </div>
    </Scene>
  )
}
