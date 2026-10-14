import { motion } from 'framer-motion'
import CubeLoader from '../ui/CubeLoader'
import MagneticTag from './MagneticTag'
import { FEATURES } from './features'

export default function FeatureList() {
  return (
    <div className="space-y-16 px-6 py-16">
      {FEATURES.map((feature, i) => (
        <motion.article
          key={feature.heading}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-xl"
        >
          <div className="h-80 overflow-hidden">
            <div className="h-full -translate-y-9 scale-[1.1]">
              <CubeLoader faces={feature.faces} />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-mono text-[11px] font-black uppercase tracking-[0.5em] text-primary opacity-60">Feature — 0{i + 1}</span>
            <span aria-hidden="true" className="h-px w-12 bg-primary/20" />
          </div>
          <h3 className="mt-4 text-3xl font-bold uppercase leading-tight tracking-tighter text-foreground">{feature.heading}</h3>
          <p className="mt-4 text-lg font-medium leading-snug text-muted-foreground">{feature.description}</p>
          <ul className="mt-6 flex flex-wrap gap-3" aria-label={`${feature.heading} skills`}>
            {feature.skills.map((skill, k) => (
              <MagneticTag key={skill} text={skill} index={k} />
            ))}
          </ul>
        </motion.article>
      ))}
    </div>
  )
}
