import { useMemo } from 'react'
import { employerKeyFor } from '../data/clientProjects'
import { experience } from '../data/profile'
import { fetchExperience, type ExperienceRow } from '../lib/contentApi'
import { jobSlug } from '../lib/experienceUtils'
import { useLiveContent } from './useLiveContent'

export function useExperience(): ExperienceRow[] {
  const fallback = useMemo<ExperienceRow[]>(
    () =>
      experience.map((job, i) => ({
        ...job,
        achievements: job.achievements ?? [],
        id: `static-${i}`,
        sort_order: i,
      })),
    [],
  )
  return useLiveContent(fetchExperience, fallback)
}

export function useRoleSlugs(): Map<string, string> {
  const jobs = useExperience()
  return useMemo(() => {
    const map = new Map<string, string>()
    for (const job of jobs) {
      const key = employerKeyFor(job.company)
      if (key && !map.has(key)) map.set(key, jobSlug(job))
    }
    return map
  }, [jobs])
}
