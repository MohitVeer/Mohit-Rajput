import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ClientOrbit from '../components/experience/ClientOrbit'
import ExperienceHero from '../components/experience/ExperienceHero'
import YearTimeline from '../components/experience/YearTimeline'
import { useExperience } from '../hooks/useExperience'
import { usePageMeta } from '../hooks/usePageMeta'
import { projectSlugFor, useProjects } from '../hooks/useProjects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { clientsForJob } from '../lib/experienceUtils'

export default function ExperiencePage() {
  usePageMeta('/experience')
  const jobs = useExperience()
  const wide = useMediaQuery('(min-width: 768px)')
  const projects = useProjects()
  const clients = Array.from(new Set(jobs.flatMap((job) => clientsForJob(job)))).slice(0, 16)
  const hrefFor = (name: string) => {
    const slug = projectSlugFor(projects, name)
    return slug ? `/projects/${slug}` : undefined
  }

  return (
    <>
      <ExperienceHero />
      <YearTimeline jobs={jobs} />

      <section aria-labelledby="clients-heading" className="relative overflow-hidden px-6 pb-16 pt-12 md:px-12 md:pb-24 md:pt-20 lg:px-20">
        <div className="mx-auto grid max-w-[1500px] items-center gap-12 2xl:grid-cols-[minmax(0,420px)_1fr] 2xl:gap-16">
          <div>
            <h2 id="clients-heading" className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Crafting Experiences That Matter
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Interfaces shipped for enterprise clients across financial services, healthcare, automotive and e-commerce.
            </p>
            <Link
              to="/resume"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-muted px-7 py-4 text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              View resume
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {wide ? (
            <ClientOrbit labels={clients} hrefFor={hrefFor} />
          ) : (
            <ul className="flex flex-wrap gap-2" aria-label="Clients and products I have shipped for">
              {clients.map((client) => {
                const href = hrefFor(client)
                const chip = 'inline-flex rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground'
                return (
                  <li key={client}>
                    {href ? (
                      <Link to={href} className={`${chip} transition-colors hover:border-foreground/40 hover:bg-foreground/5`}>
                        {client}
                      </Link>
                    ) : (
                      <span className={chip}>{client}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
