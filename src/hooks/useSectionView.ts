import { useEffect } from 'react'
import { trackEvent } from '../lib/analytics'

/**
 * Fires one analytics event the first time the section with this id
 * scrolls into view — e.g. "Contact section viewed". Only once per page
 * load (not once per scroll-into-view), and skipped entirely if opted out
 * (trackEvent already no-ops when tracking is disabled).
 */
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
