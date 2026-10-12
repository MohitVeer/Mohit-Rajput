import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'

function Column({ images, y, offset }: { images: string[]; y: MotionValue<number>; offset: string }) {
  return (
    <motion.div className="relative flex h-full w-1/3 min-w-[250px] flex-col gap-4 will-change-transform md:gap-6" style={{ y, top: offset, translateZ: 0 }}>
      {images.map((src, i) => (
        <div key={`${src}-${i}`} className="relative w-full overflow-hidden bg-zinc-100 ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10" style={{ paddingTop: '75%' }}>
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute inset-0 m-auto h-3/5 w-3/5 object-contain"
          />
        </div>
      ))}
    </motion.div>
  )
}

export default function CertGallery({ images }: { images: string[] }) {
  const gallery = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const { scrollYProgress } = useScroll({ target: gallery, offset: ['start end', 'end start'] })
  const progress = useSpring(scrollYProgress, { stiffness: 20, damping: 15, mass: 0.2, restDelta: 0.001 })

  const y1 = useTransform(progress, [0, 1], [0, height * 1.2])
  const y2 = useTransform(progress, [0, 1], [0, height * 2.0])
  const y3 = useTransform(progress, [0, 1], [0, height * 0.8])

  useEffect(() => {
    const resize = () => setHeight(window.innerHeight)
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const pick = (indexes: number[]) => indexes.map((i) => images[i % images.length])

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 md:px-8 lg:px-12" aria-hidden="true">
      <div ref={gallery} className="relative box-border flex h-[100vh] gap-4 overflow-hidden md:h-[130vh] md:gap-6">
        <Column images={pick([0, 1, 2, 3, 4, 5])} y={y1} offset="-45%" />
        <Column images={pick([5, 6, 7, 8, 9, 10])} y={y2} offset="-95%" />
        <Column images={pick([11, 12, 13, 14, 15, 0])} y={y3} offset="-65%" />
      </div>
    </div>
  )
}
