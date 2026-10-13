import { useMemo } from 'react'
import { skillGroups } from '../data/profile'
import { fetchSkillGroups, type SkillGroupRow } from '../lib/contentApi'
import { useLiveContent } from './useLiveContent'

export function useSkillGroups(): SkillGroupRow[] {
  const fallback = useMemo<SkillGroupRow[]>(() => skillGroups.map((g, i) => ({ ...g, id: `static-${i}`, sort_order: i })), [])
  return useLiveContent(fetchSkillGroups, fallback)
}
