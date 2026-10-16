import wiproColor from '../../assets/wipro/wipro-primary-color.svg'
import wiproWhite from '../../assets/wipro/wipro-primary-white.svg'
import { profile } from '../../data/profile'
import { useExperience } from '../../hooks/useExperience'
import { CARD_HEIGHT, CARD_WIDTH, CLIP_LENGTH } from './lanyardPhysics'

const BRAND_STRIPE = 'linear-gradient(90deg,#7ec45f,#3498b3,#355493,#746fa7,#be266a,#f57f2a,#ffcd2e)'
function since(period: string): string {
  return period.split(/\s*[—–-]\s*/)[0]?.trim() ?? period
}

export default function WiproIdCard() {
  const jobs = useExperience()
  const job = jobs.find((entry) => /wipro/i.test(entry.company))
  return (
    <div className="relative" style={{ width: CARD_WIDTH, height: CLIP_LENGTH + CARD_HEIGHT }}>
      <div
        className="absolute inset-x-0 overflow-hidden rounded-[18px] border border-neutral-200 bg-white text-neutral-900 shadow-2xl shadow-black/30 dark:border-white/15 dark:bg-[#0d0d10] dark:text-white"
        style={{ top: CLIP_LENGTH, height: CARD_HEIGHT }}
      >
        <span className="absolute left-1/2 top-[12px] h-[10px] w-[56px] -translate-x-1/2 rounded-full bg-neutral-300 shadow-inner dark:bg-white/20" />

        <div className="flex h-[84px] items-end justify-center px-[20px] pb-[10px] pt-[32px]">
          <img src={wiproColor} alt="" width={378} height={298} draggable={false} className="h-[48px] w-auto dark:hidden" />
          <img src={wiproWhite} alt="" width={378} height={298} draggable={false} className="hidden h-[48px] w-auto dark:block" />
        </div>
        <div className="h-[3px] w-full" style={{ background: BRAND_STRIPE }} />

        <div className="flex flex-col items-center px-[20px] pt-[12px] text-center">
          <span className="grid h-[62px] w-[62px] place-items-center rounded-full bg-neutral-900 text-[20px] leading-[28px] font-black tracking-tighter text-white ring-4 ring-neutral-200 dark:bg-white dark:text-neutral-900 dark:ring-white/15">
            MR
          </span>
          <p className="mt-[10px] text-[19px] font-black uppercase leading-tight tracking-tight">{profile.name}</p>
          <p className="mt-[4px] text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">{job?.role ?? profile.role}</p>
        </div>

        <dl className="mx-[20px] mt-[12px] space-y-[4px] border-t border-neutral-200 pt-[10px] font-mono text-[8.5px] uppercase tracking-wider dark:border-white/15">
          {job && (
            <div className="flex justify-between gap-[12px]">
              <dt className="text-neutral-500 dark:text-neutral-400">Since</dt>
              <dd className="font-bold">{since(job.period)}</dd>
            </div>
          )}
          {job && (
            <div className="flex justify-between gap-[12px]">
              <dt className="text-neutral-500 dark:text-neutral-400">Base</dt>
              <dd className="text-right font-bold">{job.location}</dd>
            </div>
          )}
        </dl>

        <div className="absolute inset-x-[20px] bottom-[16px] flex h-[24px] items-end gap-[2px]">
          {Array.from({ length: 44 }, (_, i) => (
            <span key={i} className="flex-1 bg-neutral-900 dark:bg-white" style={{ height: `${38 + ((i * 37) % 62)}%` }} />
          ))}
        </div>
      </div>

      <svg aria-hidden="true" width={CARD_WIDTH} height={CLIP_LENGTH + 22} viewBox={`0 0 ${CARD_WIDTH} ${CLIP_LENGTH + 22}`} className="pointer-events-none absolute left-0 top-0 overflow-visible">
        <defs>
          <linearGradient id="wipro-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8d9097" />
            <stop offset="0.35" stopColor="#f1f2f4" />
            <stop offset="0.65" stopColor="#b6b9c0" />
            <stop offset="1" stopColor="#6f727a" />
          </linearGradient>
        </defs>
        <rect x={CARD_WIDTH / 2 - 27} y="-2" width="54" height="17" rx="4" fill="url(#wipro-metal)" stroke="rgba(0,0,0,0.35)" strokeWidth="0.75" />
        <rect x={CARD_WIDTH / 2 - 11} y="13" width="22" height="34" rx="9" fill="none" stroke="url(#wipro-metal)" strokeWidth="5" />
        <rect x={CARD_WIDTH / 2 - 11} y="13" width="22" height="34" rx="9" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.75" />
      </svg>
    </div>
  )
}
