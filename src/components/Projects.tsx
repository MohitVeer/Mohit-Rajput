import { fetchProjects } from '../lib/contentApi'
import { useLiveContent } from '../hooks/useLiveContent'
import { skillIcons } from './icons/TechIcons'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'
import { trackExternalLink } from '../lib/analytics'

export default function Projects() {
  const projects = useLiveContent(fetchProjects, [])

  return (
    <Scene id="projects" index="07" label="Projects" center={projects.length === 0}>
      <Reveal>
        <h2
          id="projects-heading"
          className="max-w-4xl mt-2 font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Selected <span className="text-gradient">Projects.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          A closer look at a few things I&apos;ve built end to end.
        </p>
      </Reveal>

      {projects.length === 0 ? (
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-xl text-base text-muted-foreground">
            Case studies are on the way — check back soon.
          </p>
        </Reveal>
      ) : (
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal
              key={project.id}
              delay={i * 0.08}
              className="glass-card flex h-full flex-col overflow-hidden transition-colors hover:border-accent/40"
            >
              {project.image && (
                <img
                  src={project.image}
                  alt=""
                  loading="lazy"
                  className="h-48 w-full object-cover"
                  width={640}
                  height={360}
                />
              )}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="font-display text-2xl font-semibold leading-snug">{project.title}</h3>
                <p className="mt-3 flex-1 text-base text-muted-foreground">{project.description}</p>

                {project.tags.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => {
                      const Icon = skillIcons[tag]
                      return (
                        <li
                          key={tag}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 font-sans text-xs font-medium text-foreground/90"
                        >
                          {Icon && <Icon className="shrink-0" />}
                          {tag}
                        </li>
                      )
                    })}
                  </ul>
                )}

                {(project.live_url || project.repo_url) && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackExternalLink(project.live_url as string, `project:${project.title}:live`)}
                        className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent"
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
                        className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent"
                      >
                        Source
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </Scene>
  )
}
