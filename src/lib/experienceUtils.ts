import type { ExperienceRow } from './contentApi'
import { parseWhen } from './achievements'
import { employerKeyOf, normalizeClient } from '../data/clientProjects'
import { clientNamesFor, type ProjectItem } from './contentModel'

const TECH_VOCABULARY = [
  'LWC',
  'Apex',
  'SOQL',
  'OmniStudio',
  'OmniScript',
  'FlexCard',
  'DataRaptor',
  'Experience Cloud',
  'Marketing Cloud',
  'Health Cloud',
  'Financial Services',
  'Agentforce',
  'SLDS',
  'AMPscript',
  'Litmus',
  'Figma',
  'Adobe XD',
  'InVision',
  'React.js',
  'Vue.js',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Bootstrap',
  'SCSS',
  'Shopify',
  'WCAG',
  'Foundry',
]

export function startYear(period: string): string {
  const match = period.match(/\d{4}/)
  return match ? match[0] : ''
}

export function periodRange(period: string): { start: string; end: string } {
  const [start, end] = period.split(/\s*[—–-]\s*/)
  return { start: start?.trim() ?? period, end: end?.trim() ?? '' }
}

export function extractTech(job: ExperienceRow, limit = 8): string[] {
  const text = job.bullets.join(' \n ')
  const found: string[] = []
  for (const term of TECH_VOCABULARY) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (new RegExp(`(^|[^A-Za-z0-9])${escaped}`, 'i').test(text)) found.push(term)
    if (found.length >= limit) break
  }
  return found
}

export function groupByYear(jobs: ExperienceRow[]): { year: string; jobs: ExperienceRow[] }[] {
  const groups: { year: string; jobs: ExperienceRow[] }[] = []
  for (const job of jobs) {
    const year = startYear(job.period) || 'Earlier'
    const last = groups[groups.length - 1]
    if (last && last.year === year) last.jobs.push(job)
    else groups.push({ year, jobs: [job] })
  }
  return groups
}

export function jobSlug(job: ExperienceRow): string {
  return `${job.company}-${job.role}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function clientsForJob(job: ExperienceRow, projects: ProjectItem[]): string[] {
  const known = clientNamesFor(projects, employerKeyOf(job.company))
  const seen = new Set<string>([job.company.toLowerCase()])
  const merged: string[] = []
  for (const name of [...known, ...job.clients.map(normalizeClient)]) {
    const id = name.toLowerCase()
    if (seen.has(id)) continue
    seen.add(id)
    merged.push(name)
  }
  return merged
}

export function isInternship(job: ExperienceRow): boolean {
  return /intern/i.test(job.role)
}

export function periodMonths(period: string, now: number = Date.now()): number | null {
  const { start, end } = periodRange(period)
  const from = parseWhen(start)
  const to = /present|now|current/i.test(end) ? now : parseWhen(end)
  if (from === undefined || to === undefined) return null
  const a = new Date(from)
  const b = new Date(to)
  const months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) + 1
  return months > 0 ? months : null
}

export function formatDuration(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'}`
  const years = Math.floor(months / 12)
  const rest = months % 12
  const yearText = `${years} ${years === 1 ? 'year' : 'years'}`
  return rest === 0 ? yearText : `${yearText} ${rest} ${rest === 1 ? 'month' : 'months'}`
}
