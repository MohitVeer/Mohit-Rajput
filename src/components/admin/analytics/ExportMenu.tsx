export default function ExportMenu({ onCsv, onJson }: { onCsv: () => void; onJson: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={onCsv}
        className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
      >
        CSV
      </button>
      <button
        type="button"
        onClick={onJson}
        className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition hover:border-accent hover:text-foreground"
      >
        JSON
      </button>
    </div>
  )
}
