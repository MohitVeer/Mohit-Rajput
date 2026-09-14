import { useState } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchSuperbadges, type SuperbadgeRow } from '../../../lib/contentApi'
import { createSuperbadge, deleteSuperbadge, updateSuperbadge } from '../../../lib/contentAdminApi'
import { EditorCard, Field, SaveDeleteRow, TextArea, TextInput } from './fields'

type Draft = Omit<SuperbadgeRow, 'id' | 'sort_order'>

const blank: Draft = { title: '', description: '', image: '', url: '' }

function BadgeForm({
  initial,
  sortOrder,
  saving,
  onSave,
  onDelete,
  saveLabel,
}: {
  initial: Draft
  sortOrder: number
  saving: boolean
  onSave: (draft: Draft & { sort_order: number }) => void
  onDelete?: () => void
  saveLabel?: string
}) {
  const [draft, setDraft] = useState<Draft>(initial)

  return (
    <EditorCard>
      <Field label="Title">
        <TextInput value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
      </Field>
      <Field label="Description">
        <TextArea value={draft.description} onChange={(v) => setDraft((d) => ({ ...d, description: v }))} rows={2} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Image path">
          <TextInput value={draft.image ?? ''} onChange={(v) => setDraft((d) => ({ ...d, image: v }))} />
        </Field>
        <Field label="Trailhead URL">
          <TextInput value={draft.url} onChange={(v) => setDraft((d) => ({ ...d, url: v }))} />
        </Field>
      </div>
      <SaveDeleteRow
        saving={saving}
        onSave={() => onSave({ ...draft, sort_order: sortOrder })}
        onDelete={onDelete}
        saveLabel={saveLabel}
      />
    </EditorCard>
  )
}

export default function SuperbadgesEditor() {
  const { items, loading, error, savingId, create, update, remove } = useCrudList(
    fetchSuperbadges,
    createSuperbadge,
    updateSuperbadge,
    deleteSuperbadge,
  )
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {items.map((badge) => (
        <BadgeForm
          key={badge.id}
          initial={badge}
          sortOrder={badge.sort_order}
          saving={savingId === badge.id}
          onSave={(draft) => update(badge.id, draft)}
          onDelete={() => window.confirm(`Delete "${badge.title}"?`) && remove(badge.id)}
        />
      ))}

      {adding ? (
        <BadgeForm
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
          + Add superbadge
        </button>
      )}
    </div>
  )
}
