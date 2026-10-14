import { useMemo, useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchExperience, type ExperienceRow } from '../../../lib/contentApi'
import { createExperience, createExperiences, deleteExperience, updateExperience } from '../../../lib/contentAdminApi'
import { missingBuiltInExperience } from '../../../lib/contentModel'
import { cleanDocuments } from '../../../lib/documents'
import DocumentsField from './DocumentsField'
import { cleanLines } from './cleanLines'
import { EditorCard, Field, ImportBanner, ListTextArea, MoveButtons, SaveDeleteRow, TextInput } from './fields'

type Draft = Omit<ExperienceRow, 'id' | 'sort_order'>

const blank: Draft = { role: '', company: '', period: '', location: '', bullets: [], achievements: [], clients: [], documents: [] }

function ExperienceForm({
  initial,
  sortOrder,
  saving,
  onSave,
  onDelete,
  saveLabel,
  header,
}: {
  initial: Draft
  sortOrder: number
  saving: boolean
  onSave: (draft: Draft & { sort_order: number }) => void
  onDelete?: () => void
  saveLabel?: string
  header?: ReactNode
}) {
  const [draft, setDraft] = useState<Draft>(initial)

  return (
    <EditorCard header={header}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Role">
          <TextInput value={draft.role} onChange={(v) => setDraft((d) => ({ ...d, role: v }))} />
        </Field>
        <Field label="Company">
          <TextInput value={draft.company} onChange={(v) => setDraft((d) => ({ ...d, company: v }))} />
        </Field>
        <Field label="Period">
          <TextInput
            value={draft.period}
            onChange={(v) => setDraft((d) => ({ ...d, period: v }))}
            placeholder="Sep 2024 — Present"
          />
        </Field>
        <Field label="Location">
          <TextInput value={draft.location} onChange={(v) => setDraft((d) => ({ ...d, location: v }))} />
        </Field>
      </div>
      <Field label="Bullets (one per line)">
        <ListTextArea value={draft.bullets} onChange={(v) => setDraft((d) => ({ ...d, bullets: v }))} rows={6} />
      </Field>
      <Field label="Achievements (one per line, optional)">
        <ListTextArea value={draft.achievements} onChange={(v) => setDraft((d) => ({ ...d, achievements: v }))} />
      </Field>
      <Field label="Clients (one per line, optional)">
        <ListTextArea value={draft.clients} onChange={(v) => setDraft((d) => ({ ...d, clients: v }))} />
      </Field>
      <DocumentsField value={draft.documents ?? []} onChange={(documents) => setDraft((d) => ({ ...d, documents }))} folder={draft.company} />
      <SaveDeleteRow
        saving={saving}
        onSave={() =>
          onSave({
            ...draft,
            bullets: cleanLines(draft.bullets),
            achievements: cleanLines(draft.achievements),
            clients: cleanLines(draft.clients),
            documents: cleanDocuments(draft.documents),
            sort_order: sortOrder,
          })
        }
        onDelete={onDelete}
        saveLabel={saveLabel}
      />
    </EditorCard>
  )
}

export default function ExperienceEditor() {
  const { items, loading, error, savingId, create, update, remove, move, reload } = useCrudList(
    fetchExperience,
    createExperience,
    updateExperience,
    deleteExperience,
  )
  const [adding, setAdding] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const missing = useMemo(() => missingBuiltInExperience(items), [items])

  const importMissing = async () => {
    setImporting(true)
    setImportError(null)
    try {
      await createExperiences(missing)
      reload()
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-4">
      {(error || importError) && (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error ?? importError}</p>
      )}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && missing.length > 0 && (
        <ImportBanner
          title={`${missing.length} built-in ${missing.length === 1 ? 'role is' : 'roles are'} not saved here yet`}
          body={`${missing.map((job) => `${job.role} at ${job.company}`).join('; ')}. The site shows only the roles saved in this list, so add them to make them appear. You can edit or reorder them afterwards.`}
          busy={importing}
          onImport={importMissing}
          label={missing.length === 1 ? 'Add this role' : 'Add missing roles'}
        />
      )}

      {items.map((job, i) => (
        <ExperienceForm
          key={job.id}
          initial={job}
          sortOrder={job.sort_order}
          saving={savingId === job.id}
          onSave={(draft) => update(job.id, draft)}
          onDelete={() => window.confirm(`Delete "${job.role} · ${job.company}"?`) && remove(job.id)}
          header={
            <MoveButtons
              onMoveUp={() => move(job.id, 'up')}
              onMoveDown={() => move(job.id, 'down')}
              disableUp={i === 0}
              disableDown={i === items.length - 1}
            />
          }
        />
      ))}

      {adding ? (
        <ExperienceForm
          initial={blank}
          sortOrder={items.length}
          saving={savingId === '__new__'}
          saveLabel="Add"
          onSave={(draft) => create(draft).then(() => setAdding(false))}
        />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="w-full rounded-lg border border-dashed border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
        >
          + Add role
        </button>
      )}
    </div>
  )
}
