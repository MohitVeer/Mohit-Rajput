import { profile, trailhead } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Trailblazer() {
  return (
    <Scene id="trailblazer" index="03" label="Trailblazer">
      <Reveal>
        <h2
          id="trailblazer-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl mt-2"
        >
          Salesforce <span className="text-gradient">Trailblazer.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Double Star Ranger and Agentblazer Champion 2026 — verified rank, badges, and points from
          my Salesforce Trailblazer profile.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
        <Reveal
          delay={0.1}
          className="flex items-center gap-6 border-b border-border pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-16"
        >
          <img src={trailhead.rankImage} alt="" className="h-20 w-20 shrink-0" width={80} height={80} />
          <dl className="grid grid-cols-3 gap-6 font-mono">
            <div>
              <dd className="text-2xl font-semibold text-accent">{trailhead.badges}</dd>
              <dt className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Badges</dt>
            </div>
            <div>
              <dd className="text-2xl font-semibold text-accent">{trailhead.points}</dd>
              <dt className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Points</dt>
            </div>
            <div>
              <dd className="text-2xl font-semibold text-accent">{trailhead.trails}</dd>
              <dt className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">Trails</dt>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.2} className="flex items-start gap-6">
          {/* Overlapping badge stack: Champion badge sits behind/left,
              Innovator badge sits in front/right — same layered look as
              the Trailhead profile page. Swap the two image URLs in
              profile.ts once you have the real Champion badge asset. */}
          <div className="relative h-24 w-28 shrink-0">
            <img
              src={trailhead.agentblazerChampionImage}
              alt=""
              className="absolute left-0 top-2 h-22 w-22 opacity-70"
              width={80}
              height={80}
            />
            <img
              src={trailhead.agentblazerImage}
              alt="Agentblazer Innovator badge"
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
              rel="noreferrer"
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
