import { ReactNode } from 'react'

interface SceneProps {
  id: string
  index: string
  label: string
  children: ReactNode
  className?: string
  minHeight?: boolean
}

export default function Scene({
  id,
  index,
  label,
  children,
  className = '',
  minHeight = true,
}: SceneProps) {
  return (
    <section
      id={id}
      data-scene
      data-index={index}
      data-label={label}
      aria-labelledby={`${id}-heading`}
      className={`relative flex flex-col justify-center border-t border-border px-6 py-28 md:px-16 lg:px-24 ${
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
