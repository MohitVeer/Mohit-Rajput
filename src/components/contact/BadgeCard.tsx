import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { profile } from '../../data/profile'
import { SalesforceMark } from '../icons/BrandMarks'

export default function BadgeCard() {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 160], [-16, 16])

  return (
    <div aria-hidden="true" className="relative mx-auto flex h-[520px] w-[280px] justify-center">
      <div className="absolute left-1/2 top-0 h-[120px] w-3 -translate-x-1/2 bg-gradient-to-b from-neutral-500 to-neutral-800 dark:from-neutral-600 dark:to-neutral-900" />
      <motion.div
        className="absolute left-0 top-[110px] w-full origin-[50%_-110px]"
        animate={reduce ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          drag={reduce ? false : 'x'}
          dragSnapToOrigin
          dragElastic={0.35}
          dragConstraints={{ left: 0, right: 0 }}
          whileDrag={{ cursor: 'grabbing' }}
          style={{ x, rotate }}
          className="origin-[50%_-110px] cursor-grab"
        >
          <div className="mx-auto h-5 w-9 rounded-t-md bg-neutral-400 dark:bg-neutral-500" />
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="relative h-28 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700">
              <span className="absolute left-1/2 top-3 h-2.5 w-14 -translate-x-1/2 rounded-full bg-black/40" />
              <SalesforceMark className="absolute bottom-4 right-4 h-8 w-8 text-white/90" />
              <span className="absolute bottom-4 left-5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/80">Open to work</span>
            </div>
            <div className="p-6">
              <span className="grid h-20 w-20 -translate-y-14 place-items-center rounded-2xl border-4 border-card bg-foreground text-3xl font-black tracking-tighter text-background">
                MR
              </span>
              <div className="-mt-10">
                <p className="text-xl font-black uppercase leading-tight tracking-tight text-foreground">{profile.name}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{profile.role}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">LWC · OmniStudio · Experience Cloud</p>
              </div>
              <div className="mt-6 flex h-8 items-end gap-[2px]">
                {Array.from({ length: 38 }, (_, i) => (
                  <span key={i} className="w-[3px] bg-foreground" style={{ height: `${40 + ((i * 37) % 60)}%` }} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
