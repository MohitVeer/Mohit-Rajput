const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export type DocumentKind = 'experience-letter' | 'relieving-letter' | 'offer-letter' | 'certificate' | 'other'

export interface ExperienceDocument {
  label: string
  kind: DocumentKind
  url: string
}

export interface ExperienceRow {
  id: string
  role: string
  company: string
  period: string
  location: string
  bullets: string[]
  achievements: string[]
  clients: string[]
  documents?: ExperienceDocument[]
  sort_order: number
}

export interface SkillGroupRow {
  id: string
  title: string
  skills: string[]
  sort_order: number
}

export interface Cert {
  name: string
  image: string
  alt: string
  fileUrl: string
  issuer?: string
  issued?: string
  credentialId?: string
  verifyUrl?: string
  description?: string
  preview?: string
}

export interface CertGroupRow {
  id: string
  title: string
  logo: string | null
  certs: Cert[]
  sort_order: number
}

export interface SuperbadgeRow {
  id: string
  title: string
  description: string
  image: string | null
  url: string
  sort_order: number
}

export interface ArticleRow {
  id: string
  title: string
  summary: string
  url: string
  published_on: string
  read_time: string | null
  slug?: string | null
  sort_order: number
}

export type ProjectKind = 'client' | 'accelerator' | 'product' | 'case-study'
export type ProjectStatus = 'ongoing' | 'completed'

export interface ProjectRow {
  id: string
  title: string
  description: string
  image: string | null
  tags: string[]
  live_url: string | null
  repo_url: string | null
  slug?: string | null
  kind?: ProjectKind
  sector?: string | null
  employer?: string | null
  role?: string | null
  period?: string | null
  status?: ProjectStatus
  highlights?: string[]
  sort_order: number
}

export interface EngagementRow {
  id: string
  employer: string
  role: string
  title: string
  period: string
  current: boolean
  kind: Exclude<ProjectKind, 'case-study'>
  highlights: string[]
  stack: string[]
  sort_order: number
}

export interface FaqRow {
  id: string
  question: string
  answer: string
  sort_order: number
}

export interface SettingRow {
  key: string
  value: unknown
}

type TableName = 'experience' | 'skill_groups' | 'cert_groups' | 'superbadges' | 'articles' | 'projects' | 'engagements' | 'faqs' | 'site_settings'

const pending = new Map<string, Promise<unknown[]>>()

function listContent<T>(table: TableName, order: string | null = 'sort_order.asc'): Promise<T[]> {
  if (!SUPABASE_URL || !ANON_KEY) return Promise.resolve([])
  const key = `${table}:${order}`
  const running = pending.get(key)
  if (running) return running as Promise<T[]>

  const request = (async () => {
    const query = order ? `select=*&order=${order}` : 'select=*'
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    })
    if (!res.ok) throw new Error(`Failed to fetch ${table}: ${res.status}`)
    return (await res.json()) as T[]
  })().finally(() => pending.delete(key))

  pending.set(key, request)
  return request
}

export const fetchExperience = () => listContent<ExperienceRow>('experience')
export const fetchSkillGroups = () => listContent<SkillGroupRow>('skill_groups')
export const fetchCertGroups = () => listContent<CertGroupRow>('cert_groups')
export const fetchSuperbadges = () => listContent<SuperbadgeRow>('superbadges')
export const fetchArticles = () => listContent<ArticleRow>('articles')
export const fetchProjects = () => listContent<ProjectRow>('projects')
export const fetchEngagements = () => listContent<EngagementRow>('engagements')
export const fetchFaqs = () => listContent<FaqRow>('faqs')
let settingsRequest: Promise<SettingRow[]> | null = null

export function fetchSettings(): Promise<SettingRow[]> {
  if (!settingsRequest) {
    settingsRequest = listContent<SettingRow>('site_settings', null).catch((error) => {
      settingsRequest = null
      throw error
    })
  }
  return settingsRequest
}

export function resetSettingsCache(): void {
  settingsRequest = null
}
