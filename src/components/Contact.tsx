import { profile } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

const emailSubject = encodeURIComponent('Interview / Role — Mohit Rajput')
const emailBody = encodeURIComponent(
  'Hi Mohit,\n\nI came across your portfolio and would like to discuss an opportunity.\n\nRole:\nCompany:\nLocation:\n\nThanks,\n',
)
const mailtoHref = `mailto:${profile.email}?subject=${emailSubject}&body=${emailBody}`

export default function Contact() {
  return (
    <Scene id="contact" index="09" label="Basecamp Radio" minHeight={false} className="pb-32">
      <Reveal>
        <h2
          id="contact-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl"
        >
          Hiring a Salesforce UI dev who{' '}
          <span className="text-gradient">ships fast, accessible product</span>?
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          I&apos;m open to full-time and contract roles <span className="text-foreground">worldwide</span>{' '}
          — remote, hybrid or onsite, visa-ready.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-12">
          <a
            href={mailtoHref}
            className="group inline-flex items-baseline gap-3 border-b-2 border-accent font-display text-3xl font-semibold transition hover:text-accent md:text-5xl"
          >
            {profile.email}
            <span className="text-2xl transition group-hover:translate-x-1 md:text-4xl" aria-hidden="true">
              →
            </span>
          </a>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-mono text-sm">
            <a href={profile.phoneHref} className="text-muted-foreground hover:text-foreground">
              {profile.phone}
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              /{profile.linkedinHandle}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Reveal>
    </Scene>
  )
}
