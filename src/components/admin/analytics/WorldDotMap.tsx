import { useState } from 'react'
import type { CityRow } from '../../../lib/adminApi'

const WIDTH = 720
const HEIGHT = 340

function project(lat: number, lon: number) {
  const x = ((lon + 180) / 360) * WIDTH
  const y = ((90 - lat) / 180) * HEIGHT
  return { x, y }
}

export default function WorldDotMap({ cities }: { cities: CityRow[] }) {
  const [hovered, setHovered] = useState<CityRow | null>(null)
  const plotted = cities.filter((c) => c.latitude !== null && c.longitude !== null)
  const maxSessions = Math.max(1, ...plotted.map((c) => c.sessions))

  if (plotted.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">No visitor location data yet</p>
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full rounded-lg border border-border bg-secondary/40"
        role="img"
        aria-label="Visitor locations by approximate city"
      >
        {}
        {Array.from({ length: 7 }, (_, i) => (i * WIDTH) / 6).map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={HEIGHT} stroke="hsl(var(--border))" strokeWidth={1} />
        ))}
        {Array.from({ length: 5 }, (_, i) => (i * HEIGHT) / 4).map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={WIDTH} y2={y} stroke="hsl(var(--border))" strokeWidth={1} />
        ))}
        <line x1={0} y1={HEIGHT / 2} x2={WIDTH} y2={HEIGHT / 2} stroke="hsl(var(--border))" strokeWidth={1.5} />

        {plotted.map((c) => {
          const { x, y } = project(Number(c.latitude), Number(c.longitude))
          const r = 3 + (Math.sqrt(c.sessions / maxSessions) * 12)
          return (
            <circle
              key={`${c.city}-${c.country}`}
              cx={x}
              cy={y}
              r={r}
              fill="hsl(var(--accent) / 0.35)"
              stroke="hsl(var(--accent))"
              strokeWidth={1}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={() => setHovered(c)}
              onMouseLeave={() => setHovered((h) => (h === c ? null : h))}
            />
          )
        })}
      </svg>

      {hovered && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-card">
          <p className="font-semibold text-foreground">
            {hovered.city}, {hovered.country}
          </p>
          <p className="mt-0.5 text-muted-foreground">
            {hovered.sessions.toLocaleString()} session{hovered.sessions === 1 ? '' : 's'} · approximate location
          </p>
        </div>
      )}
    </div>
  )
}
