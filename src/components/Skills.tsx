import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { skillGroups } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'
import { getLenisInstance } from '../lib/lenisInstance'

export default function Skills() {
  const [activeGroup, setActiveGroup] = useState<string>('All')
  const reduceMotion = useReducedMotion()
  const categories = useMemo(() => ['All', ...skillGroups.map((g) => g.title)], [])

  const visibleGroups =
    activeGroup === 'All' ? skillGroups : skillGroups.filter((g) => g.title === activeGroup)

  // Filtering to one category can shrink this section's height a lot (six
  // pill groups down to one) — that shrink happens while the section may
  // still be under the viewport's scroll position, and Lenis recalculates
  // its scroll limit against the page's new (shorter) height as part of
  // handling the resize. Depending on timing, that recalculation can clamp
  // — or the browser's own scroll-anchoring can yank — scrollY back toward
  // 0 right as the DOM updates. Re-asserting the pre-click position for a
  // few frames after the state change rides out whichever one fires.
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
            <h3 className="scene-index">{group.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {group.skills.map((skill, i) => (
                <motion.li
                  key={skill}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.02 }}
                >
                  <span
                    className="group inline-flex items-center rounded-lg border border-border bg-card/60 px-3.5 py-2 font-display text-sm text-foreground/90 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent hover:shadow-glow sm:text-base"
                  >
                    {skill}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Scene>
  )
}
