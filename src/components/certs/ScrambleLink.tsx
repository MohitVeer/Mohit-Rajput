import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

interface ScrambleLinkProps {
  href: string
  label: string
  onClick?: () => void
}

export default function ScrambleLink({ href, label, onClick }: ScrambleLinkProps) {
  const [text, setText] = useState(label)
  const running = useRef(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current)
    },
    [],
  )

  const scramble = () => {
    if (running.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    running.current = true
    let iteration = 0
    timer.current = window.setInterval(() => {
      setText(
        label
          .split('')
          .map((letter, index) => (index < iteration || letter === ' ' ? label[index] : CHARS[Math.floor(Math.random() * CHARS.length)]))
          .join(''),
      )
      if (iteration >= label.length) {
        if (timer.current) window.clearInterval(timer.current)
        running.current = false
        setText(label)
      }
      iteration += 1 / 3
    }, 30)
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={scramble}
      onFocus={scramble}
      onClick={onClick}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg transition-all hover:scale-105 hover:shadow-primary/20 active:scale-95"
    >
      <span className="sr-only">{label} (opens in a new tab)</span>
      <span aria-hidden="true" className="relative z-10">
        {text}
      </span>
      <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 group-hover:animate-[move-x_1.5s_infinite]"
      />
    </a>
  )
}
