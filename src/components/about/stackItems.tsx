import type { ScrollerItem } from '../ui/BrandScroller'
import { skillIcons } from '../icons/skillIcons'

const ICON_SIZE = { width: 40, height: 40 }

function fromSkill(skill: string, label?: string): ScrollerItem | null {
  const Icon = skillIcons[skill]
  if (!Icon) return null
  return { name: label ?? skill, icon: <Icon {...ICON_SIZE} /> }
}

const compact = (items: Array<ScrollerItem | null>) => items.filter((item): item is ScrollerItem => item !== null)

export const frontEndStack = compact([
  fromSkill('React.js', 'React'),
  fromSkill('TypeScript'),
  fromSkill('JavaScript (ES6+)', 'JavaScript'),
  fromSkill('HTML5'),
  fromSkill('CSS3 / SCSS', 'CSS3 / SCSS'),
  fromSkill('Vue.js', 'Vue'),
  fromSkill('Next.js'),
  fromSkill('Node.js'),
])

export const salesforceStack = compact([
  fromSkill('Agentforce'),
  fromSkill('SFDX CLI', 'Salesforce CLI'),
  fromSkill('Gearset'),
  fromSkill('Git'),
  fromSkill('GitHub'),
  fromSkill('Figma'),
  fromSkill('JIRA', 'Jira'),
  fromSkill('Postman'),
  fromSkill('VS Code', 'VS Code'),
  fromSkill('Litmus'),
])
