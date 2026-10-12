import { coverFor } from '../../lib/articleUtils'
import { cn } from '../../lib/cn'
import { LinkedInMark } from '../icons/BrandMarks'

interface ArticleCoverProps {
  title: string
  index: number
  large?: boolean
  className?: string
}

export default function ArticleCover({ title, index, large = false, className }: ArticleCoverProps) {
  const { color, text } = coverFor(index)
  return (
    <div className={cn('relative flex w-full flex-col justify-between gap-6 overflow-hidden p-6 md:p-8', className)} style={{ backgroundColor: color, color: text }}>
      <span aria-hidden="true" className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-20" style={{ backgroundColor: text }} />
      <span aria-hidden="true" className="absolute -bottom-14 left-1/3 h-52 w-52 rounded-full opacity-10" style={{ backgroundColor: text }} />
      {large ? (
        <span aria-hidden="true" className="h-4" />
      ) : (
        <span className="relative font-mono text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">{String(index + 1).padStart(2, '0')}</span>
      )}
      <span className={cn('relative font-black leading-[1.08] tracking-tight', large ? 'text-3xl md:text-5xl' : 'text-xl')}>{title}</span>
      {large ? <span aria-hidden="true" className="h-5" /> : <LinkedInMark className="relative h-5 w-5 opacity-70" />}
    </div>
  )
}
