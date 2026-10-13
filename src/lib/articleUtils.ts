import type { ArticleRow } from './contentApi'

export const COVERS = ['#9D2127', '#7DC1C1', '#FED954', '#454ADE', '#439775', '#FF0F67']
export const LIGHT_COVERS = new Set(['#7DC1C1', '#FED954'])

const TOPICS = [
  'Marketing Cloud',
  'Experience Cloud',
  'SLDS',
  'Personalization',
  'Performance',
  'Email',
  'MCP',
  'LWC',
  'OmniStudio',
  'E-commerce',
  'Accessibility',
]

export interface ArticleItem extends ArticleRow {
  slug: string
}

export function topicsIn(text: string): string[] {
  const haystack = text.toLowerCase()
  return TOPICS.filter((topic) => new RegExp(`(^|[^a-z0-9])${topic.toLowerCase().replace(/[.*+?^${}()|[\]\\-]/g, '\\$&')}`).test(haystack))
}

export function articleTopics(article: ArticleRow): string[] {
  return topicsIn(`${article.title} ${article.summary}`)
}

export function readMinutes(article: ArticleRow): number {
  const match = article.read_time?.match(/\d+/)
  return match ? Number(match[0]) : 0
}

export function coverFor(index: number) {
  const color = COVERS[index % COVERS.length]
  return { color, text: LIGHT_COVERS.has(color) ? '#0a0a0a' : '#ffffff' }
}
