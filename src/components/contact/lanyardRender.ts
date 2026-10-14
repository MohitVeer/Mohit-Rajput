import type { Vec } from './lanyardPhysics'

interface StrapPalette {
  base: string
  edge: string
  sheen: string
  stitch: string
  shadow: string
}

export const STRAP_PALETTES: Record<'dark' | 'light', StrapPalette> = {
  dark: {
    base: '#101013',
    edge: 'rgba(255,255,255,0.2)',
    sheen: 'rgba(255,255,255,0.06)',
    stitch: 'rgba(255,255,255,0.24)',
    shadow: 'rgba(0,0,0,0)',
  },
  light: {
    base: '#2d5fd3',
    edge: 'rgba(8,24,84,0.5)',
    sheen: 'rgba(255,255,255,0.16)',
    stitch: 'rgba(255,255,255,0.45)',
    shadow: 'rgba(15,30,80,0.28)',
  },
}

const STRAP_WIDTH = 46
const LOGO_HEIGHT = 25
const PERIOD = 160

function catmull(p0: Vec, p1: Vec, p2: Vec, p3: Vec, t: number): Vec {
  const t2 = t * t
  const t3 = t2 * t
  return {
    x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  }
}

function smooth(points: Vec[], perSegment: number): Vec[] {
  const out: Vec[] = []
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    for (let s = 0; s < perSegment; s += 1) out.push(catmull(p0, p1, p2, p3, s / perSegment))
  }
  out.push({ x: points[points.length - 1].x, y: points[points.length - 1].y })
  return out
}

export function makeTile(logo: HTMLImageElement, density: number): HTMLCanvasElement {
  const tile = document.createElement('canvas')
  tile.width = Math.ceil(PERIOD * density)
  tile.height = Math.ceil(STRAP_WIDTH * density)
  const ctx = tile.getContext('2d')
  if (ctx) {
    ctx.scale(density, density)
    const width = LOGO_HEIGHT * (logo.naturalWidth / logo.naturalHeight)
    ctx.drawImage(logo, (PERIOD - width) / 2, (STRAP_WIDTH - LOGO_HEIGHT) / 2, width, LOGO_HEIGHT)
  }
  return tile
}

function offsetLine(points: Vec[], normals: Vec[], distance: number): Vec[] {
  return points.map((p, i) => ({ x: p.x + normals[i].x * distance, y: p.y + normals[i].y * distance }))
}

function trace(ctx: CanvasRenderingContext2D, points: Vec[]) {
  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y)
}

export function drawStrap(ctx: CanvasRenderingContext2D, raw: Vec[], palette: StrapPalette, tile: HTMLCanvasElement | null) {
  const points = smooth(raw, 8)
  const normals: Vec[] = []
  const arc: number[] = [0]
  for (let i = 0; i < points.length; i += 1) {
    const before = points[Math.max(0, i - 1)]
    const after = points[Math.min(points.length - 1, i + 1)]
    const length = Math.hypot(after.x - before.x, after.y - before.y) || 1
    normals.push({ x: -(after.y - before.y) / length, y: (after.x - before.x) / length })
    if (i > 0) arc.push(arc[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y))
  }
  const half = STRAP_WIDTH / 2
  const left = offsetLine(points, normals, half)
  const right = offsetLine(points, normals, -half)

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(left[0].x, left[0].y)
  for (let i = 1; i < left.length; i += 1) ctx.lineTo(left[i].x, left[i].y)
  for (let i = right.length - 1; i >= 0; i -= 1) ctx.lineTo(right[i].x, right[i].y)
  ctx.closePath()
  ctx.shadowColor = palette.shadow
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 4
  ctx.fillStyle = palette.base
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.lineWidth = 1
  ctx.strokeStyle = palette.edge
  ctx.stroke()
  ctx.clip()

  trace(ctx, points)
  ctx.lineWidth = STRAP_WIDTH * 0.5
  ctx.lineCap = 'butt'
  ctx.strokeStyle = palette.sheen
  ctx.stroke()

  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1
  ctx.strokeStyle = palette.stitch
  trace(ctx, offsetLine(points, normals, half - 4))
  ctx.stroke()
  trace(ctx, offsetLine(points, normals, -(half - 4)))
  ctx.stroke()
  ctx.setLineDash([])

  if (tile) {
    const total = arc[arc.length - 1]
    for (let s = PERIOD * 0.42; s < total - 26; s += PERIOD) {
      let i = 1
      while (i < arc.length - 1 && arc[i] < s) i += 1
      const span = arc[i] - arc[i - 1] || 1
      const t = (s - arc[i - 1]) / span
      const x = points[i - 1].x + (points[i].x - points[i - 1].x) * t
      const y = points[i - 1].y + (points[i].y - points[i - 1].y) * t
      const angle = Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x)
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.drawImage(tile, -PERIOD / 2, -half, PERIOD, STRAP_WIDTH)
      ctx.restore()
    }
  }
  ctx.restore()
}
