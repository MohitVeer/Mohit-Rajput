import { useEffect } from 'react'
import { trackEvent } from '../lib/analytics'

export function useSectionView(sectionId: string, component: string, action: string) {
  useEffect(() => {
    const el = document.getElementById(sectionId)
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent(component, action)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [sectionId, component, action])
}
