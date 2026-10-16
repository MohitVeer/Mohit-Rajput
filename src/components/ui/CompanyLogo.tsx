import { companyLogo } from '../../data/companyLogos'
import { cn } from '../../lib/cn'

function initials(name: string): string {
  const words = name
    .replace(/[^A-Za-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  return `${words[0]?.[0] ?? ''}${words[1]?.[0] ?? ''}`
}

export default function CompanyLogo({ company, size = 44, className }: { company: string; size?: number; className?: string }) {
  const src = companyLogo(company)

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid shrink-0 place-items-center overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/15',
        src ? 'bg-white' : 'bg-muted text-foreground',
        className,
      )}
      style={{ width: `${size / 16}rem`, height: `${size / 16}rem` }}
    >
      {src ? (
        <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-contain p-1" />
      ) : (
        <span className="text-xs font-black uppercase tracking-tight">{initials(company)}</span>
      )}
    </span>
  )
}
