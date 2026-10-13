import BrandScroller from '../ui/BrandScroller'
import SkillIcon from './SkillIcon'

const ROW_ONE = ['VS Code', 'Git', 'GitHub', 'Gearset', 'SFDX CLI', 'Postman', 'JIRA']
const ROW_TWO = ['Figma', 'Adobe XD', 'Litmus', 'NPM', 'Node.js', 'Agentforce', 'React.js']

const toItems = (names: string[]) => names.map((name) => ({ name, icon: <SkillIcon name={name} size={32} /> }))

export default function ToolingMarquee() {
  return (
    <section aria-labelledby="tooling-heading" className="relative overflow-hidden py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground">Workflow &amp; infrastructure</p>
        <h2 id="tooling-heading" className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
          Professional Tooling
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          The platforms I rely on to design, build, test and deploy — rapid, reliable and repeatable.
        </p>
      </div>
      <div className="mt-14 space-y-2">
        <BrandScroller items={toItems(ROW_ONE)} duration={34} label="Development and delivery tools" />
        <BrandScroller items={toItems(ROW_TWO)} reverse duration={38} label="Design, email and framework tools" />
      </div>
    </section>
  )
}
