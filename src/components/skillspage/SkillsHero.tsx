import { motion, useReducedMotion } from 'framer-motion'
import CubeLoader from '../ui/CubeLoader'
import { FEATURES } from '../skills/features'
import SkillIcon from './SkillIcon'
import { LOOP_VIEWPORT } from '../../lib/loop'

const FLOATERS = [
  { name: 'React.js', className: 'left-[8%] top-[22%]', size: 44 },
  { name: 'TypeScript', className: 'right-[9%] top-[18%]', size: 40 },
  { name: 'Agentforce', className: 'left-[18%] top-[56%]', size: 42 },
  { name: 'Next.js', className: 'right-[16%] top-[52%]', size: 40 },
  { name: 'Figma', className: 'left-[5%] bottom-[16%]', size: 38 },
  { name: 'Node.js', className: 'right-[6%] bottom-[18%]', size: 44 },
  { name: 'Vue.js', className: 'left-[30%] top-[10%]', size: 34 },
  { name: 'Git', className: 'right-[28%] bottom-[10%]', size: 34 },
]

export default function SkillsHero() {
  const reduce = useReducedMotion()

  return (
    <section aria-labelledby="skills-heading" className="relative flex min-h-screen min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28">
      {FLOATERS.map((floater, i) => (
        <motion.span
          key={floater.name}
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
          className={`absolute hidden md:block ${floater.className}`}
        >
          <motion.span
            whileInView={reduce ? undefined : { y: [0, -16, 0], rotate: [0, 4, 0], transition: { duration: 5 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 } }}
            viewport={LOOP_VIEWPORT}
            className="grid place-items-center rounded-2xl border border-border bg-card/70 p-4 shadow-xl backdrop-blur"
          >
            <SkillIcon name={floater.name} size={floater.size} />
          </motion.span>
        </motion.span>
      ))}

      <div aria-hidden="true" className="relative h-[300px] w-full max-w-md md:h-[38vh]">
        <div className="absolute inset-x-0 top-1/2 h-[400px] -translate-y-1/2 scale-[0.9] sm:scale-[1.2] md:inset-0 md:top-0 md:h-auto md:translate-y-0 md:scale-[1.9]">
          <CubeLoader faces={FEATURES[0].faces} />
        </div>
      </div>

      <h1 id="skills-heading" className="relative mt-8 text-center text-[clamp(2.6rem,9.5vw,8.5rem)] md:mt-4 font-black leading-[0.95] tracking-tighter text-foreground">
        SKILLS &amp; TOOLS
      </h1>
      <p className="relative mt-6 text-center font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground md:text-xs">
        Technologies and tools I work with
      </p>
    </section>
  )
}
