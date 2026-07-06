# NestCMS CMS MVP Data Model

Date: 2026-07-06
Status: architecture contract for issue #9
Source spec: `docs/superpowers/specs/2026-07-05-nestcms-cms-product-discovery-design.md`

## Purpose

Define the first durable CMS model before building the editor, AI copilot, renderer, or backend persistence. This model keeps the MVP narrow: one account owns one site, one site has one custom domain, pages have autosaved drafts, publishing creates immutable public snapshots, and AI suggestions are reviewable structured operations.

## Scope

This is a contract for the future backend and frontend editor. It does not introduce a database, authentication provider, AI provider, domain verification service, or public renderer yet.

The existing frontend commerce demo remains separate. CMS entities use the `Cms` prefix in TypeScript to avoid mixing the future product model with demo commerce types.

## Bounded Contexts

| Context | Owns | Notes |
| --- | --- | --- |
| Account | `CmsAccount`, `CmsUser` | Account owns billing/plan limits later, but MVP starts with a single owner user. |
| Site | `CmsSite`, `CmsDomain` | Site owns preview/custom domain state and enforces one-site/one-custom-domain limits. |
| Content | `CmsPage`, `CmsPageDraft`, `CmsPublishedPageSnapshot`, `CmsCanvasElement` | Draft state and public snapshots are separate records. Canvas is structured JSON. |
| Assets | `CmsAsset` | Media belongs to a site and may be referenced by draft or published snapshots. |
| AI | `CmsAiSuggestion`, `CmsAiOperation` | AI output is never raw code. It is an operation list applied only after user approval. |
| Publishing | `CmsPublication` | Publishing copies a draft into a new immutable snapshot and points the public route at that snapshot. |

## Model Overview

| Model | Responsibility | Primary relationships |
| --- | --- | --- |
| `CmsAccount` | Commercial/customer container for the MVP owner. | Has one `CmsUser`; has one `CmsSite`. |
| `CmsUser` | Human actor who edits and publishes. | Belongs to one `CmsAccount`. |
| `CmsSite` | Website container with slug, preview subdomain, and publication settings. | Belongs to one `CmsAccount`; has pages, domains, assets, publications. |
| `CmsDomain` | DNS/SSL state for either preview or custom hostname. | Belongs to one `CmsSite`. |
| `CmsPage` | Stable page identity, slug, title, SEO defaults, and pointers to draft/published state. | Belongs to one `CmsSite`; has one active draft and zero-or-one latest published snapshot. |
| `CmsPageDraft` | Editable autosaved document. | Belongs to one `CmsPage`; stores `CmsCanvasDocument`. |
| `CmsPublishedPageSnapshot` | Immutable public document produced by publishing. | Belongs to one `CmsPage` and one `CmsPublication`; stores a copied `CmsCanvasDocument`. |
| `CmsCanvasElement` | Structured element inside a canvas document. | Stored inside draft/snapshot documents, not as raw generated HTML. |
| `CmsAsset` | Image/file metadata and public/private delivery URLs. | Belongs to one `CmsSite`; referenced by image elements or metadata. |
| `CmsAiSuggestion` | Auditable AI response pending apply/discard. | Belongs to one draft/page/site; contains `CmsAiOperation[]`. |
| `CmsPublication` | Publish attempt and result. | Links draft to produced snapshot and publish status. |

## MVP Invariants

1. One account can have at most one site.
2. One site can have one preview subdomain and at most one custom domain.
3. The preview subdomain renders draft state only in authenticated preview flows.
4. The custom domain renders only the latest published snapshot.
5. Draft and published state never share mutable records.
6. Publishing copies the current draft canvas into a new immutable snapshot.
7. A public renderer reads `CmsPublishedPageSnapshot`, not `CmsPageDraft`.
8. Canvas documents are structured JSON with typed elements, layout, content, style, responsive hints, and accessibility fields.
9. AI suggestions contain structured operations only: `updateText`, `updateStyle`, `createElement`, `moveElement`, or `deleteElement`.
10. AI operations modify drafts only after explicit user approval.

## Field Contract

### `CmsAccount`

- `id`: stable id.
- `name`: display name.
- `ownerUserId`: owner user id.
- `siteId`: nullable until onboarding creates the one site.
- `status`: `active`, `suspended`, or `closed`.
- `createdAt`, `updatedAt`: ISO timestamps.

### `CmsUser`

- `id`: stable id.
- `accountId`: owning account.
- `email`: login/contact email.
- `name`: optional display name.
- `role`: MVP value is `owner`.
- `createdAt`, `updatedAt`: ISO timestamps.

### `CmsSite`

- `id`: stable id.
- `accountId`: owning account; must be unique for MVP.
- `name`: site display name.
- `slug`: stable site slug.
- `previewSubdomain`: generated hostname such as `site-slug.nestcms.app`.
- `customDomainId`: nullable pointer to the active custom domain.
- `status`: `draft`, `active`, `paused`, or `archived`.
- `createdAt`, `updatedAt`: ISO timestamps.

### `CmsDomain`

- `id`: stable id.
- `siteId`: owning site.
- `kind`: `preview` or `custom`.
- `host`: hostname.
- `status`: `pending_dns`, `verifying`, `active`, `failed`, or `disabled`.
- `dnsRecords`: expected DNS records for custom domains.
- `sslStatus`: `not_required`, `pending`, `active`, or `failed`.
- `isPrimary`: whether public routing should prefer this hostname.
- `lastCheckedAt`: nullable ISO timestamp.
- `createdAt`, `updatedAt`: ISO timestamps.

Constraint: `(siteId, kind)` is unique for `preview`. `(siteId, kind)` is unique for `custom` in the MVP.

### `CmsPage`

- `id`: stable id.
- `siteId`: owning site.
- `title`: editor title.
- `slug`: public path segment.
- `status`: `draft`, `published`, or `archived`.
- `draftId`: active draft id.
- `latestPublishedSnapshotId`: nullable pointer used by public routes.
- `seo`: SEO defaults.
- `createdAt`, `updatedAt`: ISO timestamps.

Constraint: `(siteId, slug)` is unique.

### `CmsPageDraft`

- `id`: stable id.
- `pageId`: owning page.
- `version`: incremented on meaningful autosave.
- `canvas`: `CmsCanvasDocument`.
- `updatedByUserId`: last editor.
- `autosavedAt`: ISO timestamp.
- `createdAt`, `updatedAt`: ISO timestamps.

Draft writes are autosaved and replace the active editable state. They do not affect public pages until publishing.

### `CmsPublishedPageSnapshot`

- `id`: stable id.
- `pageId`: owning page.
- `publicationId`: publication event that created this snapshot.
- `sourceDraftId`: draft copied into this snapshot.
- `version`: snapshot version for the page.
- `canvas`: copied `CmsCanvasDocument`.
- `seo`: SEO data copied or overridden at publish time.
- `publishedByUserId`: publisher.
- `publishedAt`: ISO timestamp.
- `immutable`: always `true`.

Snapshots are append-only. A rollback creates a new publication pointing to a selected historical snapshot or copied document; it does not mutate the historical snapshot.

### `CmsAsset`

- `id`: stable id.
- `siteId`: owning site.
- `kind`: `image`, `document`, or `video`.
- `fileName`: original or normalized file name.
- `mimeType`: MIME type.
- `sizeBytes`: asset size.
- `url`: private or editor URL.
- `publicUrl`: nullable public delivery URL.
- `altText`: optional accessibility text for images.
- `status`: `uploading`, `ready`, or `failed`.
- `createdAt`, `updatedAt`: ISO timestamps.

### `CmsAiSuggestion`

- `id`: stable id.
- `siteId`, `pageId`, `draftId`: suggestion context.
- `selectedElementId`: nullable selected element.
- `prompt`: user instruction.
- `status`: `pending`, `applied`, `discarded`, or `failed`.
- `operations`: ordered `CmsAiOperation[]`.
- `createdByUserId`: requester.
- `createdAt`, `resolvedAt`: ISO timestamps.

AI suggestions remain audit records. Applying a suggestion updates only the draft and should create undo history in the future editor.

### `CmsPublication`

- `id`: stable id.
- `siteId`, `pageId`, `draftId`: source context.
- `snapshotId`: nullable until publication succeeds.
- `status`: `queued`, `publishing`, `published`, or `failed`.
- `createdByUserId`: publisher.
- `createdAt`, `completedAt`: ISO timestamps.
- `failureReason`: nullable diagnostic message.

## Canvas Document Contract

A canvas document is JSON:

```json
{
  "schemaVersion": 1,
  "rootElementId": "element-root",
  "elements": {
    "element-root": {
      "id": "element-root",
      "type": "box",
      "parentId": null,
      "children": ["element-heading"],
      "layout": { "x": 0, "y": 0, "width": 1200, "height": 720 },
      "content": {},
      "style": { "backgroundColor": "#ffffff" },
      "responsive": { "mobileOrder": 1, "mobileVisibility": "visible" },
      "accessibility": {}
    },
    "element-heading": {
      "id": "element-heading",
      "type": "heading",
      "parentId": "element-root",
      "children": [],
      "layout": { "x": 80, "y": 96, "width": 640, "height": 96 },
      "content": { "text": "Consultoria que transforma sua presença digital", "level": 1 },
      "style": { "color": "#111827", "fontSize": 48 },
      "responsive": { "mobileOrder": 1, "mobileVisibility": "visible" },
      "accessibility": {}
    }
  },
  "metadata": {
    "title": "Home",
    "description": "Página inicial"
  }
}
```

The renderer may produce HTML/CSS from this document, but stored source state remains JSON.

## AI Operation Contract

AI suggestions must return one or more operations:

```json
[
  {
    "type": "updateText",
    "elementId": "element-heading",
    "text": "Crie uma presença digital profissional sem depender de código"
  },
  {
    "type": "updateStyle",
    "elementId": "element-cta",
    "stylePatch": { "backgroundColor": "#0f766e" }
  },
  {
    "type": "createElement",
    "parentId": "element-root",
    "element": {
      "type": "button",
      "content": { "label": "Quero publicar minha página", "href": "#waitlist", "target": "same_tab" }
    }
  }
]
```

`deleteElement` is allowed in the contract but must be labeled as destructive in the UI before the user applies it.

## Publishing Flow

1. User edits the active `CmsPageDraft`.
2. Autosave updates draft `canvas`, `version`, and `autosavedAt`.
3. User previews draft through the authenticated preview route.
4. User clicks Publish.
5. System creates `CmsPublication` with `queued` status.
6. System copies draft canvas into a new `CmsPublishedPageSnapshot`.
7. System marks publication `published`.
8. System updates `CmsPage.latestPublishedSnapshotId`.
9. Custom domain routing serves that latest snapshot.

## Acceptance Mapping

- One site per account: `CmsAccount.siteId` plus unique `CmsSite.accountId`.
- One custom domain per site: `CmsDomain.kind = custom` unique per `siteId`.
- Draft and published separation: `CmsPageDraft` and `CmsPublishedPageSnapshot` are separate models.
- Structured canvas JSON: `CmsCanvasDocument` stores typed `CmsCanvasElement` records, not raw HTML.
- AI structured operations: `CmsAiSuggestion.operations` stores `CmsAiOperation[]`.
