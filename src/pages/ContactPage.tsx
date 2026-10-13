import ContactForm from '../components/contact/ContactForm'
import ContactHero from '../components/contact/ContactHero'
import Faq from '../components/contact/Faq'
import WiproLanyard from '../components/contact/WiproLanyard'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ContactPage() {
  usePageMeta('/contact')

  return (
    <>
      <ContactHero />

      <section aria-labelledby="talk-heading" className="relative px-6 py-14 md:px-12 md:py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-24">
            <WiproLanyard />
          </div>
          <div>
            <h2 id="talk-heading" className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
              Let&apos;s talk
            </h2>
            <p className="mb-12 mt-4 max-w-md text-sm text-muted-foreground md:text-base">Have a role, a project or an idea? Let&apos;s build something extraordinary together.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <Faq />
    </>
  )
}
