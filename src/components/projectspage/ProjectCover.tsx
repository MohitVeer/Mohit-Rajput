import type { ProjectItem } from '../../hooks/useProjects'
import { cn } from '../../lib/cn'
import { toneFor } from '../../lib/projectTone'

interface ProjectCoverProps {
  item: ProjectItem
  size?: 'banner' | 'card' | 'preview' | 'compact'
  className?: string
}

const TITLE_SIZE = {
  banner: 'text-3xl sm:text-5xl md:text-7xl',
  card: 'text-3xl sm:text-4xl',
  preview: 'text-4xl',
  compact: 'text-xl md:text-2xl',
}

export default function ProjectCover({ item, size = 'card', className }: ProjectCoverProps) {
  const tone = toneFor(item.slug)

  if (item.image) {
    return (
      <div className={cn('relative isolate overflow-hidden bg-zinc-950', className)}>
        <img src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    )
  }

  return (
    <div className={cn('relative isolate overflow-hidden bg-zinc-950 text-white', className)}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: `radial-gradient(120% 90% at 100% 0%, ${tone}99, transparent 62%), radial-gradient(90% 80% at 0% 100%, ${tone}44, transparent 62%)` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <svg aria-hidden="true" viewBox="0 0 400 240" preserveAspectRatio="xMaxYMax slice" className="absolute inset-0 h-full w-full">
        {[60, 105, 150, 195, 240].map((radius) => (
          <circle key={radius} cx="372" cy="214" r={radius} fill="none" stroke={tone} strokeOpacity={0.5 - radius / 700} strokeWidth="1" strokeDasharray="2 5" />
        ))}
        <circle cx="372" cy="214" r="5" fill={tone} />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute -right-2 -top-8 select-none text-[14rem] font-black leading-none text-white/[0.05]">
        {item.title.charAt(0)}
      </span>
      <div className={cn('relative z-10 flex h-full flex-col justify-between gap-3 p-5', size === 'compact' ? 'md:p-5' : 'gap-4 md:p-8')}>
        <span className="flex items-start gap-2 font-mono text-[0.625rem] font-bold uppercase leading-snug tracking-[0.25em] text-white/70">
          <span className="mt-[0.1875rem] h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: tone }} />
          <span className="min-w-0 break-words">{item.sector ?? (item.kind === 'case-study' ? 'Case study' : 'Project')}</span>
        </span>
        <span className="block min-w-0">
          <span className={cn('block break-words font-black leading-[1.02] tracking-tight [text-wrap:balance]', TITLE_SIZE[size])}>{item.title}</span>
          {size !== 'compact' && (item.employer || item.role) && (
            <span className="mt-3 block font-mono text-[0.625rem] font-bold uppercase leading-relaxed tracking-[0.2em] text-white/60">
              {[item.employer, item.role].filter(Boolean).join(' · ')}
            </span>
          )}
        </span>
      </div>
    </div>
  )
}
