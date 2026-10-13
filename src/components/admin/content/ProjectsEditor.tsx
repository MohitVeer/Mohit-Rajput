import { useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchProjects, type ProjectKind, type ProjectRow, type ProjectStatus } from '../../../lib/contentApi'
import { createProject, createProjects, deleteProject, updateProject } from '../../../lib/contentAdminApi'
import { builtInProjectRows, employerSuggestions } from '../../../lib/contentModel'
import { slugify } from '../../../lib/slug'
import { cleanLines, ComboInput, EditorCard, Field, Hint, ImportBanner, ListTextArea, MoveButtons, SaveDeleteRow, SelectInput, TextArea, TextInput } from './EditorFields'

type Draft = {
  title: string
  slug: string
  kind: ProjectKind
  status: ProjectStatus
  sector: string
  employer: string
  role: string
  period: string
  description: string
  highlights: string[]
  image: string
  tagsCsv: string
  live_url: string
  repo_url: string
}

const KIND_OPTIONS: { value: ProjectKind; label: string }[] = [
  { value: 'client', label: 'Client project' },
  { value: 'accelerator', label: 'Internal accelerator' },
  { value: 'product', label: 'Product / storefront' },
  { value: 'case-study', label: 'Case study (own project)' },
]

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'ongoing', label: 'Ongoing' },
]

const isManaged = (row: ProjectRow) => Boolean(row.kind) && row.kind !== 'case-study'

function toDraft(row: ProjectRow): Draft {
  return {
    title: row.title,
    slug: row.slug ?? '',
    kind: row.kind ?? 'case-study',
    status: row.status ?? 'completed',
    sector: row.sector ?? '',
    employer: row.employer ?? '',
    role: row.role ?? '',
    period: row.period ?? '',
    description: row.description,
    highlights: row.highlights ?? [],
    image: row.image ?? '',
    tagsCsv: row.tags.join(', '),
    live_url: row.live_url ?? '',
    repo_url: row.repo_url ?? '',
  }
}

const blank: Draft = {
  title: '',
  slug: '',
  kind: 'client',
  status: 'completed',
  sector: '',
  employer: '',
  role: '',
  period: '',
  description: '',
  highlights: [],
  image: '',
  tagsCsv: '',
  live_url: '',
  repo_url: '',
}

const orNull = (value: string) => value.trim() || null

function ProjectForm({
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
  onSave: (draft: Omit<ProjectRow, 'id'>) => void
  onDelete?: () => void
  saveLabel?: string
  header?: ReactNode
}) {
  const [draft, setDraft] = useState<Draft>(initial)
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }))
  const slug = slugify(draft.slug) || slugify(draft.title)

  const handleSave = () => {
    onSave({
      title: draft.title.trim(),
      slug: slugify(draft.slug) || null,
      kind: draft.kind,
      status: draft.status,
      sector: orNull(draft.sector),
      employer: orNull(draft.employer),
      role: orNull(draft.role),
      period: orNull(draft.period),
      description: draft.description,
      highlights: cleanLines(draft.highlights),
      image: orNull(draft.image),
      tags: draft.tagsCsv
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      live_url: orNull(draft.live_url),
      repo_url: orNull(draft.repo_url),
      sort_order: sortOrder,
    })
  }

  return (
    <EditorCard header={header}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title / client name">
          <TextInput value={draft.title} onChange={(v) => set('title', v)} />
        </Field>
        <Field label="Page address (optional)">
          <TextInput value={draft.slug} onChange={(v) => set('slug', v)} placeholder={slugify(draft.title) || 'auto-from-title'} />
        </Field>
      </div>
      {slug && <Hint>This project opens at /projects/{slug}. Changing it later breaks links that already point to the old address.</Hint>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <SelectInput value={draft.kind} onChange={(v) => set('kind', v)} options={KIND_OPTIONS} />
        </Field>
        <Field label="Status">
          <SelectInput value={draft.status} onChange={(v) => set('status', v)} options={STATUS_OPTIONS} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Employer / company">
          <ComboInput value={draft.employer} onChange={(v) => set('employer', v)} suggestions={employerSuggestions()} placeholder="Wipro" />
        </Field>
        <Field label="Sector">
          <TextInput value={draft.sector} onChange={(v) => set('sector', v)} placeholder="Telecommunications" />
        </Field>
        <Field label="Your role (optional)">
          <TextInput value={draft.role} onChange={(v) => set('role', v)} placeholder="Reuses the engagement's role when empty" />
        </Field>
        <Field label="Period (optional)">
          <TextInput value={draft.period} onChange={(v) => set('period', v)} placeholder="Reuses the engagement's period when empty" />
        </Field>
      </div>

      <Field label="Description">
        <TextArea value={draft.description} onChange={(v) => set('description', v)} rows={3} />
      </Field>
      <Field label="Delivery highlights (one per line — optional)">
        <ListTextArea value={draft.highlights} onChange={(v) => set('highlights', v)} rows={4} placeholder="Leave empty to reuse the engagement's highlights" />
      </Field>
      <Field label="Tags (comma-separated — the logo is picked automatically)">
        <TextInput value={draft.tagsCsv} onChange={(v) => set('tagsCsv', v)} placeholder="React.js, TypeScript, LWC" />
      </Field>
      <Field label="Screenshot / thumbnail path or URL">
        <TextInput value={draft.image} onChange={(v) => set('image', v)} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live URL (optional)">
          <TextInput value={draft.live_url} onChange={(v) => set('live_url', v)} />
        </Field>
        <Field label="Repo URL (optional)">
          <TextInput value={draft.repo_url} onChange={(v) => set('repo_url', v)} />
        </Field>
      </div>
      <SaveDeleteRow saving={saving} onSave={handleSave} onDelete={onDelete} saveLabel={saveLabel} />
    </EditorCard>
  )
}

export default function ProjectsEditor() {
  const { items, loading, error, savingId, create, update, remove, move, reload } = useCrudList(
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  )
  const [adding, setAdding] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const nextOrder = items.reduce((max, row) => Math.max(max, row.sort_order), -1) + 1
  const managed = items.some(isManaged)
  const builtIns = builtInProjectRows(nextOrder)

  const importBuiltIns = async () => {
    const ok = window.confirm(
      `Import ${builtIns.length} built-in projects?\n\nAfter this, the list here replaces the built-in list on the Projects page. Page addresses stay the same.`,
    )
    if (!ok) return
    setImporting(true)
    setImportError(null)
    try {
      await createProjects(builtIns)
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

      {!loading && !managed && (
        <ImportBanner
          title="Manage the built-in client projects here"
          body={`Ericsson, American Honda, Foundry and the other ${builtIns.length - 3} client, accelerator and product projects currently come from the site's code. Import them once to edit, reorder or remove them in this list. Until you do, the built-in list is shown on the site.`}
          busy={importing}
          onImport={importBuiltIns}
          label="Import built-in projects"
        />
      )}
      {managed && (
        <Hint>
          Client, accelerator and product rows replace the built-in list. Case studies are always shown. Each project's page address is /projects/&lt;address&gt;. Re-deploy once after adding pages so the sitemap and search tags include them.
        </Hint>
      )}

      {items.map((project, i) => (
        <ProjectForm
          key={project.id}
          initial={toDraft(project)}
          sortOrder={project.sort_order}
          saving={savingId === project.id}
          onSave={(draft) => update(project.id, draft)}
          onDelete={() => window.confirm(`Delete "${project.title}"?`) && remove(project.id)}
          header={
            <MoveButtons
              onMoveUp={() => move(project.id, 'up')}
              onMoveDown={() => move(project.id, 'down')}
              disableUp={i === 0}
              disableDown={i === items.length - 1}
            />
          }
        />
      ))}

      {adding ? (
        <ProjectForm
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
          + Add project
        </button>
      )}
    </div>
  )
}
