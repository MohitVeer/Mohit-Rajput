import AchievementArchive from '../components/achievements/AchievementArchive'
import AchievementsHero from '../components/achievements/AchievementsHero'
import CertificateSpread from '../components/achievements/CertificateSpread'
import TechUniverse from '../components/achievements/TechUniverse'
import { useAchievements } from '../hooks/useAchievements'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AchievementsPage() {
  usePageMeta('/achievements')
  const items = useAchievements()

  return (
    <>
      <AchievementsHero items={items} />
      <CertificateSpread items={items} />
      <AchievementArchive items={items} />
      <TechUniverse />
    </>
  )
}
