import AchievementArchive from '../components/achievements/AchievementArchive'
import AchievementsHero from '../components/achievements/AchievementsHero'
import TechUniverse from '../components/achievements/TechUniverse'
import { useAchievements } from '../hooks/useAchievements'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AchievementsPage() {
  usePageMeta('/achievements')
  const items = useAchievements()

  return (
    <div className="relative overflow-x-clip">
      <AchievementsHero items={items} />
      <div className="relative z-30 bg-background">
        <AchievementArchive items={items} />
        <TechUniverse />
      </div>
    </div>
  )
}
