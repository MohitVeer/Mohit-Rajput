import { profile, heroTags, trailhead } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Hero() {
  return (
    <Scene id="top" index="00" label="Basecamp">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Available worldwide · Remote · Hybrid · Onsite
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <h1
          id="top-heading"
          className="mt-6 max-w-5xl font-display text-[13vw] font-semibold leading-[0.95] tracking-tight md:text-[7.5vw]"
        >
          Salesforce UI,
          <br />
          <span className="text-gradient">built to move.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.16}>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          I&apos;m <span className="font-medium text-foreground">{profile.name}</span> — Salesforce
          Consultant at Wipro, Double Star Ranger, and Agentblazer Champion 2026. 5+ years shipping{' '}
          <span className="text-foreground">
            LWC, OmniStudio, Experience Cloud, Marketing Cloud and Agentforce
          </span>
          .
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        <ul
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-accent"
          aria-label="Core focus areas"
        >
          {heroTags.map((tag) => (
            <li key={tag}>／ {tag}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.32}>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${profile.email}?subject=Interview%20request%20—%20Mohit%20Rajput`}
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-glow transition hover:opacity-90"
          >
            Let&apos;s talk →
          </a>
          <a
            href={profile.trailblazerUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition hover:border-accent"
          >
            {trailhead.rank}
            <span className="sr-only"> — view Trailblazer profile (opens in a new tab)</span>
          </a>
        </div>
      </Reveal>
    </Scene>
  )
}
