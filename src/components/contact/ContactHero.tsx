import ScrollVelocityText from './ScrollVelocityText'

const ROWS = ["Let's build something great · Open to opportunities worldwide ·", 'Available for full-time & contract · Remote · Hybrid · Onsite ·']

export default function ContactHero() {
  return (
    <section aria-labelledby="contact-heading" className="relative w-full pb-10 pt-32 md:pb-20 md:pt-48">
      <h1 id="contact-heading" className="sr-only">
        Contact Mohit Rajput
      </h1>
      <div aria-hidden="true" className="pointer-events-none flex w-full select-none items-center justify-center opacity-20">
        <ScrollVelocityText texts={ROWS} velocity={20} className="text-7xl font-black uppercase leading-[1.05] tracking-tight md:text-[9rem]" />
      </div>
    </section>
  )
}
