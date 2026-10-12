import { useState } from 'react'
import { Trophy } from 'lucide-react'
import type { Achievement, AchievementKind } from '../../lib/achievements'
import { cn } from '../../lib/cn'

const GRADIENTS: Record<AchievementKind, string> = {
  certification: 'from-sky-500 via-blue-600 to-indigo-700',
  superbadge: 'from-violet-500 via-fuchsia-600 to-pink-600',
  trailhead: 'from-emerald-500 via-teal-600 to-cyan-700',
  award: 'from-amber-400 via-orange-500 to-rose-600',
}

interface AchievementThumbProps {
  item: Achievement
  className?: string
  alt?: string
  priority?: boolean
}

export default function AchievementThumb({ item, className, alt = '', priority = false }: AchievementThumbProps) {
  const [failed, setFailed] = useState(false)
  const showCertificate = item.image && !failed

  if (showCertificate) {
    return (
      <img
        src={item.image ?? undefined}
        alt={alt}
        width={1280}
        height={720}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', className)}
      />
    )
  }

  return (
    <div className={cn('relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br', GRADIENTS[item.kind], className)}>
      <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_55%)]" />
      {item.badge ? (
        <img
          src={item.badge}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="relative h-3/5 w-auto max-w-[70%] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
        />
      ) : (
        <Trophy className="relative h-1/3 w-1/3 text-white drop-shadow-lg" aria-hidden="true" />
      )}
    </div>
  )
}
