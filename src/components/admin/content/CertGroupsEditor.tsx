import { useState } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchCertGroups, type Cert, type CertGroupRow } from '../../../lib/contentApi'
import { createCertGroup, deleteCertGroup, updateCertGroup } from '../../../lib/contentAdminApi'
import { EditorCard, Field, SaveDeleteRow, TextArea, TextInput } from './fields'

type Draft = { title: string; logo: string; certsJson: string }

function toDraft(row: { title: string; logo: string | null; certs: Cert[] }): Draft {
  return { title: row.title, logo: row.logo ?? '', certsJson: JSON.stringify(row.certs, null, 2) }
}

const blank: Draft = {
  title: '',
  logo: '',
  certsJson: JSON.stringify([{ name: '', image: '', alt: '', fileUrl: '' }], null, 2),
}

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
  onSave: (draft: { title: string; logo: string; certs: Cert[]; sort_order: number }) => void
  onDelete?: () => void
  saveLabel?: string
}) {
  const [draft, setDraft] = useState<Draft>(initial)
  const [jsonError, setJsonError] = useState<string | null>(null)

  const handleSave = () => {
    try {
      const certs = JSON.parse(draft.certsJson) as Cert[]
      if (!Array.isArray(certs)) throw new Error('Must be a JSON array')
      setJsonError(null)
      onSave({ title: draft.title, logo: draft.logo, certs, sort_order: sortOrder })
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }

  return (
    <EditorCard>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Group title">
          <TextInput value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
        </Field>
        <Field label="Group logo path">
          <TextInput
            value={draft.logo}
            onChange={(v) => setDraft((d) => ({ ...d, logo: v }))}
            placeholder="/Salesforce Product Icons/…"
          />
        </Field>
      </div>
      <Field label="Certifications (JSON array of { name, image, alt, fileUrl })">
        <TextArea value={draft.certsJson} onChange={(v) => setDraft((d) => ({ ...d, certsJson: v }))} rows={8} />
      </Field>
      {jsonError && <p className="text-xs text-red-300">{jsonError}</p>}
      <SaveDeleteRow saving={saving} onSave={handleSave} onDelete={onDelete} saveLabel={saveLabel} />
    </EditorCard>
  )
}

export default function CertGroupsEditor() {
  const { items, loading, error, savingId, create, update, remove } = useCrudList(
    fetchCertGroups,
    createCertGroup,
    updateCertGroup,
    deleteCertGroup,
  )
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {items.map((group: CertGroupRow) => (
        <GroupForm
          key={group.id}
          initial={toDraft(group)}
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
          + Add certification group
        </button>
      )}
    </div>
  )
}
