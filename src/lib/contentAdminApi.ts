import { supabase } from './supabaseClient'
import { resetSettingsCache, type ArticleRow, type Cert, type CertGroupRow, type EngagementRow, type ExperienceRow, type FaqRow, type ProjectRow, type SkillGroupRow, type SuperbadgeRow } from './contentApi'

type TableName = 'experience' | 'skill_groups' | 'cert_groups' | 'superbadges' | 'articles' | 'projects' | 'engagements' | 'faqs'

async function createContent<T extends { id: string }>(table: TableName, row: Partial<T>): Promise<T> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from(table).insert(row as never).select().single()
  if (error) throw error
  return data as T
}

async function updateContent<T>(table: TableName, id: string, row: Partial<T>): Promise<T> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from(table).update(row as never).eq('id', id).select().single()
  if (error) throw error
  return data as T
}

async function deleteContent(table: TableName, id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

export const createExperience = (row: Omit<ExperienceRow, 'id'>) => createContent<ExperienceRow>('experience', row)
export const updateExperience = (id: string, row: Partial<ExperienceRow>) =>
  updateContent<ExperienceRow>('experience', id, row)
export const deleteExperience = (id: string) => deleteContent('experience', id)

export const createSkillGroup = (row: Omit<SkillGroupRow, 'id'>) => createContent<SkillGroupRow>('skill_groups', row)
export const updateSkillGroup = (id: string, row: Partial<SkillGroupRow>) =>
  updateContent<SkillGroupRow>('skill_groups', id, row)
export const deleteSkillGroup = (id: string) => deleteContent('skill_groups', id)

export const createCertGroup = (row: Omit<CertGroupRow, 'id'>) => createContent<CertGroupRow>('cert_groups', row)
export const updateCertGroup = (id: string, row: Partial<CertGroupRow>) =>
  updateContent<CertGroupRow>('cert_groups', id, row)
export const deleteCertGroup = (id: string) => deleteContent('cert_groups', id)
export type { Cert }

export const createSuperbadge = (row: Omit<SuperbadgeRow, 'id'>) => createContent<SuperbadgeRow>('superbadges', row)
export const updateSuperbadge = (id: string, row: Partial<SuperbadgeRow>) =>
  updateContent<SuperbadgeRow>('superbadges', id, row)
export const deleteSuperbadge = (id: string) => deleteContent('superbadges', id)

export const createArticle = (row: Omit<ArticleRow, 'id'>) => createContent<ArticleRow>('articles', row)
export const updateArticle = (id: string, row: Partial<ArticleRow>) => updateContent<ArticleRow>('articles', id, row)
export const deleteArticle = (id: string) => deleteContent('articles', id)

export const createProject = (row: Omit<ProjectRow, 'id'>) => createContent<ProjectRow>('projects', row)
export const updateProject = (id: string, row: Partial<ProjectRow>) => updateContent<ProjectRow>('projects', id, row)
export const deleteProject = (id: string) => deleteContent('projects', id)

export const createEngagement = (row: Omit<EngagementRow, 'id'>) => createContent<EngagementRow>('engagements', row)
export const updateEngagement = (id: string, row: Partial<EngagementRow>) => updateContent<EngagementRow>('engagements', id, row)
export const deleteEngagement = (id: string) => deleteContent('engagements', id)

export const createFaq = (row: Omit<FaqRow, 'id'>) => createContent<FaqRow>('faqs', row)
export const updateFaq = (id: string, row: Partial<FaqRow>) => updateContent<FaqRow>('faqs', id, row)
export const deleteFaq = (id: string) => deleteContent('faqs', id)

export async function saveSetting(key: string, value: unknown): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('site_settings').upsert({ key, value } as never, { onConflict: 'key' })
  if (error) throw error
  resetSettingsCache()
}

export async function deleteSetting(key: string): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured')
  const { error } = await supabase.from('site_settings').delete().eq('key', key)
  if (error) throw error
  resetSettingsCache()
}

async function createManyContent<T>(table: TableName, rows: object[]): Promise<T[]> {
  if (!supabase) throw new Error('Supabase not configured')
  const { data, error } = await supabase.from(table).insert(rows as never).select()
  if (error) throw error
  return (data ?? []) as T[]
}

export const createProjects = (rows: Omit<ProjectRow, 'id'>[]) => createManyContent<ProjectRow>('projects', rows)
export const createEngagements = (rows: Omit<EngagementRow, 'id'>[]) => createManyContent<EngagementRow>('engagements', rows)
export const createFaqs = (rows: Omit<FaqRow, 'id'>[]) => createManyContent<FaqRow>('faqs', rows)
