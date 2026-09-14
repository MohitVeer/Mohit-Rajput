// CMS content: Experience / Skills / Certifications / Superbadges / Articles /
// Projects are editable from the admin dashboard without a code deploy — the
// tables back the exact same content that used to live only in
// src/data/profile.ts. Public (anon) reads are open (this content is already
// public in the compiled JS bundle); writes require the authenticated admin
// session (see contentAdminApi.ts and the RLS policies in
// supabase/migrations/*_cms_content_schema.sql).
//
// Reads here go over plain PostgREST `fetch()`, not the @supabase/supabase-js
// client, on purpose: this file is imported by every public page section, so
// pulling in the ~55KB (gzipped) SDK just to run a handful of anonymous
// SELECTs would bloat the public bundle for every visitor. The SDK is only
// ever loaded on the gated /admin route (contentAdminApi.ts, adminApi.ts).
//
// Every public component still imports the matching static fallback from
// profile.ts and renders it immediately — the live fetch swaps it in once it
// resolves. If Supabase is unreachable, misconfigured, or mid-migration, the
// site still renders correctly from the static data; a failed content fetch
// is caught and logged, never thrown into the UI (same resilience pattern as
// the analytics client).

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
