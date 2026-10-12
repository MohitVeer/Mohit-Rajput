import { useMemo } from 'react'
import { articles } from '../data/profile'
import { fetchArticles, type ArticleRow } from '../lib/contentApi'
import { useLiveContent } from './useLiveContent'

export function useArticles(): ArticleRow[] {
  const fallback = useMemo<ArticleRow[]>(
    () =>
      articles.map((a, i) => ({
        title: a.title,
        summary: a.summary,
        url: a.url,
        published_on: a.publishedOn,
        read_time: a.readTime,
        id: `static-${i}`,
        sort_order: i,
      })),
    [],
  )
  return useLiveContent(fetchArticles, fallback)
}
