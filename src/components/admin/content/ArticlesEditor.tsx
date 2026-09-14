import { useState, type ReactNode } from 'react'
import { useCrudList } from '../../../hooks/useCrudList'
import { fetchArticles, type ArticleRow } from '../../../lib/contentApi'
import { createArticle, deleteArticle, updateArticle } from '../../../lib/contentAdminApi'
import { EditorCard, Field, MoveButtons, SaveDeleteRow, TextArea, TextInput } from './fields'

type Draft = Omit<ArticleRow, 'id' | 'sort_order'>

const blank: Draft = { title: '', summary: '', url: '', published_on: 'LinkedIn', read_time: '' }

function ArticleForm({
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
      <Field label="Title">
        <TextInput value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
      </Field>
      <Field label="Summary">
        <TextArea value={draft.summary} onChange={(v) => setDraft((d) => ({ ...d, summary: v }))} rows={2} />
      </Field>
      <Field label="URL">
        <TextInput value={draft.url} onChange={(v) => setDraft((d) => ({ ...d, url: v }))} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Published on">
          <TextInput value={draft.published_on} onChange={(v) => setDraft((d) => ({ ...d, published_on: v }))} />
        </Field>
        <Field label="Read time">
          <TextInput
            value={draft.read_time ?? ''}
            onChange={(v) => setDraft((d) => ({ ...d, read_time: v }))}
            placeholder="4 min read"
          />
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

export default function ArticlesEditor() {
  const { items, loading, error, savingId, create, update, remove, move } = useCrudList(
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  )
  const [adding, setAdding] = useState(false)

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {items.map((article, i) => (
        <ArticleForm
          key={article.id}
          initial={article}
          sortOrder={article.sort_order}
          saving={savingId === article.id}
          onSave={(draft) => update(article.id, draft)}
          onDelete={() => window.confirm(`Delete "${article.title}"?`) && remove(article.id)}
          header={
            <MoveButtons
              onMoveUp={() => move(article.id, 'up')}
              onMoveDown={() => move(article.id, 'down')}
              disableUp={i === 0}
              disableDown={i === items.length - 1}
            />
          }
        />
      ))}

      {adding ? (
        <ArticleForm
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
          + Add article
        </button>
      )}
    </div>
  )
}
