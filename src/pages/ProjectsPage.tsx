import { useMemo } from 'react'
import GithubDashboard from '../components/github/GithubDashboard'
import { GitHubMark } from '../components/icons/BrandMarks'
import ProjectImpact from '../components/projectspage/ProjectImpact'
import ProjectsArchive from '../components/projectspage/ProjectsArchive'
import ProjectsCta from '../components/projectspage/ProjectsCta'
import ProjectsHero from '../components/projectspage/ProjectsHero'
import { usePageMeta } from '../hooks/usePageMeta'
import { useProjects } from '../hooks/useProjects'

export default function ProjectsPage() {
  const items = useProjects()
  const collection = useMemo(() => items.map((item) => ({ name: item.title, path: `/projects/${item.slug}` })), [items])
  usePageMeta('/projects', collection)

  return (
    <>
      <ProjectsHero items={items} />
      <ProjectImpact items={items} />
      <ProjectsArchive items={items} />

      <section id="open-source" aria-labelledby="open-source-heading" className="relative mx-auto max-w-[93.75rem] scroll-mt-24 px-6 pb-16 md:px-12 md:pb-24">
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-[#15803d] dark:text-[#22c55e]">
          <GitHubMark className="h-6 w-6" />
          GitHub ecosystem
        </p>
        <h2 id="open-source-heading" className="mb-10 mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
          Building in the open, <span className="text-[#15803d] dark:text-[#22c55e]">live from GitHub.</span>
        </h2>
        <GithubDashboard />
      </section>

      <ProjectsCta />
    </>
  )
}
