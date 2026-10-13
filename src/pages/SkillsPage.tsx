import { useMemo } from 'react'
import CoreFocus from '../components/skillspage/CoreFocus'
import DeliveryCards from '../components/skillspage/DeliveryCards'
import Foundation from '../components/skillspage/Foundation'
import SkillsClosing from '../components/skillspage/SkillsClosing'
import SkillsHero from '../components/skillspage/SkillsHero'
import ToolingMarquee from '../components/skillspage/ToolingMarquee'
import { useSkillGroups } from '../hooks/useSkillGroups'
import { usePageMeta } from '../hooks/usePageMeta'

const DELIVERY = /delivery|collaborat/i

export default function SkillsPage() {
  usePageMeta('/skills')
  const groups = useSkillGroups()
  const delivery = useMemo(() => groups.find((group) => DELIVERY.test(group.title)), [groups])
  const focusGroups = useMemo(() => groups.filter((group) => !DELIVERY.test(group.title)), [groups])

  return (
    <>
      <SkillsHero />
      {delivery && <DeliveryCards title={delivery.title} items={delivery.skills} />}
      <CoreFocus groups={focusGroups} />
      <Foundation />
      <ToolingMarquee />
      <SkillsClosing />
    </>
  )
}
