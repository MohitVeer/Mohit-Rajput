import { useMemo, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useSkillGroups } from '../../hooks/useSkillGroups'

const TILTS = [-8, 5, -3, 9, -6, 3, -10, 7, -2, 6]

export default function TechUniverse() {
  const groups = useSkillGroups()
  const reduce = useReducedMotion()
  const canDrag = useMediaQuery('(hover: hover) and (pointer: fine)')
  const boundsRef = useRef<HTMLDivElement>(null)

  const words = useMemo(() => {
    const seen = new Set<string>()
    const all: string[] = []
    const depth = Math.max(...groups.map((g) => g.skills.length), 0)
    for (let i = 0; i < depth; i++) {
      for (const group of groups) {
        const skill = group.skills[i]
        if (skill && !seen.has(skill)) {
          seen.add(skill)
          all.push(skill)
        }
      }
    }
    return all.slice(0, 36)
  }, [groups])

  return (
    <section aria-labelledby="universe-heading" className="relative px-6 pb-16 pt-8 text-center md:pb-24">
      <h2 id="universe-heading" className="text-3xl font-black tracking-tight text-foreground md:text-5xl">
        Technical Universe
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
        {canDrag ? 'Drag the technologies around — ' : ''}the core tools and platforms behind the work.
      </p>

      <div ref={boundsRef} className="relative mx-auto mt-14 flex min-h-[320px] max-w-5xl flex-wrap content-center items-center justify-center gap-x-5 gap-y-4">
        {words.map((word, i) => (
          <motion.span
            key={word}
            drag={canDrag && !reduce}
            dragConstraints={boundsRef}
            dragElastic={0.25}
            whileDrag={{ scale: 1.15, zIndex: 5, cursor: 'grabbing' }}
            initial={reduce ? false : { y: -420, opacity: 0, rotate: TILTS[i % TILTS.length] * 3 }}
            whileInView={{ y: 0, opacity: 1, rotate: TILTS[i % TILTS.length] }}
            viewport={{ once: true, margin: '0px 0px -5% 0px' }}
            transition={{ type: 'spring', stiffness: 90, damping: 11, mass: 0.9, delay: (i % 12) * 0.06 }}
            className="inline-block cursor-grab select-none text-xl font-black tracking-tight text-foreground md:text-3xl"
          >
            {word}
          </motion.span>
        ))}
      </div>
    </section>
  )
}
