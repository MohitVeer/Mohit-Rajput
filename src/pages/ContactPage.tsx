import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import ContactBackdrop, { Meteors } from '../components/contact/ContactBackdrop'
import ContactForm from '../components/contact/ContactForm'
import ContactHero from '../components/contact/ContactHero'
import Faq from '../components/contact/Faq'
import SocialTickers from '../components/contact/SocialTickers'
import WiproLanyard from '../components/contact/WiproLanyard'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ContactPage() {
  usePageMeta('/contact')
  const calm = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const sheet = wide && !calm
  const runway = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ target: runway, offset: ['start end', 'end end'] })
  const fade = useTransform(scrollYProgress, [0, 0.4], [1, 0.6])
  const shrink = useTransform(scrollYProgress, [0, 0.4], [1, 0.98])
  const rise = useTransform(scrollYProgress, [0, 1], ['100vh', '0vh'])

  return (
    <div className="relative bg-background selection:bg-primary/20">
      <ContactBackdrop />

      <motion.div className="relative z-10" style={sheet ? { opacity: fade, scale: shrink } : undefined}>
        <ContactHero />

        <section aria-labelledby="talk-heading" className="mx-auto max-w-[1800px] px-4 pb-12 md:px-8 md:pb-24 lg:pb-40">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-20">
            <div className="relative z-20 col-span-1 lg:sticky lg:top-0 lg:col-span-4 lg:min-h-[90vh]">
              <WiproLanyard />
            </div>

            <div className="relative z-10 col-span-1 flex min-w-0 flex-col gap-16 lg:col-span-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <SocialTickers />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="mb-10 md:mb-16">
                  <h2 id="talk-heading" className="relative z-10 text-5xl font-black uppercase tracking-tight text-foreground md:text-7xl">
                    Let&apos;s talk
                  </h2>
                  <p className="mt-4 max-w-md text-lg font-light text-muted-foreground">Have a role, a project or an idea? Let&apos;s build something extraordinary together.</p>
                </div>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </section>

        <div ref={runway} aria-hidden="true" className={sheet ? 'pointer-events-none h-screen w-full' : 'h-0 w-full'} />
      </motion.div>

      <motion.div className="relative z-30 overflow-hidden bg-background" style={sheet ? { y: rise, marginTop: '-100vh' } : undefined}>
        {sheet && (
          <>
            <Meteors count={18} className="opacity-40" />
            <div aria-hidden="true" className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </>
        )}
        <div className="relative z-10 mx-auto max-w-[1700px] py-4 md:px-8 md:py-16 lg:py-32">
          <Faq />
        </div>
      </motion.div>
    </div>
  )
}
