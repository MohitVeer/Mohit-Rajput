import { useEffect, useRef } from 'react'
import { useTheme } from '../theme/useTheme'

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

const SPARK_SIZE = 10
const SPARK_RADIUS = 15
const SPARK_COUNT = 8
const DURATION = 400
const MAX_DRAG = 12

const ease = (t: number) => t * (2 - t)

export default function ClickSpark() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const colorRef = useRef('#ffffff')
  colorRef.current = resolvedTheme === 'dark' ? '#ffffff' : '#171717'

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let sparks: Spark[] = []
    let frame = 0
    let width = 0
    let height = 0
    let ratio = 1

    const resize = () => {
      ratio = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
    }

    const draw = (timestamp: number) => {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = colorRef.current
      ctx.lineWidth = 2

      sparks = sparks.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= DURATION) return false
        const eased = ease(elapsed / DURATION)
        const distance = eased * SPARK_RADIUS
        const length = SPARK_SIZE * (1 - eased)
        ctx.beginPath()
        ctx.moveTo(spark.x + distance * Math.cos(spark.angle), spark.y + distance * Math.sin(spark.angle))
        ctx.lineTo(spark.x + (distance + length) * Math.cos(spark.angle), spark.y + (distance + length) * Math.sin(spark.angle))
        ctx.stroke()
        return true
      })

      frame = sparks.length > 0 ? window.requestAnimationFrame(draw) : 0
    }

    let downX = 0
    let downY = 0

    const press = (event: PointerEvent) => {
      downX = event.clientX
      downY = event.clientY
    }

    const burst = (event: PointerEvent) => {
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
      if (Math.hypot(event.clientX - downX, event.clientY - downY) > MAX_DRAG) return
      const startTime = performance.now()
      for (let index = 0; index < SPARK_COUNT; index++) {
        sparks.push({ x: event.clientX, y: event.clientY, angle: (2 * Math.PI * index) / SPARK_COUNT, startTime })
      }
      if (!frame) frame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('pointerdown', press, { passive: true })
    document.addEventListener('pointerup', burst, { passive: true })
    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('pointerdown', press)
      document.removeEventListener('pointerup', burst)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[250] h-full w-full" />
}
