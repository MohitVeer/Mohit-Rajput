import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { articles } from '../data/profile'
import { fetchArticles, type ArticleRow } from '../lib/contentApi'
import { useLiveContent } from '../hooks/useLiveContent'
import { useBreakpointValue } from '../hooks/useBreakpointValue'
import Book from './ui/Book'
import Section from './shell/Section'
import { trackEvent } from '../lib/analytics'

const COVERS = ['#9D2127', '#7DC1C1', '#FED954', '#454ADE', '#439775', '#FF0F67']
const LIGHT_COVERS = new Set(['#7DC1C1', '#FED954'])

const COUNT_BREAKPOINTS = { sm: 1, md: 2, lg: 3 }
const BOOK_WIDTH = { sm: 180, md: 220, lg: 260 }

export default function Articles() {
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
  const items = useLiveContent(fetchArticles, fallback)
  const visibleCount = Math.min(useBreakpointValue(COUNT_BREAKPOINTS), items.length)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const go = (step: number) => {
    setDirection(step)
    setIndex((prev) => (prev + step + items.length) % items.length)
  }

  const visible = Array.from({ length: visibleCount }, (_, i) => {
    const slot = (index + i) % items.length
    return { article: items[slot], slot }
  })

  return (
    <Section id="articles" index="08" label="Articles" className="relative bg-background px-6 py-32 md:px-12">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl space-y-4 pb-16 text-center"
        >
          <h2 id="articles-heading" className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Articles &amp; Insights
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground/80 md:text-xl">
            Sharing what I learn in the Salesforce ecosystem — LWC, OmniStudio, and Marketing Cloud.
          </p>
        </motion.div>

        <div className="flex items-center justify-between border-b border-border/50 pb-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">Latest Stories</h3>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Articles • Insights • Deep Dives</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous articles"
              className="grid h-12 w-12 place-items-center rounded-full border border-border/50 bg-muted/10 text-foreground transition-all hover:scale-110 hover:bg-muted/20 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next articles"
              className="grid h-12 w-12 place-items-center rounded-full border border-border/50 bg-muted/10 text-foreground transition-all hover:scale-110 hover:bg-muted/20 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="relative mx-auto flex min-h-[480px] items-start justify-center gap-8 px-2 pb-12 pt-14 md:gap-24" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map(({ article, slot }, position) => {
              const color = COVERS[slot % COVERS.length]
              const textColor = LIGHT_COVERS.has(color) ? 'var(--ds-gray-1000)' : position % 2 !== 0 ? '#FFFFFF' : 'var(--ds-gray-1000)'
              return (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, x: direction * 50, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: direction * -50, scale: 0.9, filter: 'blur(10px)' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="relative w-[180px] flex-shrink-0 md:w-[260px]"
                >
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEvent('Article', 'article_click', article.title, { destination: article.url })}
                    className="group/book relative z-10 block"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 scale-100 rounded-full opacity-0 blur-[80px] transition-all duration-700 group-hover/book:scale-110 group-hover/book:opacity-70"
                      style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
                    />
                    <Book title={article.title} color={color} textColor={textColor} variant={position % 2 === 0 ? 'stripe' : 'simple'} width={BOOK_WIDTH} />
                    <span className="mt-8 block space-y-3 opacity-100 transition-all duration-500 md:translate-y-4 md:opacity-0 md:group-hover/book:translate-y-0 md:group-hover/book:opacity-100 md:group-focus-visible/book:translate-y-0 md:group-focus-visible/book:opacity-100">
                      <span className="flex items-center gap-2">
                        <span className="rounded border border-border/50 bg-muted/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">
                          {article.published_on}
                        </span>
                        {article.read_time && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{article.read_time}</span>
                        )}
                      </span>
                      <span className="line-clamp-3 block text-sm font-medium leading-relaxed text-muted-foreground">{article.summary}</span>
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <ul className="mx-auto mt-4 max-w-3xl divide-y divide-border/60 border-t border-border/60">
          {items.map((article) => (
            <li key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('Article', 'article_click', article.title, { destination: article.url })}
                className="group flex items-center justify-between gap-4 py-4 text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="text-base font-semibold">
                  {article.title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs uppercase tracking-widest">
                  {article.published_on}
                  {article.read_time ? ` · ${article.read_time}` : ''}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
