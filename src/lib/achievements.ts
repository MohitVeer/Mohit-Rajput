import type { CertGroupRow, ExperienceRow, SuperbadgeRow } from './contentApi'
import { certificateImage, certificateThumb, credentialFor, VERIFY_URL } from '../data/credentials'
import { profile } from '../data/profile'
import { HERO_KEYS, heroThumb } from './heroShowcase'
import type { TrailheadData } from './siteSettings'

export type AchievementKind = 'certification' | 'superbadge' | 'trailhead' | 'award'
export type SortOrder = 'newest' | 'oldest'

export interface Achievement {
  id: string
  kind: AchievementKind
  label: string
  title: string
  issuer: string
  group?: string
  image: string | null
  thumb?: string | null
  badge: string | null
  issued?: string
  time?: number
  credentialId?: string
  fileUrl?: string
  url: string
  description?: string
}

export const KIND_PLURAL: Record<AchievementKind, string> = {
  certification: 'Certifications',
  superbadge: 'Superbadges',
  trailhead: 'Trailhead',
  award: 'Awards',
}

const MONTHS: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 }

export function parseWhen(value?: string): number | undefined {
  if (!value) return undefined
  const named = value.match(/([A-Za-z]{3})[a-z]*\.?\s+(?:(\d{1,2}),?\s+)?(\d{4})/)
  if (named) {
    const month = MONTHS[named[1].toLowerCase()]
    if (month !== undefined) return Date.UTC(Number(named[3]), month, Number(named[2] ?? 1))
  }
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const shortFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
const longFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

function formatShortDate(time: number): string {
  return shortFormat.format(time)
}

export function formatLongDate(time: number): string {
  return longFormat.format(time)
}

export function splitAward(text: string): { title: string; description?: string } {
  if (text.includes(' — ')) {
    const [title, ...rest] = text.split(' — ')
    return { title: title.trim(), description: rest.join(' — ').trim() }
  }
  if (text.length <= 48) return { title: text.trim() }
  const title = text.split(/\s+(?:from|for|by)\s+/i)[0].trim()
  return { title, description: text.trim() }
}

function certLabel(group: string): string {
  if (/internship/i.test(group)) return 'Internship'
  if (/course|training/i.test(group)) return 'Course'
  return 'Certification'
}

export function buildAchievements(groups: CertGroupRow[], badges: SuperbadgeRow[], jobs: ExperienceRow[], trailhead: TrailheadData): Achievement[] {
  const items: Achievement[] = []

  for (const group of groups) {
    for (const cert of group.certs) {
      const meta = credentialFor(cert.fileUrl)
      const preview = cert.preview || null
      const issued = cert.issued || meta?.issued
      items.push({
        id: `cert-${cert.name}`,
        kind: 'certification',
        label: certLabel(group.title),
        title: cert.name.replace(/^Salesforce Certified /, '').replace(/^Salesforce /, ''),
        issuer: cert.issuer || 'Salesforce',
        group: group.title,
        image: preview ?? certificateImage(cert.fileUrl),
        thumb: preview ? preview.replace(/\.webp$/i, '-sm.webp') : certificateThumb(cert.fileUrl),
        badge: cert.image || null,
        issued,
        time: parseWhen(issued),
        credentialId: cert.credentialId || meta?.credentialId,
        fileUrl: cert.fileUrl || undefined,
        url: cert.verifyUrl || (cert.issuer ? '' : VERIFY_URL),
        description: cert.description || cert.name,
      })
    }
  }

  for (const badge of badges) {
    items.push({
      id: `badge-${badge.title}`,
      kind: 'superbadge',
      label: 'Superbadge',
      title: badge.title.replace(/^Superbadge: /, ''),
      issuer: 'Salesforce Trailhead',
      image: null,
      badge: badge.image,
      url: badge.url,
      description: badge.description,
    })
  }

  items.push(
    {
      id: 'trail-rank',
      kind: 'trailhead',
      label: 'Trailhead',
      title: trailhead.rank,
      issuer: 'Salesforce Trailhead',
      image: null,
      badge: trailhead.rankImage,
      url: profile.trailblazerUrl,
      description: `${trailhead.badges} badges · ${trailhead.points} points · ${trailhead.trails} trails`,
    },
    {
      id: 'trail-agentblazer',
      kind: 'trailhead',
      label: 'Trailhead',
      title: trailhead.status,
      issuer: 'Salesforce Trailhead',
      image: null,
      badge: trailhead.agentblazerImage,
      url: profile.trailblazerUrl,
      description: 'Earned by completing the required Agentforce learning paths on Trailhead.',
    },
  )

  for (const job of jobs) {
    for (const award of job.achievements) {
      const { title, description } = splitAward(award)
      items.push({
        id: `award-${job.company}-${title}`,
        kind: 'award',
        label: 'Award',
        title,
        issuer: job.company,
        image: null,
        badge: null,
        issued: job.period,
        time: parseWhen(job.period),
        url: '/experience',
        description,
      })
    }
  }

  return items
}

export function achievementDate(item: Achievement): string | undefined {
  if (item.kind === 'award') return item.issued
  return item.time === undefined ? undefined : formatShortDate(item.time)
}

export function sortAchievements(items: Achievement[], order: SortOrder): Achievement[] {
  const dated = items.filter((item) => item.time !== undefined)
  const undated = items.filter((item) => item.time === undefined)
  dated.sort((a, b) => (order === 'newest' ? (b.time as number) - (a.time as number) : (a.time as number) - (b.time as number)))
  return [...dated, ...undated]
}

export function countByKind(items: Achievement[]): Record<AchievementKind, number> {
  const counts: Record<AchievementKind, number> = { certification: 0, superbadge: 0, trailhead: 0, award: 0 }
  for (const item of items) counts[item.kind] += 1
  return counts
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function pickShowcase(items: Achievement[], count: number, seed: number): Achievement[] {
  const random = seededRandom(seed)
  const withImage = items.filter((item) => item.image)
  const pinned = HERO_KEYS.map((key) => withImage.find((item) => item.thumb === heroThumb(key))).filter((item): item is Achievement => item !== undefined)
  const rest = withImage
    .filter((item) => !pinned.includes(item))
    .map((item) => ({ item, key: random() }))
    .sort((a, b) => a.key - b.key)
    .map((entry) => entry.item)
  const picks = [...pinned, ...rest].slice(0, count)
  for (let index = picks.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1))
    ;[picks[index], picks[swap]] = [picks[swap], picks[index]]
  }
  return picks
}
