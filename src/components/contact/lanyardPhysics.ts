export interface Vec {
  x: number
  y: number
}

interface Particle {
  x: number
  y: number
  px: number
  py: number
  inverseMass: number
}

interface Constraint {
  a: number
  b: number
  length: number
  stiffness: number
}

export const STAGE_WIDTH = 380
export const STAGE_HEIGHT = 620
export const CLIP_LENGTH = 30
export const CARD_WIDTH = 220
export const CARD_HEIGHT = 330

const SEGMENTS = 7
const ANCHOR_SPREAD = 82
const ANCHOR_Y = -16
export const REST_JOINT_Y = 214
const GRAVITY = 1900
const DAMPING = 0.991
const ITERATIONS = 14
const STEP = 1 / 60
const MAX_STEP_MOVE = 16
const PAD_X = 46
const STRAP_LENGTH = Math.hypot(ANCHOR_SPREAD, REST_JOINT_Y - ANCHOR_Y)
const MAX_REACH = STRAP_LENGTH + (CLIP_LENGTH + CARD_HEIGHT) / 2 - 12

export class Lanyard {
  readonly particles: Particle[] = []
  readonly constraints: Constraint[] = []
  private readonly leftStart: number
  private readonly rightStart: number
  private readonly joint: number
  private readonly middle: number
  private readonly bottom: number
  private grabbed = -1
  private target: Vec = { x: 0, y: 0 }
  private offset: Vec = { x: 0, y: 0 }
  private accumulator = 0

  constructor() {
    const left: Vec = { x: STAGE_WIDTH / 2 - ANCHOR_SPREAD, y: ANCHOR_Y }
    const right: Vec = { x: STAGE_WIDTH / 2 + ANCHOR_SPREAD, y: ANCHOR_Y }
    const jointAt: Vec = { x: STAGE_WIDTH / 2, y: REST_JOINT_Y }
    const strapLength = Math.hypot(jointAt.x - left.x, jointAt.y - left.y)
    const segment = strapLength / SEGMENTS

    const chain = (from: Vec): number => {
      const start = this.particles.length
      for (let i = 0; i < SEGMENTS; i += 1) {
        const t = i / SEGMENTS
        this.particles.push(this.make(from.x + (jointAt.x - from.x) * t, from.y + (jointAt.y - from.y) * t, i === 0 ? 0 : 1))
      }
      return start
    }

    this.leftStart = chain(left)
    this.rightStart = chain(right)
    this.joint = this.particles.length
    this.particles.push(this.make(jointAt.x, jointAt.y, 0.7))
    const rod = CLIP_LENGTH + CARD_HEIGHT
    this.middle = this.particles.length
    this.particles.push(this.make(jointAt.x, jointAt.y + rod / 2, 0.45))
    this.bottom = this.particles.length
    this.particles.push(this.make(jointAt.x, jointAt.y + rod, 0.3))

    for (const start of [this.leftStart, this.rightStart]) {
      for (let i = 0; i < SEGMENTS; i += 1) {
        const a = start + i
        const b = i === SEGMENTS - 1 ? this.joint : start + i + 1
        this.constraints.push({ a, b, length: segment, stiffness: 1 })
      }
      for (let i = 0; i < SEGMENTS - 1; i += 1) {
        const a = start + i
        const b = i === SEGMENTS - 2 ? this.joint : start + i + 2
        this.constraints.push({ a, b, length: segment * 1.97, stiffness: 0.12 })
      }
    }
    this.constraints.push({ a: this.joint, b: this.middle, length: rod / 2, stiffness: 1 })
    this.constraints.push({ a: this.middle, b: this.bottom, length: rod / 2, stiffness: 1 })
    this.constraints.push({ a: this.joint, b: this.bottom, length: rod, stiffness: 1 })
  }

  private make(x: number, y: number, inverseMass: number): Particle {
    return { x, y, px: x, py: y, inverseMass }
  }

  get leftStrap(): Vec[] {
    return this.chainPoints(this.leftStart)
  }

  get rightStrap(): Vec[] {
    return this.chainPoints(this.rightStart)
  }

  private chainPoints(start: number): Vec[] {
    const points: Vec[] = []
    for (let i = 0; i < SEGMENTS; i += 1) points.push(this.particles[start + i])
    points.push(this.particles[this.joint])
    return points
  }

  get card(): { x: number; y: number; angle: number } {
    const top = this.particles[this.joint]
    const bottom = this.particles[this.bottom]
    return { x: top.x, y: top.y, angle: Math.atan2(-(bottom.x - top.x), bottom.y - top.y) }
  }

  get cardCenter(): Vec {
    return this.particles[this.middle]
  }

  nudge(dx: number) {
    const bottom = this.particles[this.bottom]
    bottom.x += dx
  }

  grab(point: Vec) {
    const held = this.particles[this.middle]
    this.grabbed = this.middle
    this.offset = { x: held.x - point.x, y: held.y - point.y }
    this.target = { x: held.x, y: held.y }
  }

  drag(point: Vec) {
    const wanted = { x: point.x + this.offset.x, y: point.y + this.offset.y }
    const dx = wanted.x - STAGE_WIDTH / 2
    const dy = wanted.y - ANCHOR_Y
    const reach = Math.hypot(dx, dy)
    const limit = MAX_REACH
    if (reach > limit) {
      wanted.x = STAGE_WIDTH / 2 + (dx / reach) * limit
      wanted.y = ANCHOR_Y + (dy / reach) * limit
    }
    this.target = wanted
  }

  release() {
    this.grabbed = -1
  }

  get dragging(): boolean {
    return this.grabbed !== -1
  }

  get energy(): number {
    let peak = 0
    for (const p of this.particles) peak = Math.max(peak, Math.abs(p.x - p.px) + Math.abs(p.y - p.py))
    return peak
  }

  advance(seconds: number): number {
    this.accumulator = Math.min(this.accumulator + seconds, STEP * 5)
    let steps = 0
    while (this.accumulator >= STEP) {
      this.step()
      this.accumulator -= STEP
      steps += 1
    }
    return steps
  }

  settle(steps: number) {
    for (let i = 0; i < steps; i += 1) this.step()
  }

  private step() {
    const gravity = GRAVITY * STEP * STEP
    for (const p of this.particles) {
      if (p.inverseMass === 0) continue
      let vx = (p.x - p.px) * DAMPING
      let vy = (p.y - p.py) * DAMPING
      const speed = Math.hypot(vx, vy)
      if (speed > MAX_STEP_MOVE) {
        vx = (vx / speed) * MAX_STEP_MOVE
        vy = (vy / speed) * MAX_STEP_MOVE
      }
      p.px = p.x
      p.py = p.y
      p.x += vx
      p.y += vy + gravity
    }

    for (let i = 0; i < ITERATIONS; i += 1) {
      if (this.grabbed !== -1) {
        const p = this.particles[this.grabbed]
        p.x += (this.target.x - p.x) * 0.22
        p.y += (this.target.y - p.y) * 0.22
      }
      for (const c of this.constraints) {
        const a = this.particles[c.a]
        const b = this.particles[c.b]
        const dx = b.x - a.x
        const dy = b.y - a.y
        const distance = Math.hypot(dx, dy) || 0.0001
        const total = a.inverseMass + b.inverseMass
        if (total === 0) continue
        const diff = ((distance - c.length) / distance / total) * c.stiffness
        a.x += dx * diff * a.inverseMass
        a.y += dy * diff * a.inverseMass
        b.x -= dx * diff * b.inverseMass
        b.y -= dy * diff * b.inverseMass
      }
    }

    if (this.grabbed !== -1) {
      const held = this.particles[this.grabbed]
      held.px = held.x - (held.x - held.px) * 0.4
      held.py = held.y - (held.y - held.py) * 0.4
    }

    for (const p of this.particles) {
      if (p.inverseMass === 0) continue
      if (p.x < -PAD_X) {
        p.x = -PAD_X
        p.px = p.x
      } else if (p.x > STAGE_WIDTH + PAD_X) {
        p.x = STAGE_WIDTH + PAD_X
        p.px = p.x
      }
      if (p.y > STAGE_HEIGHT + 20) {
        p.y = STAGE_HEIGHT + 20
        p.py = p.y
      }
    }
  }
}
