import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../../lib/cn'

const COLORS = [
  { main: 'bg-emerald-500', hover: 'group-hover/badge:text-white' },
  { main: 'bg-blue-500', hover: 'group-hover/badge:text-white' },
  { main: 'bg-violet-500', hover: 'group-hover/badge:text-white' },
  { main: 'bg-rose-500', hover: 'group-hover/badge:text-white' },
  { main: 'bg-amber-500', hover: 'group-hover/badge:text-black' },
  { main: 'bg-cyan-500', hover: 'group-hover/badge:text-black' },
]

export default function MagneticTag({ text, index }: { text: string; index: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })
  const color = COLORS[index % COLORS.length]

  const onMove = (event: React.MouseEvent<HTMLLIElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.4)
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.4)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <li className="pointer-events-auto relative -m-2 cursor-default p-2" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.span
        style={{ x: springX, y: springY }}
        className="group/badge relative block overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.02] px-6 py-3 text-[10px] font-extrabold uppercase tracking-widest text-black backdrop-blur-xl transition-colors duration-300 hover:border-transparent dark:text-white md:px-8 md:py-4 md:text-[11px]"
      >
        <span aria-hidden="true" className={cn('absolute inset-0 z-0 translate-y-[101%] transition-transform duration-300 ease-out group-hover/badge:translate-y-0', color.main)} />
        <span className={cn('relative z-10 transition-colors duration-300', color.hover)}>{text}</span>
      </motion.span>
    </li>
  )
}
