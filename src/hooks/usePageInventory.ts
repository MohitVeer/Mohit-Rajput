import { useMemo } from 'react'
import { siteRoutes } from '../lib/siteRoutes'
import { useArticles } from './useArticles'
import { useProjects } from './useProjects'

export function usePageInventory(): string[] {
  const projects = useProjects()
  const articles = useArticles()
  return useMemo(
    () => [...siteRoutes.map((route) => route.path), ...projects.map((project) => `/projects/${project.slug}`), ...articles.map((article) => `/blog/${article.slug}`)],
    [projects, articles],
  )
}
