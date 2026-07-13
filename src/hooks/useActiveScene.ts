import { useEffect, useState } from 'react'

export interface ActiveScene {
  id: string
  index: string
  label: string
}

const FALLBACK: ActiveScene = { id: 'top', index: '00', label: 'Basecamp' }

/**
 * Watches every element tagged `data-scene` and reports whichever one
 * currently occupies the most viewport space — powers the corner index
 * nav ("03 — Route History") without needing per-scene scroll math.
 */
export function useActiveScene(): ActiveScene {
  const [active, setActive] = useState<ActiveScene>(FALLBACK)

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) {
          const el = visible.target as HTMLElement
          setActive({
            id: el.id,
            index: el.dataset.index ?? '00',
            label: el.dataset.label ?? '',
          })
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return active
}
