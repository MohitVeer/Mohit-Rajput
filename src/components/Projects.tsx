import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { fetchProjects } from '../lib/contentApi'
import { useLiveContent } from '../hooks/useLiveContent'
import { skillIcons } from './icons/TechIcons'
import Section from './shell/Section'
import { trackExternalLink } from '../lib/analytics'

export default function Projects() {
  const projects = useLiveContent(fetchProjects, [])

  return (
    <Section id="projects" index="07" label="Projects" className="relative bg-background px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16 space-y-4"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary/60">Portfolio</p>
          <h2 id="projects-heading" className="text-4xl font-black leading-[1.05] tracking-tighter text-foreground md:text-6xl lg:text-7xl">
            Selected <span className="font-serif font-normal italic">projects</span>
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">A closer look at a few things I&apos;ve built end to end.</p>
        </motion.div>

        {projects.length === 0 ? (
          <p className="max-w-xl border-t border-border pt-8 text-lg text-muted-foreground">Case studies are on the way — check back soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project, i) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white/70 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-foreground/30 dark:border-neutral-800 dark:bg-zinc-950/60"
              >
                {project.image && (
                  <div className="relative h-60 w-full overflow-hidden bg-muted">
                    <img
                      src={project.image}
                      alt={`Screenshot of ${project.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      width={640}
                      height={360}
                    />
                    <span aria-hidden="true" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-foreground text-background opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-foreground md:text-3xl">{project.title}</h3>
                  <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">{project.description}</p>

                  {project.tags.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => {
                        const Icon = skillIcons[tag]
                        return (
                          <li key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-foreground/90 dark:border-neutral-800">
                            {Icon && <Icon className="shrink-0" />}
                            {tag}
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  {(project.live_url || project.repo_url) && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackExternalLink(project.live_url as string, `project:${project.title}:live`)}
                          className="rounded-full bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
                        >
                          Live site
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackExternalLink(project.repo_url as string, `project:${project.title}:repo`)}
                          className="rounded-full border-2 border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
                        >
                          Source
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
