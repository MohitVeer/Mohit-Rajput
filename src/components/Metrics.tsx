import { stats } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'

export default function Metrics() {
  return (
    <Scene id="metrics" index="01" label="Impact">
      <h2 id="metrics-heading" className="sr-only">
        Impact, by the numbers
      </h2>

      <dl className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.06} className="border-b border-border pb-6">
            <dd className="font-display text-6xl font-semibold text-accent md:text-7xl">
              {stat.value}
            </dd>
            <dt className="mt-2 text-sm text-muted-foreground">{stat.label}</dt>
          </Reveal>
        ))}
      </dl>
    </Scene>
  )
}
