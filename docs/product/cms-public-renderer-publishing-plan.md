# NestCMS Public Renderer And Publishing Plan

Date: 2026-07-06
Status: implementation handoff for issue #12
Depends on: `docs/product/cms-mvp-data-model.md`

## Goal

Plan public page serving separately from the editor runtime. Published routes must render immutable snapshot data, preview routes must render draft data, and custom-domain routing must serve the latest published snapshot.

## Runtime Boundary

Editor runtime:

- authenticated;
- loads editor chrome, panels, drag/resize logic, history, and AI side panel;
- reads and writes `CmsPageDraft`.

Preview runtime:

- authenticated or token-protected;
- read-only;
- renders `CmsPageDraft`;
- does not expose editor controls.

Public renderer:

- unauthenticated;
- read-only;
- renders `CmsPublishedPageSnapshot`;
- does not import editor-only controls, drag/resize behavior, history, or AI panel code.

## Route Plan

| Route type | Example | Data source | Access |
| --- | --- | --- | --- |
| Editor | `/cms/editor/:pageId` | `CmsPageDraft` | authenticated owner |
| Preview | `/cms/preview/:siteSlug/:pageSlug` | `CmsPageDraft` | authenticated owner or preview token |
| NestCMS subdomain public | `site-slug.nestcms.app/:pageSlug` | latest `CmsPublishedPageSnapshot` | public |
| Custom domain public | `example.com/:pageSlug` | latest `CmsPublishedPageSnapshot` | public |

The current Nuxt app is `ssr: false`; the production renderer should be introduced as a future server-rendered or edge-rendered surface so public pages can avoid the editor SPA bundle.

## Publishing Flow

1. User edits `CmsPageDraft`.
2. User clicks Publish.
3. Backend creates `CmsPublication` with `queued`.
4. Backend validates:
   - account owns site;
   - page belongs to site;
   - draft exists;
   - canvas schema is valid;
   - required accessibility fields exist for images/forms where applicable.
5. Backend copies draft into `CmsPublishedPageSnapshot`.
6. Backend marks snapshot immutable.
7. Backend updates `CmsPage.latestPublishedSnapshotId`.
8. Backend marks publication `published`.
9. Renderer cache is invalidated for affected host/path.
10. Public route serves the new latest snapshot.

Failed publishing leaves the previous published snapshot active.

## Renderer Input

The renderer receives:

- `CmsPublishedPageSnapshot.canvas`;
- page SEO metadata;
- site/domain metadata;
- asset public URLs.

The renderer does not receive:

- draft ids;
- editor history;
- AI prompt/suggestion records;
- provider configuration;
- private asset URLs;
- authenticated user session data.

## Renderer Output

For each snapshot:

- semantic HTML generated from `CmsCanvasDocument`;
- scoped CSS generated from structured layout/style fields;
- responsive mobile layout from `mobileOrder`, `mobileVisibility`, and `mobileLayoutMode`;
- image `alt` attributes from `CmsImageContent.altText` or asset metadata;
- no editor chrome;
- no drag handles;
- no AI side panel;
- no raw user-injected scripts in MVP.

## Custom Domain Resolution

Request handling:

1. Read `Host` header.
2. Find active `CmsDomain` by host.
3. Resolve domain to `CmsSite`.
4. Resolve path to `CmsPage.slug`.
5. Load `CmsPage.latestPublishedSnapshotId`.
6. Render that `CmsPublishedPageSnapshot`.

If no active domain or snapshot exists:

- unknown domain: 404;
- known domain with no published page: branded empty/not-published state;
- domain pending DNS/SSL: owner-facing settings page only, not public fallback.

## Preview Resolution

Preview uses draft state and must not be indexable:

- require auth or signed preview token;
- load `CmsPageDraft`;
- render read-only preview;
- add `noindex` metadata;
- display draft preview indicator outside public renderer output.

## Bundle Boundary

Public renderer code should live in a separate module from editor code:

- shared: pure canvas-to-render-model utilities;
- renderer: read-only render components;
- editor: interactive canvas/editor components.

Shared code may understand `CmsCanvasDocument`. It must not import editor stores, drag/resize libraries, AI panel code, or authenticated shell components.

## Caching

- Cache public snapshots by `host + path + snapshotId`.
- Invalidate on successful publication.
- Do not cache preview draft routes publicly.
- Keep old snapshots addressable internally for audit/rollback.

## Acceptance Mapping

- Published route serves immutable snapshot data: public routes read `CmsPublishedPageSnapshot`.
- Public pages avoid editor bundle code: renderer/editor bundle boundary is explicit.
- Preview renders draft state: preview routes read `CmsPageDraft`.
- Custom domain route renders latest published snapshot: host resolution loads active domain, site, page, and `latestPublishedSnapshotId`.
