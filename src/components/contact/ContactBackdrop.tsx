import { useMemo, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'

const GRID_LINES =
  'linear-gradient(to right, hsl(var(--foreground) / 0.06) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.06) 1px, transparent 1px)'

interface Meteor {
  left: string
  delay: string
  duration: string
}

export function Meteors({ count, className }: { count: number; className?: string }) {
  const meteors = useMemo<Meteor[]>(
    () =>
      Array.from({ length: count }, () => ({
        left: `${Math.floor(Math.random() * 100)}%`,
        delay: `${(Math.random() * 6.8 + 0.2).toFixed(2)}s`,
        duration: `${Math.floor(Math.random() * 8 + 2)}s`,
      })),
    [count],
  )

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {meteors.map((meteor, index) => (
        <span
          key={index}
          className="absolute size-1.5 animate-meteor rounded-full bg-primary shadow-[0_0_20px_4px_hsl(var(--primary)/0.4)] will-change-transform"
          style={{ '--angle': '-215deg', top: '-5%', left: meteor.left, animationDelay: meteor.delay, animationDuration: meteor.duration } as CSSProperties}
        >
          <span className="pointer-events-none absolute top-1/2 -z-10 h-[2px] w-[100px] -translate-y-1/2 bg-gradient-to-r from-primary to-transparent" />
        </span>
      ))}
    </div>
  )
}

export default function ContactBackdrop() {
  const calm = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" style={{ backgroundImage: GRID_LINES, backgroundSize: '40px 40px', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-background/60" />
      {wide && !calm && <Meteors count={28} />}
    </div>
  )
}
