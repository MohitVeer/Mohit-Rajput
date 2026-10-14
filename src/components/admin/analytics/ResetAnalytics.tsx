import { useEffect, useId, useRef, useState } from 'react'
import { resetAnalytics, type ResetResult } from '../../../lib/adminApi'

const PHRASE = 'RESET'

export default function ResetAnalytics({ onReset }: { onReset: (result: ResetResult) => void }) {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const hintId = useId()

  const close = () => {
    if (busy) return
    setOpen(false)
    setTyped('')
    setError(null)
    trigger.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    input.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) {
        setOpen(false)
        setTyped('')
        setError(null)
        trigger.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, busy])

  const confirm = async () => {
    if (typed.trim().toUpperCase() !== PHRASE || busy) return
    setBusy(true)
    setError(null)
    try {
      const result = await resetAnalytics()
      setOpen(false)
      setTyped('')
      onReset(result)
      trigger.current?.focus()
    } catch (err) {
      const detail = typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: unknown }).message) : ''
      setError(`The reset failed${detail ? `: ${detail}` : ''}. Nothing was deleted.`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
      >
        Reset all tracking data
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={hintId} className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              void confirm()
            }}
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-card"
          >
            <h2 id={titleId} className="font-display text-lg font-semibold text-foreground">
              Reset all tracking data?
            </h2>
            <p id={hintId} className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This permanently deletes every visitor, session, page view and click recorded so far, for all dates. Your content (projects, articles, experience, skills) is not touched. This cannot be undone.
            </p>

            <label htmlFor={`${titleId}-input`} className="mt-5 block text-xs font-mono uppercase tracking-wide text-muted-foreground">
              Type {PHRASE} to confirm
            </label>
            <input
              id={`${titleId}-input`}
              ref={input}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={busy}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground outline-none focus:border-red-400/60"
            />

            {error && (
              <p role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={close} disabled={busy} className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground disabled:opacity-50">
                Cancel
              </button>
              <button
                type="submit"
                disabled={typed.trim().toUpperCase() !== PHRASE || busy}
                className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy ? 'Deleting…' : 'Delete all tracking data'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
