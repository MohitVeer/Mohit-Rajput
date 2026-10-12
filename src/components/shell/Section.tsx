import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  index?: string
  label?: string
  children: ReactNode
  className?: string
}

export default function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={className}>
      {children}
    </section>
  )
}
