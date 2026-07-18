import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
}

const PARTICLES_PER_BURST = 16
const LINK_DISTANCE = 90
const PARTICLE_SPEED = 1.6
const FADE_RATE = 0.012
// Bounds the worst case for the O(n²) per-burst distance check: even if
// someone clicks rapidly, only this many bursts animate concurrently — the
// oldest is dropped immediately (not faded) once the cap is hit.
const MAX_CONCURRENT_BURSTS = 6

/**
 * On click anywhere in the app, spawns a small burst of points at the click
 * position that drift apart and draw connecting lines between nearby points
 * — like a tiny constellation — then fade out. Purely decorative: it never
 * intercepts the click itself (canvas is pointer-events-none), and is
 * skipped entirely under prefers-reduced-motion.
 *
 * The animation loop only runs while at least one burst is alive — it does
 * not spin a requestAnimationFrame loop indefinitely in the background.
 */
export default function ClickConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const burstsRef = useRef<Particle[][]>([])
  const rafRef = useRef<number>()
  const loopRunningRef = useRef(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent')
      .trim()

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      burstsRef.current = burstsRef.current.filter((particles) => {
        for (const p of particles) {
          p.x += p.vx
          p.y += p.vy
          p.alpha -= FADE_RATE
        }

        const alive = particles.filter((p) => p.alpha > 0)

        // Connecting lines between nearby particles in this burst
        for (let i = 0; i < alive.length; i++) {
          for (let j = i + 1; j < alive.length; j++) {
            const a = alive[i]
            const b = alive[j]
            const dist = Math.hypot(a.x - b.x, a.y - b.y)
            if (dist < LINK_DISTANCE) {
              const lineAlpha = (1 - dist / LINK_DISTANCE) * Math.min(a.alpha, b.alpha) * 0.6
              ctx.strokeStyle = `hsl(${accentColor} / ${lineAlpha})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }

        // Particle dots
        for (const p of alive) {
          ctx.fillStyle = `hsl(${accentColor} / ${p.alpha})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.75, 0, Math.PI * 2)
          ctx.fill()
        }

        particles.length = 0
        particles.push(...alive)
        return particles.length > 0
      })

      // Only keep the loop alive while something is actually animating.
      if (burstsRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        loopRunningRef.current = false
      }
    }

    const ensureLoopRunning = () => {
      if (loopRunningRef.current) return
      loopRunningRef.current = true
      rafRef.current = requestAnimationFrame(tick)
    }

    const spawnBurst = (x: number, y: number) => {
      const particles: Particle[] = Array.from({ length: PARTICLES_PER_BURST }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = PARTICLE_SPEED * (0.4 + Math.random() * 0.8)
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
        }
      })
      burstsRef.current.push(particles)
      if (burstsRef.current.length > MAX_CONCURRENT_BURSTS) {
        burstsRef.current.shift()
      }
      ensureLoopRunning()
    }

    const onClick = (e: MouseEvent) => {
      spawnBurst(e.clientX, e.clientY)
    }
    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', onClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      loopRunningRef.current = false
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[250]"
    />
  )
}
