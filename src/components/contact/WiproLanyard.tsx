import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import wiproMark from '../../assets/wipro/wipro-secondary-white.svg'
import { useTheme } from '../../theme/useTheme'
import WiproIdCard from './WiproIdCard'
import { CARD_WIDTH, Lanyard, REST_JOINT_Y, STAGE_HEIGHT, STAGE_WIDTH, type Vec } from './lanyardPhysics'
import { drawStrap, makeTile, STRAP_PALETTES } from './lanyardRender'

const SLEEP_AFTER = 90
const REST_ENERGY = 0.02

export default function WiproLanyard() {
  const reduce = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const outer = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const theme = useRef(resolvedTheme)
  const redraw = useRef<() => void>(() => {})
  const [scale, setScale] = useState(1)

  theme.current = resolvedTheme

  useEffect(() => {
    const node = outer.current
    if (!node) return
    const measure = () => setScale(Math.min(1, node.clientWidth / STAGE_WIDTH))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const surface = canvas.current
    const cardNode = card.current
    const stageNode = stage.current
    const ctx = surface?.getContext('2d')
    if (!surface || !cardNode || !stageNode || !ctx) return

    const density = Math.min(window.devicePixelRatio || 1, 2.5)
    surface.width = Math.round(STAGE_WIDTH * density)
    surface.height = Math.round(STAGE_HEIGHT * density)

    const sim = new Lanyard()
    let tile: HTMLCanvasElement | null = null
    let frame = 0
    let last = 0
    let calm = 0
    let visible = true
    let disposed = false

    const render = () => {
      ctx.setTransform(density, 0, 0, density, 0, 0)
      ctx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT)
      const palette = STRAP_PALETTES[theme.current === 'dark' ? 'dark' : 'light']
      drawStrap(ctx, sim.leftStrap, palette, tile)
      drawStrap(ctx, sim.rightStrap, palette, tile)
      const pose = sim.card
      cardNode.style.transform = `translate(${pose.x}px, ${pose.y}px) rotate(${pose.angle}rad)`
    }

    const tick = (now: number) => {
      frame = 0
      if (disposed || !visible || document.hidden) return
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60
      last = now
      sim.advance(delta)
      render()
      calm = sim.dragging || sim.energy > REST_ENERGY ? 0 : calm + 1
      if (calm < SLEEP_AFTER) frame = window.requestAnimationFrame(tick)
    }

    const wake = () => {
      calm = 0
      if (frame || disposed || !visible || document.hidden) return
      last = 0
      frame = window.requestAnimationFrame(tick)
    }

    redraw.current = render

    const logo = new Image()
    logo.src = wiproMark
    logo
      .decode()
      .then(() => {
        if (disposed) return
        tile = makeTile(logo, density)
        render()
      })
      .catch(() => {})

    if (reduce) {
      sim.settle(420)
      render()
      return () => {
        disposed = true
        redraw.current = () => {}
      }
    }

    sim.settle(60)
    sim.nudge(26)
    render()
    wake()

    const toStage = (event: PointerEvent): Vec => {
      const rect = stageNode.getBoundingClientRect()
      const ratio = rect.width / STAGE_WIDTH || 1
      return { x: (event.clientX - rect.left) / ratio, y: (event.clientY - rect.top) / ratio }
    }

    const down = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return
      cardNode.setPointerCapture(event.pointerId)
      sim.grab(toStage(event))
      cardNode.style.cursor = 'grabbing'
      wake()
    }
    const move = (event: PointerEvent) => {
      if (!sim.dragging) return
      sim.drag(toStage(event))
      wake()
    }
    const up = (event: PointerEvent) => {
      if (!sim.dragging) return
      sim.release()
      if (cardNode.hasPointerCapture(event.pointerId)) cardNode.releasePointerCapture(event.pointerId)
      cardNode.style.cursor = 'grab'
      wake()
    }

    cardNode.addEventListener('pointerdown', down)
    cardNode.addEventListener('pointermove', move)
    cardNode.addEventListener('pointerup', up)
    cardNode.addEventListener('pointercancel', up)

    const watcher = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) wake()
      },
      { threshold: 0.05 },
    )
    watcher.observe(stageNode)
    const onVisibility = () => {
      if (!document.hidden) wake()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      disposed = true
      redraw.current = () => {}
      if (frame) window.cancelAnimationFrame(frame)
      watcher.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      cardNode.removeEventListener('pointerdown', down)
      cardNode.removeEventListener('pointermove', move)
      cardNode.removeEventListener('pointerup', up)
      cardNode.removeEventListener('pointercancel', up)
    }
  }, [reduce])

  useEffect(() => {
    redraw.current()
  }, [resolvedTheme])

  return (
    <div ref={outer} aria-hidden="true" className="relative mx-auto w-full max-w-[380px]" style={{ height: STAGE_HEIGHT * scale }}>
      <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-2 w-48 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent blur-[2px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[3px] w-24 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-foreground/40 to-transparent" />
      <div ref={stage} className="absolute left-0 top-0 origin-top-left" style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}>
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
        <div
          ref={card}
          className={reduce ? 'absolute left-0 top-0 select-none' : 'absolute left-0 top-0 cursor-grab touch-pan-y select-none will-change-transform'}
          style={{ width: CARD_WIDTH, marginLeft: -CARD_WIDTH / 2, transformOrigin: `${CARD_WIDTH / 2}px 0px`, transform: `translate(${STAGE_WIDTH / 2}px, ${REST_JOINT_Y}px)` }}
        >
          <WiproIdCard />
        </div>
      </div>
    </div>
  )
}
