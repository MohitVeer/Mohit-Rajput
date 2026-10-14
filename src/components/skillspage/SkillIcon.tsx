import type { CSSProperties } from 'react'
import { Braces } from 'lucide-react'
import {
  AdobeXdIcon,
  AgentforceIcon,
  Css3Icon,
  FigmaIcon,
  GearsetIcon,
  GitHubIcon,
  GitIcon,
  Html5Icon,
  JavaScriptIcon,
  JiraIcon,
  LitmusIcon,
  NextJsIcon,
  NodeJsIcon,
  NpmIcon,
  PostmanIcon,
  ReactIcon,
  SalesforceCloudIcon,
  ScssIcon,
  SfdxCliIcon,
  TypeScriptIcon,
  VsCodeIcon,
  VueIcon,
} from '../icons/TechIcons'
import { skillIcons } from '../icons/skillIcons'
import { brandColor, brandFor, isSalesforceCompanion, isSalesforceTerm, techKeys, wordsOf } from '../../lib/techIcons'

type Icon = typeof SalesforceCloudIcon

const customIcons = new Map<string, Icon>()

function register(icon: Icon, ...names: string[]) {
  for (const name of names) for (const key of techKeys(name)) if (!customIcons.has(key)) customIcons.set(key, icon)
}

register(Html5Icon, 'html', 'html5')
register(Css3Icon, 'css', 'css3')
register(ScssIcon, 'scss', 'sass')
register(JavaScriptIcon, 'javascript', 'js', 'es6', 'ecmascript')
register(TypeScriptIcon, 'typescript', 'ts')
register(ReactIcon, 'react', 'react.js')
register(VueIcon, 'vue', 'vue.js')
register(NextJsIcon, 'next', 'next.js')
register(NodeJsIcon, 'node', 'node.js')
register(GitIcon, 'git')
register(GitHubIcon, 'github')
register(FigmaIcon, 'figma')
register(AdobeXdIcon, 'adobe xd', 'xd')
register(VsCodeIcon, 'vs code', 'vscode', 'visual studio code')
register(JiraIcon, 'jira')
register(PostmanIcon, 'postman')
register(NpmIcon, 'npm')
register(SfdxCliIcon, 'sfdx', 'sfdx cli', 'salesforce cli', 'sf cli')
register(AgentforceIcon, 'agentforce')
register(LitmusIcon, 'litmus')
register(GearsetIcon, 'gearset')

function customIconFor(name: string): Icon | undefined {
  const exact = skillIcons[name]
  if (exact) return exact
  for (const key of techKeys(name)) {
    const icon = customIcons.get(key)
    if (icon) return icon
  }
  return undefined
}

interface SkillIconProps {
  name: string
  size?: number
  className?: string
  context?: 'salesforce'
}

function BrandMark({ slug, hex, size, className }: { slug: string; hex: string; size: number; className?: string }) {
  const url = `url(/tech/${slug}.svg)`
  const style: CSSProperties = {
    display: 'inline-block',
    width: size,
    height: size,
    backgroundColor: brandColor(hex) ?? 'currentColor',
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  }
  return <span aria-hidden="true" className={className} style={style} />
}

export default function SkillIcon({ name, size = 24, className, context }: SkillIconProps) {
  const Custom = customIconFor(name)
  if (Custom) return <Custom width={size} height={size} className={className} />

  const salesforce = <SalesforceCloudIcon width={size} height={size} className={className} />
  if (isSalesforceTerm(name)) return salesforce
  if (context === 'salesforce' && isSalesforceCompanion(name)) return salesforce

  const brand = brandFor(name)
  if (brand) return <BrandMark slug={brand.slug} hex={brand.hex} size={size} className={className} />

  for (const word of wordsOf(name)) {
    const WordIcon = customIconFor(word)
    if (WordIcon) return <WordIcon width={size} height={size} className={className} />
    const wordBrand = brandFor(word)
    if (wordBrand) return <BrandMark slug={wordBrand.slug} hex={wordBrand.hex} size={size} className={className} />
  }

  return <Braces width={size} height={size} className={className} strokeWidth={1.75} aria-hidden="true" />
}
