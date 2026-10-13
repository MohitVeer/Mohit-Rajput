import { useRef, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '../../lib/cn'

interface MagneticCtaProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'outline'
  href?: string
  to?: string
  onClick?: () => void
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: string
}

export default function MagneticCta({ children, className, variant = 'primary', href, to, onClick, target, rel }: MagneticCtaProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.3)
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.3)
  }

  const onLeave = () => {
    setHovered(false)
    x.set(0)
    y.set(0)
  }

  const tone =
    variant === 'primary'
      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black'
      : 'border-neutral-200 bg-transparent text-neutral-900 dark:border-white/20 dark:text-white'

  const body = (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={() => setHovered(true)}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn('relative flex items-center justify-center overflow-hidden rounded-full border-2 font-bold shadow-xl transition-all duration-300', tone, className)}
    >
      <motion.span
        aria-hidden="true"
        className={cn('absolute inset-0 z-0 rounded-full', variant === 'primary' ? 'bg-white dark:bg-neutral-900' : 'bg-neutral-900 dark:bg-white')}
        initial={{ y: '100%', borderRadius: '50% 50% 0 0' }}
        animate={{ y: hovered ? '0%' : '100%', borderRadius: hovered ? '0% 0% 0 0' : '50% 50% 0 0' }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      />
      <span
        className={cn(
          'relative z-10 flex h-full w-full items-center justify-center gap-3 transition-colors duration-300',
          hovered && variant === 'outline' && 'text-white dark:text-black',
          hovered && variant === 'primary' && 'text-black dark:text-white',
        )}
      >
        {children}
      </span>
    </motion.div>
  )

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="block rounded-full">
        {body}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className="block rounded-full">
        {body}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className="block rounded-full">
      {body}
    </button>
  )
}
