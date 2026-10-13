import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, LayoutGrid, List, Search } from 'lucide-react'
import { articleTopics, type ArticleItem } from '../../lib/articleUtils'
import { cn } from '../../lib/cn'
import ArticleCard from './ArticleCard'

export default function ArticleArchive({ articles }: { articles: ArticleItem[] }) {
  const [params] = useSearchParams()
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const topics = useMemo(() => {
    const counts = new Map<string, number>()
    for (const article of articles) for (const t of articleTopics(article)) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)
  }, [articles])

  const incoming = params.get('q')

  useEffect(() => {
    if (!incoming) return
    const match = topics.find((name) => name.toLowerCase() === incoming.toLowerCase())
    if (match) {
      setTopic(match)
      setQuery('')
    } else {
      setTopic('all')
      setQuery(incoming)
    }
  }, [incoming, topics])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return articles
      .map((article, index) => ({ article, index }))
      .filter(({ article }) => {
        if (topic !== 'all' && !articleTopics(article).includes(topic)) return false
        if (!needle) return true
        return `${article.title} ${article.summary}`.toLowerCase().includes(needle)
      })
  }, [articles, topic, query])

  const tabs = ['all', ...topics]

  return (
    <section id="all" aria-labelledby="all-articles-heading" className="relative mx-auto max-w-[1400px] scroll-mt-24 px-6 pb-16 md:px-12 md:pb-24">
      <div className="flex flex-col gap-6 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="all-articles-heading" className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-foreground">
            All publications <span className="ml-2 rounded bg-muted px-2 py-0.5 text-muted-foreground">{articles.length}</span>
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <label htmlFor="article-search" className="sr-only">
              Search articles
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="article-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search archive…"
              className="w-56 rounded-xl border border-border bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
            />
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1" role="group" aria-label="View mode">
            {(['grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                aria-label={mode === 'grid' ? 'Grid view' : 'List view'}
                className={cn('grid h-8 w-8 place-items-center rounded-md transition-colors', view === mode ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground')}
              >
                {mode === 'grid' ? <LayoutGrid className="h-4 w-4" aria-hidden="true" /> : <List className="h-4 w-4" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tabs.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={topic === tab}
              onClick={() => setTopic(tab)}
              className={cn(
                'rounded-lg border px-3.5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors',
                topic === tab ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
              )}
            >
              {tab === 'all' ? 'All' : tab}
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {visible.length} articles shown
      </p>

      {visible.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">No articles match that search.</p>
      ) : view === 'grid' ? (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {visible.map(({ article, index }) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <ul className="mt-6 border-t border-border">
          {visible.map(({ article }) => (
            <motion.li layout key={article.id}>
              <Link
                to={`/blog/${article.slug}`}
                state={{ from: 'blog' }}
                className="group flex items-center justify-between gap-4 border-b border-border py-5 transition-colors hover:bg-muted/30 md:px-3"
              >
                <span className="min-w-0">
                  <span className="block text-lg font-bold tracking-tight text-foreground">{article.title}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{article.summary}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                  <span className="hidden sm:inline">
                    {article.published_on}
                    {article.read_time ? ` · ${article.read_time}` : ''}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}
