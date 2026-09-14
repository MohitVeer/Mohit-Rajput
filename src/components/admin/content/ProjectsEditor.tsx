import { useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchProjects, type ProjectRow } from '../../../lib/contentApi'
import { createProject, deleteProject, updateProject } from '../../../lib/contentAdminApi'
import { EditorCard, Field, MoveButtons, SaveDeleteRow, TextArea, TextInput } from './fields'

type Draft = {
  title: string
  description: string
  image: string
  tagsCsv: string
  live_url: string
  repo_url: string
}

function toDraft(row: ProjectRow): Draft {
  return {
    title: row.title,
    description: row.description,
    image: row.image ?? '',
    tagsCsv: row.tags.join(', '),
    live_url: row.live_url ?? '',
    repo_url: row.repo_url ?? '',
  }
}

const blank: Draft = { title: '', description: '', image: '', tagsCsv: '', live_url: '', repo_url: '' }

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

  const handleSave = () => {
    onSave({
      title: draft.title,
      description: draft.description,
      image: draft.image || null,
      tags: draft.tagsCsv
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      live_url: draft.live_url || null,
      repo_url: draft.repo_url || null,
      sort_order: sortOrder,
    })
  }

  return (
    <EditorCard header={header}>
      <Field label="Title">
        <TextInput value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
      </Field>
      <Field label="Description">
        <TextArea value={draft.description} onChange={(v) => setDraft((d) => ({ ...d, description: v }))} rows={3} />
      </Field>
      <Field label="Screenshot / thumbnail path or URL">
        <TextInput value={draft.image} onChange={(v) => setDraft((d) => ({ ...d, image: v }))} />
      </Field>
      <Field label="Tags (comma-separated — matches a tech icon by exact name)">
        <TextInput
          value={draft.tagsCsv}
          onChange={(v) => setDraft((d) => ({ ...d, tagsCsv: v }))}
          placeholder="React.js, TypeScript, LWC"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live URL (optional)">
          <TextInput value={draft.live_url} onChange={(v) => setDraft((d) => ({ ...d, live_url: v }))} />
        </Field>
        <Field label="Repo URL (optional)">
          <TextInput value={draft.repo_url} onChange={(v) => setDraft((d) => ({ ...d, repo_url: v }))} />
        </Field>
      </div>
      <SaveDeleteRow saving={saving} onSave={handleSave} onDelete={onDelete} saveLabel={saveLabel} />
    </EditorCard>
  )
}

export default function ProjectsEditor() {
  const { items, loading, error, savingId, create, update, remove, move } = useCrudList(
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  )
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!loading && items.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground">
          No projects yet — this section shows a "coming soon" message on the live site until you add one.
        </p>
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
          + Add project
        </button>
      )}
    </div>
  )
}
