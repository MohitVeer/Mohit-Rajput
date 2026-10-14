import { useMemo } from 'react'
import type { ArticleItem } from '../lib/articleUtils'
import { fetchArticles, type ArticleRow } from '../lib/contentApi'
import { buildArticles, builtInArticleRows } from '../lib/contentModel'
import { useLiveContentState } from './useLiveContent'

function useArticleList(): { items: ArticleItem[]; settled: boolean } {
  const fallback = useMemo<ArticleRow[]>(builtInArticleRows, [])
  const { data, settled } = useLiveContentState(fetchArticles, fallback)
  const items = useMemo(() => buildArticles(data), [data])
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
