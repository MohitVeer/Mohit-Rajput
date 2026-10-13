import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Layers, Link2 } from 'lucide-react'
import ArticleCover from '../components/blog/ArticleCover'
import { LinkedInMark } from '../components/icons/BrandMarks'
import ProjectCover from '../components/projectspage/ProjectCover'
import { useArticle } from '../hooks/useArticles'
import { useProjects } from '../hooks/useProjects'
import { topicsIn, articleTopics } from '../lib/articleUtils'
import { trackEvent } from '../lib/analytics'
import { cn } from '../lib/cn'
import { setPageMeta } from '../lib/pageMeta'
import { seoForArticle } from '../lib/seo'

const sidebarTitle = 'mb-6 border-b border-border pb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground'

export default function ArticlePage() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { item, items, loading } = useArticle(slug)
  const projects = useProjects()
  const [copied, setCopied] = useState(false)
  const fromList = (location.state as { from?: string } | null)?.from === 'blog'

  useEffect(() => {
    if (item) {
      const page = seoForArticle({ slug: item.slug, title: item.title, summary: item.summary, url: item.url, read_time: item.read_time })
      setPageMeta({ title: page.title, description: page.description, path: page.path, type: page.type, jsonLd: page.jsonLd })
    } else if (!loading) {
      setPageMeta({ title: 'Article not found — Mohit Rajput', path: `/blog/${slug ?? ''}`, noindex: true })
    }
  }, [item, loading, slug])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="grid min-h-[100svh] place-items-center">
        <span className="sr-only">Loading article</span>
        <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground" />
      </div>
    )
  }

  if (!item) {
    return (
      <section className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">404</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">Article not found.</h1>
          <p className="mt-4 text-muted-foreground">That article link may be old or mistyped.</p>
          <Link to="/blog" className="mt-8 inline-flex rounded-full bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-transform hover:scale-105">
            Browse all articles
          </Link>
        </div>
      </section>
    )
  }

  const index = items.findIndex((entry) => entry.id === item.id)
  const topics = articleTopics(item)
  const others = items.filter((entry) => entry.id !== item.id)
  const more = others.slice(0, 2)
  const related = projects.filter((project) => topicsIn(`${project.tags.join(' ')} ${project.description} ${project.engagementTitle ?? ''}`).some((topic) => topics.includes(topic))).slice(0, 3)
  const sections = [
    { id: 'summary', label: 'Summary' },
    { id: 'read', label: 'Read the article' },
    ...(related.length > 0 ? [{ id: 'projects', label: 'Related projects' }] : []),
    ...(more.length > 0 ? [{ id: 'more', label: 'More articles' }] : []),
  ]

  const goBack = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!fromList) return
    event.preventDefault()
    navigate(-1)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const trackRead = () => trackEvent('Article', 'article_click', item.title, { destination: item.url })

  return (
    <div className="min-h-screen bg-background pb-24 pt-28 text-foreground sm:pt-32">
      <header className="mx-auto mb-12 w-full max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/blog" onClick={goBack} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
          <div className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            <span className="rounded-md border border-border bg-foreground/5 px-2 py-1">{item.published_on}</span>
            {item.read_time && <span>{item.read_time}</span>}
          </div>
          <h1 className="mb-6 max-w-5xl break-words text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-7xl">{item.title}</h1>
          <p className="max-w-3xl text-xl font-light leading-relaxed text-muted-foreground/90 md:text-2xl">{item.summary}</p>
        </motion.div>
      </header>

      <div className="mx-auto mb-16 w-full max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="overflow-hidden rounded-3xl border border-border shadow-2xl">
          <ArticleCover title={item.title} index={Math.max(index, 0)} large className="min-h-[16rem] md:min-h-[22rem]" />
        </motion.div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="min-w-0 space-y-20 lg:col-span-8">
            <section id="summary" aria-labelledby="summary-heading" className="scroll-mt-28">
              <h2 id="summary-heading" className="mb-6 text-2xl font-bold">
                Summary
              </h2>
              <p className="text-lg leading-loose text-muted-foreground">{item.summary}</p>
              {topics.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-3" aria-label="Topics">
                  {topics.map((topic) => (
                    <li key={topic}>
                      <Link to={`/blog?q=${encodeURIComponent(topic)}`} className="inline-flex rounded-lg bg-foreground/[0.06] px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground">
                        #{topic.replace(/\s+/g, '')}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section id="read" aria-labelledby="read-heading" className="scroll-mt-28">
              <div className="rounded-3xl border border-border bg-card/60 p-8 md:p-10">
                <LinkedInMark className="mb-5 h-7 w-7 text-[#0A66C2]" />
                <h2 id="read-heading" className="text-2xl font-bold md:text-3xl">
                  Read the full article on LinkedIn
                </h2>
                <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                  This piece was published on LinkedIn, where the complete text and the discussion live.
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackRead}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
                >
                  Open on LinkedIn
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </section>

            {related.length > 0 && (
              <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-28">
                <h2 id="projects-heading" className="mb-6 text-2xl font-bold">
                  Related projects
                </h2>
                <ul className="grid gap-5 sm:grid-cols-2">
                  {related.map((project) => (
                    <li key={project.id}>
                      <Link to={`/projects/${project.slug}`} className="group block overflow-hidden rounded-2xl border border-border transition-all hover:-translate-y-1 hover:shadow-xl">
                        <ProjectCover item={project} size="card" className="aspect-video transition-transform duration-700 group-hover:scale-105" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="relative lg:col-span-4" aria-label="Article details">
            <div className="space-y-8 [@media(min-width:1024px)_and_(min-height:760px)]:sticky [@media(min-width:1024px)_and_(min-height:760px)]:top-24">
              <nav aria-label="Table of contents" className="hidden lg:block">
                <h2 className={sidebarTitle}>Table of Contents</h2>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`} className="block transition-all duration-200 hover:translate-x-1 hover:text-foreground">
                        — {section.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {topics.length > 0 && (
                <div>
                  <h2 className={sidebarTitle}>Topics</h2>
                  <ul className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <li key={topic}>
                        <Link to={`/blog?q=${encodeURIComponent(topic)}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
                          <Layers className="h-3 w-3" aria-hidden="true" />
                          {topic}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className={sidebarTitle}>Share</h2>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-foreground/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground/10"
                >
                  {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {copied ? 'Link copied' : 'Copy link'}
                </button>
                <p className="sr-only" role="status" aria-live="polite">
                  {copied ? 'Link copied to clipboard' : ''}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {more.length > 0 && (
          <section id="more" aria-labelledby="more-heading" className="mt-28 scroll-mt-28 border-t border-border pt-16">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <h2 id="more-heading" className="text-2xl font-bold md:text-3xl">
                From the blog
              </h2>
              <Link to="/blog" className="rounded-lg border border-border px-5 py-2.5 text-sm font-bold transition-colors hover:bg-foreground hover:text-background">
                View all posts
              </Link>
            </div>
            <ul className="grid gap-8 md:grid-cols-2">
              {more.map((entry) => (
                <li key={entry.id}>
                  <Link to={`/blog/${entry.slug}`} className="group block">
                    <span className="block overflow-hidden rounded-2xl border border-border">
                      <span className="block transition-transform duration-700 group-hover:scale-105">
                        <ArticleCover title={entry.title} index={items.findIndex((candidate) => candidate.id === entry.id)} className="min-h-[14rem]" />
                      </span>
                    </span>
                    <span className="mt-5 block text-xl font-bold tracking-tight transition-colors group-hover:text-primary md:text-2xl">{entry.title}</span>
                    <span className="mt-2 block leading-relaxed text-muted-foreground">{entry.summary}</span>
                    <span className={cn('mt-4 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground')}>
                      {entry.published_on}
                      {entry.read_time ? ` · ${entry.read_time}` : ''}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-16 flex justify-center">
          <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <Link2 className="h-4 w-4" aria-hidden="true" />
            Want to talk about this topic? Get in touch
          </Link>
        </div>
      </div>
    </div>
  )
}
