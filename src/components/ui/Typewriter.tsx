import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface TypewriterProps {
  phrases: string[]
  className?: string
}

const TYPING = 70
const DELETING = 35
const PAUSE = 1800

export default function Typewriter({ phrases, className }: TypewriterProps) {
  const reduce = useReducedMotion()
  const [text, setText] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) return
    const full = phrases[index % phrases.length]
    const timer = window.setTimeout(
      () => {
        if (!deleting && text === full) {
          setDeleting(true)
          return
        }
        if (deleting && text === '') {
          setDeleting(false)
          setIndex((value) => value + 1)
          return
        }
        setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1))
      },
      !deleting && text === full ? PAUSE : deleting ? DELETING : TYPING,
    )
    return () => window.clearTimeout(timer)
  }, [text, deleting, index, phrases, reduce])

  return (
    <span aria-hidden="true" className={className}>
      {reduce ? phrases[0] : text}
      {!reduce && <span className="animate-pulse">|</span>}
    </span>
  )
}
