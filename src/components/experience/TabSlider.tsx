import { useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import MagneticEffect from '../ui/MagneticEffect'
import { cn } from '../../lib/cn'

export interface TabDefinition {
  id: string
  label: string
  quote: string
  icon: LucideIcon
}

interface TabSliderProps {
  tabs: TabDefinition[]
  active: number
  onChange: (index: number) => void
}

export default function TabSlider({ tabs, active, onChange }: TabSliderProps) {
  const calm = useReducedMotion()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (active + step + tabs.length) % tabs.length
    onChange(next)
    buttons.current[next]?.focus()
  }

  return (
    <div className="mx-auto mb-12 w-full max-w-5xl px-2 text-center sm:px-12">
      <div className="relative h-28 sm:h-36">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[25rem] w-[25rem] -translate-x-1/2 before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-gradient-to-b before:from-cyan-500/25 before:via-cyan-500/5 before:via-25% before:to-cyan-500/0 before:to-75% sm:h-[35rem] sm:w-[35rem]"
        >
          <div className="h-24 [mask-image:linear-gradient(0deg,transparent,white_20%,white)] sm:h-32">
            <AnimatePresence initial={false}>
              <motion.div
                key={tabs[active].id}
                initial={calm ? false : { opacity: 0, rotate: -60 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 60 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="absolute inset-0 -z-10 flex h-full items-center justify-center"
              >
                <div className="relative top-8 h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/30 sm:top-11" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mb-6 min-h-[6.25rem] sm:mb-9">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={tabs[active].id}
            initial={calm ? false : { opacity: 0, y: 16, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="px-4 text-xl font-bold text-foreground sm:px-0 sm:text-2xl lg:text-3xl"
          >
            &ldquo;{tabs[active].quote}&rdquo;
          </motion.p>
        </AnimatePresence>
      </div>

      <div
        role="tablist"
        aria-label="Experience views"
        className="flex flex-wrap justify-center gap-1.5 py-4 sm:gap-2"
      >
        {tabs.map((tab, index) => {
          const selected = index === active
          const Icon = tab.icon
          return (
            <MagneticEffect key={tab.id}>
              <button
                ref={(node) => {
                  buttons.current[index] = node
                }}
                type="button"
                role="tab"
                id={`experience-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`experience-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onChange(index)}
                onKeyDown={onKeyDown}
                className={cn(
                  'group inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.8125rem] shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring focus-visible:ring-cyan-300 sm:m-1.5 sm:gap-2.5 sm:px-6 sm:py-3 sm:text-base',
                  selected
                    ? 'bg-cyan-700 text-white shadow-cyan-700/25'
                    : 'border border-transparent bg-white text-cyan-900 backdrop-blur-sm hover:bg-cyan-50 dark:border-white/5 dark:bg-neutral-800/80 dark:text-cyan-100 dark:hover:bg-neutral-700/80',
                )}
              >
                <Icon className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" aria-hidden="true" />
                <span className="font-medium">{tab.label}</span>
              </button>
            </MagneticEffect>
          )
        })}
      </div>
    </div>
  )
}
