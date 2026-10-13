import { useEffect } from 'react'
import { setPageMeta } from '../lib/pageMeta'
import { seoForRoute } from '../lib/seo'

export function usePageMeta(path: string, collection?: { name: string; path: string }[]) {
  useEffect(() => {
    const page = seoForRoute(path, collection)
    setPageMeta({ title: page.title, description: page.description, path: page.path, type: page.type, jsonLd: page.jsonLd })
  }, [path, collection])
}
