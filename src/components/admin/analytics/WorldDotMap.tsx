import { useState } from 'react'
import type { CityRow } from '../../../lib/adminApi'
import { WORLD_LAND_PATH } from './worldLandPath'

const WIDTH = 720
const HEIGHT = 340

function project(lat: number, lon: number) {
  const x = ((lon + 180) / 360) * WIDTH
  const y = ((90 - lat) / 180) * HEIGHT
  return { x, y }
}

/**
 * Lightweight visitor-density map: a real (if simplified) world landmass
 * silhouette — baked-in path data, no mapping-library dependency — with
 * one dot per city sized by session count. Kept intentionally simple so
 * it stays fast and never pulls in a mapping package just for an
 * admin-only chart.
 */
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
        aria-label="Visitor locations by approximate city, plotted on a world map"
      >
        <path d={WORLD_LAND_PATH} fill="hsl(var(--border))" stroke="none" />

        {plotted.map((c) => {
          const { x, y } = project(Number(c.latitude), Number(c.longitude))
          const r = 3 + (Math.sqrt(c.sessions / maxSessions) * 12)
          return (
            <circle
              key={`${c.city}-${c.country}`}
              cx={x}
              cy={y}
              r={r}
              fill="hsl(var(--accent) / 0.4)"
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
