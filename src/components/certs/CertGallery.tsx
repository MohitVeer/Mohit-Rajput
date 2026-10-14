import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useViewportSize } from '../../hooks/useViewportSize'

function Column({ images, y, offset, className }: { images: string[]; y: MotionValue<number>; offset: string; className?: string }) {
  return (
    <motion.div className={`relative h-full w-1/2 min-w-0 flex-col gap-3 will-change-transform md:w-1/3 md:min-w-[250px] md:gap-6 ${className ?? 'flex'}`} style={{ y, top: offset, translateZ: 0 }}>
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="relative w-full overflow-hidden rounded-lg bg-zinc-100 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10" style={{ paddingTop: '56.25%' }}>
          <img
            src={src}
            alt=""
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ))}
    </motion.div>
  )
}

export default function CertGallery({ images }: { images: string[] }) {
  const gallery = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 768px)')
  const { w, h: height } = useViewportSize()

  const { scrollYProgress } = useScroll({ target: gallery, offset: ['start end', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 20, damping: 15, mass: 0.2, restDelta: 0.001 })

  const travel = wide ? [1.2, 2.0, 0.8] : [0.5, 0.8, 0]
  const y1 = useTransform(progress, [0, 1], [0, height * travel[0]])
  const y2 = useTransform(progress, [0, 1], [0, height * travel[1]])
  const y3 = useTransform(progress, [0, 1], [0, height * travel[2]])

  const columns = wide ? 3 : 2
  const step = Math.max(wide ? 250 : 0, (w - (wide ? 96 : 32)) / columns) * 0.5625 + (wide ? 24 : 12)
  const stage = height * (wide ? 1.3 : 0.8)
  const count = Math.min(images.length, Math.max(wide ? 6 : 9, Math.ceil((stage * 1.4) / step)))
  const pick = (start: number) => Array.from({ length: count }, (_, k) => images[(start + k) % images.length])

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 md:px-8 lg:px-12" aria-hidden="true">
      <div ref={gallery} className="relative box-border flex h-[80svh] gap-3 overflow-hidden md:h-[130vh] md:gap-6">
        <Column images={pick(wide ? 0 : 0)} y={y1} offset={wide ? '-45%' : '-40%'} />
        <Column images={pick(wide ? 5 : 8)} y={y2} offset={wide ? '-95%' : '-85%'} />
        <Column images={pick(11)} y={y3} offset="-65%" className="hidden md:flex" />
      </div>
    </div>
  )
}
