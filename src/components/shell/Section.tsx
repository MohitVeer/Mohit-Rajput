import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  index: string
  label: string
  children: ReactNode
  className?: string
}

export default function Section({ id, index, label, children, className }: SectionProps) {
  return (
    <section id={id} data-scene data-index={index} data-label={label} aria-labelledby={`${id}-heading`} className={className}>
      {children}
    </section>
  )
}
