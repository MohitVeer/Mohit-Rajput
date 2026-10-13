import { useMemo } from 'react'
import { articles } from '../data/profile'
import type { ArticleItem } from '../lib/articleUtils'
import { fetchArticles, type ArticleRow } from '../lib/contentApi'
import { uniqueSlugs } from '../lib/slug'
import { useLiveContentState } from './useLiveContent'

export function useArticleList(): { items: ArticleItem[]; settled: boolean } {
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
  const { data, settled } = useLiveContentState(fetchArticles, fallback)
  const items = useMemo(() => {
    const slugs = uniqueSlugs(data.map((row) => row.title))
    return data.map((row, i) => ({ ...row, slug: slugs[i] }))
  }, [data])
  return { items, settled }
}

export function useArticles(): ArticleItem[] {
  return useArticleList().items
}

export function useArticle(slug: string | undefined): { item: ArticleItem | undefined; items: ArticleItem[]; loading: boolean } {
  const { items, settled } = useArticleList()
  const item = items.find((entry) => entry.slug === slug)
  return { item, items, loading: !item && !settled }
}
