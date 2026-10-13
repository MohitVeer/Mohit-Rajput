import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MagneticEffectProps {
  children: ReactNode
  strength?: number
  stiffness?: number
  damping?: number
  mass?: number
}

export default function MagneticEffect({ children, strength = 0.35, stiffness = 150, damping = 15, mass = 0.1 }: MagneticEffectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const onMove = (event: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPosition({
      x: (event.clientX - (rect.left + rect.width / 2)) * strength,
      y: (event.clientY - (rect.top + rect.height / 2)) * strength,
    })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPosition({ x: 0, y: 0 })}
      animate={position}
      transition={{ type: 'spring', stiffness, damping, mass }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}
