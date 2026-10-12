import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { skillGroups } from '../../data/profile'
import { fetchSkillGroups, type SkillGroupRow } from '../../lib/contentApi'
import { useLiveContent } from '../../hooks/useLiveContent'
import { getLenisInstance } from '../../lib/lenisInstance'
import { cn } from '../../lib/cn'
import { groupIcons, skillIcons } from '../icons/TechIcons'

export default function SkillExplorer() {
  const [activeGroup, setActiveGroup] = useState('All')
  const reduceMotion = useReducedMotion()
  const fallback = useMemo<SkillGroupRow[]>(() => skillGroups.map((g, i) => ({ ...g, id: `static-${i}`, sort_order: i })), [])
  const groups = useLiveContent(fetchSkillGroups, fallback)
  const categories = useMemo(() => ['All', ...groups.map((g) => g.title)], [groups])
  const visible = activeGroup === 'All' ? groups : groups.filter((g) => g.title === activeGroup)

  const select = (category: string) => {
    const y = window.scrollY
    setActiveGroup(category)
    let frames = 4
    const hold = () => {
      const lenis = getLenisInstance()
      if (lenis) lenis.scrollTo(y, { immediate: true })
      else window.scrollTo(0, y)
      frames -= 1
      if (frames > 0) requestAnimationFrame(hold)
    }
    requestAnimationFrame(hold)
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-24 md:px-12 lg:px-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="space-y-4"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60">Skills &amp; expertise</p>
        <h3 className="max-w-4xl text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          The full stack, <span className="text-shiny">filtered</span> your way.
        </h3>
        <p className="max-w-2xl text-lg text-muted-foreground">Filter by category, or leave it on All to see everything at once.</p>
      </motion.div>

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
        {categories.map((category) => {
          const isActive = category === activeGroup
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(category)}
              className={cn(
                'rounded-full border px-5 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300',
                isActive
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
            >
              {category}
            </button>
          )
        })}
      </div>

      <div className="mt-12 space-y-12">
        {visible.map((group) => (
          <div key={group.id}>
            <h4 className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              {groupIcons[group.title] && (
                <img src={groupIcons[group.title]} alt="" width={22} height={22} className="h-[22px] w-[22px] rounded-sm bg-white object-contain p-0.5" />
              )}
              {group.title}
            </h4>
            <ul className="mt-5 flex flex-wrap gap-3">
              {group.skills.map((skill, i) => {
                const Icon = skillIcons[skill]
                return (
                  <motion.li
                    key={skill}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.02 }}
                  >
                    <span className="group inline-flex items-center gap-2.5 rounded-2xl border border-border bg-card/60 px-4 py-2.5 text-sm font-semibold text-foreground/90 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-card sm:text-base">
                      {Icon && <Icon className="shrink-0 opacity-80 transition-transform duration-200 group-hover:scale-125 group-hover:opacity-100" />}
                      {skill}
                    </span>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
