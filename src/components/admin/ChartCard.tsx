import { ReactNode } from 'react'

export default function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  )
}
