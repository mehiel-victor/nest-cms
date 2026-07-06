<script setup lang="ts">
import {
  ArrowLeft,
  Box,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  FormInput,
  Heading1,
  ImageIcon,
  Layers3,
  MousePointer2,
  Redo2,
  Rocket,
  RotateCcw,
  Save,
  Square,
  Trash2,
  Type,
  Undo2
} from '@lucide/vue'
import type { Component, CSSProperties } from 'vue'
import type {
  CmsButtonContent,
  CmsCanvasElement,
  CmsCanvasElementType,
  CmsCanvasLayout,
  CmsCanvasStyle,
  CmsFormContent,
  CmsHeadingContent,
  CmsImageContent,
  CmsTextContent
} from '~/types'

definePageMeta({
  requiresAuth: false
})

useHead({
  title: 'NestCMS | Editor visual',
  meta: [
    {
      name: 'description',
      content: 'Editor visual local do CMS MVP com canvas, propriedades, camadas, autosave, preview e publicação.'
    }
  ]
})

const route = useRoute()
const pageId = computed(() => String(route.params.pageId || 'home'))
const editor = useCmsEditorDraft(pageId.value)

const previewOpen = ref(false)
const previewMode = ref<'desktop' | 'mobile'>('desktop')
const activeLeftPanel = ref<'elements' | 'layers'>('elements')

const palette: Array<{ type: CmsCanvasElementType, label: string, icon: Component }> = [
  { type: 'heading', label: 'Título', icon: Heading1 },
  { type: 'text', label: 'Texto', icon: Type },
  { type: 'button', label: 'Botão', icon: Square },
  { type: 'image', label: 'Imagem', icon: ImageIcon },
  { type: 'box', label: 'Container', icon: Box },
  { type: 'form', label: 'Formulário', icon: FormInput }
]

const autosaveLabels: Record<string, string> = {
  idle: 'Pronto',
  dirty: 'Alterações locais',
  saving: 'Salvando...',
  saved: 'Rascunho salvo',
  failed: 'Falha ao salvar'
}

const publishLabels: Record<string, string> = {
  idle: 'Sem publicação local',
  publishing: 'Publicando...',
  published: 'Snapshot publicado',
  failed: 'Falha ao publicar'
}

const selectedElement = editor.selectedElement
const selectedElementType = computed(() => selectedElement.value?.type ?? null)

const selectedName = computed(() => selectedElement.value?.name || selectedElement.value?.type || 'Elemento')
const selectedText = computed(() => {
  const element = selectedElement.value
  if (element?.type === 'heading' || element?.type === 'text') {
    return element.content.text
  }
  return ''
})

const selectedHeadingLevel = computed(() =>
  selectedElement.value?.type === 'heading' ? selectedElement.value.content.level : 2
)

const selectedButton = computed(() =>
  selectedElement.value?.type === 'button' ? selectedElement.value.content : null
)

const selectedImage = computed(() =>
  selectedElement.value?.type === 'image' ? selectedElement.value.content : null
)

const selectedForm = computed(() =>
  selectedElement.value?.type === 'form' ? selectedElement.value.content : null
)

const numberFromEvent = (event: Event) => {
  const value = Number((event.target as HTMLInputElement).value)
  return Number.isFinite(value) ? value : 0
}

const stringFromEvent = (event: Event) =>
  (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value

const elementLabel = (element: CmsCanvasElement) =>
  element.name || element.type

const elementSummary = (element: CmsCanvasElement) => {
  if (element.type === 'heading' || element.type === 'text') {
    return element.content.text
  }
  if (element.type === 'button') {
    return element.content.label
  }
  if (element.type === 'image') {
    return element.content.altText
  }
  if (element.type === 'form') {
    return `${element.content.fields.length} campos`
  }
  return 'Container visual'
}

const elementFrameStyle = (element: CmsCanvasElement): CSSProperties => ({
  left: `${element.layout.x}px`,
  top: `${element.layout.y}px`,
  width: `${element.layout.width}px`,
  height: `${element.layout.height}px`,
  zIndex: element.layout.zIndex ?? 1,
  position: 'absolute'
})

const previewFrameStyle = (element: CmsCanvasElement): CSSProperties => {
  if (previewMode.value === 'desktop') {
    return elementFrameStyle(element)
  }

  return {
    position: 'relative',
    width: '100%',
    minHeight: `${Math.max(64, Math.min(element.layout.height, 240))}px`,
    order: element.responsive.mobileOrder
  }
}

const contentStyle = (element: CmsCanvasElement): CSSProperties => {
  const style = element.style
  const borderWidth = style.borderWidth ?? 0

  return {
    backgroundColor: style.backgroundColor,
    borderColor: style.borderColor,
    borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : undefined,
    borderStyle: borderWidth ? 'solid' : undefined,
    borderWidth: borderWidth ? `${borderWidth}px` : undefined,
    color: style.color,
    fontSize: style.fontSize !== undefined ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    opacity: style.opacity,
    textAlign: style.textAlign
  }
}

const updateLayout = (field: keyof CmsCanvasLayout, value: number) => {
  const element = selectedElement.value
  if (!element) {
    return
  }

  editor.updateElementLayout(element.id, { [field]: value })
}

const updateStyle = (patch: CmsCanvasStyle) => {
  const element = selectedElement.value
  if (!element) {
    return
  }

  editor.updateElementStyle(element.id, patch)
}

const updateSelectedText = (text: string) => {
  const element = selectedElement.value
  if (element?.type === 'heading') {
    editor.updateElementContent(element.id, { ...element.content, text } satisfies CmsHeadingContent)
  }
  if (element?.type === 'text') {
    editor.updateElementContent(element.id, { ...element.content, text } satisfies CmsTextContent)
  }
}

const updateHeadingLevel = (level: number) => {
  const element = selectedElement.value
  if (element?.type !== 'heading') {
    return
  }

  editor.updateElementContent(element.id, {
    ...element.content,
    level: Math.min(6, Math.max(1, level)) as CmsHeadingContent['level']
  })
}

const updateButtonContent = (patch: Partial<CmsButtonContent>) => {
  const element = selectedElement.value
  if (element?.type !== 'button') {
    return
  }

  editor.updateElementContent(element.id, { ...element.content, ...patch })
}

const updateImageContent = (patch: Partial<CmsImageContent>) => {
  const element = selectedElement.value
  if (element?.type !== 'image') {
    return
  }

  editor.updateElementContent(element.id, { ...element.content, ...patch })
}

const updateFormContent = (patch: Partial<CmsFormContent>) => {
  const element = selectedElement.value
  if (element?.type !== 'form') {
    return
  }

  editor.updateElementContent(element.id, { ...element.content, ...patch })
}

const updateFormField = (
  fieldIndex: number,
  patch: Partial<CmsFormContent['fields'][number]>
) => {
  const element = selectedElement.value
  if (element?.type !== 'form') {
    return
  }

  const fields = element.content.fields.map((field, index) =>
    index === fieldIndex ? { ...field, ...patch } : field
  )
  updateFormContent({ fields })
}

const addPaletteElement = (type: CmsCanvasElementType) => {
  activeLeftPanel.value = 'layers'
  editor.addElement(type)
}

interface DragState {
  elementId: string
  startX: number
  startY: number
  originX: number
  originY: number
}

const dragState = ref<DragState | null>(null)

const stopDrag = () => {
  if (!dragState.value) {
    return
  }

  dragState.value = null
  editor.commitElementDrag()
  window.removeEventListener('mousemove', dragElement)
  window.removeEventListener('mouseup', stopDrag)
}

const dragElement = (event: MouseEvent) => {
  const state = dragState.value
  if (!state) {
    return
  }

  editor.updateElementLayoutDuringDrag(state.elementId, {
    x: Math.max(0, Math.round(state.originX + event.clientX - state.startX)),
    y: Math.max(0, Math.round(state.originY + event.clientY - state.startY))
  })
}

const startDrag = (event: MouseEvent, element: CmsCanvasElement) => {
  if (event.button !== 0 || element.id === editor.draft.value.canvas.rootElementId) {
    return
  }

  event.preventDefault()
  editor.selectElement(element.id)
  editor.beginElementDrag(element.id)
  dragState.value = {
    elementId: element.id,
    startX: event.clientX,
    startY: event.clientY,
    originX: element.layout.x,
    originY: element.layout.y
  }
  window.addEventListener('mousemove', dragElement)
  window.addEventListener('mouseup', stopDrag)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', dragElement)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <main class="cms-editor">
    <header class="cms-editor-topbar">
      <div class="cms-editor-title">
        <NuxtLink to="/cms" class="cms-editor-back" aria-label="Voltar para CMS">
          <ArrowLeft :size="18" aria-hidden="true" />
        </NuxtLink>
        <div>
          <p class="eyebrow">CMS editor MVP</p>
          <h1>{{ editor.draft.value.canvas.metadata.title }}</h1>
        </div>
      </div>

      <div class="cms-editor-actions">
        <span class="cms-editor-status" :class="`status-${editor.autosaveStatus.value}`">
          <Save :size="15" aria-hidden="true" />
          {{ autosaveLabels[editor.autosaveStatus.value] }}
        </span>
        <button type="button" class="icon-button" :disabled="!editor.canUndo.value" title="Desfazer" @click="editor.undo">
          <Undo2 :size="18" aria-hidden="true" />
        </button>
        <button type="button" class="icon-button" :disabled="!editor.canRedo.value" title="Refazer" @click="editor.redo">
          <Redo2 :size="18" aria-hidden="true" />
        </button>
        <button type="button" class="tool-button" @click="previewOpen = true">
          <Eye :size="16" aria-hidden="true" />
          Preview
        </button>
        <button type="button" class="tool-button primary" @click="editor.publishDraft">
          <Rocket :size="16" aria-hidden="true" />
          Publicar
        </button>
      </div>
    </header>

    <section class="cms-editor-shell">
      <aside class="cms-editor-left" aria-label="Elementos e camadas">
        <div class="cms-editor-tabs" role="tablist" aria-label="Painéis do editor">
          <button type="button" :class="{ active: activeLeftPanel === 'elements' }" @click="activeLeftPanel = 'elements'">
            <MousePointer2 :size="16" aria-hidden="true" />
            Elementos
          </button>
          <button type="button" :class="{ active: activeLeftPanel === 'layers' }" @click="activeLeftPanel = 'layers'">
            <Layers3 :size="16" aria-hidden="true" />
            Camadas
          </button>
        </div>

        <div v-if="activeLeftPanel === 'elements'" class="cms-tool-list">
          <button
            v-for="item in palette"
            :key="item.type"
            type="button"
            class="cms-tool-item"
            @click="addPaletteElement(item.type)"
          >
            <component :is="item.icon" :size="18" aria-hidden="true" />
            <span>{{ item.label }}</span>
          </button>
        </div>

        <div v-else class="cms-layer-list">
          <button
            v-for="element in editor.childElements.value"
            :key="element.id"
            type="button"
            class="cms-layer-item"
            :class="{ selected: editor.selectedElementId.value === element.id }"
            @click="editor.selectElement(element.id)"
          >
            <span>
              <strong>{{ elementLabel(element) }}</strong>
              <small>{{ elementSummary(element) }}</small>
            </span>
          </button>
        </div>
      </aside>

      <section class="cms-editor-stage" aria-label="Canvas">
        <div class="cms-stage-ruler horizontal" />
        <div class="cms-stage-ruler vertical" />
        <div class="cms-canvas-surface" :style="{ width: `${editor.rootElement.value?.layout.width ?? 1200}px`, minHeight: `${editor.rootElement.value?.layout.height ?? 760}px` }">
          <button
            v-for="element in editor.childElements.value"
            :key="element.id"
            type="button"
            class="cms-canvas-element"
            :class="[`type-${element.type}`, { selected: editor.selectedElementId.value === element.id }]"
            :style="elementFrameStyle(element)"
            @click.stop="editor.selectElement(element.id)"
            @mousedown="startDrag($event, element)"
          >
            <span class="cms-canvas-element-label">{{ elementLabel(element) }}</span>

            <span v-if="element.type === 'heading'" class="cms-render-heading" :style="contentStyle(element)">
              {{ element.content.text }}
            </span>
            <span v-else-if="element.type === 'text'" class="cms-render-text" :style="contentStyle(element)">
              {{ element.content.text }}
            </span>
            <span v-else-if="element.type === 'button'" class="cms-render-button" :style="contentStyle(element)">
              {{ element.content.label }}
            </span>
            <img
              v-else-if="element.type === 'image'"
              class="cms-render-image"
              :src="element.content.src"
              :alt="element.content.altText"
              :style="contentStyle(element)"
            >
            <span v-else-if="element.type === 'form'" class="cms-render-form" :style="contentStyle(element)">
              <span v-for="field in element.content.fields" :key="field.id">{{ field.label }}</span>
              <strong>{{ element.content.submitLabel }}</strong>
            </span>
            <span v-else class="cms-render-box" :style="contentStyle(element)">
              Container
            </span>
          </button>
        </div>
      </section>

      <aside class="cms-editor-right" aria-label="Propriedades">
        <div class="properties-head">
          <div>
            <p class="eyebrow">Selecionado</p>
            <h2>{{ selectedName }}</h2>
          </div>
          <button type="button" class="icon-button danger" title="Excluir elemento" @click="selectedElement && editor.deleteElement(selectedElement.id)">
            <Trash2 :size="17" aria-hidden="true" />
          </button>
        </div>

        <div v-if="selectedElement" class="property-groups">
          <section class="property-group">
            <h3>Layout</h3>
            <div class="property-grid">
              <label>X <input :value="selectedElement.layout.x" type="number" @input="updateLayout('x', numberFromEvent($event))"></label>
              <label>Y <input :value="selectedElement.layout.y" type="number" @input="updateLayout('y', numberFromEvent($event))"></label>
              <label>W <input :value="selectedElement.layout.width" type="number" min="24" @input="updateLayout('width', numberFromEvent($event))"></label>
              <label>H <input :value="selectedElement.layout.height" type="number" min="24" @input="updateLayout('height', numberFromEvent($event))"></label>
            </div>
          </section>

          <section class="property-group">
            <h3>Conteúdo</h3>

            <template v-if="selectedElementType === 'heading' || selectedElementType === 'text'">
              <label class="property-field">
                Texto
                <textarea :value="selectedText" @input="updateSelectedText(stringFromEvent($event))" />
              </label>
              <label v-if="selectedElementType === 'heading'" class="property-field">
                Nível
                <select :value="selectedHeadingLevel" @change="updateHeadingLevel(numberFromEvent($event))">
                  <option v-for="level in [1, 2, 3, 4, 5, 6]" :key="level" :value="level">H{{ level }}</option>
                </select>
              </label>
            </template>

            <template v-else-if="selectedButton">
              <label class="property-field">Label <input :value="selectedButton.label" @input="updateButtonContent({ label: stringFromEvent($event) })"></label>
              <label class="property-field">Link <input :value="selectedButton.href || ''" @input="updateButtonContent({ href: stringFromEvent($event) || null })"></label>
            </template>

            <template v-else-if="selectedImage">
              <label class="property-field">URL <input :value="selectedImage.src" @input="updateImageContent({ src: stringFromEvent($event) })"></label>
              <label class="property-field">Alt text <input :value="selectedImage.altText" @input="updateImageContent({ altText: stringFromEvent($event) })"></label>
            </template>

            <template v-else-if="selectedForm">
              <label class="property-field">Botão <input :value="selectedForm.submitLabel" @input="updateFormContent({ submitLabel: stringFromEvent($event) })"></label>
              <label class="property-field">Mensagem <input :value="selectedForm.successMessage" @input="updateFormContent({ successMessage: stringFromEvent($event) })"></label>
              <div class="form-field-editor">
                <label v-for="(field, index) in selectedForm.fields" :key="field.id">
                  Campo {{ index + 1 }}
                  <input :value="field.label" @input="updateFormField(index, { label: stringFromEvent($event) })">
                </label>
              </div>
            </template>

            <p v-else class="property-note">Container visual usado para organizar blocos e composição.</p>
          </section>

          <section class="property-group">
            <h3>Estilo</h3>
            <div class="property-grid">
              <label>Cor <input :value="selectedElement.style.color || '#17211d'" type="color" @input="updateStyle({ color: stringFromEvent($event) })"></label>
              <label>Fundo <input :value="selectedElement.style.backgroundColor || '#ffffff'" type="color" @input="updateStyle({ backgroundColor: stringFromEvent($event) })"></label>
              <label>Fonte <input :value="selectedElement.style.fontSize || 16" type="number" min="8" @input="updateStyle({ fontSize: numberFromEvent($event) })"></label>
              <label>Raio <input :value="selectedElement.style.borderRadius || 0" type="number" min="0" @input="updateStyle({ borderRadius: numberFromEvent($event) })"></label>
            </div>
          </section>

          <section class="property-group compact">
            <h3>Camada</h3>
            <div class="property-actions">
              <button type="button" @click="editor.moveElement(selectedElement.id, -1)">
                <ChevronUp :size="16" aria-hidden="true" /> Subir
              </button>
              <button type="button" @click="editor.moveElement(selectedElement.id, 1)">
                <ChevronDown :size="16" aria-hidden="true" /> Descer
              </button>
            </div>
          </section>
        </div>

        <div class="publish-card">
          <FileText :size="18" aria-hidden="true" />
          <div>
            <strong>{{ publishLabels[editor.publishStatus.value] }}</strong>
            <p v-if="editor.latestSnapshot.value">Snapshot v{{ editor.latestSnapshot.value.version }} em {{ new Date(editor.latestSnapshot.value.publishedAt).toLocaleString('pt-BR') }}</p>
            <p v-else>Publicação local cria uma cópia imutável do rascunho.</p>
          </div>
        </div>

        <button type="button" class="reset-button" @click="editor.resetDraft">
          <RotateCcw :size="16" aria-hidden="true" />
          Restaurar exemplo
        </button>
      </aside>
    </section>

    <div v-if="previewOpen" class="cms-preview-overlay" role="dialog" aria-modal="true" aria-label="Preview do rascunho">
      <div class="cms-preview-dialog">
        <header class="cms-preview-head">
          <div>
            <p class="eyebrow">Preview do rascunho</p>
            <h2>{{ editor.draft.value.canvas.metadata.title }}</h2>
          </div>
          <div class="preview-actions">
            <button type="button" :class="{ active: previewMode === 'desktop' }" @click="previewMode = 'desktop'">Desktop</button>
            <button type="button" :class="{ active: previewMode === 'mobile' }" @click="previewMode = 'mobile'">Mobile</button>
            <button type="button" class="tool-button" @click="previewOpen = false">Fechar</button>
          </div>
        </header>

        <div class="cms-preview-frame" :class="`mode-${previewMode}`">
          <article class="cms-preview-page">
            <div
              v-for="element in editor.childElements.value"
              :key="element.id"
              class="cms-preview-element"
              :class="`type-${element.type}`"
              :style="[previewFrameStyle(element), contentStyle(element)]"
            >
              <h1 v-if="element.type === 'heading' && element.content.level === 1">{{ element.content.text }}</h1>
              <h2 v-else-if="element.type === 'heading'">{{ element.content.text }}</h2>
              <p v-else-if="element.type === 'text'">{{ element.content.text }}</p>
              <a v-else-if="element.type === 'button'" :href="element.content.href || '#'" class="cms-preview-button">{{ element.content.label }}</a>
              <img v-else-if="element.type === 'image'" :src="element.content.src" :alt="element.content.altText">
              <form v-else-if="element.type === 'form'" class="cms-preview-form">
                <label v-for="field in element.content.fields" :key="field.id">{{ field.label }}<input :type="field.type === 'textarea' ? 'text' : field.type" disabled></label>
                <button type="button">{{ element.content.submitLabel }}</button>
              </form>
            </div>
          </article>
        </div>
      </div>
    </div>
  </main>
</template>
