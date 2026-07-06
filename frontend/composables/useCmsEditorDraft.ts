import type {
  CmsButtonContent,
  CmsCanvasDocument,
  CmsCanvasElement,
  CmsCanvasElementContent,
  CmsCanvasElementSeed,
  CmsCanvasElementType,
  CmsCanvasLayout,
  CmsCanvasStyle,
  CmsFormContent,
  CmsHeadingContent,
  CmsImageContent,
  CmsPageDraft,
  CmsPageSeo,
  CmsPublishedPageSnapshot,
  CmsTextContent
} from '~/types'

type AutosaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'failed'
type PublishStatus = 'idle' | 'publishing' | 'published' | 'failed'

const EDITOR_STORAGE_PREFIX = 'nestcms_cms_editor_draft_v1'
const SNAPSHOT_STORAGE_PREFIX = 'nestcms_cms_published_snapshots_v1'
const SAMPLE_USER_ID = 'cms-user-owner'

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const hasBrowserStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage
  } catch {
    return false
  }
}

const nowIso = () => new Date().toISOString()

const makeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const draftStorageKey = (pageId: string) => `${EDITOR_STORAGE_PREFIX}:${pageId}`
const snapshotStorageKey = (pageId: string) => `${SNAPSHOT_STORAGE_PREFIX}:${pageId}`

const defaultLayout = (index: number): CmsCanvasLayout => ({
  x: 96 + (index % 3) * 36,
  y: 120 + index * 34,
  width: 360,
  height: 96,
  zIndex: index + 1
})

const defaultResponsive = (index: number) => ({
  mobileOrder: index + 1,
  mobileVisibility: 'visible' as const,
  mobileLayoutMode: 'stack' as const
})

const defaultStyle = (type: CmsCanvasElementType): CmsCanvasStyle => {
  if (type === 'button') {
    return {
      backgroundColor: '#0f7a5f',
      borderRadius: 8,
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center'
    }
  }

  if (type === 'box') {
    return {
      backgroundColor: '#ffffff',
      borderColor: '#dce5df',
      borderRadius: 8,
      borderWidth: 1,
      padding: { top: 20, right: 20, bottom: 20, left: 20 }
    }
  }

  return {
    color: '#17211d',
    fontSize: type === 'heading' ? 42 : 17,
    fontWeight: type === 'heading' ? 'bold' : 'normal',
    lineHeight: type === 'heading' ? 1.08 : 1.5
  }
}

const makeElementFromSeed = (
  seed: CmsCanvasElementSeed,
  parentId: string,
  index: number
): CmsCanvasElement => ({
  id: makeId(seed.type),
  type: seed.type,
  parentId,
  children: [],
  name: seed.name,
  layout: {
    ...defaultLayout(index),
    ...seed.layout
  },
  content: clone(seed.content),
  style: {
    ...defaultStyle(seed.type),
    ...seed.style
  },
  responsive: {
    ...defaultResponsive(index),
    ...seed.responsive
  },
  accessibility: {
    ...seed.accessibility
  }
} as CmsCanvasElement)

const seedForElementType = (type: CmsCanvasElementType): CmsCanvasElementSeed => {
  if (type === 'heading') {
    return {
      type,
      name: 'Título',
      content: { text: 'Novo título para sua página', level: 2 },
      layout: { width: 520, height: 88 }
    }
  }

  if (type === 'text') {
    return {
      type,
      name: 'Texto',
      content: { text: 'Escreva um parágrafo direto para explicar sua oferta.' },
      layout: { width: 480, height: 110 }
    }
  }

  if (type === 'button') {
    return {
      type,
      name: 'Botão',
      content: { label: 'Quero saber mais', href: '#contato', target: 'same_tab' },
      layout: { width: 220, height: 52 }
    }
  }

  if (type === 'image') {
    return {
      type,
      name: 'Imagem',
      content: {
        assetId: 'sample-asset-cover',
        src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
        altText: 'Mesa de trabalho com notebook e materiais de planejamento'
      },
      layout: { width: 360, height: 220 },
      style: { borderRadius: 8 }
    }
  }

  if (type === 'form') {
    return {
      type,
      name: 'Formulário',
      content: {
        fields: [
          { id: makeId('field'), label: 'Nome', type: 'text', required: true },
          { id: makeId('field'), label: 'E-mail', type: 'email', required: true }
        ],
        submitLabel: 'Enviar interesse',
        successMessage: 'Recebemos seu contato.'
      },
      layout: { width: 360, height: 210 },
      style: { backgroundColor: '#f7faf8', borderColor: '#dce5df', borderRadius: 8, borderWidth: 1 }
    }
  }

  return {
    type: 'box',
    name: 'Container',
    content: {},
    layout: { width: 420, height: 240 },
    style: { backgroundColor: '#f7faf8', borderColor: '#dce5df', borderRadius: 8, borderWidth: 1 }
  }
}

const createSampleDraft = (pageId: string): CmsPageDraft => {
  const createdAt = nowIso()
  const rootId = 'element-root'
  const headingId = 'element-heading'
  const textId = 'element-text'
  const buttonId = 'element-button'
  const imageId = 'element-image'

  const canvas: CmsCanvasDocument = {
    schemaVersion: 1,
    rootElementId: rootId,
    metadata: {
      title: 'Página inicial',
      description: 'Rascunho local do editor visual NestCMS'
    },
    elements: {
      [rootId]: {
        id: rootId,
        type: 'box',
        parentId: null,
        children: [headingId, textId, buttonId, imageId],
        name: 'Página',
        layout: { x: 0, y: 0, width: 1200, height: 760, zIndex: 0 },
        content: {},
        style: { backgroundColor: '#ffffff' },
        responsive: { mobileOrder: 0, mobileVisibility: 'visible', mobileLayoutMode: 'stack' },
        accessibility: {}
      },
      [headingId]: {
        id: headingId,
        type: 'heading',
        parentId: rootId,
        children: [],
        name: 'Hero title',
        layout: { x: 84, y: 86, width: 560, height: 176, zIndex: 1 },
        content: { text: 'Publique sua presença digital sem depender de código', level: 1 },
        style: { color: '#17211d', fontSize: 48, fontWeight: 'bold', lineHeight: 1.05 },
        responsive: { mobileOrder: 1, mobileVisibility: 'visible', mobileLayoutMode: 'stack' },
        accessibility: {}
      },
      [textId]: {
        id: textId,
        type: 'text',
        parentId: rootId,
        children: [],
        name: 'Hero copy',
        layout: { x: 88, y: 306, width: 520, height: 104, zIndex: 2 },
        content: { text: 'Monte páginas profissionais, ajuste cada bloco no canvas e publique no seu domínio quando o rascunho estiver pronto.' },
        style: { color: '#66736d', fontSize: 18, lineHeight: 1.55 },
        responsive: { mobileOrder: 2, mobileVisibility: 'visible', mobileLayoutMode: 'stack' },
        accessibility: {}
      },
      [buttonId]: {
        id: buttonId,
        type: 'button',
        parentId: rootId,
        children: [],
        name: 'Hero CTA',
        layout: { x: 88, y: 442, width: 236, height: 54, zIndex: 3 },
        content: { label: 'Quero publicar', href: '#contato', target: 'same_tab' },
        style: { backgroundColor: '#0f7a5f', borderRadius: 8, color: '#ffffff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
        responsive: { mobileOrder: 3, mobileVisibility: 'visible', mobileLayoutMode: 'stack' },
        accessibility: { ariaLabel: 'Quero publicar minha página' }
      },
      [imageId]: {
        id: imageId,
        type: 'image',
        parentId: rootId,
        children: [],
        name: 'Hero image',
        layout: { x: 710, y: 96, width: 360, height: 260, zIndex: 4 },
        content: {
          assetId: 'sample-asset-cover',
          src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
          altText: 'Mesa de trabalho com notebook e materiais de planejamento'
        },
        style: { borderRadius: 8 },
        responsive: { mobileOrder: 4, mobileVisibility: 'visible', mobileLayoutMode: 'stack' },
        accessibility: { altText: 'Mesa de trabalho com notebook e materiais de planejamento' }
      }
    }
  }

  return {
    id: `draft-${pageId}`,
    pageId,
    version: 1,
    canvas,
    updatedByUserId: SAMPLE_USER_ID,
    autosavedAt: createdAt,
    createdAt,
    updatedAt: createdAt
  }
}

export const useCmsEditorDraft = (pageId: string) => {
  const draft = ref<CmsPageDraft>(createSampleDraft(pageId))
  const selectedElementId = ref<string>('element-heading')
  const autosaveStatus = ref<AutosaveStatus>('idle')
  const publishStatus = ref<PublishStatus>('idle')
  const undoStack = ref<CmsCanvasDocument[]>([])
  const redoStack = ref<CmsCanvasDocument[]>([])
  const latestSnapshot = ref<CmsPublishedPageSnapshot | null>(null)
  let autosaveTimer: ReturnType<typeof setTimeout> | null = null

  const selectedElement = computed(() =>
    draft.value.canvas.elements[selectedElementId.value] ?? null
  )

  const rootElement = computed(() =>
    draft.value.canvas.elements[draft.value.canvas.rootElementId]
  )

  const childElements = computed(() =>
    (rootElement.value?.children ?? [])
      .map((id) => draft.value.canvas.elements[id])
      .filter((element): element is CmsCanvasElement => Boolean(element))
      .sort((a, b) => (a.layout.zIndex ?? 0) - (b.layout.zIndex ?? 0))
  )

  const canUndo = computed(() => undoStack.value.length > 0)
  const canRedo = computed(() => redoStack.value.length > 0)

  const saveDraft = () => {
    if (!hasBrowserStorage()) {
      autosaveStatus.value = 'failed'
      return
    }

    autosaveStatus.value = 'saving'

    try {
      const savedAt = nowIso()
      draft.value = {
        ...draft.value,
        version: draft.value.version + 1,
        autosavedAt: savedAt,
        updatedAt: savedAt
      }
      window.localStorage.setItem(draftStorageKey(pageId), JSON.stringify(draft.value))
      autosaveStatus.value = 'saved'
    } catch {
      autosaveStatus.value = 'failed'
    }
  }

  const scheduleAutosave = () => {
    autosaveStatus.value = 'dirty'

    if (autosaveTimer) {
      clearTimeout(autosaveTimer)
    }

    autosaveTimer = setTimeout(saveDraft, 500)
  }

  const recordMutation = () => {
    undoStack.value = [...undoStack.value.slice(-24), clone(draft.value.canvas)]
    redoStack.value = []
  }

  const mutateCanvas = (mutation: () => void) => {
    recordMutation()
    mutation()
    scheduleAutosave()
  }

  const loadDraft = () => {
    if (!hasBrowserStorage()) {
      return
    }

    try {
      const raw = window.localStorage.getItem(draftStorageKey(pageId))
      if (raw) {
        draft.value = JSON.parse(raw) as CmsPageDraft
      }

      const snapshotRaw = window.localStorage.getItem(snapshotStorageKey(pageId))
      latestSnapshot.value = snapshotRaw ? JSON.parse(snapshotRaw) as CmsPublishedPageSnapshot : null
    } catch {
      draft.value = createSampleDraft(pageId)
      latestSnapshot.value = null
    }
  }

  const selectElement = (elementId: string) => {
    if (draft.value.canvas.elements[elementId]) {
      selectedElementId.value = elementId
    }
  }

  const addElement = (type: CmsCanvasElementType) => {
    const root = rootElement.value
    if (!root) {
      return
    }

    const seed = seedForElementType(type)
    const nextIndex = root.children.length + 1
    const element = makeElementFromSeed(seed, root.id, nextIndex)

    mutateCanvas(() => {
      draft.value.canvas.elements[element.id] = element
      root.children.push(element.id)
      selectedElementId.value = element.id
    })
  }

  const updateElement = (elementId: string, patch: Partial<CmsCanvasElement>) => {
    const current = draft.value.canvas.elements[elementId]
    if (!current) {
      return
    }

    mutateCanvas(() => {
      draft.value.canvas.elements[elementId] = {
        ...current,
        ...patch
      } as CmsCanvasElement
    })
  }

  const updateElementLayout = (elementId: string, patch: Partial<CmsCanvasLayout>) => {
    const current = draft.value.canvas.elements[elementId]
    if (!current) {
      return
    }

    updateElement(elementId, {
      layout: {
        ...current.layout,
        ...patch
      }
    })
  }

  const beginElementDrag = (elementId: string) => {
    if (!draft.value.canvas.elements[elementId]) {
      return
    }

    recordMutation()
    redoStack.value = []
    autosaveStatus.value = 'dirty'
  }

  const updateElementLayoutDuringDrag = (elementId: string, patch: Partial<CmsCanvasLayout>) => {
    const current = draft.value.canvas.elements[elementId]
    if (!current) {
      return
    }

    draft.value.canvas.elements[elementId] = {
      ...current,
      layout: {
        ...current.layout,
        ...patch
      }
    } as CmsCanvasElement
  }

  const commitElementDrag = () => {
    scheduleAutosave()
  }

  const updateElementStyle = (elementId: string, patch: CmsCanvasStyle) => {
    const current = draft.value.canvas.elements[elementId]
    if (!current) {
      return
    }

    updateElement(elementId, {
      style: {
        ...current.style,
        ...patch
      }
    })
  }

  const updateElementContent = (elementId: string, content: CmsCanvasElementContent) => {
    updateElement(elementId, { content } as Partial<CmsCanvasElement>)
  }

  const moveElement = (elementId: string, direction: -1 | 1) => {
    const element = draft.value.canvas.elements[elementId]
    if (!element?.parentId) {
      return
    }

    const parent = draft.value.canvas.elements[element.parentId]
    if (!parent) {
      return
    }

    const index = parent.children.indexOf(elementId)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= parent.children.length) {
      return
    }

    mutateCanvas(() => {
      const nextChildren = [...parent.children]
      const [moved] = nextChildren.splice(index, 1)
      nextChildren.splice(nextIndex, 0, moved)
      parent.children = nextChildren
      nextChildren.forEach((childId, childIndex) => {
        const child = draft.value.canvas.elements[childId]
        if (child) {
          child.layout.zIndex = childIndex + 1
          child.responsive.mobileOrder = childIndex + 1
        }
      })
    })
  }

  const deleteElement = (elementId: string) => {
    const element = draft.value.canvas.elements[elementId]
    if (!element || element.id === draft.value.canvas.rootElementId) {
      return
    }

    mutateCanvas(() => {
      if (element.parentId) {
        const parent = draft.value.canvas.elements[element.parentId]
        if (parent) {
          parent.children = parent.children.filter((id) => id !== elementId)
        }
      }

      const removeRecursively = (id: string) => {
        const item = draft.value.canvas.elements[id]
        item?.children.forEach(removeRecursively)
        delete draft.value.canvas.elements[id]
      }

      removeRecursively(elementId)
      selectedElementId.value = rootElement.value?.children[0] ?? draft.value.canvas.rootElementId
    })
  }

  const undo = () => {
    const previous = undoStack.value.at(-1)
    if (!previous) {
      return
    }

    redoStack.value = [...redoStack.value, clone(draft.value.canvas)]
    undoStack.value = undoStack.value.slice(0, -1)
    draft.value.canvas = clone(previous)
    if (!draft.value.canvas.elements[selectedElementId.value]) {
      selectedElementId.value = draft.value.canvas.rootElementId
    }
    scheduleAutosave()
  }

  const redo = () => {
    const next = redoStack.value.at(-1)
    if (!next) {
      return
    }

    undoStack.value = [...undoStack.value, clone(draft.value.canvas)]
    redoStack.value = redoStack.value.slice(0, -1)
    draft.value.canvas = clone(next)
    if (!draft.value.canvas.elements[selectedElementId.value]) {
      selectedElementId.value = draft.value.canvas.rootElementId
    }
    scheduleAutosave()
  }

  const resetDraft = () => {
    recordMutation()
    draft.value = createSampleDraft(pageId)
    selectedElementId.value = 'element-heading'
    scheduleAutosave()
  }

  const publishDraft = () => {
    publishStatus.value = 'publishing'

    try {
      const publishedAt = nowIso()
      const snapshot: CmsPublishedPageSnapshot = {
        id: makeId('snapshot'),
        pageId,
        publicationId: makeId('publication'),
        sourceDraftId: draft.value.id,
        version: (latestSnapshot.value?.version ?? 0) + 1,
        canvas: clone(draft.value.canvas),
        seo: {
          title: draft.value.canvas.metadata.title,
          description: draft.value.canvas.metadata.description,
          noIndex: false
        } satisfies CmsPageSeo,
        publishedByUserId: SAMPLE_USER_ID,
        publishedAt,
        immutable: true
      }

      if (hasBrowserStorage()) {
        window.localStorage.setItem(snapshotStorageKey(pageId), JSON.stringify(snapshot))
      }

      latestSnapshot.value = snapshot
      publishStatus.value = 'published'
    } catch {
      publishStatus.value = 'failed'
    }
  }

  onMounted(loadDraft)

  onUnmounted(() => {
    if (autosaveTimer) {
      clearTimeout(autosaveTimer)
    }
  })

  return {
    autosaveStatus,
    canRedo,
    canUndo,
    childElements,
    draft,
    latestSnapshot,
    publishStatus,
    rootElement,
    selectedElement,
    selectedElementId,
    addElement,
    beginElementDrag,
    commitElementDrag,
    deleteElement,
    moveElement,
    publishDraft,
    redo,
    resetDraft,
    saveDraft,
    selectElement,
    undo,
    updateElementContent,
    updateElementLayout,
    updateElementLayoutDuringDrag,
    updateElementStyle
  }
}

export type CmsEditorDraftController = ReturnType<typeof useCmsEditorDraft>
export type CmsEditorAutosaveStatus = AutosaveStatus
export type CmsEditorPublishStatus = PublishStatus
export type {
  CmsButtonContent,
  CmsFormContent,
  CmsHeadingContent,
  CmsImageContent,
  CmsTextContent
}
