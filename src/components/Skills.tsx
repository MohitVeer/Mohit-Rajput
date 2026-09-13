import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { skillGroups } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'
import { getLenisInstance } from '../lib/lenisInstance'
import { groupIcons, skillIcons } from './icons/TechIcons'

export default function Skills() {
  const [activeGroup, setActiveGroup] = useState<string>('All')
  const reduceMotion = useReducedMotion()
  const categories = useMemo(() => ['All', ...skillGroups.map((g) => g.title)], [])

  const visibleGroups =
    activeGroup === 'All' ? skillGroups : skillGroups.filter((g) => g.title === activeGroup)

  const selectCategory = (category: string) => {
    const y = window.scrollY
    setActiveGroup(category)
    let framesLeft = 4
    const reassert = () => {
      const lenis = getLenisInstance()
      if (lenis) lenis.scrollTo(y, { immediate: true })
      else window.scrollTo(0, y)
      framesLeft -= 1
      if (framesLeft > 0) requestAnimationFrame(reassert)
    }
    requestAnimationFrame(reassert)
  }

  return (
    <Scene id="skills" index="04" label="Skills" center>
      <Reveal>
        <h2
          id="skills-heading"
          className="max-w-4xl mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Skills &amp; <span className="text-gradient">Expertise.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Filter by category, or leave it on all to see the full stack at once.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
          {categories.map((category) => {
            const isActive = category === activeGroup
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => selectCategory(category)}
                className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border text-muted-foreground hover:border-accent/60 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </Reveal>

      <div className="mt-10 space-y-10">
        {visibleGroups.map((group) => (
          <div key={group.title}>
            <h3 className="flex items-center gap-2 scene-index">
              {groupIcons[group.title] && (
                <img
                  src={groupIcons[group.title]}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] rounded-sm bg-white/90 object-contain p-0.5"
                />
              )}
              {group.title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {group.skills.map((skill, i) => {
                const Icon = skillIcons[skill]
                return (
                  <motion.li
                    key={skill}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.02 }}
                  >
                    <span
                      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3.5 py-2 font-display text-sm text-foreground/90 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent hover:shadow-glow sm:text-base"
                    >
                      {Icon && (
                        <Icon className="shrink-0 opacity-80 transition-transform duration-200 group-hover:scale-125 group-hover:opacity-100" />
                      )}
                      {skill}
                    </span>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </Scene>
  )
}
