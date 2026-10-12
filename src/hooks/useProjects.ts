import { useMemo } from 'react'
import { clientProjects, type ClientProject, type ProjectKind } from '../data/clientProjects'
import { fetchProjects, type ProjectRow } from '../lib/contentApi'
import { useLiveContent } from './useLiveContent'

export interface ProjectItem {
  id: string
  title: string
  sector: string | null
  employer: string | null
  employerKey: string | null
  role: string | null
  current: boolean
  description: string
  tags: string[]
  kind: ProjectKind | 'case-study'
  url: string | null
  image: string | null
}

function fromCaseStudy(row: ProjectRow): ProjectItem {
  return {
    id: `cms-${row.id}`,
    title: row.title,
    sector: null,
    employer: null,
    employerKey: null,
    role: null,
    current: false,
    description: row.description,
    tags: row.tags,
    kind: 'case-study',
    url: row.live_url ?? row.repo_url,
    image: row.image,
  }
}

function fromStatic(project: ClientProject): ProjectItem {
  return {
    id: project.id,
    title: project.client,
    sector: project.sector,
    employer: project.employer,
    employerKey: project.employerKey,
    role: project.role,
    current: Boolean(project.current),
    description: project.summary,
    tags: project.stack,
    kind: project.kind,
    url: null,
    image: null,
  }
}

const NO_ROWS: ProjectRow[] = []

export function useProjects(): ProjectItem[] {
  const rows = useLiveContent(fetchProjects, NO_ROWS)
  return useMemo(() => (rows.length > 0 ? rows.map(fromCaseStudy) : clientProjects.map(fromStatic)), [rows])
}
