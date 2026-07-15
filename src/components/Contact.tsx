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
    <Scene id="contact" index="09" label="Contact" minHeight={false} className="pb-32">
      <Reveal>
        <h2
          id="contact-heading"
          className="max-w-4xl mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Let&apos;s <span className="text-gradient">Connect.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
          I&apos;m open to full-time and contract opportunities{' '}
          <span className="text-foreground">worldwide</span> — remote, hybrid or onsite. Open to visa-sponsored roles. Looking for a Salesforce UI Engineer specializing in Lightning Web Components, Experience Cloud, and modern frontend engineering with a focus on performance, accessibility, and reusable UI architecture? Let&apos;s connect.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-12">
          <a
            href={mailtoHref}
            className="group inline-flex items-baseline gap-3 border-b-2 border-accent font-display text-2xl font-semibold transition hover:text-accent md:text-4xl"
          >
            {profile.email}
            <span className="text-2xl transition group-hover:translate-x-1 md:text-4xl" aria-hidden="true">
              →
            </span>
          </a>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-mono text-base">
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
