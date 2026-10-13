import { useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchEngagements, type EngagementRow } from '../../../lib/contentApi'
import { createEngagement, createEngagements, deleteEngagement, updateEngagement } from '../../../lib/contentAdminApi'
import { builtInEngagementRows, employerSuggestions } from '../../../lib/contentModel'
import { CheckboxField, cleanLines, ComboInput, EditorCard, Field, Hint, ImportBanner, ListTextArea, MoveButtons, SaveDeleteRow, SelectInput, TextInput } from './EditorFields'

type Draft = {
  employer: string
  role: string
  title: string
  period: string
  current: boolean
  kind: EngagementRow['kind']
  highlights: string[]
  stackCsv: string
}

const KIND_OPTIONS: { value: EngagementRow['kind']; label: string }[] = [
  { value: 'client', label: 'Client projects' },
  { value: 'accelerator', label: 'Internal accelerator' },
  { value: 'product', label: 'Product / storefront' },
]

function toDraft(row: EngagementRow): Draft {
  return {
    employer: row.employer,
    role: row.role,
    title: row.title,
    period: row.period,
    current: row.current,
    kind: row.kind,
    highlights: row.highlights,
    stackCsv: row.stack.join(', '),
  }
}

const blank: Draft = { employer: '', role: '', title: '', period: '', current: false, kind: 'client', highlights: [], stackCsv: '' }

function EngagementForm({
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
  onSave: (draft: Omit<EngagementRow, 'id'>) => void
  onDelete?: () => void
  saveLabel?: string
  header?: ReactNode
}) {
  const [draft, setDraft] = useState<Draft>(initial)
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const handleSave = () => {
    onSave({
      employer: draft.employer.trim(),
      role: draft.role.trim(),
      title: draft.title.trim(),
      period: draft.period.trim(),
      current: draft.current,
      kind: draft.kind,
      highlights: cleanLines(draft.highlights),
      stack: draft.stackCsv
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      sort_order: sortOrder,
    })
  }

  return (
    <EditorCard header={header}>
      <Field label="Title of the engagement">
        <TextInput value={draft.title} onChange={(v) => set('title', v)} placeholder="Enterprise Experience Cloud programs" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Employer / company">
          <ComboInput value={draft.employer} onChange={(v) => set('employer', v)} suggestions={employerSuggestions()} placeholder="Wipro" />
        </Field>
        <Field label="Your role">
          <TextInput value={draft.role} onChange={(v) => set('role', v)} placeholder="Salesforce Consultant" />
        </Field>
        <Field label="Period">
          <TextInput value={draft.period} onChange={(v) => set('period', v)} placeholder="Sep 2024 — Present" />
        </Field>
        <Field label="Groups projects of type">
          <SelectInput value={draft.kind} onChange={(v) => set('kind', v)} options={KIND_OPTIONS} />
        </Field>
      </div>
      <CheckboxField checked={draft.current} onChange={(v) => set('current', v)} label="Current engagement (shows the green dot)" />
      <Field label="Highlights (one per line)">
        <ListTextArea value={draft.highlights} onChange={(v) => set('highlights', v)} rows={5} />
      </Field>
      <Field label="Stack (comma-separated)">
        <TextInput value={draft.stackCsv} onChange={(v) => set('stackCsv', v)} placeholder="LWC, Apex, Experience Cloud" />
      </Field>
      <SaveDeleteRow saving={saving} onSave={handleSave} onDelete={onDelete} saveLabel={saveLabel} />
    </EditorCard>
  )
}

export default function EngagementsEditor() {
  const { items, loading, error, savingId, create, update, remove, move, reload } = useCrudList(
    fetchEngagements,
    createEngagement,
    updateEngagement,
    deleteEngagement,
  )
  const [adding, setAdding] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const nextOrder = items.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1
  const builtIns = builtInEngagementRows(nextOrder)

  const importBuiltIns = async () => {
    if (!window.confirm(`Import ${builtIns.length} built-in engagements?\n\nAfter this, the list here replaces the built-in cards on the home page.`)) return
    setImporting(true)
    setImportError(null)
    try {
      await createEngagements(builtIns)
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

      <Hint>
        Each engagement is one stacked card on the home page. The clients shown on a card are the projects with the same employer and type, so add or edit projects in the Projects section and they appear here automatically.
      </Hint>

      {!loading && items.length === 0 && (
        <ImportBanner
          title="Manage the built-in engagement cards here"
          body={`The ${builtIns.length} cards for Wipro, Mphasis Silverline and DJT currently come from the site's code. Import them once to edit or reorder them. Until you do, the built-in cards are shown.`}
          busy={importing}
          onImport={importBuiltIns}
          label="Import built-in engagements"
        />
      )}

      {items.map((engagement, i) => (
        <EngagementForm
          key={engagement.id}
          initial={toDraft(engagement)}
          sortOrder={engagement.sort_order}
          saving={savingId === engagement.id}
          onSave={(draft) => update(engagement.id, draft)}
          onDelete={() => window.confirm(`Delete "${engagement.title}"?`) && remove(engagement.id)}
          header={
            <MoveButtons
              onMoveUp={() => move(engagement.id, 'up')}
              onMoveDown={() => move(engagement.id, 'down')}
              disableUp={i === 0}
              disableDown={i === items.length - 1}
            />
          }
        />
      ))}

      {adding ? (
        <EngagementForm
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
          + Add engagement
        </button>
      )}
    </div>
  )
}
