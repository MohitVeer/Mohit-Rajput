import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSkillGroups } from '../../hooks/useSkillGroups'
import FallingText from './FallingText'

const WORD_LIMIT = 24

export default function TechUniverse() {
  const groups = useSkillGroups()

  const words = useMemo(() => {
    const seen = new Set<string>()
    const all: string[] = []
    const depth = Math.max(...groups.map((group) => group.skills.length), 0)
    for (let i = 0; i < depth; i++) {
      for (const group of groups) {
        const skill = group.skills[i]
        if (skill && !seen.has(skill)) {
          seen.add(skill)
          all.push(skill)
        }
      }
    }
    return all.slice(0, WORD_LIMIT)
  }, [groups])

  return (
    <motion.section
      aria-labelledby="universe-heading"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      className="w-full border-t border-border/20 py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
          <h2 id="universe-heading" className="mb-3 text-2xl font-black sm:text-3xl lg:text-4xl">
            Technical Universe
          </h2>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground/80">
            Interact with the core technologies and platforms that drive my Salesforce and front-end work.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative mx-auto w-full">
          <FallingText words={words} />
        </motion.div>
      </div>
    </motion.section>
  )
}
