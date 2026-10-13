import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProjectDetail from '../components/projectspage/ProjectDetail'
import { useProject } from '../hooks/useProjects'
import { setPageMeta } from '../lib/pageMeta'
import { seoForProject } from '../lib/seo'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { item, items, loading } = useProject(slug)

  useEffect(() => {
    if (item) {
      const page = seoForProject({
        slug: item.slug,
        title: item.title,
        description: item.description,
        tags: item.tags,
        sector: item.sector,
        employer: item.employer,
        role: item.role,
      })
      setPageMeta({ title: page.title, description: page.description, path: page.path, type: page.type, jsonLd: page.jsonLd })
    } else if (!loading) {
      setPageMeta({ title: 'Project not found — Mohit Rajput', path: `/projects/${slug ?? ''}`, noindex: true })
    }
  }, [item, loading, slug])

  if (item) return <ProjectDetail key={item.slug} item={item} items={items} />

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="grid min-h-[100svh] place-items-center">
        <span className="sr-only">Loading project</span>
        <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground" />
      </div>
    )
  }

  return (
    <section className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-primary">404</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight md:text-7xl">Project not found.</h1>
        <p className="mt-4 text-muted-foreground">That project link may be old or mistyped.</p>
        <Link
          to="/projects"
          className="mt-8 inline-flex rounded-full bg-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
        >
          Browse all projects
        </Link>
      </div>
    </section>
  )
}
