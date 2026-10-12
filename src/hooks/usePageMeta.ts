import { useEffect } from 'react'
import { setPageMeta } from '../lib/pageMeta'
import { routeFor } from '../lib/siteRoutes'

export function usePageMeta(path: string) {
  useEffect(() => {
    const route = routeFor(path)
    setPageMeta({ title: route.title, description: route.description, path: route.path })
  }, [path])
}
