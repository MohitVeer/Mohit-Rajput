import { useEffect, useState } from 'react'

export interface ActiveScene {
  id: string
  index: string
  label: string
}

const FALLBACK: ActiveScene = { id: 'top', index: '00', label: 'Home' }

export function useActiveScene(): ActiveScene {
  const [active, setActive] = useState<ActiveScene>(FALLBACK)

  useEffect(() => {
    const observed = new WeakSet<Element>()
    const crossing = new Set<HTMLElement>()

    const publish = () => {
      const nodes = Array.from(crossing)
      if (nodes.length === 0) return
      const el = nodes.reduce((best, node) => (node.getBoundingClientRect().top > best.getBoundingClientRect().top ? node : best))
      setActive({ id: el.id, index: el.dataset.index ?? '00', label: el.dataset.label ?? '' })
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) crossing.add(el)
          else crossing.delete(el)
        })
        publish()
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
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
