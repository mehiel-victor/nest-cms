export type CmsId = string
export type CmsIsoDateTime = string

export const CMS_MVP_LIMITS = {
  sitesPerAccount: 1,
  customDomainsPerSite: 1,
  previewSubdomainsPerSite: 1
} as const

export type CmsAccountStatus = 'active' | 'suspended' | 'closed'
export type CmsUserRole = 'owner'
export type CmsSiteStatus = 'draft' | 'active' | 'paused' | 'archived'
export type CmsDomainKind = 'preview' | 'custom'
export type CmsDomainStatus = 'pending_dns' | 'verifying' | 'active' | 'failed' | 'disabled'
export type CmsDomainSslStatus = 'not_required' | 'pending' | 'active' | 'failed'
export type CmsPageStatus = 'draft' | 'published' | 'archived'
export type CmsAssetKind = 'image' | 'document' | 'video'
export type CmsAssetStatus = 'uploading' | 'ready' | 'failed'
export type CmsAiSuggestionStatus = 'pending' | 'applied' | 'discarded' | 'failed'
export type CmsPublicationStatus = 'queued' | 'publishing' | 'published' | 'failed'

export interface CmsAccount {
  id: CmsId
  name: string
  ownerUserId: CmsId
  siteId: CmsId | null
  status: CmsAccountStatus
  createdAt: CmsIsoDateTime
  updatedAt: CmsIsoDateTime
}

export interface CmsUser {
  id: CmsId
  accountId: CmsId
  email: string
  name: string | null
  role: CmsUserRole
  createdAt: CmsIsoDateTime
  updatedAt: CmsIsoDateTime
}

export interface CmsSite {
  id: CmsId
  accountId: CmsId
  name: string
  slug: string
  previewSubdomain: string
  customDomainId: CmsId | null
  status: CmsSiteStatus
  createdAt: CmsIsoDateTime
  updatedAt: CmsIsoDateTime
}

export type CmsDomainRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT'
export type CmsDomainRecordStatus = 'missing' | 'valid' | 'invalid'

export interface CmsDomainDnsRecord {
  type: CmsDomainRecordType
  host: string
  value: string
  status: CmsDomainRecordStatus
  priority?: number
}

export interface CmsDomain {
  id: CmsId
  siteId: CmsId
  kind: CmsDomainKind
  host: string
  status: CmsDomainStatus
  dnsRecords: CmsDomainDnsRecord[]
  sslStatus: CmsDomainSslStatus
  isPrimary: boolean
  lastCheckedAt: CmsIsoDateTime | null
  createdAt: CmsIsoDateTime
  updatedAt: CmsIsoDateTime
}

export interface CmsPageSeo {
  title: string
  description: string
  noIndex: boolean
  canonicalUrl?: string | null
  openGraphImageAssetId?: CmsId | null
}

export interface CmsPage {
  id: CmsId
  siteId: CmsId
  title: string
  slug: string
  status: CmsPageStatus
  draftId: CmsId
  latestPublishedSnapshotId: CmsId | null
  seo: CmsPageSeo
  createdAt: CmsIsoDateTime
  updatedAt: CmsIsoDateTime
}

export interface CmsPageDraft {
  id: CmsId
  pageId: CmsId
  version: number
  canvas: CmsCanvasDocument
  updatedByUserId: CmsId
  autosavedAt: CmsIsoDateTime
  createdAt: CmsIsoDateTime
  updatedAt: CmsIsoDateTime
}

export interface CmsPublishedPageSnapshot {
  id: CmsId
  pageId: CmsId
  publicationId: CmsId
  sourceDraftId: CmsId
  version: number
  canvas: CmsCanvasDocument
  seo: CmsPageSeo
  publishedByUserId: CmsId
  publishedAt: CmsIsoDateTime
  immutable: true
}

export interface CmsAsset {
  id: CmsId
  siteId: CmsId
  kind: CmsAssetKind
  fileName: string
  mimeType: string
  sizeBytes: number
  url: string
  publicUrl: string | null
  altText: string | null
  status: CmsAssetStatus
  createdAt: CmsIsoDateTime
  updatedAt: CmsIsoDateTime
}

export type CmsCanvasElementType = 'box' | 'heading' | 'text' | 'button' | 'image' | 'form'

export interface CmsCanvasLayout {
  x: number
  y: number
  width: number
  height: number
  zIndex?: number
  rotation?: number
}

export interface CmsSpacing {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export interface CmsCanvasStyle {
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  borderWidth?: number
  color?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: number | 'normal' | 'medium' | 'semibold' | 'bold'
  lineHeight?: number
  margin?: CmsSpacing
  opacity?: number
  padding?: CmsSpacing
  textAlign?: 'left' | 'center' | 'right'
}

export type CmsMobileVisibility = 'visible' | 'hidden'
export type CmsMobileLayoutMode = 'stack' | 'full_width' | 'preserve_aspect'

export interface CmsCanvasResponsiveBehavior {
  mobileOrder: number
  mobileVisibility: CmsMobileVisibility
  mobileLayoutMode?: CmsMobileLayoutMode
}

export interface CmsCanvasAccessibility {
  ariaLabel?: string
  altText?: string
  role?: string
}

export interface CmsHeadingContent {
  text: string
  level: 1 | 2 | 3 | 4 | 5 | 6
}

export interface CmsTextContent {
  text: string
}

export interface CmsButtonContent {
  label: string
  href: string | null
  target: 'same_tab' | 'new_tab'
}

export interface CmsImageContent {
  assetId: CmsId
  src: string
  altText: string
}

export interface CmsFormField {
  id: CmsId
  label: string
  type: 'text' | 'email' | 'textarea'
  required: boolean
}

export interface CmsFormContent {
  fields: CmsFormField[]
  submitLabel: string
  successMessage: string
}

export type CmsBoxContent = Record<string, never>

export type CmsCanvasElementContent =
  | CmsBoxContent
  | CmsHeadingContent
  | CmsTextContent
  | CmsButtonContent
  | CmsImageContent
  | CmsFormContent

export interface CmsCanvasElementBase<Type extends CmsCanvasElementType, Content extends CmsCanvasElementContent> {
  id: CmsId
  type: Type
  parentId: CmsId | null
  children: CmsId[]
  name?: string
  layout: CmsCanvasLayout
  content: Content
  style: CmsCanvasStyle
  responsive: CmsCanvasResponsiveBehavior
  accessibility: CmsCanvasAccessibility
}

export type CmsBoxElement = CmsCanvasElementBase<'box', CmsBoxContent>
export type CmsHeadingElement = CmsCanvasElementBase<'heading', CmsHeadingContent>
export type CmsTextElement = CmsCanvasElementBase<'text', CmsTextContent>
export type CmsButtonElement = CmsCanvasElementBase<'button', CmsButtonContent>
export type CmsImageElement = CmsCanvasElementBase<'image', CmsImageContent>
export type CmsFormElement = CmsCanvasElementBase<'form', CmsFormContent>

export type CmsCanvasElement =
  | CmsBoxElement
  | CmsHeadingElement
  | CmsTextElement
  | CmsButtonElement
  | CmsImageElement
  | CmsFormElement

export interface CmsCanvasDocumentMetadata {
  title: string
  description: string
}

export interface CmsCanvasDocument {
  schemaVersion: 1
  rootElementId: CmsId
  elements: Record<CmsId, CmsCanvasElement>
  metadata: CmsCanvasDocumentMetadata
}

export interface CmsCanvasElementSeedBase<Type extends CmsCanvasElementType, Content extends CmsCanvasElementContent> {
  type: Type
  name?: string
  layout?: Partial<CmsCanvasLayout>
  content: Content
  style?: CmsCanvasStyle
  responsive?: Partial<CmsCanvasResponsiveBehavior>
  accessibility?: CmsCanvasAccessibility
}

export type CmsBoxElementSeed = CmsCanvasElementSeedBase<'box', CmsBoxContent>
export type CmsHeadingElementSeed = CmsCanvasElementSeedBase<'heading', CmsHeadingContent>
export type CmsTextElementSeed = CmsCanvasElementSeedBase<'text', CmsTextContent>
export type CmsButtonElementSeed = CmsCanvasElementSeedBase<'button', CmsButtonContent>
export type CmsImageElementSeed = CmsCanvasElementSeedBase<'image', CmsImageContent>
export type CmsFormElementSeed = CmsCanvasElementSeedBase<'form', CmsFormContent>

export type CmsCanvasElementSeed =
  | CmsBoxElementSeed
  | CmsHeadingElementSeed
  | CmsTextElementSeed
  | CmsButtonElementSeed
  | CmsImageElementSeed
  | CmsFormElementSeed

export interface CmsAiOperationBase {
  id: CmsId
  reason?: string
}

export interface CmsAiUpdateTextOperation extends CmsAiOperationBase {
  type: 'updateText'
  elementId: CmsId
  text: string
}

export interface CmsAiUpdateStyleOperation extends CmsAiOperationBase {
  type: 'updateStyle'
  elementId: CmsId
  stylePatch: CmsCanvasStyle
}

export interface CmsAiCreateElementOperation extends CmsAiOperationBase {
  type: 'createElement'
  parentId: CmsId
  index?: number
  element: CmsCanvasElementSeed
}

export interface CmsAiMoveElementOperation extends CmsAiOperationBase {
  type: 'moveElement'
  elementId: CmsId
  parentId?: CmsId
  index?: number
  layoutPatch?: Partial<CmsCanvasLayout>
}

export interface CmsAiDeleteElementOperation extends CmsAiOperationBase {
  type: 'deleteElement'
  elementId: CmsId
  includeChildren: boolean
}

export type CmsAiOperation =
  | CmsAiUpdateTextOperation
  | CmsAiUpdateStyleOperation
  | CmsAiCreateElementOperation
  | CmsAiMoveElementOperation
  | CmsAiDeleteElementOperation

export interface CmsAiSuggestion {
  id: CmsId
  siteId: CmsId
  pageId: CmsId
  draftId: CmsId
  selectedElementId: CmsId | null
  prompt: string
  status: CmsAiSuggestionStatus
  operations: CmsAiOperation[]
  createdByUserId: CmsId
  createdAt: CmsIsoDateTime
  resolvedAt: CmsIsoDateTime | null
}

export interface CmsPublication {
  id: CmsId
  siteId: CmsId
  pageId: CmsId
  draftId: CmsId
  snapshotId: CmsId | null
  status: CmsPublicationStatus
  createdByUserId: CmsId
  createdAt: CmsIsoDateTime
  completedAt: CmsIsoDateTime | null
  failureReason: string | null
}

export const isDestructiveCmsAiOperation = (operation: CmsAiOperation) =>
  operation.type === 'deleteElement'
