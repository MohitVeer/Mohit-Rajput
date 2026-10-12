import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { ArticleRow } from '../../lib/contentApi'
import { articleTopics } from '../../lib/articleUtils'
import { trackEvent } from '../../lib/analytics'
import ArticleCover from './ArticleCover'

export default function ArticleCard({ article, index }: { article: ArticleRow; index: number }) {
  const topics = articleTopics(article).slice(0, 2)
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('Article', 'article_click', article.title, { destination: article.url })}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-2xl"
      >
        <span className="block overflow-hidden">
          <span className="block transition-transform duration-700 group-hover:scale-105">
            <ArticleCover title={article.title} index={index} className="min-h-[12rem]" />
          </span>
        </span>
        <span className="flex flex-1 flex-col p-6">
          <span className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{article.published_on}</span>
            {article.read_time && <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{article.read_time}</span>}
            {topics.map((topic) => (
              <span key={topic} className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/70">
                #{topic.replace(/\s+/g, '')}
              </span>
            ))}
          </span>
          <span className="mt-4 text-lg font-bold leading-snug tracking-tight text-foreground">{article.title}</span>
          <span className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{article.summary}</span>
          <span className="mt-5 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground">
            Read the article
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            <span className="sr-only">(opens in a new tab)</span>
          </span>
        </span>
      </a>
    </motion.li>
  )
}
