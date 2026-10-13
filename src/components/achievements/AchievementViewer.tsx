import { useEffect } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import type { Achievement } from '../../lib/achievements'
import { achievementDate, KIND_LABEL } from '../../lib/achievements'
import { trackEvent, trackExternalLink } from '../../lib/analytics'
import FullscreenDialog from '../ui/FullscreenDialog'
import AchievementThumb from './AchievementThumb'

interface AchievementViewerProps {
  items: Achievement[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function AchievementViewer({ items, index, onClose, onNavigate }: AchievementViewerProps) {
  const open = index !== null && items[index] !== undefined
  const item = open ? items[index as number] : null

  useEffect(() => {
    if (!open || index === null) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') onNavigate((index + 1) % items.length)
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, index, items.length, onNavigate])

  useEffect(() => {
    if (item) trackEvent('Certification', 'cert_view', item.title)
  }, [item])

  const external = item ? item.url.startsWith('http') : false

  return (
    <FullscreenDialog open={open} onClose={onClose} label={item ? `${item.title} — ${KIND_LABEL[item.kind]}` : 'Achievement'}>
      {item && index !== null && (
        <div className="mx-auto grid min-h-screen max-w-[1500px] items-center gap-10 px-5 pb-12 pt-24 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:px-12">
          <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
            <div className="aspect-video">
              <AchievementThumb item={item} full alt={`${item.title} — ${KIND_LABEL[item.kind].toLowerCase()} awarded to Mohit Rajput`} priority />
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
              {KIND_LABEL[item.kind]}
              {item.group ? ` · ${item.group}` : ''}
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-foreground md:text-5xl">{item.title}</h2>
            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex gap-4">
                <dt className="w-28 shrink-0 font-bold uppercase tracking-widest text-muted-foreground">Issuer</dt>
                <dd className="font-medium text-foreground">{item.issuer}</dd>
              </div>
              {achievementDate(item) && (
                <div className="flex gap-4">
                  <dt className="w-28 shrink-0 font-bold uppercase tracking-widest text-muted-foreground">Issued</dt>
                  <dd className="font-medium text-foreground">{item.issued}</dd>
                </div>
              )}
              {item.kind === 'award' && item.issued && (
                <div className="flex gap-4">
                  <dt className="w-28 shrink-0 font-bold uppercase tracking-widest text-muted-foreground">During</dt>
                  <dd className="font-medium text-foreground">{item.issued}</dd>
                </div>
              )}
              {item.credentialId && (
                <div className="flex gap-4">
                  <dt className="w-28 shrink-0 font-bold uppercase tracking-widest text-muted-foreground">Credential</dt>
                  <dd className="font-mono font-medium text-foreground">{item.credentialId}</dd>
                </div>
              )}
            </dl>
            {item.description && item.description !== item.title && (
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{item.description}</p>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {external ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackExternalLink(item.url, `verify:${item.title}`)}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-widest text-background transition-transform hover:scale-105"
                >
                  {item.kind === 'certification' ? 'Verify credential' : 'View on Trailblazer'}
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
              {item.fileUrl && (
                <a
                  href={item.fileUrl}
                  download
                  onClick={() => trackEvent('Certification', 'cert_download', item.title)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-6 py-3 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background dark:border-white/20"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download PDF
                </a>
              )}
            </div>

            <div className="mt-12 flex items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate((index - 1 + items.length) % items.length)}
                aria-label="Previous entry"
                className="grid h-12 w-12 place-items-center rounded-full border border-border transition-all hover:scale-110 hover:bg-muted"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate((index + 1) % items.length)}
                aria-label="Next entry"
                className="grid h-12 w-12 place-items-center rounded-full border border-border transition-all hover:scale-110 hover:bg-muted"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="font-mono text-xs tracking-widest text-muted-foreground" aria-live="polite">
                {index + 1} / {items.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </FullscreenDialog>
  )
}
