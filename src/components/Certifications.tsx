import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAchievements } from '../hooks/useAchievements'
import CertGallery from './certs/CertGallery'
import Section from './shell/Section'

export default function Certifications() {
  const items = useAchievements()
  const certificates = useMemo(() => items.filter((item) => item.kind === 'certification' && item.image).map((item) => (item.thumb ?? item.image) as string), [items])
  const salesforceCount = items.filter((item) => item.kind === 'certification' && item.issuer === 'Salesforce').length
  const otherCount = items.filter((item) => item.kind === 'certification' && item.issuer !== 'Salesforce').length
  const badgeCount = items.filter((item) => item.kind === 'superbadge').length

  return (
    <Section id="certs" index="05" label="Certifications" className="relative w-full overflow-hidden bg-background pb-16 md:pb-24">
      <div className="container relative z-10 mx-auto mb-12 max-w-[109.375rem] px-4 pt-16 md:mb-16 md:px-12 md:pt-24 lg:px-24">
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
              {salesforceCount} Salesforce certifications{otherCount > 0 ? `, ${otherCount} other certificates` : ''} and {badgeCount} Trailhead superbadges — the original certificates, ready to open and verify.
            </p>
          </div>
          <Link
            to="/achievements"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            View all achievements
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>

      {certificates.length > 0 && <CertGallery images={certificates} />}

      <div aria-hidden="true" className="pointer-events-none absolute left-1/4 top-[20%] -z-10 h-[31.25rem] w-[31.25rem] rounded-full bg-primary/5 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[10%] right-1/4 -z-10 h-[25rem] w-[25rem] rounded-full bg-primary/5 blur-[100px]" />
    </Section>
  )
}
