import { stats } from '../data/profile'
import Scene from './cinematic/Scene'
import Reveal from './cinematic/Reveal'
import { useCountUp } from '../hooks/useCountUp'

function statFontSize(value: string) {
  const max = Math.min(4.75, Math.max(2.5, 4.75 - (value.length - 1) * 0.3))
  return `clamp(1.85rem, 1.1rem + 3.4vw, ${max}rem)`
}

function Stat({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp<HTMLDivElement>(value)

  return (
    <div className="glass-card group h-full min-w-0 p-6 transition-colors hover:border-accent/50 hover:shadow-glow">
      <div
        ref={ref}
        style={{ fontSize: statFontSize(value) }}
        className="font-display font-semibold leading-none tabular-nums text-accent"
      >
        {display}
      </div>
      <p className="mt-3 text-base text-muted-foreground">{label}</p>
    </div>
  )
}

export default function Metrics() {
  return (
    <Scene id="metrics" index="01" label="Impact" center>
      <Reveal>
        <h2
          id="metrics-heading"
          className="max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl mt-2"
        >
          Impact &amp; <span className="text-gradient">Results.</span>
        </h2>
      </Reveal>

      {/* Plain divs, not dl/dt/dd — these are stat tiles, not true
          term/definition pairs, and the Reveal + glass-card wrappers each
          nest of one own div between dl and its dt/dd, which HTML5 only
          allows a single such wrapper for — real markup issue Lighthouse
          flagged, not just a style choice. */}
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.06}>
            <Stat value={stat.value} label={stat.label} />
          </Reveal>
        ))}
      </div>
    </Scene>
  )
}
