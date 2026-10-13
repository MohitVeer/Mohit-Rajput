import { useMemo, useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchCertGroups, type Cert, type CertGroupRow } from '../../../lib/contentApi'
import { createCertGroup, createCertGroups, deleteCertGroup, updateCertGroup } from '../../../lib/contentAdminApi'
import { missingBuiltInCerts } from '../../../lib/contentModel'
import { EditorCard, Field, Hint, ImportBanner, MoveButtons, SaveDeleteRow, TextArea, TextInput } from './fields'

type Draft = { title: string; logo: string; certs: Cert[] }

const blankCert: Cert = { name: '', image: '', alt: '', fileUrl: '' }

function toDraft(row: { title: string; logo: string | null; certs: Cert[] }): Draft {
  return { title: row.title, logo: row.logo ?? '', certs: row.certs.length > 0 ? row.certs : [blankCert] }
}

const blank: Draft = { title: '', logo: '', certs: [blankCert] }

const OPTIONAL_CERT_FIELDS = ['issuer', 'issued', 'credentialId', 'verifyUrl', 'description', 'preview'] as const

function cleanCert(cert: Cert): Cert {
  const cleaned: Cert = { name: cert.name.trim(), image: cert.image.trim(), alt: cert.alt.trim(), fileUrl: cert.fileUrl.trim() }
  for (const key of OPTIONAL_CERT_FIELDS) {
    const value = cert[key]?.trim()
    if (value) cleaned[key] = value
  }
  return cleaned
}

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
        <Field label="Certificate PDF path (optional)">
          <TextInput
            value={cert.fileUrl}
            onChange={(v) => onChange({ ...cert, fileUrl: v })}
            placeholder="/Certifications/…"
          />
        </Field>
        <Field label="Issuer (empty means Salesforce)">
          <TextInput value={cert.issuer ?? ''} onChange={(v) => onChange({ ...cert, issuer: v })} placeholder="Udemy" />
        </Field>
        <Field label="Issued on">
          <TextInput value={cert.issued ?? ''} onChange={(v) => onChange({ ...cert, issued: v })} placeholder="March 12, 2026" />
        </Field>
        <Field label="Credential ID">
          <TextInput value={cert.credentialId ?? ''} onChange={(v) => onChange({ ...cert, credentialId: v })} />
        </Field>
        <Field label="Verification link">
          <TextInput value={cert.verifyUrl ?? ''} onChange={(v) => onChange({ ...cert, verifyUrl: v })} placeholder="https://…" />
        </Field>
        <Field label="Certificate image path (when there is no PDF)">
          <TextInput
            value={cert.preview ?? ''}
            onChange={(v) => onChange({ ...cert, preview: v })}
            placeholder="/certificates/…webp"
          />
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Description (optional)">
          <TextArea value={cert.description ?? ''} onChange={(v) => onChange({ ...cert, description: v })} rows={2} />
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
            certs: draft.certs.filter((c) => c.name.trim()).map(cleanCert),
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
  const { items, loading, error, savingId, create, update, remove, move, reload } = useCrudList(
    fetchCertGroups,
    createCertGroup,
    updateCertGroup,
    deleteCertGroup,
  )
  const [adding, setAdding] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const plan = useMemo(() => missingBuiltInCerts(items), [items])

  const importMissing = async () => {
    setImporting(true)
    setImportError(null)
    try {
      if (plan.add.length > 0) await createCertGroups(plan.add)
      for (const group of plan.extend) await updateCertGroup(group.id, { certs: group.certs })
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

      <Hint>Preview images are files in the site's /certificates folder. For a PDF at /Certifications/Name.pdf the site shows /certificates/Name.webp and Name-sm.webp; a certificate without a PDF (for example an online-only one) uses its own certificate image path instead. Adding a new image file needs a code change and a deploy.</Hint>

      {!loading && plan.names.length > 0 && (
        <ImportBanner
          title={`${plan.names.length} built-in ${plan.names.length === 1 ? 'certificate is' : 'certificates are'} not saved here yet`}
          body={`${plan.names.join('; ')}. The site shows only what is saved in this list, so add them to make them appear. You can edit or reorder them afterwards.`}
          busy={importing}
          onImport={importMissing}
          label="Add missing certificates"
        />
      )}

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
