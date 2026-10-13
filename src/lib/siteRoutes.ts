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
    title: 'Mohit Rajput — Salesforce UI Developer | LWC & OmniStudio',
    description:
      'Salesforce UI Developer with 5+ years building LWC, OmniStudio, Experience Cloud and Marketing Cloud solutions. Cut portal load times 50%. Available for hire.',
  },
  {
    path: '/projects',
    id: 'projects',
    label: 'Projects',
    title: 'Projects — Mohit Rajput | Enterprise Salesforce Front-End',
    description:
      'Client projects by Mohit Rajput for global brands: Experience Cloud, LWC and OmniStudio across telecom, banking, healthcare and automotive.',
  },
  {
    path: '/experience',
    id: 'experience',
    label: 'Experience',
    title: 'Experience — Mohit Rajput | Salesforce UI Developer',
    description:
      'Career timeline at Wipro, Mphasis Silverline, DJT and Escade Technologies: LWC, OmniStudio, Experience Cloud, Marketing Cloud and React.',
  },
  {
    path: '/skills',
    id: 'skills',
    label: 'Skills',
    title: 'Skills & Tools — Mohit Rajput',
    description:
      'Technical toolkit: Lightning Web Components, Apex, OmniStudio, Experience Cloud, Marketing Cloud, React, TypeScript, design-to-code and accessibility.',
  },
  {
    path: '/achievements',
    id: 'achievements',
    label: 'Achievements',
    title: 'Certifications & Achievements — Mohit Rajput',
    description:
      'Nine Salesforce certifications with the original certificates, five Trailhead superbadges and Triple Star Ranger status.',
  },
  {
    path: '/blog',
    id: 'blog',
    label: 'Articles',
    title: 'Articles — Mohit Rajput',
    description:
      'Articles on Experience Cloud performance, SLDS 2, Marketing Cloud email rendering and personalization by Mohit Rajput.',
  },
  {
    path: '/contact',
    id: 'contact',
    label: 'Contact',
    title: 'Contact & Hire — Mohit Rajput',
    description:
      'Get in touch with Mohit Rajput for full-time or contract Salesforce front-end roles — remote, hybrid or onsite, worldwide.',
  },
  {
    path: '/resume',
    id: 'resume',
    label: 'Resume',
    title: 'Resume — Mohit Rajput',
    description: 'View or download the current résumé of Mohit Rajput, Salesforce UI Developer.',
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
