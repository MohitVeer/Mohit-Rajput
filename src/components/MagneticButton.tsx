import { motion, useReducedMotion } from 'framer-motion'
import { ElementType, MouseEvent, ReactNode, useRef } from 'react'

interface MagneticButtonProps {
  as?: ElementType
  href?: string
  onClick?: () => void
  target?: string
  rel?: string
  type?: 'button' | 'submit'
  className?: string
  children: ReactNode
}

export default function MagneticButton({
  as = 'a',
  className,
  children,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()
  
  const Component = motion(as as any)

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    ref.current.style.setProperty('--mx', `${x * 0.25}px`)
    ref.current.style.setProperty('--my', `${y * 0.25}px`)
  }

  const handleLeave = () => {
    ref.current?.style.setProperty('--mx', '0px')
    ref.current?.style.setProperty('--my', '0px')
  }

  return (
    <Component
      
      ref={ref as any}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transform: 'translate3d(var(--mx, 0), var(--my, 0), 0)' }}
      className={`transition-transform duration-200 ease-out ${className ?? ''}`}
      {...rest}
    >
      {children}
    </Component>
  )
}
