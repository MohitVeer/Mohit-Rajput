import {
  clientProjects,
  engagements as builtInEngagements,
  EMPLOYER_LABEL,
  employerKeyOf,
  type ClientProject,
  type Engagement,
} from '../data/clientProjects'
import { faq as builtInFaq } from '../data/faq'
import { articles as builtInArticles } from '../data/profile'
import type { ArticleItem } from './articleUtils'
import type { ArticleRow, EngagementRow, FaqRow, ProjectKind, ProjectRow, ProjectStatus } from './contentApi'
import { resolveSlugs } from './slug'

export type { ProjectKind, ProjectStatus }
export type EngagementKind = Exclude<ProjectKind, 'case-study'>

export interface ProjectItem {
  id: string
  slug: string
  title: string
  sector: string | null
  employer: string | null
  employerKey: string | null
  employerLabel: string | null
  role: string | null
  period: string | null
  engagementTitle: string | null
  current: boolean
  status: ProjectStatus
  description: string
  highlights: string[]
  peers: string[]
  tags: string[]
  kind: ProjectKind
  url: string | null
  repoUrl: string | null
  image: string | null
}

export interface EngagementItem {
  id: string
  employer: string
  employerKey: string
  role: string
  title: string
  period: string
  current: boolean
  kind: EngagementKind
  clients: string[]
  highlights: string[]
  stack: string[]
}

export interface Portfolio {
  projects: ProjectItem[]
  engagements: EngagementItem[]
}

interface Draft {
  id: string
  slugHint: string | null
  title: string
  sector: string | null
  employer: string | null
  role: string | null
  period: string | null
  status: ProjectStatus
  description: string
  highlights: string[]
  tags: string[]
  kind: ProjectKind
  url: string | null
  repoUrl: string | null
  image: string | null
}

const clean = (value: string | null | undefined): string | null => {
  const text = value?.trim()
  return text ? text : null
}

const cleanList = (values: string[] | null | undefined): string[] => (values ?? []).map((value) => value.trim()).filter(Boolean)

function draftFromRow(row: ProjectRow): Draft {
  return {
    id: `cms-${row.id}`,
    slugHint: clean(row.slug),
    title: row.title,
    sector: clean(row.sector),
    employer: clean(row.employer),
    role: clean(row.role),
    period: clean(row.period),
    status: row.status === 'ongoing' ? 'ongoing' : 'completed',
    description: row.description,
    highlights: cleanList(row.highlights),
    tags: cleanList(row.tags),
    kind: row.kind ?? 'case-study',
    url: clean(row.live_url),
    repoUrl: clean(row.repo_url),
    image: clean(row.image),
  }
}

function draftFromBuiltIn(project: ClientProject): Draft {
  return {
    id: project.id,
    slugHint: project.id,
    title: project.client,
    sector: project.sector,
    employer: project.employer,
    role: project.role,
    period: null,
    status: project.current ? 'ongoing' : 'completed',
    description: project.summary,
    highlights: [],
    tags: project.stack,
    kind: project.kind,
    url: null,
    repoUrl: null,
    image: null,
  }
}

function engagementFromRow(row: EngagementRow): EngagementItem {
  return {
    id: `cms-${row.id}`,
    employer: row.employer,
    employerKey: employerKeyOf(row.employer),
    role: row.role,
    title: row.title,
    period: row.period,
    current: Boolean(row.current),
    kind: row.kind,
    clients: [],
    highlights: cleanList(row.highlights),
    stack: cleanList(row.stack),
  }
}

function engagementFromBuiltIn(engagement: Engagement): EngagementItem {
  return {
    id: engagement.id,
    employer: engagement.employer,
    employerKey: engagement.employerKey,
    role: engagement.role,
    title: engagement.title,
    period: engagement.period,
    current: Boolean(engagement.current),
    kind: engagement.kind,
    clients: [],
    highlights: engagement.highlights,
    stack: engagement.stack,
  }
}

function link(draft: Draft, slug: string, engagements: EngagementItem[]): ProjectItem {
  const employerKey = draft.employer ? employerKeyOf(draft.employer) : null
  const engagement =
    draft.kind !== 'case-study' && employerKey
      ? engagements.find((entry) => entry.employerKey === employerKey && entry.kind === draft.kind)
      : undefined

  return {
    id: draft.id,
    slug,
    title: draft.title,
    sector: draft.sector,
    employer: draft.employer,
    employerKey,
    employerLabel: draft.employer ? ((employerKey && EMPLOYER_LABEL[employerKey]) || draft.employer) : null,
    role: draft.role ?? engagement?.role ?? null,
    period: draft.period ?? engagement?.period ?? null,
    engagementTitle: engagement?.title ?? null,
    current: draft.status === 'ongoing',
    status: draft.status,
    description: draft.description,
    highlights: draft.highlights.length > 0 ? draft.highlights : (engagement?.highlights ?? []),
    peers: [],
    tags: draft.tags,
    kind: draft.kind,
    url: draft.url,
    repoUrl: draft.repoUrl,
    image: draft.image,
  }
}

export function buildPortfolio(projectRows: ProjectRow[], engagementRows: EngagementRow[]): Portfolio {
  const shells = engagementRows.length > 0 ? engagementRows.map(engagementFromRow) : builtInEngagements.map(engagementFromBuiltIn)
  const drafts = projectRows.map(draftFromRow)
  const managed = drafts.some((draft) => draft.kind !== 'case-study')
  const list = managed ? drafts : [...drafts, ...clientProjects.map(draftFromBuiltIn)]

  const slugs = resolveSlugs(list.map((draft) => ({ title: draft.title, slug: draft.slugHint })))
  const projects = list.map((draft, index) => link(draft, slugs[index], shells))

  const engagements = shells.map((shell) => ({
    ...shell,
    clients: projects.filter((project) => project.kind === shell.kind && project.employerKey === shell.employerKey).map((project) => project.title),
  }))

  const byKey = new Map(engagements.map((entry) => [`${entry.employerKey}|${entry.kind}`, entry]))
  for (const project of projects) {
    if (project.kind === 'case-study' || !project.employerKey) continue
    const entry = byKey.get(`${project.employerKey}|${project.kind}`)
    if (entry) project.peers = entry.clients.filter((client) => client !== project.title)
  }

  return { projects, engagements }
}

export function projectSlugFor(items: ProjectItem[], name: string): string | undefined {
  const needle = name.trim().toLowerCase()
  return items.find((item) => item.title.toLowerCase() === needle)?.slug
}

export function builtInArticleRows(): ArticleRow[] {
  return builtInArticles.map((article, index) => ({
    id: `static-${index}`,
    title: article.title,
    summary: article.summary,
    url: article.url,
    published_on: article.publishedOn,
    read_time: article.readTime,
    sort_order: index,
  }))
}

export function buildArticles(rows: ArticleRow[]): ArticleItem[] {
  const data = rows.length > 0 ? rows : builtInArticleRows()
  const slugs = resolveSlugs(data.map((row) => ({ title: row.title, slug: row.slug })))
  return data.map((row, index) => ({ ...row, slug: slugs[index] }))
}

export function clientNamesFor(projects: ProjectItem[], employerKey: string | null): string[] {
  if (!employerKey) return []
  return projects.filter((project) => project.employerKey === employerKey && project.kind === 'client').map((project) => project.title)
}

export function builtInProjectRows(startOrder = 0): Omit<ProjectRow, 'id'>[] {
  return clientProjects.map((project, index) => ({
    title: project.client,
    description: project.summary,
    image: null,
    tags: [...project.stack],
    live_url: null,
    repo_url: null,
    slug: project.id,
    kind: project.kind,
    sector: project.sector,
    employer: project.employer,
    role: project.role,
    period: null,
    status: project.current ? 'ongoing' : 'completed',
    highlights: [],
    sort_order: startOrder + index,
  }))
}

export function builtInEngagementRows(startOrder = 0): Omit<EngagementRow, 'id'>[] {
  return builtInEngagements.map((engagement, index) => ({
    employer: engagement.employer,
    role: engagement.role,
    title: engagement.title,
    period: engagement.period,
    current: Boolean(engagement.current),
    kind: engagement.kind,
    highlights: [...engagement.highlights],
    stack: [...engagement.stack],
    sort_order: startOrder + index,
  }))
}

export function builtInFaqRows(startOrder = 0): Omit<FaqRow, 'id'>[] {
  return builtInFaq.map((entry, index) => ({ question: entry.question, answer: entry.answer, sort_order: startOrder + index }))
}

export function employerSuggestions(): string[] {
  return Array.from(new Set(clientProjects.map((project) => project.employer)))
}
