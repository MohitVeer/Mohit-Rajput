import { useMediaQuery } from '../hooks/useMediaQuery'
import FeatureList from './skills/FeatureList'
import SkillExplorer from './skills/SkillExplorer'
import SkillsAdventure from './skills/SkillsAdventure'
import Section from './shell/Section'

export default function Skills() {
  const wide = useMediaQuery('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')

  return (
    <Section id="skills" index="03" label="Skills" className="relative bg-background dark:bg-black">
      <h2 id="skills-heading" className="sr-only">
        Skills and expertise
      </h2>
      {wide ? <SkillsAdventure /> : <FeatureList />}
      <SkillExplorer />
    </Section>
  )
}
