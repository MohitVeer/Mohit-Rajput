export const OPEN_RESUME_EVENT = 'open-resume'

export function openResume() {
  window.dispatchEvent(new Event(OPEN_RESUME_EVENT))
}
