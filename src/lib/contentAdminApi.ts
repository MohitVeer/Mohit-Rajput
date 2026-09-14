// Admin-only writes for the CMS content tables. Split out from contentApi.ts
// (the public read side) so the @supabase/supabase-js client — needed here
// for authenticated inserts/updates/deletes — is only ever pulled into the
// gated /admin bundle, never the public site's. See contentApi.ts for why.
import { supabase } from './supabaseClient'
import type { ArticleRow, Cert, CertGroupRow, ExperienceRow, ProjectRow, SkillGroupRow, SuperbadgeRow } from './contentApi'

type TableName = 'experience' | 'skill_groups' | 'cert_groups' | 'superbadges' | 'articles' | 'projects'

async function createContent<T extends { id: string }>(table: TableName, row: Partial<T>): Promise<T> {
  if (!supabase) throw new Error('Supabase not configured')
  // The untyped Supabase client's insert() overload doesn't accept a generic
  // Partial<T> — the real shape is enforced by the DB schema and RLS on the
  // way in, and by the T return-type cast on the way out.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await supabase.from(table).insert(row as any).select().single()
  if (error) throw error
  return data as T
}

async function updateContent<T>(table: TableName, id: string, row: Partial<T>): Promise<T> {
  if (!supabase) throw new Error('Supabase not configured')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await supabase.from(table).update(row as any).eq('id', id).select().single()
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
