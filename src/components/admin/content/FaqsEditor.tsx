import { useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchFaqs, type FaqRow } from '../../../lib/contentApi'
import { createFaq, createFaqs, deleteFaq, updateFaq } from '../../../lib/contentAdminApi'
import { builtInFaqRows } from '../../../lib/contentModel'
import { EditorCard, Field, Hint, ImportBanner, MoveButtons, SaveDeleteRow, TextArea, TextInput } from './fields'

type Draft = Pick<FaqRow, 'question' | 'answer'>

const blank: Draft = { question: '', answer: '' }

function FaqForm({
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
      <Field label="Question">
        <TextInput value={draft.question} onChange={(v) => setDraft((d) => ({ ...d, question: v }))} />
      </Field>
      <Field label="Answer">
        <TextArea value={draft.answer} onChange={(v) => setDraft((d) => ({ ...d, answer: v }))} rows={4} />
      </Field>
      <SaveDeleteRow
        saving={saving}
        onSave={() => onSave({ question: draft.question.trim(), answer: draft.answer.trim(), sort_order: sortOrder })}
        onDelete={onDelete}
        saveLabel={saveLabel}
      />
    </EditorCard>
  )
}

export default function FaqsEditor() {
  const { items, loading, error, savingId, create, update, remove, move, reload } = useCrudList(fetchFaqs, createFaq, updateFaq, deleteFaq)
  const [adding, setAdding] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const nextOrder = items.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1
  const builtIns = builtInFaqRows(nextOrder)

  const importBuiltIns = async () => {
    if (!window.confirm(`Import ${builtIns.length} built-in questions?\n\nAfter this, the list here replaces the built-in FAQ on the Contact page.`)) return
    setImporting(true)
    setImportError(null)
    try {
      await createFaqs(builtIns)
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

      <Hint>These questions appear in the "Frequently Asked Questions" list on the Contact page.</Hint>

      {!loading && items.length === 0 && (
        <ImportBanner
          title="Manage the built-in questions here"
          body={`The ${builtIns.length} questions currently come from the site's code. Import them once to edit, reorder or remove them. Until you do, the built-in list is shown.`}
          busy={importing}
          onImport={importBuiltIns}
          label="Import built-in questions"
        />
      )}

      {items.map((entry, i) => (
        <FaqForm
          key={entry.id}
          initial={entry}
          sortOrder={entry.sort_order}
          saving={savingId === entry.id}
          onSave={(draft) => update(entry.id, draft)}
          onDelete={() => window.confirm(`Delete "${entry.question}"?`) && remove(entry.id)}
          header={
            <MoveButtons
              onMoveUp={() => move(entry.id, 'up')}
              onMoveDown={() => move(entry.id, 'down')}
              disableUp={i === 0}
              disableDown={i === items.length - 1}
            />
          }
        />
      ))}

      {adding ? (
        <FaqForm
          initial={blank}
          sortOrder={nextOrder}
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
          + Add question
        </button>
      )}
    </div>
  )
}
