export const HERO_KEYS = [
  'Platform_Developer',
  'Omnistudio_Developer',
  'Marketing_Cloud_Engagement_Developer',
  'AI_Associate',
  'freeCodeCamp_Responsive_Web_Design',
  'Udemy_Zero_to_Hero_LWC',
] as const

export const HERO_SIZES = '(min-width: 768px) 34vw, 45vw'

export const heroThumb = (key: string) => `/certificates/${key}-sm.webp`

export const heroImage = (key: string) => `/certificates/${key}.webp`
