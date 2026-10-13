import { motion } from 'framer-motion'
import { profile } from '../../data/profile'

export default function AboutLeadIn() {
  return (
    <div className="mx-auto flex w-full max-w-[1650px] items-center justify-center px-6 py-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        whileHover="hover"
        viewport={{ once: false, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 80, scale: 0.96 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
        }}
        className="group relative w-full overflow-hidden border border-red-600/20 bg-white p-6 shadow-xl transition-colors duration-500 dark:border-red-600/40 dark:bg-black dark:shadow-2xl md:p-12 lg:p-16"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle,_#00000008_1px,_transparent_1px)] bg-[size:20px_20px] dark:bg-[radial-gradient(circle,_#ffffff08_1px,_transparent_1px)]"
        />

        <span aria-hidden="true" className="absolute left-0 top-0 z-10 h-2.5 w-2.5 -translate-x-1 -translate-y-1/2 bg-red-600" />
        <span aria-hidden="true" className="absolute right-0 top-0 z-10 h-2.5 w-2.5 -translate-y-1/2 translate-x-1 bg-red-600" />
        <span aria-hidden="true" className="absolute bottom-0 left-0 z-10 h-2.5 w-2.5 -translate-x-1 translate-y-1/2 bg-red-600" />
        <span aria-hidden="true" className="absolute bottom-0 right-0 z-10 h-2.5 w-2.5 translate-x-1 translate-y-1/2 bg-red-600" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          <motion.div
            variants={{ hidden: { left: '-150%' }, show: { left: '-150%' }, hover: { left: '150%' } }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-y-0 w-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/80 to-transparent dark:via-white/30 md:w-[75%]"
          />
        </div>

        <div className="relative z-10">
          <div className="mb-6 flex items-start justify-between md:mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-600 dark:text-red-500 md:text-xs">Core focus</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-600 md:block">{profile.role}</span>
          </div>

          <div className="relative mb-8 cursor-default md:mb-14">
            <h2
              id="about-heading"
              className="text-[clamp(26px,8vw,40px)] font-bold leading-[1.1] tracking-tight sm:leading-[0.92] text-zinc-900 transition-all duration-700 dark:text-white sm:text-[48px] md:text-[clamp(40px,min(7.5vw,10vh),64px)] lg:text-[clamp(44px,min(5.4vw,10vh),88px)]"
            >
              <span aria-hidden="true" className="mr-2 text-zinc-300 transition-colors duration-700 group-hover:text-zinc-400 dark:text-zinc-700 dark:group-hover:text-zinc-500">
                “
              </span>
              Lightning Web Components.{' '}
              <span className="font-medium text-zinc-400 transition-colors duration-700 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300">
                Experience Cloud.
              </span>{' '}
              <br className="hidden md:block" />
              <span className="font-serif font-normal lowercase italic text-zinc-900 opacity-90 transition-opacity duration-700 group-hover:opacity-100 dark:text-white">
                accessible front-end engineering
              </span>
              <span aria-hidden="true" className="ml-1 text-zinc-300 transition-colors duration-700 group-hover:text-zinc-400 dark:text-zinc-700 dark:group-hover:text-zinc-500">
                .”
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-zinc-100 pt-8 dark:border-zinc-900 md:grid-cols-12 md:gap-12 md:pt-12">
            <div className="md:col-span-5">
              <p className="text-base font-medium leading-relaxed tracking-tight text-zinc-600 dark:text-zinc-400 md:text-lg lg:text-xl">
                I build scalable, user-focused digital experiences across the Salesforce ecosystem and the{' '}
                <span className="font-serif font-normal italic text-zinc-900 dark:text-white">modern front-end</span> that makes
                them fast, accessible and reliable.
              </p>
            </div>

            <div className="flex flex-col gap-8 text-[13px] sm:flex-row md:col-span-7">
              <div className="flex-1 space-y-3">
                <span className="block border-b border-zinc-100 pb-3 font-bold uppercase tracking-widest text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  Scope &amp; Platform
                </span>
                <p className="leading-relaxed text-zinc-500">
                  LWC, Experience Cloud, Agentforce, OmniStudio and Marketing Cloud, with Apex, SOQL and modern JavaScript
                  where the build needs them.
                </p>
                <p className="font-medium italic text-red-600/80 dark:text-red-500/70">Turning complex requirements into production-ready UI.</p>
              </div>
              <div className="flex flex-1 flex-col space-y-3">
                <span className="block border-b border-zinc-100 pb-3 font-bold uppercase tracking-widest text-zinc-800 dark:border-zinc-900 dark:text-zinc-200">
                  Delivery
                </span>
                <p className="leading-relaxed text-zinc-500">
                  WCAG 2.1/2.2 AA by default, responsive design, and CI/CD with Gearset and SFDX so what ships is tested and
                  accessible.
                </p>
                <div className="mt-6 pt-4 md:mt-auto">
                  <span className="font-signature text-3xl text-zinc-900 dark:text-white/90 lg:text-4xl">{profile.name.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
