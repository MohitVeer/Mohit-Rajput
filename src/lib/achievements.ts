import type { CertGroupRow, ExperienceRow, SuperbadgeRow } from './contentApi'
import { certificateImage, credentialFor, VERIFY_URL } from '../data/credentials'
import { profile, trailhead } from '../data/profile'

export type AchievementKind = 'certification' | 'superbadge' | 'trailhead' | 'award'

export interface Achievement {
  id: string
  kind: AchievementKind
  title: string
  issuer: string
  group?: string
  image: string | null
  badge: string | null
  issued?: string
  credentialId?: string
  fileUrl?: string
  url: string
  description?: string
}

export const KIND_LABEL: Record<AchievementKind, string> = {
  certification: 'Certification',
  superbadge: 'Superbadge',
  trailhead: 'Trailhead',
  award: 'Award',
}

export const KIND_PLURAL: Record<AchievementKind, string> = {
  certification: 'Certifications',
  superbadge: 'Superbadges',
  trailhead: 'Trailhead',
  award: 'Awards',
}

function shortDate(value?: string): string | undefined {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
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

export function buildAchievements(groups: CertGroupRow[], badges: SuperbadgeRow[], jobs: ExperienceRow[]): Achievement[] {
  const items: Achievement[] = []

  for (const group of groups) {
    for (const cert of group.certs) {
      const meta = credentialFor(cert.fileUrl)
      items.push({
        id: `cert-${cert.name}`,
        kind: 'certification',
        title: cert.name.replace(/^Salesforce Certified /, '').replace(/^Salesforce /, ''),
        issuer: 'Salesforce',
        group: group.title,
        image: certificateImage(cert.fileUrl),
        badge: cert.image,
        issued: meta?.issued,
        credentialId: meta?.credentialId,
        fileUrl: cert.fileUrl,
        url: VERIFY_URL,
        description: cert.name,
      })
    }
  }

  for (const badge of badges) {
    items.push({
      id: `badge-${badge.title}`,
      kind: 'superbadge',
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
        title,
        issuer: job.company,
        image: null,
        badge: null,
        issued: job.period,
        url: '/experience',
        description,
      })
    }
  }

  return items
}

export function achievementDate(item: Achievement): string | undefined {
  return item.kind === 'award' ? undefined : item.issued ? shortDate(item.issued) : undefined
}
