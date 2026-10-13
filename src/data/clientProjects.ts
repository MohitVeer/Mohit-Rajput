import { slugify } from '../lib/slug'

export type ProjectKind = 'client' | 'accelerator' | 'product'

export interface ClientProject {
  id: string
  client: string
  sector: string
  employer: string
  employerKey: string
  role: string
  current?: boolean
  kind: ProjectKind
  summary: string
  stack: string[]
}

export interface Engagement {
  id: string
  employer: string
  employerKey: string
  title: string
  role: string
  period: string
  current?: boolean
  kind: ProjectKind
  highlights: string[]
  stack: string[]
}

const WIPRO = { employer: 'Wipro', employerKey: 'wipro', role: 'Salesforce Consultant' }
const MPHASIS = { employer: 'Mphasis Silverline', employerKey: 'mphasis', role: 'Developer' }
const DJT = { employer: 'DJT Corporation & Investments', employerKey: 'djt', role: 'UI Developer' }

const MPHASIS_SUMMARY = "Delivered LWC, FlexCard and OmniScript-based UI using SLDS patterns as part of Mphasis Silverline's Salesforce implementations."
const WIPRO_SUMMARY = 'Client engagement delivered as a Salesforce Consultant at Wipro, covering Salesforce front-end work.'

export const clientProjects: ClientProject[] = [
  {
    id: 'ericsson',
    client: 'Ericsson',
    sector: 'Telecommunications',
    ...WIPRO,
    current: true,
    kind: 'client',
    summary: 'Current client engagement as a Salesforce Consultant at Wipro, covering Salesforce front-end work.',
    stack: ['Salesforce'],
  },
  {
    id: 'intellect-design-arena',
    client: 'Intellect Design Arena',
    sector: 'Financial technology',
    ...WIPRO,
    kind: 'client',
    summary: WIPRO_SUMMARY,
    stack: ['Salesforce'],
  },
  {
    id: 'st-jamess-place',
    client: "St. James's Place",
    sector: 'Wealth management',
    ...WIPRO,
    kind: 'client',
    summary:
      'Built Lightning Web Components and Apex integration layers for an Experience Cloud Financial Services portal, working directly with design, engineering and business stakeholders.',
    stack: ['LWC', 'Apex', 'Experience Cloud'],
  },
  {
    id: 'american-honda',
    client: 'American Honda',
    sector: 'Automotive',
    ...WIPRO,
    kind: 'client',
    summary:
      'Built Lightning Web Components and Apex integration layers for an Experience Cloud Commerce Portal, working directly with design, engineering and business stakeholders.',
    stack: ['LWC', 'Apex', 'Experience Cloud'],
  },
  {
    id: 'republic-finance',
    client: 'Republic Finance',
    sector: 'Consumer finance',
    ...MPHASIS,
    kind: 'client',
    summary: MPHASIS_SUMMARY,
    stack: ['LWC', 'FlexCards', 'OmniScripts', 'SLDS'],
  },
  {
    id: 'arvest-bank',
    client: 'Arvest Bank',
    sector: 'Banking',
    ...MPHASIS,
    kind: 'client',
    summary: MPHASIS_SUMMARY,
    stack: ['LWC', 'FlexCards', 'OmniScripts', 'SLDS'],
  },
  {
    id: 'wealth-enhancement-group',
    client: 'Wealth Enhancement Group',
    sector: 'Wealth management',
    ...MPHASIS,
    kind: 'client',
    summary: MPHASIS_SUMMARY,
    stack: ['LWC', 'FlexCards', 'OmniScripts', 'SLDS'],
  },
  {
    id: 'peoples-bank',
    client: 'Peoples Bank',
    sector: 'Banking',
    ...MPHASIS,
    kind: 'client',
    summary: MPHASIS_SUMMARY,
    stack: ['LWC', 'FlexCards', 'OmniScripts', 'SLDS'],
  },
  {
    id: 'teladoc',
    client: 'Teladoc',
    sector: 'Healthcare',
    ...MPHASIS,
    kind: 'client',
    summary: MPHASIS_SUMMARY,
    stack: ['LWC', 'FlexCards', 'OmniScripts', 'SLDS'],
  },
  {
    id: 'five-star-bank',
    client: 'Five Star Bank',
    sector: 'Banking',
    ...MPHASIS,
    kind: 'client',
    summary: MPHASIS_SUMMARY,
    stack: ['LWC', 'FlexCards', 'OmniScripts', 'SLDS'],
  },
  {
    id: 'beatport',
    client: 'Beatport',
    sector: 'Music & e-commerce',
    ...MPHASIS,
    kind: 'client',
    summary: MPHASIS_SUMMARY,
    stack: ['LWC', 'FlexCards', 'OmniScripts', 'SLDS'],
  },
  {
    id: 'foundry',
    client: 'Foundry',
    sector: 'Internal accelerator',
    ...MPHASIS,
    kind: 'accelerator',
    summary:
      'Contributed to Foundry, a reusable component and OmniStudio accelerator — reducing implementation timelines 35% across 3 engagements and enabling pre-sales demos.',
    stack: ['LWC', 'OmniStudio', 'SLDS'],
  },
  {
    id: 'smart-cart',
    client: 'Smart Cart',
    sector: 'Retail technology',
    ...DJT,
    kind: 'product',
    summary: 'React.js web application supporting in-store product scanning and digital checkout workflows.',
    stack: ['React.js', 'JavaScript', 'CSS3'],
  },
  {
    id: 'house-of-believe',
    client: 'House of Believe',
    sector: 'E-commerce',
    ...DJT,
    kind: 'product',
    summary: 'Shopify e-commerce storefront with the front end customised to match brand requirements and responsive design expectations.',
    stack: ['Shopify', 'HTML5', 'CSS3'],
  },
]

export const engagements: Engagement[] = [
  {
    id: 'wipro-experience-cloud',
    ...WIPRO,
    title: 'Enterprise Experience Cloud programs',
    period: 'Sep 2024 — Present',
    current: true,
    kind: 'client',
    highlights: [
      'Built reusable Lightning Web Components and Apex integration layers for enterprise portals, turning Figma designs into production-ready, responsive UI.',
      'Reduced portal load time from ~3.2s to 1.5s (~50%) with cacheable Apex, reactive-property tuning and fewer DOM re-renders.',
      'Shortened delivery cycles from 10 to 6–7 days (~35%) with a reusable SLDS component library.',
      'Resolved 300+ production defects within SLA while sustaining a 4.5+/5 client CSAT.',
    ],
    stack: ['LWC', 'Apex', 'Experience Cloud', 'SLDS', 'Gearset'],
  },
  {
    id: 'mphasis-financial-health',
    ...MPHASIS,
    title: 'Financial Services & Health Cloud implementations',
    period: 'Aug 2022 — Sep 2024',
    kind: 'client',
    highlights: [
      'Delivered Apex, LWC, FlexCard and OmniScript solutions across 5+ implementations for 8+ enterprise clients, improving user-journey completion rates 20%.',
      'Designed reusable LWC and OmniStudio frameworks for 4 client-facing Experience Cloud portals, cutting per-portal development time by about 30%.',
      'Built responsive AMPscript emails validated across Outlook, Gmail and Apple Mail with Litmus for Marketing Cloud campaigns.',
    ],
    stack: ['LWC', 'OmniStudio', 'FlexCards', 'OmniScripts', 'SLDS', 'AMPscript'],
  },
  {
    id: 'mphasis-foundry',
    ...MPHASIS,
    title: 'Foundry — reusable component and OmniStudio accelerator',
    period: 'Aug 2022 — Sep 2024',
    kind: 'accelerator',
    highlights: [
      'Contributed reusable components to the accelerator, reducing implementation timelines 35% across 3 engagements.',
      'Enabled pre-sales demos with ready-made, production-quality building blocks.',
    ],
    stack: ['LWC', 'OmniStudio', 'SLDS'],
  },
  {
    id: 'djt-retail-ecommerce',
    ...DJT,
    title: 'Retail & e-commerce front ends',
    period: 'Nov 2021 — May 2022',
    kind: 'product',
    highlights: [
      'Built the Smart Cart React.js application for in-store product scanning and digital checkout.',
      'Customised the House of Believe Shopify storefront to brand and responsive design requirements.',
      'Received formal appreciation from the MD and stakeholders for delivery on the House of Believe and DJT brand websites.',
    ],
    stack: ['React.js', 'Vue.js', 'Shopify', 'JavaScript', 'CSS3'],
  },
]

export const EMPLOYER_LABEL: Record<string, string> = {
  wipro: 'Wipro',
  mphasis: 'Mphasis Silverline',
  djt: 'DJT',
}

export function employerKeyFor(company: string): string | null {
  const name = company.toLowerCase()
  if (name.includes('wipro')) return 'wipro'
  if (name.includes('mphasis') || name.includes('silverline')) return 'mphasis'
  if (name.includes('djt')) return 'djt'
  if (name.includes('escade')) return 'escade'
  if (name.includes('forelsket')) return 'forelsket'
  return null
}

export function employerKeyOf(employer: string): string {
  return employerKeyFor(employer) ?? (slugify(employer) || 'other')
}

const CLIENT_ALIASES: Record<string, string> = {
  teledoc: 'Teladoc',
  'saint james’s place': "St. James's Place",
  "saint james's place": "St. James's Place",
  'st. james’s place': "St. James's Place",
  'peoples bank': 'Peoples Bank',
  "people's bank": 'Peoples Bank',
}

export function normalizeClient(name: string): string {
  return CLIENT_ALIASES[name.trim().toLowerCase()] ?? name.trim()
}
