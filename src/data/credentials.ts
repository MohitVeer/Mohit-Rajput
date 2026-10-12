export interface CredentialMeta {
  issued: string
  credentialId?: string
}

export const credentialMeta: Record<string, CredentialMeta> = {
  AI_Associate: { issued: 'December 4, 2024', credentialId: '5381564' },
  Marketing_Cloud_Email_Specialist: { issued: 'April 29, 2023', credentialId: '7863709' },
  Marketing_Cloud_Engagement_Developer: { issued: 'September 25, 2023', credentialId: '7863712' },
  Marketing_Cloud_Personalization: { issued: 'February 9, 2023', credentialId: '7863714' },
  Omnistudio_Consultant: { issued: 'January 30, 2023', credentialId: '7863711' },
  Omnistudio_Developer: { issued: 'January 12, 2023', credentialId: '7863710' },
  Platform_Developer: { issued: 'July 17, 2026', credentialId: '7945062' },
  Platform_Foundations: { issued: 'October 23, 2023', credentialId: '7863708' },
  Platform_User_Experience_Designer: { issued: 'November 14, 2023', credentialId: '7863713' },
}

export const VERIFY_URL = 'https://sforce.co/verifycerts'

export function credentialKey(fileUrl?: string): string {
  if (!fileUrl) return ''
  const file = fileUrl.split('/').pop() ?? ''
  return file.replace(/\.pdf$/i, '')
}

export function certificateImage(fileUrl?: string): string | null {
  const key = credentialKey(fileUrl)
  return key ? `/certificates/${key}.webp` : null
}

export function credentialFor(fileUrl?: string): CredentialMeta | null {
  return credentialMeta[credentialKey(fileUrl)] ?? null
}
