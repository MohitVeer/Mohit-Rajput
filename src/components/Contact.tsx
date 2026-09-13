import { profile } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'
import MagneticButton from './MagneticButton'
import { openResume } from '../lib/resumeEvents'
import { trackExternalLink } from '../lib/analytics'

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
  <span className="text-foreground">worldwide</span> — remote, hybrid, or onsite, including
  visa-sponsored roles. Looking for a Salesforce Front-End Engineer who can build scalable,
  accessible, and high-performance experiences with{' '}
  <span className="text-foreground">
    LWC, Experience Cloud, OmniStudio, Agentforce, Apex, and modern front-end technologies
  </span>
  ? Let&apos;s connect.
</p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="glass-card mt-12 min-w-0 p-8 sm:p-10">
          <MagneticButton
            href={mailtoHref}
            onClick={() => trackExternalLink(mailtoHref, 'email')}
            className="group inline-flex w-full max-w-full flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-accent font-display text-xl font-semibold hover:text-accent sm:text-2xl md:text-4xl"
          >
            <span className="break-all">{profile.email}</span>
            <span className="text-xl transition group-hover:translate-x-1 sm:text-2xl md:text-4xl" aria-hidden="true">
              →
            </span>
          </MagneticButton>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 font-mono text-base">
            <a
              href={profile.phoneHref}
              onClick={() => trackExternalLink(profile.phoneHref, 'phone')}
              className="text-muted-foreground hover:text-foreground"
            >
              {profile.phone}
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackExternalLink(profile.linkedinUrl, 'linkedin')}
              className="text-muted-foreground hover:text-foreground"
            >
              /{profile.linkedinHandle}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
           <button
            type="button"
            onClick={openResume}
            className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-accent"
          >
            View Resume
          </button>
        </div>
      </Reveal>
    </Scene>
  )
}
