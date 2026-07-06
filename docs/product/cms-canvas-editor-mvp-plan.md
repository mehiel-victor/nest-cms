# NestCMS Canvas Editor MVP Plan

Date: 2026-07-06
Status: implementation handoff for issue #10
Depends on: `docs/product/cms-mvp-data-model.md`

## Goal

Plan the first free desktop canvas editor for the CMS MVP. The editor should let a solo creator assemble one page from basic elements, autosave to `CmsPageDraft`, preview the draft, and publish an immutable snapshot.

## Explicit Scope

In scope:

- desktop free canvas;
- automatic mobile behavior from responsive hints;
- elements: heading, text, button, image, box/container, simple form;
- element selection and drag positioning;
- properties panel;
- layers panel;
- undo/redo;
- autosave;
- preview;
- publish.

Out of scope:

- advanced breakpoint editor;
- real-time collaboration;
- custom code embeds;
- plugin architecture;
- full-page AI generation;
- dynamic CMS collections;
- multi-site or multi-user workspaces.

## Editor Surface

The first editor route should be separate from the validation landing page:

- route: `/cms/editor/:pageId`;
- top bar: page title, autosave state, preview, publish;
- left rail: element palette and layers tab;
- center: canvas surface;
- right rail: properties panel for the selected element;
- optional right-side slot later for AI copilot suggestions.

The editor reads and writes `CmsPageDraft.canvas`. It never writes directly to `CmsPublishedPageSnapshot`.

## Elements

| Element | Content | Editable properties |
| --- | --- | --- |
| Heading | `text`, `level` | text, level, position, size, color, font size, weight, alignment |
| Text | `text` | text, position, size, color, font size, line height, alignment |
| Button | `label`, `href`, `target` | label, link, position, size, color, background, radius |
| Image | `assetId`, `src`, `altText` | image asset, alt text, position, size, radius |
| Box/container | empty content, children | position, size, background, border, padding, child order |
| Simple form | fields, submit label, success message | fields, required flags, labels, position, size, button style |

Every element maps to a `CmsCanvasElement` and must include:

- stable `id`;
- `type`;
- `parentId`;
- ordered `children`;
- desktop `layout`;
- typed `content`;
- `style`;
- `responsive`;
- `accessibility`.

## State Model

Editor runtime state:

- active draft id;
- `CmsCanvasDocument`;
- selected element id;
- hover element id;
- transient drag/resize state;
- undo stack;
- redo stack;
- autosave status: `idle`, `dirty`, `saving`, `saved`, `failed`;
- publish status: `idle`, `publishing`, `published`, `failed`.

Draft persistence:

- debounce autosave after local edits;
- save the full `CmsCanvasDocument` for MVP simplicity;
- increment draft `version` on successful autosave;
- keep public snapshot untouched.

## Implementation Slices

### Slice 1: Editor Shell

- Add `/cms/editor/:pageId` route.
- Render fixed editor chrome: top bar, left rail, canvas, right properties rail.
- Seed a local sample `CmsPageDraft` until backend exists.
- Show autosave state as read-only placeholder.

Verification:

- route loads on desktop and mobile;
- existing `/cms` and `/demo` still load;
- `npm run typecheck`.

### Slice 2: Canvas Store

- Add a composable for editor state.
- Load a `CmsCanvasDocument`.
- Select, insert, update, move, and delete elements.
- Keep mutation functions typed against `CmsCanvasElement`.

Verification:

- adding each MVP element updates the document;
- selecting an element updates properties and layer selection;
- `npm run typecheck`.

### Slice 3: Element Palette And Rendering

- Add palette buttons for heading, text, button, image, box/container, form.
- Render each element on the canvas from structured JSON.
- Avoid raw HTML injection.
- Keep image rendering tied to `CmsImageContent.altText`.

Verification:

- every MVP element can be added and rendered;
- no element requires custom code or raw HTML.

### Slice 4: Properties Panel

- Edit common layout fields: x, y, width, height.
- Edit common style fields: color, background, font size, border radius.
- Edit type-specific content fields.
- Validate required fields locally.

Verification:

- changing a field updates selected element state;
- invalid required values show recoverable UI state.

### Slice 5: Layers Panel

- Show element tree from `parentId` and `children`.
- Select elements from layers.
- Reorder siblings.
- Move elements into box/container where allowed.

Verification:

- layer selection and canvas selection stay synchronized;
- reordering updates `children`.

### Slice 6: Undo And Redo

- Capture document patches or snapshots per user action.
- Undo/redo local actions before autosave response.
- Clear redo on a new edit.

Verification:

- create, edit, move, reorder, delete are reversible;
- AI-applied changes can use the same history model later.

### Slice 7: Autosave

- Persist draft document after debounced local edits.
- Show save status.
- Retry failed saves manually.
- Preserve draft/public separation.

Verification:

- draft changes persist in the local adapter;
- published snapshot remains unchanged.

### Slice 8: Preview

- Add preview action for the active draft.
- Render draft through a read-only preview route or modal.
- Keep preview clearly separate from published state.

Verification:

- preview reflects unsent draft changes after autosave;
- preview does not update custom-domain/public snapshot.

### Slice 9: Publish

- Add publish action.
- Create a `CmsPublication`.
- Copy active draft into a `CmsPublishedPageSnapshot`.
- Update latest published snapshot pointer.

Verification:

- publish creates a new immutable snapshot;
- public view reads latest snapshot, not draft.

## Mobile Behavior

The MVP does not expose advanced breakpoints. Mobile output is generated from:

- element `mobileOrder`;
- `mobileVisibility`;
- `mobileLayoutMode`;
- container child order.

The editor may show a mobile preview, but users do not manually design independent mobile breakpoints in this phase.

## Acceptance Mapping

- Heading, text, button, image, box/container, and simple form are covered in the element plan.
- Properties panel, layers, undo/redo, autosave, preview, and publish are covered as implementation slices.
- Advanced breakpoints and collaborative editing are explicitly out of scope.
