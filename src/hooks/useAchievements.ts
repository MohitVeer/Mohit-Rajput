import { useMemo } from 'react'
import { certGroups, superbadges } from '../data/profile'
import { fetchCertGroups, fetchSuperbadges, type CertGroupRow, type SuperbadgeRow } from '../lib/contentApi'
import { buildAchievements, type Achievement } from '../lib/achievements'
import { useExperience } from './useExperience'
import { useLiveContent } from './useLiveContent'
import { useTrailhead } from './useSiteSettings'

export function useAchievements(): Achievement[] {
  const certFallback = useMemo<CertGroupRow[]>(
    () =>
      certGroups.map((g, i) => ({
        ...g,
        certs: Array.isArray(g.certs) ? g.certs : [g.certs],
        id: `static-${i}`,
        sort_order: i,
      })),
    [],
  )
  const badgeFallback = useMemo<SuperbadgeRow[]>(() => superbadges.map((s, i) => ({ ...s, id: `static-${i}`, sort_order: i })), [])
  const groups = useLiveContent(fetchCertGroups, certFallback)
  const badges = useLiveContent(fetchSuperbadges, badgeFallback)
  const jobs = useExperience()
  const trailhead = useTrailhead()

  return useMemo(() => buildAchievements(groups, badges, jobs, trailhead), [groups, badges, jobs, trailhead])
}
