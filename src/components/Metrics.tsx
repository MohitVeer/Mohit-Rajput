import { stats } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Metrics() {
  return (
    <Scene id="metrics" index="01" label="Impact">
      <Reveal>
        <h2
          id="metrics-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
        >
          Impact &amp; <span className="text-gradient">Results.</span>
        </h2>
      </Reveal>

      <dl className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.06} className="border-b border-border pb-6">
            <dd className="font-display text-5xl font-semibold text-accent sm:text-6xl md:text-7xl">
              {stat.value}
            </dd>
            <dt className="mt-2 text-base text-muted-foreground">{stat.label}</dt>
          </Reveal>
        ))}
      </dl>
    </Scene>
  )
}
