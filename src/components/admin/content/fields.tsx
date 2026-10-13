import { useId, type ReactNode } from 'react'

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

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputClass}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function ComboInput({
  value,
  onChange,
  suggestions,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  suggestions: string[]
  placeholder?: string
}) {
  const listId = useId()
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={listId}
        className={inputClass}
      />
      <datalist id={listId}>
        {suggestions.map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
    </>
  )
}

export function CheckboxField({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 text-sm font-medium text-foreground">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[var(--accent,#4c76ff)]" />
      {label}
    </label>
  )
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted-foreground">{children}</p>
}

export function ImportBanner({
  title,
  body,
  busy,
  onImport,
  label,
}: {
  title: string
  body: string
  busy: boolean
  onImport: () => void
  label: string
}) {
  return (
    <div className="glass-card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
      </div>
      <button
        type="button"
        onClick={onImport}
        disabled={busy}
        className="shrink-0 rounded-full border border-border px-5 py-2 text-sm font-semibold transition hover:border-accent disabled:opacity-50"
      >
        {busy ? 'Importing…' : label}
      </button>
    </div>
  )
}

export function cleanLines(lines: string[]): string[] {
  return lines.map((line) => line.trim()).filter(Boolean)
}

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
      onChange={(e) => onChange(e.target.value.split('\n'))}
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

export function EditorCard({ children, header }: { children: ReactNode; header?: ReactNode }) {
  return (
    <div className="glass-card space-y-4 p-5">
      {header && <div className="flex items-start justify-between gap-3">{header}</div>}
      {children}
    </div>
  )
}

export function MoveButtons({
  onMoveUp,
  onMoveDown,
  disableUp,
  disableDown,
}: {
  onMoveUp: () => void
  onMoveDown: () => void
  disableUp: boolean
  disableDown: boolean
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disableUp}
        aria-label="Move up"
        title="Move up"
        className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disableDown}
        aria-label="Move down"
        title="Move down"
        className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground transition hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground"
      >
        ↓
      </button>
    </div>
  )
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
