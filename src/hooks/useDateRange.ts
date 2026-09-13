import { useMemo, useState } from 'react'
import type { DateRange } from '../lib/adminApi'

export type DatePreset = 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'custom'

const PRESET_LABELS: Record<DatePreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  custom: 'Custom range',
}

function startOfDay(d: Date) {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function rangeForPreset(preset: DatePreset, custom: { start: string; end: string }): DateRange {
  const now = new Date()
  const today = startOfDay(now)

  switch (preset) {
    case 'today':
      return { start: today, end: new Date(), label: PRESET_LABELS.today }
    case 'yesterday': {
      const start = new Date(today)
      start.setDate(start.getDate() - 1)
      return { start, end: today, label: PRESET_LABELS.yesterday }
    }
    case '7d': {
      const start = new Date(today)
      start.setDate(start.getDate() - 6)
      return { start, end: new Date(), label: PRESET_LABELS['7d'] }
    }
    case '90d': {
      const start = new Date(today)
      start.setDate(start.getDate() - 89)
      return { start, end: new Date(), label: PRESET_LABELS['90d'] }
    }
    case 'custom': {
      const start = custom.start ? new Date(custom.start) : today
      // Inclusive end-of-day for a picked custom end date.
      const end = custom.end ? new Date(new Date(custom.end).getTime() + 24 * 60 * 60 * 1000) : new Date()
      return { start, end, label: PRESET_LABELS.custom }
    }
    case '30d':
    default: {
      const start = new Date(today)
      start.setDate(start.getDate() - 29)
      return { start, end: new Date(), label: PRESET_LABELS['30d'] }
    }
  }
}

export function useDateRange(initial: DatePreset = '30d') {
  const [preset, setPreset] = useState<DatePreset>(initial)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const range = useMemo(
    () => rangeForPreset(preset, { start: customStart, end: customEnd }),
    [preset, customStart, customEnd],
  )

  const isDefault = preset === initial && !customStart && !customEnd
  const reset = () => {
    setPreset(initial)
    setCustomStart('')
    setCustomEnd('')
  }

  return {
    preset,
    setPreset,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    range,
    presetLabels: PRESET_LABELS,
    isDefault,
    reset,
  }
}
