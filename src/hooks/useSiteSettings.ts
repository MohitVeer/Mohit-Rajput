import { useMemo } from 'react'
import { fetchSettings, type SettingRow } from '../lib/contentApi'
import { resolveSettings, type SiteSettings } from '../lib/siteSettings'
import { useLiveContent } from './useLiveContent'

const NO_ROWS: SettingRow[] = []

export function useSiteSettings(): SiteSettings {
  const rows = useLiveContent(fetchSettings, NO_ROWS)
  return useMemo(() => resolveSettings(rows), [rows])
}

export const useTrailhead = () => useSiteSettings().trailhead
export const useStats = () => useSiteSettings().stats
export const useHeroTags = () => useSiteSettings().heroTags
