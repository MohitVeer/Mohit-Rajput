import { useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchCertGroups, type Cert, type CertGroupRow } from '../../../lib/contentApi'
import { createCertGroup, deleteCertGroup, updateCertGroup } from '../../../lib/contentAdminApi'
import { EditorCard, Field, MoveButtons, SaveDeleteRow, TextInput } from './fields'

type Draft = { title: string; logo: string; certs: Cert[] }

const blankCert: Cert = { name: '', image: '', alt: '', fileUrl: '' }

function toDraft(row: { title: string; logo: string | null; certs: Cert[] }): Draft {
  return { title: row.title, logo: row.logo ?? '', certs: row.certs.length > 0 ? row.certs : [blankCert] }
}

const blank: Draft = { title: '', logo: '', certs: [blankCert] }

function CertFields({
  cert,
  onChange,
  onRemove,
  canRemove,
}: {
  cert: Cert
  onChange: (cert: Cert) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name">
          <TextInput value={cert.name} onChange={(v) => onChange({ ...cert, name: v })} />
        </Field>
        <Field label="Badge image path">
          <TextInput
            value={cert.image}
            onChange={(v) => onChange({ ...cert, image: v })}
            placeholder="/Salesforce Icons/…"
          />
        </Field>
        <Field label="Alt text">
          <TextInput value={cert.alt} onChange={(v) => onChange({ ...cert, alt: v })} />
        </Field>
        <Field label="Certificate PDF path">
          <TextInput
            value={cert.fileUrl}
            onChange={(v) => onChange({ ...cert, fileUrl: v })}
            placeholder="/Certifications/…"
          />
        </Field>
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-3 text-xs font-semibold text-red-300 transition hover:text-red-200"
        >
          Remove this certification
        </button>
      )}
    </div>
  )
}

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
  onSave: (draft: { title: string; logo: string; certs: Cert[]; sort_order: number }) => void
  onDelete?: () => void
  saveLabel?: string
  header?: ReactNode
}) {
  const [draft, setDraft] = useState<Draft>(initial)

  const updateCert = (index: number, cert: Cert) => {
    setDraft((d) => ({ ...d, certs: d.certs.map((c, i) => (i === index ? cert : c)) }))
  }
  const removeCert = (index: number) => {
    setDraft((d) => ({ ...d, certs: d.certs.filter((_, i) => i !== index) }))
  }
  const addCert = () => {
    setDraft((d) => ({ ...d, certs: [...d.certs, blankCert] }))
  }

  return (
    <EditorCard header={header}>
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

      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Certifications in this group
        </span>
        {draft.certs.map((cert, i) => (
          <CertFields
            key={i}
            cert={cert}
            onChange={(c) => updateCert(i, c)}
            onRemove={() => removeCert(i)}
            canRemove={draft.certs.length > 1}
          />
        ))}
        <button
          type="button"
          onClick={addCert}
          className="w-full rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
        >
          + Add certification to this group
        </button>
      </div>

      <SaveDeleteRow
        saving={saving}
        onSave={() =>
          onSave({
            title: draft.title,
            logo: draft.logo,
            certs: draft.certs.filter((c) => c.name.trim()),
            sort_order: sortOrder,
          })
        }
        onDelete={onDelete}
        saveLabel={saveLabel}
      />
    </EditorCard>
  )
}

export default function CertGroupsEditor() {
  const { items, loading, error, savingId, create, update, remove, move } = useCrudList(
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

      {items.map((group: CertGroupRow, i) => (
        <GroupForm
          key={group.id}
          initial={toDraft(group)}
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
          + Add certification group
        </button>
      )}
    </div>
  )
}
