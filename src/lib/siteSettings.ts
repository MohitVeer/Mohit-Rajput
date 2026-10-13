import { heroTags as builtInHeroTags, stats as builtInStats, trailhead as builtInTrailhead } from '../data/profile'
import type { SettingRow } from './contentApi'

export interface TrailheadData {
  rank: string
  rankImage: string
  agentblazerImage: string
  agentblazerChampionImage: string
  badges: number
  points: string
  trails: number
  status: string
}

export interface StatItem {
  value: string
  label: string
}

export interface SiteSettings {
  trailhead: TrailheadData
  stats: StatItem[]
  heroTags: string[]
}

export const SETTING_KEYS = ['trailhead', 'stats', 'heroTags'] as const
export type SettingKey = (typeof SETTING_KEYS)[number]

export function defaultSettings(): SiteSettings {
  return {
    trailhead: { ...builtInTrailhead },
    stats: builtInStats.map((stat) => ({ ...stat })),
    heroTags: [...builtInHeroTags],
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

const text = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value.trim() || undefined
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return undefined
}

const count = (value: unknown): number | undefined => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.replace(/,/g, '')) : NaN
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

function readTrailhead(raw: unknown, base: TrailheadData): TrailheadData {
  if (!isRecord(raw)) return base
  return {
    rank: text(raw.rank) ?? base.rank,
    rankImage: text(raw.rankImage) ?? base.rankImage,
    agentblazerImage: text(raw.agentblazerImage) ?? base.agentblazerImage,
    agentblazerChampionImage: text(raw.agentblazerChampionImage) ?? base.agentblazerChampionImage,
    badges: count(raw.badges) ?? base.badges,
    points: text(raw.points) ?? base.points,
    trails: count(raw.trails) ?? base.trails,
    status: text(raw.status) ?? base.status,
  }
}

function readStats(raw: unknown, base: StatItem[]): StatItem[] {
  if (!Array.isArray(raw)) return base
  const items = raw.flatMap((entry) => {
    if (!isRecord(entry)) return []
    const value = text(entry.value)
    const label = text(entry.label)
    return value && label ? [{ value, label }] : []
  })
  return items.length > 0 ? items : base
}

function readTags(raw: unknown, base: string[]): string[] {
  if (!Array.isArray(raw)) return base
  const items = raw.map((entry) => text(entry)).filter((entry): entry is string => Boolean(entry))
  return items.length > 0 ? items : base
}

export function resolveSettings(rows: SettingRow[]): SiteSettings {
  const base = defaultSettings()
  const byKey = new Map(rows.map((row) => [row.key, row.value]))
  return {
    trailhead: readTrailhead(byKey.get('trailhead'), base.trailhead),
    stats: readStats(byKey.get('stats'), base.stats),
    heroTags: readTags(byKey.get('heroTags'), base.heroTags),
  }
}

export function statValue(stats: StatItem[], label: string, fallback = ''): string {
  return stats.find((stat) => stat.label === label)?.value ?? fallback
}
