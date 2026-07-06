# NestCMS CMS Backlog Issue Drafts

Date: 2026-07-05
Status: draft for GitHub issues
Source spec: `docs/superpowers/specs/2026-07-05-nestcms-cms-product-discovery-design.md`

## Milestone 0: Validation

### Issue: Create CMS competitive research matrix

Labels: `discovery`, `product`, `cms`

Body:

```text
## Goal
Create the competitive matrix for Webflow, Wix, Framer, WordPress.com, Elementor, and Dorik using official sources.

## Acceptance Criteria
- Matrix covers target user, learning curve, canvas, CMS, AI, SEO/AEO, custom domain, hosting/SSL, publishing, mobile, entry path for custom domain, strengths, and gaps.
- All rows include official source links.
- Research states whether the NestCMS positioning has a credible solo-creator wedge.
```

### Issue: Publish CMS validation landing page

Labels: `frontend`, `validation`, `cms`

Body:

```text
## Goal
Publish `/cms` as the validation landing page for the new AI-assisted visual CMS positioning.

## Acceptance Criteria
- Page explains solo-creator page publishing, custom domain, and AI copiloting.
- CTA records local validation events.
- Existing commerce demo remains available.
- Typecheck and build pass.
```

### Issue: Review landing page validation signals

Labels: `product`, `validation`, `analytics`

Body:

```text
## Goal
Review the first validation signals before approving full CMS editor implementation.

## Acceptance Criteria
- Visitor-to-lead conversion is documented.
- CTA clicks and waitlist submissions are summarized.
- Qualitative feedback from at least 3 solo creators is recorded.
- Decision is made: continue, revise positioning, or stop.
```

## Milestone 1: CMS MVP Foundation

### Issue: Define CMS account/site/page data model

Labels: `architecture`, `backend`, `cms`

Body:

```text
## Goal
Define the core Account, User, Site, Domain, Page, PageDraft, PublishedPageSnapshot, CanvasElement, Asset, AiSuggestion, and Publication models.

## Acceptance Criteria
- Data model supports one site per account and one custom domain per site.
- Draft and published snapshots are separate.
- Canvas document is structured JSON, not raw generated HTML.
- AI suggestions map to structured operations.
```

### Issue: Plan canvas editor MVP

Labels: `frontend`, `editor`, `cms`

Body:

```text
## Goal
Create the implementation plan for the first free desktop canvas editor.

## Acceptance Criteria
- Plan covers heading, text, button, image, box/container, and simple form elements.
- Plan covers properties panel, layers, undo/redo, autosave, preview, and publish.
- Plan explicitly excludes advanced breakpoints and collaborative editing.
```

### Issue: Plan AI copilot mediation

Labels: `ai`, `backend`, `cms`

Body:

```text
## Goal
Create the implementation plan for backend-mediated AI suggestions.

## Acceptance Criteria
- Frontend never calls provider directly.
- AI output is structured as updateText, updateStyle, createElement, moveElement, or deleteElement operations.
- User approval is required before applying suggestions.
- Suggestions affect draft state only.
```

### Issue: Plan public renderer and publishing snapshots

Labels: `frontend`, `backend`, `publishing`, `cms`

Body:

```text
## Goal
Create the implementation plan for serving published pages separately from the editor runtime.

## Acceptance Criteria
- Published route serves immutable snapshot data.
- Public pages avoid editor bundle code.
- Preview renders draft state.
- Custom domain route renders latest published snapshot.
```

## Future Backlog Candidates

- Blog/posts.
- Editorial portal.
- Knowledge base/documentation.
- Digital content/product catalog.
- Dynamic CMS collections.
- Ready-made templates.
- Section library.
- Multi-site accounts.
- Multiple domains.
- Collaborators.
- RBAC.
- Editorial approvals.
- Version history and rollback.
- SEO/AEO assistant before publish.
- AI full-page generation from a briefing.
- AI mobile auto-fix.
- Form inbox.
- Traffic and conversion analytics.
- Google Analytics integration.
- Google Search Console integration.
- Meta Pixel integration.
- Email marketing integrations.
- HTML/CSS export.
- Headless API.
- Embed/script publishing.
- White-label mode for agencies.

## Optional GitHub Commands

Run these only after reviewing labels and milestone names in GitHub:

```bash
gh issue create --title "Create CMS competitive research matrix" --label discovery --label product --label cms --body-file /tmp/nestcms-issue-competitive-research.md
gh issue create --title "Publish CMS validation landing page" --label frontend --label validation --label cms --body-file /tmp/nestcms-issue-validation-landing.md
gh issue create --title "Review landing page validation signals" --label product --label validation --label analytics --body-file /tmp/nestcms-issue-validation-review.md
gh issue create --title "Define CMS account/site/page data model" --label architecture --label backend --label cms --body-file /tmp/nestcms-issue-data-model.md
gh issue create --title "Plan canvas editor MVP" --label frontend --label editor --label cms --body-file /tmp/nestcms-issue-canvas-plan.md
gh issue create --title "Plan AI copilot mediation" --label ai --label backend --label cms --body-file /tmp/nestcms-issue-ai-plan.md
gh issue create --title "Plan public renderer and publishing snapshots" --label frontend --label backend --label publishing --label cms --body-file /tmp/nestcms-issue-renderer-plan.md
```
