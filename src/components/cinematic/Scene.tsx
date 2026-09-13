import { CSSProperties, ReactNode } from 'react'

interface SceneProps {
  id: string
  index: string
  label: string
  children: ReactNode
  className?: string
  minHeight?: boolean
  center?: boolean   
}

const AURORA_PAIRS: Array<[string, string]> = [
  ['226 100% 65%', '38 96% 62%'], 
  ['262 83% 68%', '226 100% 65%'], 
  ['38 96% 62%', '262 83% 68%'], 
]

export default function Scene({ id, index, label, children, className = '', minHeight = true, center = false }: SceneProps) {
  const [a, b] = AURORA_PAIRS[Number.parseInt(index, 10) % AURORA_PAIRS.length]
  const auroraVars = { '--aurora-a': a, '--aurora-b': b } as CSSProperties

  return (
    <section
      id={id}
      data-scene
      data-index={index}
      data-label={label}
      aria-labelledby={`${id}-heading`}
      style={auroraVars}
      className={`relative flex flex-col ${center ? 'justify-center' : 'justify-start'} border-t border-border px-5 py-24 sm:px-8 md:px-16 md:py-28 lg:px-24 ${
        minHeight ? 'min-h-screen' : ''
      } ${className}`}
    >
      <div className="aurora-field" />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <span className="scene-index" aria-hidden="true">
          {index} — {label}
        </span>
        {children}
      </div>
    </section>
  )
}
