import { motion } from 'framer-motion'
import SkillIcon from './SkillIcon'

interface Pillar {
  name: string
  label: string
  detail: string
}

const PILLARS: Pillar[] = [
  { name: 'LWC', label: 'Lightning Web Components', detail: 'Standards-based components for Salesforce front ends.' },
  { name: 'Apex', label: 'Apex', detail: 'Server-side logic and integrations on the Salesforce platform.' },
  { name: 'OmniStudio / Vlocity', label: 'OmniStudio', detail: 'FlexCards, OmniScripts and DataRaptors for guided journeys.' },
  { name: 'Experience Cloud', label: 'Experience Cloud', detail: 'Customer and partner portals built on the platform.' },
  { name: 'React.js', label: 'React', detail: 'Component-driven interfaces for the modern web.' },
  { name: 'TypeScript', label: 'TypeScript', detail: 'Typed JavaScript for safer, maintainable front-end code.' },
]

const ARC = ['React.js', 'TypeScript', 'Agentforce', 'JavaScript (ES6+)', 'Git']

export default function Foundation() {
  return (
    <section aria-labelledby="foundation-heading" className="relative overflow-hidden px-6 py-16 md:px-12 md:py-20">
      <div aria-hidden="true" className="relative mx-auto flex h-40 max-w-3xl items-end justify-between md:h-56">
        {ARC.map((name, i) => {
          const lift = [0, 36, 64, 36, 0][i]
          return (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{ marginBottom: lift, rotate: (i - 2) * 9 }}
              className="grid place-items-center rounded-2xl border border-border bg-card/70 p-3.5 shadow-xl backdrop-blur md:p-4"
            >
              <SkillIcon name={name} size={36} />
            </motion.span>
          )
        })}
      </div>

      <div className="mx-auto mt-14 max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground">Core technologies</p>
        <h2 id="foundation-heading" className="mt-4 text-4xl font-medium tracking-tight md:text-6xl">
          The Engineering Foundation
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          Building scalable, accessible interfaces on Salesforce and the modern web — the platforms and frameworks I reach for every day.
        </p>
      </div>

      <ul className="mx-auto mt-14 grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((pillar, i) => (
          <motion.li
            key={pillar.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card/50 p-5 transition-colors hover:border-foreground/30"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted">
              <SkillIcon name={pillar.name} size={24} />
            </span>
            <span>
              <span className="block text-sm font-bold text-foreground">{pillar.label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{pillar.detail}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
