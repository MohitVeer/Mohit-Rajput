export default function StatTile({ value, label, className }: { value: string; label: string; className: string }) {
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-[3cqw] text-center ${className}`}>
      <span className="text-[22cqw] font-black leading-none tracking-tighter">{value}</span>
      <span className="text-[6cqw] font-bold uppercase tracking-[0.2em] opacity-[0.85]">{label}</span>
    </div>
  )
}
