import type { DatePreset } from '../../../hooks/useDateRange'

const PRESETS: DatePreset[] = ['today', 'yesterday', '7d', '30d', '90d']

interface DateRangeBarProps {
  preset: DatePreset
  onPresetChange: (p: DatePreset) => void
  customStart: string
  customEnd: string
  onCustomStartChange: (v: string) => void
  onCustomEndChange: (v: string) => void
  presetLabels: Record<DatePreset, string>
  isDefault: boolean
  onReset: () => void
}

export default function DateRangeBar({
  preset,
  onPresetChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
  presetLabels,
  isDefault,
  onReset,
}: DateRangeBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPresetChange(p)}
          className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            preset === p
              ? 'border-accent bg-accent text-accent-foreground'
              : 'border-border text-muted-foreground hover:border-accent/60 hover:text-foreground'
          }`}
        >
          {presetLabels[p]}
        </button>
      ))}

      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={customStart}
          onChange={(e) => {
            onCustomStartChange(e.target.value)
            onPresetChange('custom')
          }}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground [color-scheme:dark]"
          aria-label="Custom range start"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <input
          type="date"
          value={customEnd}
          onChange={(e) => {
            onCustomEndChange(e.target.value)
            onPresetChange('custom')
          }}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground [color-scheme:dark]"
          aria-label="Custom range end"
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        disabled={isDefault}
        title={isDefault ? 'Already showing the default range' : 'Reset to the default range'}
        className="rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground"
      >
        Reset
      </button>
    </div>
  )
}
