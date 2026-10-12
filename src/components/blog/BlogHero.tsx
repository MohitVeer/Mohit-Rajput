import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Clock, FileText, Layers } from 'lucide-react'
import type { ArticleRow } from '../../lib/contentApi'
import { readMinutes } from '../../lib/articleUtils'
import { trackEvent } from '../../lib/analytics'
import { useCountUp } from '../../hooks/useCountUp'
import ArticleCover from './ArticleCover'

function Stat({ icon: Icon, value, label }: { icon: typeof FileText; value: string; label: string }) {
  const { ref, display } = useCountUp<HTMLSpanElement>(value)
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-background/60 p-5">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <span ref={ref} className="block text-3xl font-black tabular-nums tracking-tight text-foreground">
          {display}
        </span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

export default function BlogHero({ articles }: { articles: ArticleRow[] }) {
  const reduce = useReducedMotion()
  const featured = articles[0]
  const minutes = articles.reduce((sum, article) => sum + readMinutes(article), 0)

  return (
    <section aria-labelledby="blog-heading" className="relative px-6 pb-12 pt-28 md:px-12 md:pb-16 md:pt-36">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <motion.h1
            id="blog-heading"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text pb-2 text-[clamp(2.6rem,9vw,8rem)] font-black leading-[0.95] tracking-tighter text-transparent"
          >
            ARTICLES &amp; NOTES
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground md:text-base"
          >
            A dedicated space for documenting what I learn in the Salesforce ecosystem — LWC, SLDS, Marketing Cloud and personalization — written for developers who ship.
          </motion.p>
        </div>

        {featured && (
          <div className="mt-16 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <motion.a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('Article', 'article_click', featured.title, { destination: featured.url })}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group relative block overflow-hidden rounded-[2rem] border border-border"
            >
              <span className="block overflow-hidden">
                <span className="block transition-transform duration-700 group-hover:scale-[1.03]">
                  <ArticleCover title={featured.title} index={0} large className="min-h-[19rem] md:min-h-[26rem]" />
                </span>
              </span>
              <span className="absolute left-5 top-5 rounded-full bg-black/75 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur md:left-6 md:top-6">
                Featured publication
              </span>
              <span className="flex flex-col items-start justify-between gap-4 bg-neutral-950 p-6 text-white md:absolute md:inset-x-0 md:bottom-0 md:flex-row md:items-end md:bg-transparent md:bg-gradient-to-t md:from-black/70 md:to-transparent md:p-8">
                <span className="max-w-xl text-sm leading-relaxed text-white/85 md:text-base">{featured.summary}</span>
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 font-mono text-[10px] font-black uppercase tracking-widest text-black">
                  Explore story
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </span>
            </motion.a>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between gap-4 rounded-[2rem] border border-border bg-card/60 p-6 md:p-8"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Publication stats</p>
                <p className="mt-3 text-xl font-bold tracking-tight text-foreground">Writing as I learn, shipping as I write.</p>
              </div>
              <div className="space-y-3">
                <Stat icon={FileText} value={String(articles.length)} label="Articles" />
                <Stat icon={Clock} value={String(minutes)} label="Minutes of reading" />
                <Stat icon={Layers} value="1" label="Platform · LinkedIn" />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
