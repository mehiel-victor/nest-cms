# NestCMS AI Copilot Mediation Plan

Date: 2026-07-06
Status: implementation handoff for issue #11
Depends on: `docs/product/cms-mvp-data-model.md`

## Goal

Plan backend-mediated AI suggestions for the CMS editor. The frontend asks for help with a selected element or section, the backend sends safe context to an AI provider, the backend validates structured operations, and the user explicitly applies or discards the suggestion.

## Non-Negotiable Rules

- Frontend never calls the AI provider directly.
- Provider keys stay server-side.
- AI output must be structured operations, not raw HTML, CSS, JavaScript, or freeform code.
- Supported operations are `updateText`, `updateStyle`, `createElement`, `moveElement`, and `deleteElement`.
- User approval is required before any operation updates the draft.
- Suggestions modify `CmsPageDraft` only.
- AI never publishes.
- Destructive operations must be labeled before apply.

## API Contract

### Create Suggestion

`POST /api/cms/ai/suggestions`

Request:

```json
{
  "siteId": "site_123",
  "pageId": "page_123",
  "draftId": "draft_123",
  "selectedElementId": "element-heading",
  "prompt": "melhore este título"
}
```

Response:

```json
{
  "suggestion": {
    "id": "suggestion_123",
    "status": "pending",
    "operations": [
      {
        "id": "operation_123",
        "type": "updateText",
        "elementId": "element-heading",
        "text": "Publique uma página profissional sem depender de código"
      }
    ]
  }
}
```

### Apply Suggestion

`POST /api/cms/ai/suggestions/:suggestionId/apply`

Behavior:

- loads the suggestion;
- verifies it belongs to the active draft;
- applies operations to `CmsPageDraft.canvas`;
- records undo history when the editor history service exists;
- marks suggestion `applied`;
- returns the updated draft version.

### Discard Suggestion

`POST /api/cms/ai/suggestions/:suggestionId/discard`

Behavior:

- marks suggestion `discarded`;
- leaves draft unchanged.

## Backend Pipeline

1. Authenticate user and account/site access.
2. Rate-limit by account and user.
3. Load `CmsPageDraft` and selected `CmsCanvasElement`.
4. Build provider prompt with minimal needed context:
   - page metadata;
   - selected element;
   - nearby parent/children context;
   - allowed operation schema;
   - safety rules.
5. Call AI provider server-side.
6. Parse provider response as JSON.
7. Validate response against the `CmsAiOperation` schema.
8. Reject operations that:
   - reference missing elements;
   - create unsupported element types;
   - contain scripts or embeds;
   - mutate published snapshots;
   - exceed operation count/size limits.
9. Persist `CmsAiSuggestion`.
10. Return suggestion to the frontend side panel.

## Frontend Flow

1. User selects an element or page area.
2. User enters an instruction in the AI side panel.
3. Frontend sends request to backend.
4. Side panel renders returned operations in readable groups:
   - copy;
   - style;
   - new element;
   - move;
   - destructive.
5. User clicks Apply or Discard.
6. Apply updates draft state only.
7. Publish remains a separate user action.

## Operation Validation

| Operation | Validation |
| --- | --- |
| `updateText` | Element exists and supports text content. |
| `updateStyle` | Style patch contains allowed `CmsCanvasStyle` keys only. |
| `createElement` | Parent exists; element type is allowed; content matches type. |
| `moveElement` | Element exists; new parent exists if provided; no circular parent/child relationship. |
| `deleteElement` | Element exists; UI marks it destructive; user approval required. |

## Audit And Observability

Store:

- prompt;
- selected element id;
- operation list;
- status;
- provider name/model;
- token or cost estimate when available;
- validation failures;
- created/resolved timestamps.

Do not store provider secrets or full private account data in logs.

## Failure States

- provider unavailable;
- invalid provider JSON;
- unsupported operation;
- stale draft version;
- rate limit reached;
- selected element deleted before apply.

Every failure returns product-language copy and keeps the draft unchanged.

## Acceptance Mapping

- Frontend never calls provider directly: all requests use backend endpoints.
- AI output is structured: response persists `CmsAiOperation[]`.
- User approval required: apply/discard endpoints are separate from create suggestion.
- Suggestions affect draft state only: apply mutates `CmsPageDraft`, never `CmsPublishedPageSnapshot`.
