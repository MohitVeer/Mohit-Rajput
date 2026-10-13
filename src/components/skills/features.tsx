import { Bot, Database, Layers, LayoutTemplate, Mail, MessageSquare, Route, Server, Workflow, Zap, Fingerprint, Code2 } from 'lucide-react'
import type { CubeFace } from '../ui/CubeLoader'

export interface Feature {
  heading: string
  description: string
  skills: string[]
  hoverColor: string
  faces: CubeFace[]
}

export const FEATURES: Feature[] = [
  {
    heading: 'Lightning Web Components',
    description:
      'Fast, reusable components styled with SLDS and wired to Apex and SOQL, with Aura and Visualforce experience for the orgs that still run on them.',
    skills: ['LWC', 'Apex', 'SOQL', 'SLDS', 'Aura', 'Visualforce'],
    hoverColor: 'bg-sky-600/10',
    faces: [
      { icon: Zap, label: 'LWC', color: '#00A1E0' },
      { icon: Code2, label: 'APEX', color: '#eab308' },
      { icon: Database, label: 'SOQL', color: '#22c55e' },
      { icon: Layers, label: 'SLDS', color: '#a855f7' },
      { icon: LayoutTemplate, label: 'UI', color: '#ef4444' },
      { icon: Workflow, label: 'FLOW', color: '#f97316' },
    ],
  },
  {
    heading: 'Experience Cloud & OmniStudio',
    description:
      'Portals and guided journeys built with Experience Cloud and OmniStudio, tuned for performance, including a portal brought from 3.2 seconds to roughly half the load time.',
    skills: ['Experience Cloud', 'OmniScripts', 'FlexCards', 'DataRaptors', 'OmniStudio / Vlocity', 'Flows'],
    hoverColor: 'bg-blue-600/10',
    faces: [
      { icon: LayoutTemplate, label: 'PORTAL', color: '#3b82f6' },
      { icon: Route, label: 'OMNI', color: '#eab308' },
      { icon: Layers, label: 'FLEX', color: '#22c55e' },
      { icon: Database, label: 'DATA', color: '#ef4444' },
      { icon: Server, label: 'API', color: '#8b5cf6' },
      { icon: Workflow, label: 'FLOW', color: '#06b6d4' },
    ],
  },
  {
    heading: 'Agentforce & Marketing Cloud',
    description:
      'AI-assisted and personalised experiences with Agentforce and Prompt Builder, plus Marketing Cloud work across Email Studio, AMPscript, Journey Builder and Personalization.',
    skills: ['Agentforce', 'Prompt Builder', 'Email Studio', 'AMPscript', 'Journey Builder', 'Personalization'],
    hoverColor: 'bg-purple-600/10',
    faces: [
      { icon: Bot, label: 'AGENT', color: '#a855f7' },
      { icon: MessageSquare, label: 'PROMPT', color: '#3b82f6' },
      { icon: Mail, label: 'EMAIL', color: '#22c55e' },
      { icon: Route, label: 'JOURNEY', color: '#ef4444' },
      { icon: Fingerprint, label: 'PERSONAL', color: '#eab308' },
      { icon: Zap, label: 'AI', color: '#f97316' },
    ],
  },
]
