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
  const ActiveEditor = SECTIONS.find((s) => s.key === active)?.Editor ?? ExperienceEditor

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        Edits here go live on the site immediately — no code change or deploy needed.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Content sections">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            role="tab"
            aria-selected={active === section.key}
            onClick={() => setActive(section.key)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
              active === section.key
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border text-muted-foreground hover:border-accent/60 hover:text-foreground'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <ActiveEditor />
      </div>
    </div>
  )
}
