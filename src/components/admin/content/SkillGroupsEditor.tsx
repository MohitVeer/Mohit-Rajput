import { useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchSkillGroups, type SkillGroupRow } from '../../../lib/contentApi'
import { createSkillGroup, deleteSkillGroup, updateSkillGroup } from '../../../lib/contentAdminApi'
import { cleanLines, EditorCard, Field, ListTextArea, MoveButtons, SaveDeleteRow, TextInput } from './fields'

type Draft = Omit<SkillGroupRow, 'id' | 'sort_order'>

const blank: Draft = { title: '', skills: [] }

function GroupForm({
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
      <Field label="Group title">
        <TextInput value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
      </Field>
      <Field label="Skills — one per line, in the order they should appear. Each matches an icon automatically by exact name; reorder by re-arranging these lines.">
        <ListTextArea value={draft.skills} onChange={(v) => setDraft((d) => ({ ...d, skills: v }))} rows={8} />
      </Field>
      <SaveDeleteRow
        saving={saving}
        onSave={() => onSave({ ...draft, skills: cleanLines(draft.skills), sort_order: sortOrder })}
        onDelete={onDelete}
        saveLabel={saveLabel}
      />
    </EditorCard>
  )
}

export default function SkillGroupsEditor() {
  const { items, loading, error, savingId, create, update, remove, move } = useCrudList(
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

      {items.map((group, i) => (
        <GroupForm
          key={group.id}
          initial={group}
          sortOrder={group.sort_order}
          saving={savingId === group.id}
          onSave={(draft) => update(group.id, draft)}
          onDelete={() => window.confirm(`Delete the "${group.title}" group?`) && remove(group.id)}
          header={
            <MoveButtons
              onMoveUp={() => move(group.id, 'up')}
              onMoveDown={() => move(group.id, 'down')}
              disableUp={i === 0}
              disableDown={i === items.length - 1}
            />
          }
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
