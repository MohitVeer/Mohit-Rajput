import { useMemo, useRef, useState } from 'react'
import { certGroups, superbadges } from '../data/profile'
import { fetchCertGroups, fetchSuperbadges, type CertGroupRow, type SuperbadgeRow } from '../lib/contentApi'
import { useLiveContent } from '../hooks/useLiveContent'
import CertificateReveal, { CertificateData } from './CertificateReveal'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'
import { trackEvent, trackExternalLink } from '../lib/analytics'

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<CertificateData | null>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const certGroupsFallback = useMemo<CertGroupRow[]>(
    () =>
      certGroups.map((g, i) => ({
        ...g,
        certs: Array.isArray(g.certs) ? g.certs : [g.certs],
        id: `static-${i}`,
        sort_order: i,
      })),
    [],
  )
  const superbadgesFallback = useMemo<SuperbadgeRow[]>(
    () => superbadges.map((s, i) => ({ ...s, id: `static-${i}`, sort_order: i })),
    [],
  )
  const groups = useLiveContent(fetchCertGroups, certGroupsFallback)
  const badges = useLiveContent(fetchSuperbadges, superbadgesFallback)

  const openCert = (cert: CertificateData, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setActiveCert(cert)
    trackEvent('Certification', 'cert_view', cert.name)
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

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {groups.map((group, i) => (
          <Reveal key={group.id} delay={i * 0.08} className="glass-card p-6 transition-colors hover:border-accent/40 sm:p-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <img
                src={group.logo ?? undefined}
                alt={group.title}
                loading="lazy"
                className="h-8 w-8 rounded-sm bg-white p-1"
                width={32}
                height={32}
              />
              <h3 className="scene-index">{group.title}</h3>
            </div>

            <ul className="mt-4 space-y-1">
              {group.certs.map((cert) => (
                <li key={cert.name}>
                  <button
                    type="button"
                    onClick={(e) => openCert(cert, e.currentTarget)}
                    className="group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent/10"
                  >
                    <img
                      src={cert.image}
                      alt=""
                      loading="lazy"
                      className="h-9 w-9 shrink-0 transition-transform group-hover:scale-110"
                      width={36}
                      height={36}
                    />
                    <span className="text-base underline decoration-border decoration-1 underline-offset-4 transition group-hover:text-accent group-hover:decoration-accent">
                      {cert.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="ml-auto text-accent opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      →
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
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge, i) => (
            <li key={badge.id}>
              <Reveal delay={i * 0.08} className="h-full">
                <a
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLink(badge.url, `superbadge:${badge.title}`)}
                  className="group glass-card flex h-full gap-4 p-5 transition-all hover:-translate-y-1 hover:border-accent-2/50 hover:shadow-glow-2"
                >
                  <img
                    src={badge.image ?? undefined}
                    alt={badge.title}
                    loading="lazy"
                    className="h-14 w-14 shrink-0"
                    width={56}
                    height={56}
                  />
                  <div>
                    <p className="text-base font-semibold leading-snug group-hover:text-accent-2">
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
