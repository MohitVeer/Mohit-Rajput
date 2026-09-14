import { useState } from 'react'
import ExperienceEditor from './ExperienceEditor'
import SkillGroupsEditor from './SkillGroupsEditor'
import CertGroupsEditor from './CertGroupsEditor'
import SuperbadgesEditor from './SuperbadgesEditor'
import ArticlesEditor from './ArticlesEditor'
import ProjectsEditor from './ProjectsEditor'

const SECTIONS = [
  { key: 'experience', label: 'Experience', Editor: ExperienceEditor },
  { key: 'skills', label: 'Skills', Editor: SkillGroupsEditor },
  { key: 'certs', label: 'Certifications', Editor: CertGroupsEditor },
  { key: 'superbadges', label: 'Superbadges', Editor: SuperbadgesEditor },
  { key: 'projects', label: 'Projects', Editor: ProjectsEditor },
  { key: 'articles', label: 'Articles', Editor: ArticlesEditor },
] as const

export default function ContentManager() {
  const [active, setActive] = useState<(typeof SECTIONS)[number]['key']>('experience')
  const activeSection = SECTIONS.find((s) => s.key === active) ?? SECTIONS[0]
  const ActiveEditor = activeSection.Editor

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Edits here go live on the site immediately — no code change or deploy needed.
      </p>

      <div className="mt-6 md:grid md:grid-cols-[200px_1fr] md:items-start md:gap-8">
        {/* Sidebar: a vertical nav from md up, a horizontal scroller on mobile so it never
            wraps into a confusing multi-row grid of pills. */}
        <div
          role="tablist"
          aria-label="Content sections"
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0"
        >
          {SECTIONS.map((section) => (
            <button
              key={section.key}
              type="button"
              role="tab"
              aria-selected={active === section.key}
              onClick={() => setActive(section.key)}
              className={`shrink-0 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-colors md:w-full ${
                active === section.key
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-card hover:text-foreground'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="mt-6 min-w-0 md:mt-0">
          <h2 className="font-display text-xl font-semibold">{activeSection.label}</h2>
          <div className="mt-4">
            <ActiveEditor />
          </div>
        </div>
      </div>
    </div>
  )
}
