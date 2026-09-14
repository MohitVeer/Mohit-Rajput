import { ReactNode } from 'react'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-accent'

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  )
}

// One item per line — used for bullets / achievements / clients / tags.
// Simpler and more forgiving to type into than a nested add/remove list UI
// for content that's mostly written in a text editor and pasted in.
export function ListTextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string[]
  onChange: (v: string[]) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      value={value.join('\n')}
      onChange={(e) => onChange(e.target.value.split('\n').map((line) => line.trim()).filter(Boolean))}
      rows={rows}
      placeholder={placeholder}
      className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
    />
  )
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className={`${inputClass} resize-y`}
    />
  )
}

export function EditorCard({ children }: { children: ReactNode }) {
  return <div className="glass-card space-y-4 p-5">{children}</div>
}

export function SaveDeleteRow({
  saving,
  onSave,
  onDelete,
  saveLabel = 'Save',
}: {
  saving: boolean
  onSave: () => void
  onDelete?: () => void
  saveLabel?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {saving ? 'Saving…' : saveLabel}
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={saving}
          className="rounded-full border border-red-400/30 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
        >
          Delete
        </button>
      )}
    </div>
  )
}
