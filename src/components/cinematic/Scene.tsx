import { ReactNode } from 'react'

interface SceneProps {
  id: string
  index: string
  label: string
  children: ReactNode
  className?: string
  minHeight?: boolean
  center?: boolean   // ← new
}

export default function Scene({ id, index, label, children, className = '', minHeight = true, center = false }: SceneProps) {
  return (
    <section
      id={id}
      data-scene
      data-index={index}
      data-label={label}
      aria-labelledby={`${id}-heading`}
      className={`relative flex flex-col ${center ? 'justify-center' : 'justify-start'} border-t border-border px-5 py-24 sm:px-8 md:px-16 md:py-28 lg:px-24 ${
        minHeight ? 'min-h-screen' : ''
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="scene-index" aria-hidden="true">
          {index} — {label}
        </span>
        {children}
      </div>
    </section>
  )
}
