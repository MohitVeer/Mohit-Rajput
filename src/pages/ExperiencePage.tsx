import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Briefcase, GraduationCap, Rocket } from 'lucide-react'
import ClientOrbit, { type OrbitNode } from '../components/experience/ClientOrbit'
import EducationPanel from '../components/experience/EducationPanel'
import ExperienceHero from '../components/experience/ExperienceHero'
import ExperienceLedger from '../components/experience/ExperienceLedger'
import LogoMarquee from '../components/experience/LogoMarquee'
import TabSlider, { type TabDefinition } from '../components/experience/TabSlider'
import YearTimeline from '../components/experience/YearTimeline'
import { education } from '../data/education'
import { useExperience } from '../hooks/useExperience'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePageMeta } from '../hooks/usePageMeta'
import { projectSlugFor, useProjects } from '../hooks/useProjects'
import { clientsForJob, jobSlug } from '../lib/experienceUtils'
import type { ExperienceRow } from '../lib/contentApi'

const TABS: TabDefinition[] = [
  { id: 'education', label: 'Education', quote: 'The academic foundation behind the work: a regular BCA followed by an MCA through distance learning.', icon: GraduationCap },
  { id: 'journey', label: 'Journey', quote: 'A timeline of roles, responsibilities, and professional growth across various organizations.', icon: Briefcase },
  { id: 'experience', label: 'Experience', quote: 'Detailed breakdown of work experiences with project highlights and achievements.', icon: Rocket },
]

const tabIndex = (id: string) => TABS.findIndex((tab) => tab.id === id)

function FloatingShape({ className, gradient, delay = 0, still }: { className: string; gradient: string; delay?: number; still: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full opacity-20 blur-3xl ${className}`}
      style={{ background: gradient }}
      animate={still ? undefined : { y: [0, -20, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 8, repeat: Infinity, delay }}
    />
  )
}

function Highlight({ headingId, title, highlight, description, children }: { headingId: string; title: string; highlight: string; description: string; children: ReactNode }) {
  return (
    <section aria-labelledby={headingId} className="relative w-full overflow-visible py-4 lg:py-6">
      <div className="mx-auto grid h-full w-full grid-cols-1 items-center gap-12 overflow-visible px-0 md:px-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:px-12">
        <div className="relative z-20 space-y-8 xl:pr-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} viewport={{ once: true }} className="space-y-6">
            <h2 id={headingId} className="text-[clamp(2.25rem,8vw,4rem)] font-bold leading-[1.1] tracking-tight text-black dark:text-white">
              {title}
              <br />
              {highlight}
            </h2>
            <p className="max-w-4xl text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">{description}</p>
            <div className="pt-4">
              <Link
                to="/resume"
                className="group flex w-fit items-center gap-2 rounded-xl bg-neutral-100 px-6 py-3 text-sm font-bold text-black transition-all hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
              >
                View resume <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="relative flex w-full items-center justify-center overflow-visible">{children}</div>
      </div>
    </section>
  )
}

export default function ExperiencePage() {
  usePageMeta('/experience')
  const jobs = useExperience()
  const projects = useProjects()
  const calm = useReducedMotion()
  const roomy = useMediaQuery('(min-width: 768px)')
  const wide = useMediaQuery('(min-width: 1024px)')
  const [active, setActive] = useState(() => tabIndex('journey'))
  const [focusJobId, setFocusJobId] = useState<string | null>(null)

  const hrefFor = useCallback(
    (name: string) => {
      const slug = projectSlugFor(projects, name)
      return slug ? `/projects/${slug}` : undefined
    },
    [projects],
  )

  const clientNames = useMemo(() => Array.from(new Set(jobs.flatMap((job) => clientsForJob(job, projects)))).slice(0, 16), [jobs, projects])
  const clients = useMemo<OrbitNode[]>(
    () =>
      clientNames.map((name) => {
        const href = hrefFor(name)
        const project = projects.find((item) => item.slug === href?.replace('/projects/', ''))
        return { label: name, href, description: project?.description }
      }),
    [clientNames, hrefFor, projects],
  )

  const orbit = roomy ? (
    <ClientOrbit nodes={clients} label="Clients and products I have shipped for" />
  ) : (
    <ChipList items={clients.map((node) => node.label)} label="Clients and products I have shipped for" links={clients} />
  )

  const openDetail = useCallback((job: ExperienceRow) => {
    setFocusJobId(jobSlug(job))
    setActive(tabIndex('experience'))
    window.scrollTo({ top: Math.max(0, (document.getElementById('experience-tabs')?.getBoundingClientRect().top ?? 0) + window.scrollY - 40), behavior: 'smooth' })
  }, [])
  const handled = useCallback(() => setFocusJobId(null), [])

  return (
    <div className="relative bg-background text-foreground">
      <ExperienceHero jobs={jobs} studies={education} />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <FloatingShape className="-right-40 -top-20 h-[min(500px,80vw)] w-[min(500px,80vw)]" gradient="radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)" still={Boolean(calm) || !wide} />
        <FloatingShape className="-left-20 bottom-40 h-[min(400px,70vw)] w-[min(400px,70vw)]" gradient="radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)" delay={3} still={Boolean(calm) || !wide} />
      </div>

      <div className="relative z-10 -mt-10 mb-20 w-full overflow-hidden pt-20 md:-mt-20">
        <LogoMarquee />
      </div>

      <div id="experience-tabs" className="relative z-10 mx-auto max-w-7xl scroll-mt-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-24">
          <TabSlider tabs={TABS} active={active} onChange={setActive} />

          <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait" initial={false}>
              {TABS[active].id === 'education' ? (
                <motion.div
                  key="education"
                  role="tabpanel"
                  id="experience-panel-education"
                  aria-labelledby="experience-tab-education"
                  initial={{ opacity: 0, y: calm ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: calm ? 0 : -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <EducationPanel entries={education} />
                </motion.div>
              ) : TABS[active].id === 'journey' ? (
                <motion.div
                  key="journey"
                  role="tabpanel"
                  id="experience-panel-journey"
                  aria-labelledby="experience-tab-journey"
                  initial={{ opacity: 0, y: calm ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: calm ? 0 : -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <YearTimeline jobs={jobs} onOpenDetail={openDetail} />
                  <div className="pb-[clamp(40px,10vh,120px)]" />
                  <Highlight
                    headingId="journey-highlight"
                    title="Crafting Experiences"
                    highlight="That Matter"
                    description="Interfaces shipped for enterprise clients across financial services, healthcare, automotive and e-commerce."
                  >
                    {orbit}
                  </Highlight>
                </motion.div>
              ) : (
                <motion.div
                  key="experience"
                  role="tabpanel"
                  id="experience-panel-experience"
                  aria-labelledby="experience-tab-experience"
                  initial={{ opacity: 0, y: calm ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: calm ? 0 : -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-12"
                >
                  <ExperienceLedger jobs={jobs} focusJobId={focusJobId} onFocusHandled={handled} />
                  <div className="pb-[clamp(40px,10vh,120px)]" />
                  <Highlight
                    headingId="experience-highlight"
                    title="Turning Ideas"
                    highlight="Into Reality"
                    description="Real-world projects that solve real problems. Building solutions that make a difference."
                  >
                    {orbit}
                  </Highlight>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChipList({ items, label, links }: { items: string[]; label: string; links?: OrbitNode[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => {
        const href = links?.find((node) => node.label === item)?.href
        const chip = 'inline-flex rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground'
        return (
          <li key={item}>
            {href ? (
              <Link to={href} className={`${chip} transition-colors hover:border-foreground/40 hover:bg-foreground/5`}>
                {item}
              </Link>
            ) : (
              <span className={chip}>{item}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
