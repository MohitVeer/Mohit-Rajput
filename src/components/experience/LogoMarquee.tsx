import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import wipro from '../../assets/wipro/wipro-primary-color.svg'
import { cn } from '../../lib/cn'

interface Logo {
  name: string
  src: string
}

const EMPLOYERS: Logo[] = [
  { name: 'Wipro', src: wipro },
  { name: 'Mphasis', src: '/logos/mphasis.webp' },
  { name: 'DJT Corporation & Investments', src: '/logos/djt.webp' },
  { name: 'Escade Technologies', src: '/logos/escade.webp' },
  { name: 'Forelsket Softwares', src: '/logos/forelsket.webp' },
]

const fill = (items: Logo[], minimum = 12) => {
  let all = [...items]
  while (all.length < minimum) all = [...all, ...items]
  return all
}

function Track({ speed, children }: { speed: number; children: ReactNode }) {
  const calm = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, (latest) => (Math.abs(latest) / 1000) * 5)
  const copyRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const paused = useRef(false)
  const visible = useRef(true)
  const [width, setWidth] = useState(0)

  const measure = useCallback(() => {
    if (copyRef.current) setWidth(copyRef.current.scrollWidth)
  }, [])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (copyRef.current) observer.observe(copyRef.current)
    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    const node = rowRef.current
    if (!node) return
    const watcher = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting
    })
    watcher.observe(node)
    return () => watcher.disconnect()
  }, [])

  const x = useTransform(baseX, (value) => {
    if (width <= 0) return '0px'
    const mod = ((value % width) + width) % width
    return speed > 0 ? `${-width + mod}px` : `${-mod}px`
  })

  useAnimationFrame((_, delta) => {
    if (calm || paused.current || !visible.current) return
    let step = Math.abs(speed) * (Math.min(delta, 50) / 1000)
    const factor = boost.get()
    if (factor > 0) step += step * factor
    baseX.set(baseX.get() + step)
  })

  return (
    <div ref={rowRef} className="w-full overflow-hidden whitespace-nowrap py-1" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <motion.div className="flex will-change-transform" style={{ x }}>
        <div ref={copyRef} className="flex shrink-0 gap-4 pr-4">
          {children}
        </div>
        <div className="flex shrink-0 gap-4 pr-4">{children}</div>
        <div className="flex shrink-0 gap-4 pr-4">{children}</div>
      </motion.div>
    </div>
  )
}

function Tile({ logo }: { logo: Logo }) {
  return (
    <div className="group relative flex h-[clamp(80px,15vw,120px)] w-[clamp(140px,30vw,200px)] shrink-0 cursor-default items-center justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-transform duration-300 hover:scale-105 md:h-[160px] md:w-[280px] md:p-8">
      <img
        src={logo.src}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className={cn('h-full w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0')}
      />
    </div>
  )
}

export default function LogoMarquee() {
  return (
    <section aria-label="Organisations I have worked with" className="relative z-10 overflow-hidden bg-background py-2 md:py-8">
      <p className="sr-only">Employers: {EMPLOYERS.map((logo) => logo.name).join(', ')}.</p>
      <div aria-hidden="true" className="flex flex-col gap-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Track speed={40}>
          {fill(EMPLOYERS).map((logo, index) => (
            <Tile key={`a-${index}`} logo={logo} />
          ))}
        </Track>
        <Track speed={-40}>
          {fill([...EMPLOYERS].reverse()).map((logo, index) => (
            <Tile key={`b-${index}`} logo={logo} />
          ))}
        </Track>
      </div>
    </section>
  )
}
