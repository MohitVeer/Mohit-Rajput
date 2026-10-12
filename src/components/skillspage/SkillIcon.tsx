import { Braces } from 'lucide-react'
import { SalesforceCloudIcon, skillIcons } from '../icons/TechIcons'

const SALESFORCE_TERMS =
  /^(lwc|apex|soql|omnistudio|flexcards?|omniscripts?|dataraptors?|experience cloud|slds|aura|visualforce|flows?|prompt builder|email studio|ampscript|journey builder|cloud pages|data extensions|personalization)/i

interface SkillIconProps {
  name: string
  size?: number
  className?: string
}

export default function SkillIcon({ name, size = 24, className }: SkillIconProps) {
  const Icon = skillIcons[name]
  if (Icon) return <Icon width={size} height={size} className={className} />
  if (SALESFORCE_TERMS.test(name)) return <SalesforceCloudIcon width={size} height={size} className={className} />
  return <Braces width={size} height={size} className={className} strokeWidth={1.75} aria-hidden="true" />
}
