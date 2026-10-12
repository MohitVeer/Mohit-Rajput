import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { certGroups, profile, superbadges, trailhead } from '../data/profile'
import { fetchCertGroups, fetchSuperbadges, type CertGroupRow, type SuperbadgeRow } from '../lib/contentApi'
import { useLiveContent } from '../hooks/useLiveContent'
import CertificateReveal, { CertificateData } from './CertificateReveal'
import CertGallery from './certs/CertGallery'
import ScrambleLink from './certs/ScrambleLink'
import Section from './shell/Section'
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
  const superbadgesFallback = useMemo<SuperbadgeRow[]>(() => superbadges.map((s, i) => ({ ...s, id: `static-${i}`, sort_order: i })), [])
  const groups = useLiveContent(fetchCertGroups, certGroupsFallback)
  const badges = useLiveContent(fetchSuperbadges, superbadgesFallback)

  const galleryImages = useMemo(() => {
    const certImages = groups.flatMap((g) => g.certs.map((c) => c.image))
    const badgeImages = badges.map((b) => b.image).filter((src): src is string => Boolean(src))
    const extras = [trailhead.agentblazerImage, trailhead.agentblazerChampionImage, trailhead.rankImage]
    const all = [...certImages, ...badgeImages, ...extras]
    return all.length > 0 ? all : extras
  }, [groups, badges])

  const openCert = (cert: CertificateData, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setActiveCert(cert)
    trackEvent('Certification', 'cert_view', cert.name)
  }

  return (
    <Section id="certs" index="05" label="Certifications" className="relative w-full overflow-hidden bg-background pb-32">
      <div className="container relative z-10 mx-auto mb-20 max-w-[1750px] px-4 pt-28 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex w-full flex-col items-center justify-center gap-8 text-center"
        >
          <div className="w-full space-y-4">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60">Certifications &amp; Achievements</p>
            <h2 id="certs-heading" className="mx-auto max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl xl:text-6xl">
              Validating <span className="text-shiny">excellence</span> through Salesforce standards.
            </h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
              9X Salesforce certifications and 5X Trailhead superbadges, grouped by product cloud. Open any certification to
              view it.
            </p>
          </div>
          <ScrambleLink href={profile.trailblazerUrl} label="Verify on Trailhead" onClick={() => trackExternalLink(profile.trailblazerUrl, 'certs_verify')} />
        </motion.div>
      </div>

      <CertGallery images={galleryImages} />

      <div className="mx-auto mt-32 max-w-[1600px] px-6 md:px-12 lg:px-24">
        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((group, i) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-neutral-200 bg-white/70 p-6 shadow-xl backdrop-blur-sm transition-colors hover:border-foreground/30 dark:border-neutral-800 dark:bg-zinc-950/60 sm:p-8"
            >
              <div className="flex items-center gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
                <img src={group.logo ?? undefined} alt="" loading="lazy" className="h-9 w-9 rounded-md bg-white object-contain p-1" width={36} height={36} />
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">{group.title}</h3>
              </div>

              <ul className="mt-4 space-y-1">
                {group.certs.map((cert) => (
                  <li key={cert.name}>
                    <button
                      type="button"
                      onClick={(e) => openCert(cert, e.currentTarget)}
                      className="group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <img src={cert.image} alt="" loading="lazy" className="h-10 w-10 shrink-0 transition-transform group-hover:scale-110" width={40} height={40} />
                      <span className="text-base font-medium text-foreground">{cert.name}</span>
                      <span aria-hidden="true" className="ml-auto text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-20">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Trailhead superbadges</h3>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge, i) => (
              <li key={badge.id}>
                <motion.a
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  href={badge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLink(badge.url, `superbadge:${badge.title}`)}
                  className="group flex h-full gap-4 rounded-3xl border border-neutral-200 bg-white/70 p-5 shadow-xl backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-foreground/30 dark:border-neutral-800 dark:bg-zinc-950/60"
                >
                  <img src={badge.image ?? undefined} alt="" loading="lazy" className="h-14 w-14 shrink-0" width={56} height={56} />
                  <span className="block">
                    <span className="block text-base font-semibold leading-snug text-foreground">
                      {badge.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{badge.description}</span>
                  </span>
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute left-1/4 top-[20%] -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[10%] right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <CertificateReveal cert={activeCert} onClose={() => setActiveCert(null)} returnFocusRef={lastTriggerRef} />
    </Section>
  )
}
