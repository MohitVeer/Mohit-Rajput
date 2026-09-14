import { useState } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchSkillGroups, type SkillGroupRow } from '../../../lib/contentApi'
import { createSkillGroup, deleteSkillGroup, updateSkillGroup } from '../../../lib/contentAdminApi'
import { EditorCard, Field, ListTextArea, SaveDeleteRow, TextInput } from './fields'

type Draft = Omit<SkillGroupRow, 'id' | 'sort_order'>

const blank: Draft = { title: '', skills: [] }

function GroupForm({
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
      <Field label="Group title">
        <TextInput value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
      </Field>
      <Field label="Skills (one per line — matches an icon automatically by exact name)">
        <ListTextArea value={draft.skills} onChange={(v) => setDraft((d) => ({ ...d, skills: v }))} rows={8} />
      </Field>
      <SaveDeleteRow
        saving={saving}
        onSave={() => onSave({ ...draft, sort_order: sortOrder })}
        onDelete={onDelete}
        saveLabel={saveLabel}
      />
    </EditorCard>
  )
}

export default function SkillGroupsEditor() {
  const { items, loading, error, savingId, create, update, remove } = useCrudList(
    fetchSkillGroups,
    createSkillGroup,
    updateSkillGroup,
    deleteSkillGroup,
  )
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {items.map((group) => (
        <GroupForm
          key={group.id}
          initial={group}
          sortOrder={group.sort_order}
          saving={savingId === group.id}
          onSave={(draft) => update(group.id, draft)}
          onDelete={() => window.confirm(`Delete the "${group.title}" group?`) && remove(group.id)}
        />
      ))}

      {adding ? (
        <GroupForm
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
          + Add skill group
        </button>
      )}
    </div>
  )
}
