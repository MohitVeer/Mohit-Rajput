import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const POSITION: Record<number, string> = {
  1: '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]',
  2: '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]',
  3: '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]',
  4: '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]',
  5: '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]',
  6: '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]',
}

interface ZoomParallaxProps {
  tiles: ReactNode[]
  children?: ReactNode
}

function StaticTiles({ tiles, children }: ZoomParallaxProps) {
  return (
    <div className="px-4 pb-4">
      <ul className="mx-auto grid max-w-xl grid-cols-2 gap-3">
        {tiles.slice(0, 6).map((tile, index) => (
          <li
            key={index}
            aria-hidden="true"
            className="aspect-square overflow-hidden rounded-2xl border border-black/10 shadow-xl dark:border-white/10"
            style={{ containerType: 'inline-size' }}
          >
            {tile}
          </li>
        ))}
      </ul>
      {children && <div className="mt-8 flex justify-center">{children}</div>}
    </div>
  )
}

export default function ZoomParallax({ tiles, children }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null)
  const zoom = useMediaQuery('(prefers-reduced-motion: no-preference)')
  const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])
  const scales: MotionValue<number>[] = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  if (!zoom) return <StaticTiles tiles={tiles}>{children}</StaticTiles>

  return (
    <div ref={container} className="relative z-[1] h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {tiles.slice(0, 7).map((tile, index) => (
          <motion.div
            key={index}
            style={{ scale: scales[index % scales.length] }}
            className={`pointer-events-none absolute top-0 flex h-full w-full items-center justify-center ${POSITION[index] ?? ''}`}
          >
            <div className="relative flex h-[25vh] w-[25vw] items-center justify-center overflow-hidden rounded-2xl border border-black/10 shadow-2xl dark:border-white/10" style={{ containerType: 'inline-size' }}>
              <div aria-hidden="true" className="absolute inset-0">
                {tile}
              </div>
            </div>
          </motion.div>
        ))}
        {children && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="pointer-events-auto">{children}</div>
          </div>
        )}
      </div>
    </div>
  )
}
