import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { Achievement } from '../../lib/achievements'
import AchievementThumb from './AchievementThumb'

interface Pose {
  x: number
  y: number
  r: number
  s: number
}

const START: Pose[] = [
  { x: -40, y: -26, r: -14, s: 0.85 },
  { x: 4, y: -32, r: 9, s: 0.75 },
  { x: 40, y: -24, r: 12, s: 0.85 },
  { x: -41, y: 28, r: 10, s: 0.8 },
  { x: -2, y: 34, r: -8, s: 0.75 },
  { x: 40, y: 30, r: -11, s: 0.85 },
]

const END: Pose[] = [
  { x: -29, y: -17, r: -2, s: 1 },
  { x: 0, y: -17, r: 1, s: 1 },
  { x: 29, y: -17, r: 2, s: 1 },
  { x: -29, y: 19, r: 1, s: 1 },
  { x: 0, y: 19, r: -1, s: 1 },
  { x: 29, y: 19, r: -2, s: 1 },
]

function SpreadCard({ item, from, to, progress }: { item: Achievement; from: Pose; to: Pose; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0.05, 0.7], [`${from.x}vw`, `${to.x}vw`])
  const y = useTransform(progress, [0.05, 0.7], [`${from.y}vh`, `${to.y}vh`])
  const rotate = useTransform(progress, [0.05, 0.7], [from.r, to.r])
  const scale = useTransform(progress, [0.05, 0.7], [from.s, to.s])

  return (
    <motion.div style={{ x, y, rotate, scale }} className="absolute inset-0 m-auto h-fit w-[26vw] max-w-[420px] will-change-transform">
      <div className="aspect-video overflow-hidden rounded-lg shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
        <AchievementThumb item={item} />
      </div>
    </motion.div>
  )
}

export default function CertificateSpread({ items }: { items: Achievement[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const headingOpacity = useTransform(scrollYProgress, [0.5, 0.75], [0, 1])
  const headingY = useTransform(scrollYProgress, [0.5, 0.75], [30, 0])
  const certs = items.filter((item) => item.image).slice(0, 6)

  if (certs.length < 6) return null

  return (
    <div ref={ref} aria-hidden="true" className="relative hidden h-[260vh] md:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.p
          style={{ opacity: headingOpacity, y: headingY }}
          className="absolute inset-x-0 top-[9vh] z-10 text-center text-3xl font-black tracking-tight text-foreground lg:text-5xl"
        >
          Verified by Salesforce.
        </motion.p>
        {certs.map((item, i) => (
          <SpreadCard key={item.id} item={item} from={START[i]} to={END[i]} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  )
}
