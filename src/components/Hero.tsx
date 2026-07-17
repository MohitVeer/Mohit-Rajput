import { profile, heroTags, trailhead } from '../data/profile'
import Scene from './cinematic/Scene'
import { openResume } from '../lib/resumeEvents'
import Reveal from './cinematic/Reveal'

export default function Hero() {
  return (
    <Scene id="top" index="00" label="Home" center>
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mt-2">
          Available to hire worldwide · Remote · Hybrid · Onsite
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <h1
          id="top-heading"
          className="mt-6 max-w-5xl text-balance font-display text-[clamp(2.75rem,9vw,6.5rem)] font-semibold leading-[1.02] tracking-tight"
        >
          Salesforce UI,
          <br />
          <span className="text-gradient">built to move.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.16}>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          I&apos;m <span className="font-medium text-foreground">{profile.name}</span> — Salesforce
          Consultant at Wipro, Triple Star Ranger, and Agentblazer Innovator 2026. 5+ years shipping{' '}
          <span className="text-foreground">
            LWC, OmniStudio, Experience Cloud, Marketing Cloud and Agentforce
          </span>
          .
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        <ul
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-accent"
          aria-label="Core focus areas"
        >
          {heroTags.map((tag) => (
            <li key={tag}> / {tag}</li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.32}>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={`mailto:${profile.email}?subject=Interview%20request%20—%20Mohit%20Rajput`}
            className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground shadow-glow transition hover:opacity-90"
          >
            Let&apos;s talk →
          </a>
          <a
            href={profile.trailblazerUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground transition hover:border-accent"
          >
            {trailhead.rank}
            <span className="sr-only"> — view Trailblazer profile (opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={openResume}
            className="rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground transition hover:border-accent"
          >
            View Resume
          </button>
        </div>
      </Reveal>
    </Scene>
  )
}
