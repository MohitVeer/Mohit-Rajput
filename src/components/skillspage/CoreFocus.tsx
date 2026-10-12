import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SkillGroupRow } from '../../lib/contentApi'
import { cn } from '../../lib/cn'
import { groupIcons } from '../icons/TechIcons'
import SkillIcon from './SkillIcon'

export default function CoreFocus({ groups }: { groups: SkillGroupRow[] }) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const current = groups[Math.min(active, groups.length - 1)]

  if (!current) return null

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % groups.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + groups.length) % groups.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = groups.length - 1
    else return
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section aria-labelledby="focus-heading" className="relative px-6 py-16 md:px-12 md:py-20 lg:px-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <h2 id="focus-heading" className="text-4xl font-black tracking-tight md:text-6xl">
            Core Focus
          </h2>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Capabilities &amp; architectures</p>
        </div>

        <div role="tablist" aria-label="Skill categories" className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-1 rounded-2xl border border-border bg-card/50 p-1.5 backdrop-blur md:flex-nowrap">
          {groups.map((group, i) => (
            <button
              key={group.id}
              ref={(el) => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`${baseId}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => onKeyDown(event, i)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-colors md:text-sm',
                active === i ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {groupIcons[group.title] && <img src={groupIcons[group.title]} alt="" width={16} height={16} className="h-4 w-4 rounded-sm bg-white object-contain p-px" />}
              <span>{group.title}</span>
              <span className={cn('font-mono text-[10px]', active === i ? 'text-background/60' : 'text-muted-foreground')}>{group.skills.length}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${active}`} tabIndex={0} className="mt-10 focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.ul
              key={current.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4"
            >
              {current.skills.map((skill) => (
                <li
                  key={skill}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-card/50 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-card"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted text-foreground transition-transform group-hover:scale-110">
                    <SkillIcon name={skill} size={22} />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-foreground">{skill}</span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
