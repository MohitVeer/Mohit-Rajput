import { SITE_ROLE } from './site'

export interface SiteRoute {
  path: string
  id: string
  label: string
  title: string
  description: string
}

export const SITE_NAME = 'Mohit Rajput'

export const siteRoutes: SiteRoute[] = [
  {
    path: '/',
    id: 'home',
    label: 'Home',
    title: `Mohit Rajput — ${SITE_ROLE}`,
    description:
      'Salesforce front-end developer with 5+ years of LWC, OmniStudio, Experience Cloud and Marketing Cloud delivery. 9x Salesforce certified. Open to hire.',
  },
  {
    path: '/projects',
    id: 'projects',
    label: 'Projects',
    title: 'Salesforce Projects by Mohit Rajput | LWC & Experience Cloud',
    description:
      'Salesforce client projects by Mohit Rajput for global brands: Experience Cloud, LWC and OmniStudio across telecom, banking, healthcare and automotive.',
  },
  {
    path: '/experience',
    id: 'experience',
    label: 'Experience',
    title: 'Experience — Mohit Rajput | Salesforce Front-End Developer',
    description:
      'Salesforce front-end career at Wipro, Mphasis Silverline, DJT, Escade and Forelsket: LWC, OmniStudio, Experience Cloud, Marketing Cloud and React.',
  },
  {
    path: '/skills',
    id: 'skills',
    label: 'Skills',
    title: 'Skills — Mohit Rajput | Salesforce Front-End Developer',
    description:
      'Salesforce and front-end toolkit: Lightning Web Components, Apex, OmniStudio, Experience Cloud, Marketing Cloud, React, TypeScript and accessibility.',
  },
  {
    path: '/achievements',
    id: 'achievements',
    label: 'Achievements',
    title: 'Salesforce Certifications — Mohit Rajput | 9x Certified',
    description:
      'Nine Salesforce certifications, five more from Udemy, freeCodeCamp, Internshala and Forelsket, five Trailhead superbadges and Triple Star Ranger status.',
  },
  {
    path: '/blog',
    id: 'blog',
    label: 'Articles',
    title: 'Salesforce & Front-End Articles — Mohit Rajput',
    description:
      'Articles on Experience Cloud performance, SLDS 2, Marketing Cloud email rendering and personalization by Mohit Rajput.',
  },
  {
    path: '/contact',
    id: 'contact',
    label: 'Contact',
    title: 'Hire a Salesforce Front-End Developer — Mohit Rajput',
    description:
      'Get in touch with Mohit Rajput for full-time or contract Salesforce front-end roles — remote, hybrid or onsite, worldwide.',
  },
  {
    path: '/resume',
    id: 'resume',
    label: 'Resume',
    title: 'Resume — Mohit Rajput | Salesforce Front-End Developer',
    description: 'View or download the current résumé of Mohit Rajput, a front-end developer with Salesforce expertise.',
  },
  {
    path: '/privacy',
    id: 'privacy',
    label: 'Privacy',
    title: 'Privacy & Analytics — Mohit Rajput',
    description: 'What lightweight, first-party usage analytics this portfolio collects and how to opt out.',
  },
]

export function routeFor(path: string): SiteRoute {
  const clean = path.replace(/\/+$/, '') || '/'
  return siteRoutes.find((route) => route.path === clean) ?? siteRoutes[0]
}
