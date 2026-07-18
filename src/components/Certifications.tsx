import { useRef, useState } from 'react'
import { certGroups, superbadges } from '../data/profile'
import CertificateReveal, { CertificateData } from './CertificateReveal'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<CertificateData | null>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const openCert = (cert: CertificateData, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setActiveCert(cert)
  }

  return (
    <Scene id="certs" index="06" label="Certifications">
      <Reveal>
        <h2
          id="certs-heading"
          className="max-w-4xl mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Certifications &amp; <span className="text-gradient">Badges.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          9X Salesforce certifications and 5X Trailhead superbadges, grouped by product cloud. Click
          any certification to view it.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
        {certGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.08}>
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <img
                src={group.logo}
                alt={group.title}
                loading="lazy"
                className="h-8 w-8 rounded-sm bg-white p-1"
                width={32}
                height={32}
              />
              <h3 className="scene-index">{group.title}</h3>
            </div>

            <ul className="mt-4 space-y-3">
              {(Array.isArray(group.certs) ? group.certs : [group.certs]).map((cert) => (
                <li key={cert.name}>
                  <button
                    type="button"
                    onClick={(e) => openCert(cert, e.currentTarget)}
                    className="group flex w-full items-center gap-3 rounded-lg text-left transition hover:text-accent"
                  >
                    <img
                      src={cert.image}
                      alt={cert.alt || cert.name}
                      loading="lazy"
                      className="h-8 w-8 shrink-0"
                      width={32}
                      height={32}
                    />
                    <span className="text-base underline decoration-border decoration-1 underline-offset-4 transition group-hover:decoration-accent">
                      {cert.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <span className="scene-index">Trailhead superbadges</span>
        <ul className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-3">
          {superbadges.map((badge, i) => (
            <li key={badge.title}>
              <Reveal delay={i * 0.08}>
                <a
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 border-b border-border pb-6 transition hover:border-accent"
                >
                  <img
                    src={badge.image}
                    alt={badge.title}
                    loading="lazy"
                    className="h-14 w-14 shrink-0"
                    width={56}
                    height={56}
                  />
                  <div>
                    <p className="text-base font-semibold leading-snug group-hover:text-accent">
                      {badge.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <CertificateReveal
        cert={activeCert}
        onClose={() => setActiveCert(null)}
        returnFocusRef={lastTriggerRef}
      />
    </Scene>
  )
}
