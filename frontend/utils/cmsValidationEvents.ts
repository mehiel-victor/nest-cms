export type CmsValidationEventName =
  | 'cms_landing_viewed'
  | 'cms_primary_cta_clicked'
  | 'cms_waitlist_submitted'
  | 'cms_ai_demo_prompt_clicked'
  | 'cms_competitor_section_viewed'

export interface CmsValidationEvent {
  id: string
  name: CmsValidationEventName
  metadata: Record<string, string | number | boolean>
  createdAt: string
}

const STORAGE_KEY = 'nestcms_cms_validation_events_v1'

const hasBrowserStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

const makeId = (name: CmsValidationEventName) =>
  `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

export const createCmsValidationEvent = (
  name: CmsValidationEventName,
  metadata: Record<string, string | number | boolean> = {}
): CmsValidationEvent => ({
  id: makeId(name),
  name,
  metadata,
  createdAt: new Date().toISOString()
})

export const readCmsValidationEvents = (): CmsValidationEvent[] => {
  if (!hasBrowserStorage()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as CmsValidationEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Intentionally no-op: unavailable storage should not throw
    }
    return []
  }
}

export const storeCmsValidationEvent = (
  name: CmsValidationEventName,
  metadata: Record<string, string | number | boolean> = {}
): CmsValidationEvent | null => {
  if (!hasBrowserStorage()) {
    return null
  }

  const event = createCmsValidationEvent(name, metadata)
  const events = readCmsValidationEvents()
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([event, ...events].slice(0, 100)))
  } catch {
    return null
  }
  return event
}

export const clearCmsValidationEvents = () => {
  if (!hasBrowserStorage()) {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}
