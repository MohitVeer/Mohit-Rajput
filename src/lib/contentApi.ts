const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export interface ExperienceRow {
  id: string
  role: string
  company: string
  period: string
  location: string
  bullets: string[]
  achievements: string[]
  clients: string[]
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
  sort_order: number
}

export interface ProjectRow {
  id: string
  title: string
  description: string
  image: string | null
  tags: string[]
  live_url: string | null
  repo_url: string | null
  sort_order: number
}

type TableName = 'experience' | 'skill_groups' | 'cert_groups' | 'superbadges' | 'articles' | 'projects'

async function listContent<T>(table: TableName): Promise<T[]> {
  if (!SUPABASE_URL || !ANON_KEY) return []
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=sort_order.asc`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${res.status}`)
  return (await res.json()) as T[]
}

export const fetchExperience = () => listContent<ExperienceRow>('experience')
export const fetchSkillGroups = () => listContent<SkillGroupRow>('skill_groups')
export const fetchCertGroups = () => listContent<CertGroupRow>('cert_groups')
export const fetchSuperbadges = () => listContent<SuperbadgeRow>('superbadges')
export const fetchArticles = () => listContent<ArticleRow>('articles')
export const fetchProjects = () => listContent<ProjectRow>('projects')
