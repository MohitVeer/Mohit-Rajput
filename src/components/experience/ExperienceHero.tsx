import { motion, useReducedMotion } from 'framer-motion'

const WORD = 'EXPERIENCE'

export default function ExperienceHero() {
  const reduce = useReducedMotion()

  return (
    <section aria-labelledby="experience-heading" className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.22),transparent_65%)] blur-3xl"
      />
      <div className="relative w-full max-w-[1800px] text-center">
        <h1 id="experience-heading" className="text-[clamp(2.6rem,15.2vw,17rem)] font-black leading-[0.9] tracking-tighter text-foreground">
          <span className="sr-only">{WORD}</span>
          <span aria-hidden="true" className="flex justify-center overflow-hidden pb-[0.08em]">
            {WORD.split('').map((letter, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mx-auto mt-10 max-w-3xl text-xs font-bold uppercase leading-[2.4] tracking-[0.35em] text-muted-foreground md:text-sm"
        >
          Merging front-end precision with enterprise Salesforce delivery. A curated timeline of my professional journey — from
          foundational code to scalable platforms.
        </motion.p>
      </div>
    </section>
  )
}
