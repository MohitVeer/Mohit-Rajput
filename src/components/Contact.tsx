import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Layers, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import { trackEvent, trackExternalLink } from '../lib/analytics'
import { useSectionView } from '../hooks/useSectionView'
import { LinkedInIcon } from './icons/TechIcons'
import InfiniteRibbon from './ui/InfiniteRibbon'
import MagneticCta from './ui/MagneticCta'
import Section from './shell/Section'

const WORDS = ['Amazing', 'Accessible', 'Scalable', 'Intelligent']
const LONGEST = WORDS.reduce((a, b) => (a.length > b.length ? a : b), '')

const RIBBON_TECH = 'LWC • Apex • SOQL • OmniStudio • Experience Cloud • Agentforce • Marketing Cloud • React • TypeScript • SLDS'
const RIBBON_ROLES =
  'Front-End Developer • Salesforce Developer • LWC Developer • OmniStudio Developer • Experience Cloud Developer • Marketing Cloud Developer'

export default function Contact() {
  useSectionView('contact', 'Contact', 'contact_section_view')
  const [word, setWord] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setWord((prev) => (prev + 1) % WORDS.length), 2500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <Section id="contact" index="10" label="Contact" className="relative overflow-hidden bg-background py-12 lg:py-16">
      <div className="pointer-events-none relative mb-10 flex h-[18.75rem] w-full items-center justify-center">
        <InfiniteRibbon
          rotation={6}
          baseVelocity={1}
          className="z-10 border-y border-blue-200 py-5 shadow-xl dark:border-white/5"
          background="bg-white dark:bg-zinc-900"
          textColor="font-mono tracking-tighter text-blue-700 dark:text-zinc-400"
        >
          {RIBBON_TECH}
        </InfiniteRibbon>
        <InfiniteRibbon
          rotation={-6}
          reverse
          baseVelocity={1.2}
          className="z-20 border-y border-white/40 py-5 shadow-2xl dark:border-white/10"
          background="bg-blue-600 dark:bg-black"
          textColor="font-bold uppercase tracking-widest text-white"
        >
          {RIBBON_ROLES}
        </InfiniteRibbon>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1 }}
        className="relative z-10 mx-auto mt-16 max-w-[100rem] px-6 text-center md:px-12 lg:px-24"
      >
        <h2 id="contact-heading" className="mb-0 text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
          Let&apos;s Build Something
          <br />
          <span className="inline-grid place-items-center pb-4">
            <span aria-hidden="true" className="invisible col-start-1 row-start-1 mx-2 pb-2 text-gradient-mono">
              {LONGEST}
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={WORDS[word]}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="col-start-1 row-start-1 mx-2 inline-block pb-2 text-gradient-mono"
              >
                {WORDS[word]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="whitespace-nowrap">Together</span>
        </h2>

        <p className="mx-auto mb-10 mt-4 max-w-4xl text-xl text-muted-foreground">
          I&apos;m open to full-time and contract opportunities worldwide — remote, hybrid, or onsite, including visa-sponsored roles.
          Need a front-end developer with Salesforce expertise who builds scalable, accessible, high-performance experiences with LWC,
          Experience Cloud, OmniStudio and Agentforce? Let&apos;s connect.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <MagneticCta to="/contact" variant="primary" className="px-10 py-5 text-lg" onClick={() => trackEvent('Contact', 'hire_me_click')}>
            <Mail className="h-5 w-5" aria-hidden="true" />
            <span>Hire Me</span>
          </MagneticCta>
          <MagneticCta to="/resume" variant="outline" className="px-10 py-5 text-lg">
            <Layers className="h-5 w-5" aria-hidden="true" />
            <span>View My Resume</span>
          </MagneticCta>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-base text-muted-foreground">
          <a href={`mailto:${profile.email}`} onClick={() => trackExternalLink(`mailto:${profile.email}`, 'email_text')} className="break-all py-2 hover:text-foreground">
            {profile.email}
          </a>
          <a href={profile.phoneHref} onClick={() => trackExternalLink(profile.phoneHref, 'phone')} className="py-2 hover:text-foreground">
            {profile.phone}
          </a>
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackExternalLink(profile.linkedinUrl, 'linkedin')}
            className="group inline-flex items-center gap-1.5 py-2 hover:text-foreground"
          >
            <LinkedInIcon className="shrink-0 transition-transform duration-200 group-hover:scale-125" />/{profile.linkedinHandle}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </motion.div>
    </Section>
  )
}
