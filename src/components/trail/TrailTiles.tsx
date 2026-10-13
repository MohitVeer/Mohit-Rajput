import type { ReactNode } from 'react'
import type { StatItem, TrailheadData } from '../../lib/siteSettings'
import { SalesforceMark } from '../icons/BrandMarks'
import StatTile from './StatTile'

export function buildTrailTiles(trailhead: TrailheadData, stats: StatItem[]): ReactNode[] {
  const find = (label: string) => stats.find((s) => s.label === label)?.value ?? ''
  return [
    <div key="mark" className="flex h-full w-full items-center justify-center bg-[#00A1E0]">
      <SalesforceMark className="h-[55%] w-[55%] text-white opacity-90" />
    </div>,
    <StatTile key="badges" value={String(trailhead.badges)} label="Trailhead badges" className="bg-zinc-950 text-white" />,
    <StatTile key="points" value={trailhead.points} label="Trailhead points" className="bg-white text-zinc-950" />,
    <StatTile key="trails" value={String(trailhead.trails)} label="Trails completed" className="bg-[#FED954] text-zinc-950" />,
    <StatTile key="certs" value={find('Salesforce Certifications')} label="Certifications" className="bg-zinc-900 text-white" />,
    <StatTile key="super" value={find('Salesforce Superbadges')} label="Superbadges" className="bg-violet-600 text-white" />,
    <div key="rank" className="flex h-full w-full flex-col items-center justify-center gap-[4cqw] bg-gradient-to-br from-blue-600 to-indigo-900 text-center text-white">
      <span className="text-[18cqw] leading-none">★★★</span>
      <span className="text-[9cqw] font-black uppercase leading-tight tracking-tight">{trailhead.rank}</span>
    </div>,
  ]
}
