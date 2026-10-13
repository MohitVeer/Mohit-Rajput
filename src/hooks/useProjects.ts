import { useMemo } from 'react'
import { clientProjects, engagements, type ClientProject, type ProjectKind } from '../data/clientProjects'
import { fetchProjects, type ProjectRow } from '../lib/contentApi'
import { uniqueSlugs } from '../lib/slug'
import { useLiveContentState } from './useLiveContent'

export type ProjectStatus = 'ongoing' | 'completed'

export interface ProjectItem {
  id: string
  slug: string
  title: string
  sector: string | null
  employer: string | null
  employerKey: string | null
  role: string | null
  period: string | null
  engagementTitle: string | null
  current: boolean
  status: ProjectStatus
  description: string
  highlights: string[]
  peers: string[]
  tags: string[]
  kind: ProjectKind | 'case-study'
  url: string | null
  repoUrl: string | null
  image: string | null
}

function fromCaseStudy(row: ProjectRow, slug: string): ProjectItem {
  return {
    id: `cms-${row.id}`,
    slug,
    title: row.title,
    sector: null,
    employer: null,
    employerKey: null,
    role: null,
    period: null,
    engagementTitle: null,
    current: false,
    status: 'completed',
    description: row.description,
    highlights: [],
    peers: [],
    tags: row.tags,
    kind: 'case-study',
    url: row.live_url,
    repoUrl: row.repo_url,
    image: row.image,
  }
}

function fromStatic(project: ClientProject): ProjectItem {
  const engagement = engagements.find((entry) => entry.employerKey === project.employerKey && entry.clients.includes(project.client))
  return {
    id: project.id,
    slug: project.id,
    title: project.client,
    sector: project.sector,
    employer: project.employer,
    employerKey: project.employerKey,
    role: project.role,
    period: engagement?.period ?? null,
    engagementTitle: engagement?.title ?? null,
    current: Boolean(project.current),
    status: project.current ? 'ongoing' : 'completed',
    description: project.summary,
    highlights: engagement?.highlights ?? [],
    peers: engagement ? engagement.clients.filter((client) => client !== project.client) : [],
    tags: project.stack,
    kind: project.kind,
    url: null,
    repoUrl: null,
    image: null,
  }
}

const NO_ROWS: ProjectRow[] = []

export function useProjectList(): { items: ProjectItem[]; settled: boolean } {
  const { data: rows, settled } = useLiveContentState(fetchProjects, NO_ROWS)
  const items = useMemo(() => {
    const statics = clientProjects.map(fromStatic)
    const slugs = uniqueSlugs(
      rows.map((row) => row.title),
      statics.map((item) => item.slug),
    )
    return [...rows.map((row, i) => fromCaseStudy(row, slugs[i])), ...statics]
  }, [rows])
  return { items, settled }
}

export function useProjects(): ProjectItem[] {
  return useProjectList().items
}

export function useProject(slug: string | undefined): { item: ProjectItem | undefined; items: ProjectItem[]; loading: boolean } {
  const { items, settled } = useProjectList()
  const item = items.find((entry) => entry.slug === slug)
  return { item, items, loading: !item && !settled }
}

export function projectSlugFor(items: ProjectItem[], name: string): string | undefined {
  const needle = name.trim().toLowerCase()
  return items.find((item) => item.title.toLowerCase() === needle)?.slug
}
