import { Fragment, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'

export default function HoverScrambleText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text)
  const [scrambling, setScrambling] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    setDisplay(text)
  }, [text])

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current)
    },
    [],
  )

  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let iteration = 0
    setScrambling(true)
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) return text[index]
            if (letter === ' ' || letter === '\n') return letter
            return LETTERS[Math.floor(Math.random() * LETTERS.length)]
          })
          .join(''),
      )
      if (iteration >= text.length) {
        setScrambling(false)
        if (timer.current) window.clearInterval(timer.current)
      }
      iteration += 2
    }, 30)
  }

  const lines = display.split('\n')

  return (
    <span
      onMouseEnter={start}
      className={cn(
        'cursor-default transition-colors duration-300',
        scrambling && 'text-primary/80',
        'hover:bg-gradient-to-r hover:from-primary hover:to-purple-500 hover:bg-clip-text hover:text-transparent',
        className,
      )}
    >
      <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
      <span aria-hidden="true">
        {lines.map((line, i) => (
          <Fragment key={i}>
            {line}
            {i !== lines.length - 1 && <br className="hidden md:block" />}
          </Fragment>
        ))}
      </span>
    </span>
  )
}
