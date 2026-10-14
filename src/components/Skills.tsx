import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import FeatureList from './skills/FeatureList'
import SkillsAdventure from './skills/SkillsAdventure'
import Section from './shell/Section'

export default function Skills() {
  const wide = useMediaQuery('(min-width: 1024px) and (min-aspect-ratio: 5/4) and (prefers-reduced-motion: no-preference)')

  return (
    <Section id="skills" index="03" label="Skills" className="relative bg-background dark:bg-black">
      <h2 id="skills-heading" className="sr-only">
        Skills and expertise
      </h2>
      {wide ? <SkillsAdventure /> : <FeatureList />}
      <div className="relative z-10 flex justify-center px-6 pb-16 pt-6">
        <Link
          to="/skills"
          className="group inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
        >
          Explore all skills &amp; tools
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </Section>
  )
}
