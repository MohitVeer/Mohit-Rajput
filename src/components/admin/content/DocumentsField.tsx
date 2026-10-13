import { useId, useState } from 'react'
import type { DocumentKind, ExperienceDocument } from '../../../lib/contentApi'
import { uploadDocument } from '../../../lib/contentAdminApi'
import { ALLOWED_DOCUMENT_TYPES, defaultDocumentLabel, DOCUMENT_KINDS, MAX_DOCUMENT_BYTES } from '../../../lib/documents'
import { Field, Hint, SelectInput, TextInput } from './fields'

export default function DocumentsField({
  value,
  onChange,
  folder,
}: {
  value: ExperienceDocument[]
  onChange: (documents: ExperienceDocument[]) => void
  folder: string
}) {
  const baseId = useId()
  const [busy, setBusy] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const update = (index: number, patch: Partial<ExperienceDocument>) => onChange(value.map((document, i) => (i === index ? { ...document, ...patch } : document)))

  const changeKind = (index: number, kind: DocumentKind) => {
    const current = value[index]
    const keepLabel = current.label.trim() !== '' && current.label !== defaultDocumentLabel(current.kind)
    update(index, { kind, label: keepLabel ? current.label : defaultDocumentLabel(kind) })
  }

  const upload = async (index: number, file: File | undefined) => {
    if (!file) return
    setError(null)
    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      setError('Upload a PDF, PNG, JPG or WebP file.')
      return
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      setError('That file is larger than 10 MB.')
      return
    }
    setBusy(index)
    try {
      update(index, { url: await uploadDocument(file, folder) })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Documents (experience letter, relieving letter, certificates)</span>
      <Hint>Visitors see these as links under this role. Files you upload here are public — anyone with the link can open them — so only add documents you are happy to show.</Hint>

      {value.map((document, index) => (
        <div key={index} className="rounded-lg border border-border p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Type">
              <SelectInput value={document.kind} onChange={(kind) => changeKind(index, kind)} options={DOCUMENT_KINDS} />
            </Field>
            <Field label="Label shown on the site">
              <TextInput value={document.label} onChange={(label) => update(index, { label })} />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="File link (upload below or paste a link)">
              <TextInput value={document.url} onChange={(url) => update(index, { url })} placeholder="https://… or /Certifications/…" />
            </Field>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label
              htmlFor={`${baseId}-${index}`}
              className="cursor-pointer rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:border-accent"
            >
              {busy === index ? 'Uploading…' : 'Upload a file'}
            </label>
            <input
              id={`${baseId}-${index}`}
              type="file"
              accept={ALLOWED_DOCUMENT_TYPES.join(',')}
              disabled={busy !== null}
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                void upload(index, file)
              }}
            />
            {document.url && (
              <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-muted-foreground underline underline-offset-4 hover:text-foreground">
                Open current file
              </a>
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              className="ml-auto text-xs font-semibold text-red-300 transition hover:text-red-200"
            >
              Remove this document
            </button>
          </div>
        </div>
      ))}

      {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <button
        type="button"
        onClick={() => onChange([...value, { kind: 'experience-letter', label: defaultDocumentLabel('experience-letter'), url: '' }])}
        className="w-full rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
      >
        + Add a document (experience letter, relieving letter…)
      </button>
    </div>
  )
}
