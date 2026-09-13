import { ReactNode } from 'react'

export default function ChartCard({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{title}</p>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}
