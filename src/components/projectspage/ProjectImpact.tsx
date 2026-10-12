import { Sparkles } from 'lucide-react'
import { stats } from '../../data/profile'
import { useCountUp } from '../../hooks/useCountUp'
import type { ProjectItem } from '../../hooks/useProjects'

const byLabel = (label: string) => stats.find((stat) => stat.label === label)?.value

function Figure({ value, label }: { value: string; label: string }) {
  const { ref, display } = useCountUp<HTMLSpanElement>(value)
  return (
    <div className="text-center">
      <span ref={ref} className="block text-4xl font-black tabular-nums tracking-tight text-foreground md:text-5xl lg:text-6xl">
        {display}
      </span>
      <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
    </div>
  )
}

export default function ProjectImpact({ items }: { items: ProjectItem[] }) {
  const clients = items.filter((item) => item.kind === 'client').length
  const figures = [
    clients > 0 ? { value: String(clients), label: 'Enterprise clients' } : null,
    byLabel('Faster LWC portal load time') ? { value: byLabel('Faster LWC portal load time') as string, label: 'Faster portal load' } : null,
    byLabel('Shorter delivery cycles') ? { value: byLabel('Shorter delivery cycles') as string, label: 'Shorter delivery cycles' } : null,
    byLabel('Client CSAT sustained') ? { value: byLabel('Client CSAT sustained') as string, label: 'Client CSAT' } : null,
  ].filter((figure): figure is { value: string; label: string } => figure !== null)

  return (
    <section aria-labelledby="impact-heading" className="relative px-6 py-16 text-center md:py-24">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        Project impact
      </span>
      <h2 id="impact-heading" className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
        Building The Future
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
        Production Salesforce experiences for global brands — measured in speed, delivery and client satisfaction.
      </p>
      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-10 md:grid-cols-4">
        {figures.map((figure) => (
          <Figure key={figure.label} value={figure.value} label={figure.label} />
        ))}
      </div>
    </section>
  )
}
