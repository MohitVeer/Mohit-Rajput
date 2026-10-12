import type { ExperienceRow } from './contentApi'
import { clientProjects, employerKeyFor, normalizeClient } from '../data/clientProjects'

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
  'React.js',
  'Vue.js',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Bootstrap',
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

export function clientsForJob(job: ExperienceRow): string[] {
  const key = employerKeyFor(job.company)
  const known = key ? clientProjects.filter((project) => project.employerKey === key && project.kind === 'client').map((project) => project.client) : []
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
