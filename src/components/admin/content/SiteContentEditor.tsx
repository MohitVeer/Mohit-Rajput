import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { fetchSettings, resetSettingsCache } from '../../../lib/contentApi'
import { deleteSetting, saveSetting } from '../../../lib/contentAdminApi'
import { defaultSettings, resolveSettings, type SettingKey, type SiteSettings, type StatItem, type TrailheadData } from '../../../lib/siteSettings'
import { cleanLines, EditorCard, Field, Hint, ListTextArea, TextInput } from './fields'

interface Loaded {
  settings: SiteSettings
  stored: Set<string>
}

function useBlock(key: SettingKey, reload: () => Promise<void>) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const run = async (action: () => Promise<void>, done: string): Promise<boolean> => {
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await action()
      await reload()
      setMessage(done)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.')
      return false
    } finally {
      setSaving(false)
    }
  }

  return {
    saving,
    message,
    error,
    save: (value: unknown) => run(() => saveSetting(key, value), 'Saved — live on the site now.'),
    reset: () => run(() => deleteSetting(key), 'Reverted to the built-in values.'),
  }
}

function Block({
  title,
  hint,
  customised,
  state,
  onSave,
  onReset,
  children,
}: {
  title: string
  hint: string
  customised: boolean
  state: ReturnType<typeof useBlock>
  onSave: () => void
  onReset: () => void | Promise<void>
  children: ReactNode
}) {
  return (
    <EditorCard>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
            customised ? 'border-emerald-500/40 text-emerald-400' : 'border-border text-muted-foreground'
          }`}
        >
          {customised ? 'Customised' : 'Built-in values'}
        </span>
      </div>
      <Hint>{hint}</Hint>
      {children}
      {state.error && <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-400">{state.message}</p>}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onSave}
          disabled={state.saving}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {state.saving ? 'Saving…' : 'Save'}
        </button>
        {customised && (
          <button
            type="button"
            onClick={() => window.confirm('Go back to the values built into the site?') && onReset()}
            disabled={state.saving}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground disabled:opacity-50"
          >
            Use built-in values
          </button>
        )}
      </div>
    </EditorCard>
  )
}

type TrailheadDraft = Record<keyof TrailheadData, string>

const TRAILHEAD_FIELDS: { key: keyof TrailheadData; label: string; wide?: boolean }[] = [
  { key: 'rank', label: 'Rank' },
  { key: 'status', label: 'Agentforce status' },
  { key: 'badges', label: 'Badges' },
  { key: 'points', label: 'Points (as shown, e.g. 154,250)' },
  { key: 'trails', label: 'Trails' },
  { key: 'rankImage', label: 'Rank badge image path', wide: true },
  { key: 'agentblazerImage', label: 'Agentblazer badge image path', wide: true },
  { key: 'agentblazerChampionImage', label: 'Agentblazer Champion image path', wide: true },
]

function TrailheadBlock({ loaded, reload }: { loaded: Loaded; reload: () => Promise<void> }) {
  const state = useBlock('trailhead', reload)
  const [draft, setDraft] = useState<TrailheadDraft>(() => toTrailheadDraft(loaded.settings.trailhead))
  const [problem, setProblem] = useState<string | null>(null)

  const save = () => {
    const badges = Number(draft.badges.replace(/,/g, ''))
    const trails = Number(draft.trails.replace(/,/g, ''))
    if (!Number.isFinite(badges) || badges < 0 || !Number.isFinite(trails) || trails < 0) {
      setProblem('Badges and trails must be whole numbers.')
      return
    }
    setProblem(null)
    void state.save({ ...draft, badges, trails })
  }

  return (
    <Block
      title="Trailhead and Agentforce"
      hint="Drives the Trailblazer section, the zoom tiles, the Achievements page and the menu blurb."
      customised={loaded.stored.has('trailhead')}
      state={state}
      onSave={save}
      onReset={async () => {
        if (await state.reset()) setDraft(toTrailheadDraft(defaultSettings().trailhead))
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {TRAILHEAD_FIELDS.map((field) => (
          <div key={field.key} className={field.wide ? 'sm:col-span-2' : undefined}>
            <Field label={field.label}>
              <TextInput value={draft[field.key]} onChange={(v) => setDraft((d) => ({ ...d, [field.key]: v }))} />
            </Field>
          </div>
        ))}
      </div>
      {problem && <p className="text-sm text-red-300">{problem}</p>}
    </Block>
  )
}

function toTrailheadDraft(data: TrailheadData): TrailheadDraft {
  return {
    rank: data.rank,
    status: data.status,
    badges: String(data.badges),
    points: data.points,
    trails: String(data.trails),
    rankImage: data.rankImage,
    agentblazerImage: data.agentblazerImage,
    agentblazerChampionImage: data.agentblazerChampionImage,
  }
}

function StatsBlock({ loaded, reload }: { loaded: Loaded; reload: () => Promise<void> }) {
  const state = useBlock('stats', reload)
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(loaded.settings.stats.map((stat) => [stat.label, stat.value])))
  const labels = defaultSettings().stats.map((stat) => stat.label)

  const save = () => {
    const stats: StatItem[] = labels.map((label) => ({ label, value: (values[label] ?? '').trim() })).filter((stat) => stat.value)
    void state.save(stats)
  }

  return (
    <Block
      title="Impact numbers"
      hint="The figures on the home page, the Projects page and the menu. Labels are fixed because each one feeds a specific spot on the site; only the values change."
      customised={loaded.stored.has('stats')}
      state={state}
      onSave={save}
      onReset={async () => {
        if (await state.reset()) setValues(Object.fromEntries(defaultSettings().stats.map((stat) => [stat.label, stat.value])))
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {labels.map((label) => (
          <Field key={label} label={label}>
            <TextInput value={values[label] ?? ''} onChange={(v) => setValues((current) => ({ ...current, [label]: v }))} />
          </Field>
        ))}
      </div>
    </Block>
  )
}

function TagsBlock({ loaded, reload }: { loaded: Loaded; reload: () => Promise<void> }) {
  const state = useBlock('heroTags', reload)
  const [tags, setTags] = useState<string[]>(loaded.settings.heroTags)

  return (
    <Block
      title="Hero tags"
      hint="One per line. The hero shows all of them; the footer ticker uses the first five."
      customised={loaded.stored.has('heroTags')}
      state={state}
      onSave={() => void state.save(cleanLines(tags))}
      onReset={async () => {
        if (await state.reset()) setTags(defaultSettings().heroTags)
      }}
    >
      <ListTextArea value={tags} onChange={setTags} rows={8} />
    </Block>
  )
}

export default function SiteContentEditor() {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    resetSettingsCache()
    const rows = await fetchSettings()
    setLoaded({ settings: resolveSettings(rows), stored: new Set(rows.map((row) => row.key)) })
  }, [])

  useEffect(() => {
    reload().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load.'))
  }, [reload])

  if (error) return <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>
  if (!loaded) return <p className="text-sm text-muted-foreground">Loading…</p>

  return (
    <div className="space-y-4">
      <TrailheadBlock loaded={loaded} reload={reload} />
      <StatsBlock loaded={loaded} reload={reload} />
      <TagsBlock loaded={loaded} reload={reload} />
    </div>
  )
}
