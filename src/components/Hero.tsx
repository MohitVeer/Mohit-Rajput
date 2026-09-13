import { profile, heroTags, trailhead } from '../data/profile'
import Scene from './cinematic/Scene'
import { openResume } from '../lib/resumeEvents'
import Reveal from './cinematic/Reveal'
import MagneticButton from './MagneticButton'
import { trackExternalLink } from '../lib/analytics'

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
        >Salesforce Front-End Engineering,
          <br />
          <span className="text-gradient">built to move.</span>
        </h1>
      </Reveal>

      <Reveal delay={0.16}>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          I&apos;m <span className="font-medium text-foreground">{profile.name}</span> — a Salesforce
          Front-End Engineer with 5+ years of experience building scalable, user-focused digital
          experiences. I work across{' '}
          <span className="text-foreground">
            LWC, Experience Cloud, Agentforce, OmniStudio, Marketing Cloud, and modern front-end
            technologies
          </span>{' '}
          to turn complex requirements into intuitive, production-ready solutions.
        </p>
      </Reveal>

      <Reveal delay={0.24}>
        {/* A slow, pausable marquee instead of a static wrapped list — the
            screen-reader list below carries the real content; this strip is
            aria-hidden and purely decorative. */}
        <ul className="sr-only" aria-label="Core focus areas">
          {heroTags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="marquee-mask mt-8 overflow-hidden" aria-hidden="true">
          <div className="marquee-track gap-x-10 font-mono text-sm text-accent">
            {[...heroTags, ...heroTags].map((tag, i) => (
              <span key={`${tag}-${i}`} className="shrink-0">
                / {tag}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.32}>
        <div className="mt-10 flex flex-wrap gap-4">
          <MagneticButton
            href={`mailto:${profile.email}?subject=Interview%20request%20—%20Mohit%20Rajput`}
            onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email_hero_cta')}
            className="inline-block rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground shadow-glow hover:opacity-90"
          >
            Let&apos;s talk →
          </MagneticButton>
          <MagneticButton
            href={profile.trailblazerUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackExternalLink(profile.trailblazerUrl, 'trailblazer_hero')}
            className="inline-block rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground hover:border-accent"
          >
            {trailhead.rank}
            <span className="sr-only"> — view Trailblazer profile (opens in a new tab)</span>
          </MagneticButton>
          <MagneticButton
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackExternalLink(profile.githubUrl, 'github_hero')}
            className="inline-block rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground hover:border-accent"
          >
            GitHub
            <span className="sr-only"> — view GitHub profile (opens in a new tab)</span>
          </MagneticButton>
          <MagneticButton
            as="button"
            type="button"
            onClick={openResume}
            className="inline-block rounded-full border border-border px-7 py-3.5 text-base font-semibold text-foreground hover:border-accent"
          >
            View Resume
          </MagneticButton>
        </div>
      </Reveal>
    </Scene>
  )
}
