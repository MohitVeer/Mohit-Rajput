import { useMemo } from 'react'
import { fetchEngagements, fetchProjects, type EngagementRow, type ProjectRow } from '../lib/contentApi'
import { buildPortfolio, projectSlugFor, type EngagementItem, type ProjectItem } from '../lib/contentModel'
import { useLiveContentState } from './useLiveContent'

export type { EngagementItem, ProjectItem, ProjectStatus } from '../lib/contentModel'
export { projectSlugFor }

const NO_PROJECTS: ProjectRow[] = []
const NO_ENGAGEMENTS: EngagementRow[] = []

export function usePortfolio(): { items: ProjectItem[]; engagements: EngagementItem[]; settled: boolean } {
  const projects = useLiveContentState(fetchProjects, NO_PROJECTS)
  const engagements = useLiveContentState(fetchEngagements, NO_ENGAGEMENTS)
  const portfolio = useMemo(() => buildPortfolio(projects.data, engagements.data), [projects.data, engagements.data])
  return { items: portfolio.projects, engagements: portfolio.engagements, settled: projects.settled && engagements.settled }
}

export function useProjects(): ProjectItem[] {
  return usePortfolio().items
}

export function useProject(slug: string | undefined): { item: ProjectItem | undefined; items: ProjectItem[]; loading: boolean } {
  const { items, settled } = usePortfolio()
  const item = items.find((entry) => entry.slug === slug)
  return { item, items, loading: !item && !settled }
}
