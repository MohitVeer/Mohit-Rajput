import { useEffect, useState } from 'react'

export interface ActiveScene {
  id: string
  index: string
  label: string
}

const FALLBACK: ActiveScene = { id: 'top', index: '00', label: 'Home' }

/**
 * Watches every element tagged `data-scene` and reports whichever one
 * currently occupies the most viewport space — powers the corner index
 * nav ("05 — Experience") without needing per-scene scroll math.
 *
 * Several scenes (Trailblazer, Skills, Experience, ...) are behind
 * React.lazy/Suspense, so they don't exist in the DOM yet on first paint.
 * A MutationObserver keeps attaching the IntersectionObserver to new
 * `[data-scene]` nodes as those chunks mount, instead of only the ones
 * present at the very first effect run — otherwise the indicator freezes
 * on the last scene that existed at mount (e.g. "About") forever.
 */
export function useActiveScene(): ActiveScene {
  const [active, setActive] = useState<ActiveScene>(FALLBACK)

  useEffect(() => {
    const observed = new WeakSet<Element>()

    const io = new IntersectionObserver(
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

    const observeNewScenes = () => {
      document.querySelectorAll<HTMLElement>('[data-scene]').forEach((node) => {
        if (!observed.has(node)) {
          observed.add(node)
          io.observe(node)
        }
      })
    }

    observeNewScenes()

    const mo = new MutationObserver(observeNewScenes)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return active
}
