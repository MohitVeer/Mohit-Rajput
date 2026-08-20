import { aboutFacts } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function About() {
  return (
    <Scene id="about" index="02" label="About" center>
      <Reveal>
        <h2
          id="about-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl mt-2"
        >
          About <span className="text-gradient">Me.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
  I build scalable, user-focused digital experiences across the Salesforce ecosystem and modern
  front-end technologies. With 5+ years of experience, I work with{' '}
  <span className="text-foreground">
    Lightning Web Components, Experience Cloud, Agentforce, OmniStudio, Marketing Cloud, and modern
    JavaScript frameworks
  </span>{' '}
  to turn complex requirements into intuitive, production-ready solutions.
</p>
      </Reveal>

      <Reveal delay={0.2}>
        <ul className="mt-12 grid gap-x-10 gap-y-4 font-mono text-base text-foreground sm:grid-cols-2">
          {aboutFacts.map((fact) => (
            <li key={fact} className="flex items-baseline gap-3 border-b border-border pb-4">
              <span className="text-accent" aria-hidden="true">
                —
              </span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Scene>
  )
}
