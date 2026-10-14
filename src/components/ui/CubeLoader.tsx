import { useRef } from 'react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useNearScreen } from '../../lib/loop'

export interface CubeFace {
  icon: LucideIcon
  label: string
  color: string
}

const TRANSFORMS = [
  'rotateY(0deg) translateZ(55px)',
  'rotateY(180deg) translateZ(55px)',
  'rotateY(90deg) translateZ(55px)',
  'rotateY(-90deg) translateZ(55px)',
  'rotateX(90deg) translateZ(55px)',
  'rotateX(-90deg) translateZ(55px)',
]

function Face({ icon: Icon, label, color, transform }: CubeFace & { transform: string }) {
  return (
    <div
      className="absolute box-border flex h-full w-full flex-col items-center justify-center overflow-hidden border-[5px] border-black"
      style={{ background: color, transform, backfaceVisibility: 'visible', boxShadow: '12px 12px 0 black' }}
    >
      <div className="absolute h-[20px] w-[150%] -translate-y-10 -rotate-45 bg-black opacity-20" />
      <Icon className="z-10 mb-1 h-10 w-10 text-black" strokeWidth={2.5} />
      <span className="z-10 mt-1 rounded-sm bg-black px-2 font-['Arial_Black',sans-serif] text-[10px] uppercase tracking-widest text-white">{label}</span>
    </div>
  )
}

export default function CubeLoader({ faces }: { faces: CubeFace[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useNearScreen(ref)
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative flex h-full min-h-[400px] w-full items-center justify-center overflow-hidden bg-transparent"
      style={{ perspective: 1500 }}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          className="relative h-[110px] w-[110px]"
          style={{ transformStyle: 'preserve-3d' }}
          initial={{ scale: 1, rotateX: -20, rotateY: 0 }}
          animate={near ? { scale: 1.3, rotateX: 160, rotateY: 180 } : { scale: 1, rotateX: -20, rotateY: 0 }}
          transition={near ? { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } : { duration: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
            animate={near ? { rotateY: 360, rotateZ: 360 } : { rotateY: 0, rotateZ: 0 }}
            transition={near ? { duration: 8, ease: 'linear', repeat: Infinity } : { duration: 0 }}
          >
            {faces.slice(0, 6).map((face, i) => (
              <Face key={face.label} {...face} transform={TRANSFORMS[i]} />
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute -bottom-[80px] h-[30px] w-[120px] rounded-[100%] bg-black/40 blur-[8px] dark:bg-white/10"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={near ? { scale: 0.4, opacity: 0.1 } : { scale: 1, opacity: 0.5 }}
          transition={near ? { duration: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' } : { duration: 0 }}
        />
      </div>
    </div>
  )
}
