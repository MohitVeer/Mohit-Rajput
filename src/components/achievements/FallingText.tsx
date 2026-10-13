import { Fragment, useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import type MatterJs from 'matter-js'

interface FallingTextProps {
  words: string[]
}

interface Session {
  stop: () => void
}

type MouseHandlers = Record<'mousemove' | 'mousedown' | 'mouseup' | 'mousewheel', EventListener>

const GRAVITY = 0.8
const STIFFNESS = 0.2

export default function FallingText({ words }: FallingTextProps) {
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduce) return
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    let disposed = false
    let wanted = false
    let starting = false
    let session: Session | null = null
    let resizeTimer = 0

    const spans = () => Array.from(text.querySelectorAll<HTMLElement>('[data-word]'))

    const halt = () => {
      if (!session) return
      session.stop()
      session = null
      spans().forEach((span) => {
        span.style.cssText = ''
      })
    }

    const start = async () => {
      if (session || starting || disposed) return
      starting = true
      const loaded = await import('matter-js')
      starting = false
      if (disposed || !wanted || session) return

      const Matter: typeof MatterJs = 'default' in loaded ? (loaded.default as typeof MatterJs) : (loaded as unknown as typeof MatterJs)
      const { Engine, Runner, World, Bodies, Body, Mouse, MouseConstraint } = Matter

      const bounds = container.getBoundingClientRect()
      if (bounds.width <= 0 || bounds.height <= 0) return

      const engine = Engine.create()
      engine.gravity.y = GRAVITY

      const wall = { isStatic: true }
      const walls = [
        Bodies.rectangle(bounds.width / 2, bounds.height + 25, bounds.width, 50, wall),
        Bodies.rectangle(-25, bounds.height / 2, 50, bounds.height, wall),
        Bodies.rectangle(bounds.width + 25, bounds.height / 2, 50, bounds.height, wall),
        Bodies.rectangle(bounds.width / 2, -25, bounds.width, 50, wall),
      ]

      const pairs = spans().map((element) => {
        const rect = element.getBoundingClientRect()
        const body = Bodies.rectangle(rect.left - bounds.left + rect.width / 2, rect.top - bounds.top + rect.height / 2, rect.width, rect.height, {
          restitution: 0.8,
          frictionAir: 0.01,
          friction: 0.2,
        })
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 })
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05)
        return { element, body }
      })

      pairs.forEach(({ element, body }) => {
        element.style.position = 'absolute'
        element.style.left = '0'
        element.style.top = '0'
        element.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%)`
      })

      const extras: MatterJs.MouseConstraint[] = []
      let detach = () => {}
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const mouse = Mouse.create(container)
        const handlers = mouse as unknown as MouseHandlers
        container.removeEventListener('wheel', handlers.mousewheel)
        detach = () => {
          container.removeEventListener('mousemove', handlers.mousemove)
          container.removeEventListener('mousedown', handlers.mousedown)
          container.removeEventListener('mouseup', handlers.mouseup)
        }
        extras.push(MouseConstraint.create(engine, { mouse, constraint: { stiffness: STIFFNESS, render: { visible: false } } }))
      }

      World.add(engine.world, [...walls, ...extras, ...pairs.map((pair) => pair.body)])

      const runner = Runner.create()
      Runner.run(runner, engine)

      let frame = 0
      const sync = () => {
        pairs.forEach(({ element, body }) => {
          element.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`
        })
        frame = window.requestAnimationFrame(sync)
      }
      sync()

      session = {
        stop: () => {
          window.cancelAnimationFrame(frame)
          detach()
          Runner.stop(runner)
          World.clear(engine.world, false)
          Engine.clear(engine)
        },
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        wanted = entry.isIntersecting
        if (wanted) void start()
        else halt()
      },
      { threshold: 0.1 },
    )
    observer.observe(container)

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (!session) return
        halt()
        if (wanted) void start()
      }, 250)
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
      halt()
    }
  }, [reduce])

  return (
    <>
      <ul className="sr-only">
        {words.map((word) => (
          <li key={word}>{word}</li>
        ))}
      </ul>
      <div ref={containerRef} aria-hidden="true" className="relative z-[1] h-[400px] w-full text-center">
        <div ref={textRef} className="inline-block text-2xl font-black leading-[1.4] text-foreground">
          {words.map((word) => (
            <Fragment key={word}>
              <span data-word className="mx-1 inline-block select-none [@media(hover:hover)_and_(pointer:fine)]:cursor-grab [@media(hover:hover)_and_(pointer:fine)]:active:cursor-grabbing">
                {word}
              </span>{' '}
            </Fragment>
          ))}
        </div>
      </div>
    </>
  )
}
