import { skillGroups } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Skills() {
  return (
    <Scene id="skills" index="04" label="Gear Cache">
      <Reveal>
        <h2
          id="skills-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl"
        >
          The stack I ship <span className="text-gradient">in production.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-x-16 gap-y-10 md:grid-cols-2">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.08} className="border-b border-border pb-8">
            <h3 className="scene-index">{group.title}</h3>
            <p className="mt-4 font-display text-xl leading-snug md:text-2xl">
              {group.skills.join(' · ')}
            </p>
          </Reveal>
        ))}
      </div>
    </Scene>
  )
}
