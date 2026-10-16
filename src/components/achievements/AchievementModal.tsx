import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Award, Building2, ChevronLeft, ChevronRight, Download, ExternalLink, MousePointer2 } from 'lucide-react'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { formatLongDate, type Achievement } from '../../lib/achievements'
import { trackEvent, trackExternalLink } from '../../lib/analytics'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

const isPdf = (path: string) => /\.pdf$/i.test(path)
const pad = (value: number) => String(value).padStart(2, '0')
const pathName = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 32)

interface AchievementModalProps {
  items: Achievement[]
  index: number
  onClose: () => void
  onNavigate: (index: number) => void
}

interface DetailRow {
  command: string
  value: string
  accent?: boolean
}

function detailRows(item: Achievement): DetailRow[] {
  const rows: DetailRow[] = []
  if (item.kind === 'award') {
    if (item.issued) rows.push({ command: 'date --period', value: item.issued })
  } else if (item.time !== undefined) {
    rows.push({ command: 'date --issued', value: formatLongDate(item.time) })
  }
  if (item.credentialId) rows.push({ command: 'credential --id', value: item.credentialId, accent: true })
  if (rows.length < 2) rows.push({ command: 'type --kind', value: item.group && item.kind === 'certification' ? `${item.label} · ${item.group}` : item.label })
  return rows
}

export default function AchievementModal({ items, index, onClose, onNavigate }: AchievementModalProps) {
  const item = items[index]
  const panelRef = useRef<HTMLDivElement>(null)
  const count = items.length

  useBodyScrollLock(true)

  const step = useCallback((delta: number) => onNavigate((index + delta + count) % count), [index, count, onNavigate])

  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null
    const timer = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(), 60)
    return () => {
      window.clearTimeout(timer)
      returnTo?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowRight') {
        step(1)
        return
      }
      if (event.key === 'ArrowLeft') {
        step(-1)
        return
      }
      if (event.key !== 'Tab') return
      const nodes = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, step])

  const title = item?.title
  useEffect(() => {
    if (title) trackEvent('Certification', 'cert_view', title)
  }, [title])

  if (!item || typeof document === 'undefined') return null

  const external = item.url.startsWith('http')
  const verifyLabel = item.kind === 'certification' ? 'Verify Source' : 'View on Trailhead'
  const rows = detailRows(item)
  const showDescription = item.description && item.description !== item.title

  return createPortal(
    <motion.div
      role="presentation"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center overflow-hidden bg-background/40 p-4 backdrop-blur-2xl md:p-8 lg:p-12"
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} — ${item.label}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/90 shadow-2xl backdrop-blur-3xl dark:bg-card/70 dark:shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-between border-b border-border/50 bg-foreground/5 px-6 py-4">
          <div className="flex items-center gap-1">
            <button type="button" onClick={onClose} aria-label="Close" title="Close" className="group grid h-6 w-6 place-items-center rounded-full">
              <span className="block h-3.5 w-3.5 rounded-full bg-[#FF5F56] shadow-sm transition-all group-hover:brightness-75" />
            </button>
            <span aria-hidden="true" className="mx-[0.3125rem] h-3.5 w-3.5 rounded-full bg-[#FFBD2E] opacity-50 shadow-sm" />
            <span aria-hidden="true" className="h-3.5 w-3.5 rounded-full bg-[#27C93F] opacity-50 shadow-sm" />
          </div>

          <div aria-hidden="true" className="hidden items-center gap-2 rounded-lg border border-border/20 bg-background/40 px-4 py-1.5 shadow-inner sm:flex">
            <MousePointer2 className="h-3 w-3 text-primary" />
            <span className="font-mono text-[0.625rem] font-bold tracking-tight text-foreground/60">
              ~/achievements/<span className="text-foreground">cert_{pathName(item.title)}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md border border-border/30 bg-background/50 px-3 py-1.5 font-mono text-[0.625rem] font-black tracking-widest" aria-live="polite">
              <span className="text-foreground">{pad(index + 1)}</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-muted-foreground">{pad(count)}</span>
              <span className="sr-only"> entries</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous entry"
                className="rounded-md p-1 px-2 text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground active:scale-90"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next entry"
                className="rounded-md p-1 px-2 text-muted-foreground transition-all hover:bg-foreground/10 hover:text-foreground active:scale-90"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="no-scrollbar flex max-h-[85vh] flex-col items-stretch gap-10 overflow-auto p-6 md:p-8 lg:flex-row lg:p-10">
          <div className="flex flex-col gap-4 lg:w-[55%]">
            <motion.div
              key={`${item.id}-media`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="group relative flex w-full items-center justify-center rounded-xl border border-border/10 bg-background/20 p-2 shadow-inner"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={`${item.title} — ${item.label.toLowerCase()} awarded to Mohit Rajput`}
                  width={1280}
                  height={720}
                  className="h-auto max-h-[55vh] w-full rounded-lg border border-border/20 object-contain shadow-xl"
                />
              ) : item.badge ? (
                <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500">
                  <img src={item.badge} alt={`${item.title} badge`} className="max-h-[70%] w-auto max-w-[60%] object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.5)]" />
                </div>
              ) : (
                <div aria-hidden="true" className="flex h-48 w-48 items-center justify-center rounded-3xl border border-border/10 bg-foreground/5 opacity-20 backdrop-blur-3xl">
                  <Award className="h-24 w-24 text-foreground" />
                </div>
              )}
              <div aria-hidden="true" className="absolute bottom-6 left-6 rounded-md border border-white/10 bg-black/50 px-3 py-1.5 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                <span className="font-mono text-[0.625rem] uppercase tracking-widest text-white/80">Type: {item.label}</span>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col justify-between py-2 lg:w-[45%]">
            <div className="space-y-8">
              <div className="space-y-4">
                <motion.h2
                  key={`${item.id}-title`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-black leading-[1.05] tracking-tight text-foreground lg:text-4xl"
                >
                  {item.title}
                </motion.h2>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex w-fit items-center gap-3 rounded-xl border border-border/30 bg-foreground/5 px-4 py-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm font-bold tracking-tight text-foreground/80">{item.issuer}</span>
                  </div>

                  {external && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackExternalLink(item.url, `verify:${item.title}`)}
                      className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-foreground px-4 py-2 text-[0.625rem] font-black uppercase tracking-[0.2em] text-background shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                      <span aria-hidden="true" className="absolute inset-0 bg-primary opacity-0 transition-opacity group-hover:opacity-10" />
                      <span>{verifyLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}

                  {item.fileUrl && (
                    <a
                      href={item.fileUrl}
                      {...(isPdf(item.fileUrl) ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                      onClick={() => trackEvent('Certification', 'cert_download', item.title)}
                      className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-border/50 px-4 py-2 text-[0.625rem] font-black uppercase tracking-[0.2em] text-foreground transition-all hover:-translate-y-0.5 hover:bg-foreground/10 active:scale-95"
                    >
                      {isPdf(item.fileUrl) ? <Download className="h-3.5 w-3.5" aria-hidden="true" /> : <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                      <span>{isPdf(item.fileUrl) ? 'Download PDF' : 'Open original'}</span>
                    </a>
                  )}
                </div>

                {showDescription && <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
              </div>

              <dl className="grid grid-cols-1 gap-2.5 font-mono">
                {rows.map((row) => (
                  <div key={row.command} className="group flex flex-col gap-1 rounded-xl border border-border/50 bg-foreground/[0.03] p-4 transition-all hover:bg-foreground/[0.05]">
                    <dt className="text-[0.5rem] font-black uppercase tracking-[0.2em] text-muted-foreground/70">$ {row.command}</dt>
                    <dd className={row.accent ? 'break-all text-[0.625rem] font-bold text-primary' : 'text-[0.625rem] font-bold uppercase tracking-wider text-foreground/90'}>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
