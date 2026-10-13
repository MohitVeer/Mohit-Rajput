export interface EducationEntry {
  id: string
  short: string
  degree: string
  field: string
  institution: string
  affiliation?: string
  mode: string
  period: string
}

export const education: EducationEntry[] = [
  {
    id: 'mca',
    short: 'MCA',
    degree: 'Master of Computer Applications',
    field: 'Computer Science',
    institution: 'Arunachal University of Studies',
    mode: 'Distance learning',
    period: '2021 — 2023',
  },
  {
    id: 'bca',
    short: 'BCA',
    degree: 'Bachelor of Computer Applications',
    field: 'Computer Science',
    institution: 'Gagan College of Management and Technology',
    affiliation: 'Dr. Bhimrao Ambedkar University, Agra',
    mode: 'Regular',
    period: '2018 — 2021',
  },
]
