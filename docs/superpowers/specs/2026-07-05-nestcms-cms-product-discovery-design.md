# NestCMS CMS Product Discovery Design

Date: 2026-07-05  
Status: approved discovery/design direction  
Repository: `mehiel-victor/nest-cms`

## Purpose

Reposition NestCMS from a commerce-ops portfolio demo into a real, operable CMS product. The product direction is a visual CMS for solo creators and small business owners who need to create, edit, organize, and publish digital pages without advanced programming knowledge.

This document captures the approved discovery decisions, MVP boundary, AI direction, competitive research plan, future backlog, and implementation constraints.

## Current Context

The current repository state is a Nuxt frontend-only demo with simulated commerce operations: catalog, inventory, checkout, orders, recovery, analytics, and seeded demo profiles. That demo is useful as portfolio evidence, but it does not match the new product direction.

The new direction is not to extend commerce first. NestCMS should become a CMS and page-publishing product first. Commerce, blog, knowledge base, editorial portal, and dynamic content collections remain future modules unless they directly support the first CMS MVP.

The existing repo guidelines require discovery evidence before product development. This product direction therefore starts with competitive research and a validation landing page before heavy editor implementation.

## Approved Product Direction

NestCMS is an AI-assisted visual CMS for solo creators who want to publish professional pages on their own domain without depending on a developer.

### Initial Persona

The initial user is a solo creator or business owner.

They are responsible for creating and publishing their own website content. They do not want to manage WordPress plugins, hosting setup, code, custom deployment, or complex design systems.

### Initial Pain

The first pain to solve is creating professional pages without hiring a developer or learning a complex website builder.

### Initial Product Surface

The first product is a page builder and publishing CMS, not a general-purpose content platform.

The MVP is centered on:

- creating pages;
- editing pages visually;
- using AI to improve selected content and elements;
- saving draft changes automatically;
- publishing intentionally;
- serving the published page on a custom domain.

## Positioning

NestCMS should not try to beat Webflow, Framer, Wix, WordPress, Elementor, or Dorik on total feature depth at launch.

The sharper position is:

> A focused CMS visual with an AI copilot for solo creators who need to edit and publish pages on their own domain without becoming designers, developers, or WordPress operators.

The product should feel smaller, clearer, and more assisted than large website platforms.

## Competitive Research

Competitive research is the next evidence artifact. The research must compare at least:

- Webflow;
- Wix;
- Framer;
- WordPress.com;
- Elementor;
- Dorik.

### Required Comparison Axes

The comparison matrix must include:

- primary target user;
- learning curve;
- canvas freedom;
- CMS/content model;
- AI site generation;
- AI copilot/editor behavior;
- SEO/AEO support;
- custom domain support;
- hosting and SSL;
- publishing, preview, and staging;
- mobile/responsive workflow;
- entry price for a custom domain path;
- strongest advantages;
- gaps for solo creators.

### Initial Competitive Signals

Initial source checks show the category is crowded:

- Webflow offers visual building, CMS, hosting, AI site building, AI-generated pages/CMS items, SEO/AEO, and custom domains.
- Wix offers drag-and-drop building, AI tools, CMS collection generation, hosting, templates, business tools, and custom domains.
- Framer offers a visual canvas, CMS, AI agents, SEO, publishing, staging, custom domains, SSL, and global hosting.
- WordPress.com offers managed hosting, CMS, themes, block editing, plugins on eligible plans, and custom domains.
- Elementor offers a WordPress drag-and-drop builder, AI planning/editor features, hosting options, custom domains, widgets, forms, and integrations.
- Dorik offers no-code building, AI, CMS, SEO, analytics, hosting, and custom domain features.

Sources checked during discovery:

- Webflow AI: https://webflow.com/ai
- Webflow AI site builder: https://webflow.com/ai-site-builder
- Webflow CMS: https://webflow.com/feature/cms
- Webflow pricing: https://webflow.com/pricing
- Wix: https://www.wix.com/
- Wix AI tools: https://support.wix.com/en/article/about-wixs-ai-tools
- Wix CMS getting started: https://support.wix.com/en/article/cms-formerly-content-manager-getting-started
- Framer AI: https://www.framer.com/ai/
- Framer CMS: https://www.framer.com/cms/
- Framer publish: https://www.framer.com/publish/
- WordPress.com: https://wordpress.com/
- WordPress.com pricing: https://wordpress.com/pricing/
- Elementor: https://elementor.com/
- Elementor pricing: https://elementor.com/pricing/
- Dorik: https://dorik.com/
- Dorik pricing: https://dorik.com/pricing

### Competitive Hypothesis

The working hypothesis is:

- Webflow and Framer are powerful, but may be too sophisticated for solo creators without design experience.
- Wix and Dorik are more accessible, but may feel template-first or less controlled for users who want direct canvas editing.
- WordPress and Elementor are flexible, but the plugin/hosting/maintenance model can be confusing for non-technical solo creators.
- NestCMS may win a narrow wedge by combining direct visual editing with an AI copilot that helps improve selected page elements in-context.

This hypothesis must be validated. The matrix should not assume NestCMS has a durable advantage.

## Validation Plan

The first validation artifacts are:

1. Competitive research matrix.
2. Landing page for the new NestCMS positioning.

### Landing Page Goal

The landing page should test whether the positioning creates interest before heavy implementation.

Primary promise:

> Create and publish professional pages on your own domain without depending on a programmer.

Secondary promise:

> Use an AI copilot to improve page copy, style, and elements while you edit visually.

### Landing Page Success Signals

Track:

- visitor-to-lead conversion;
- clicks on primary CTA;
- waitlist or contact submissions;
- qualitative replies from solo creators;
- which promise gets more engagement: domain publishing, AI copilot, or no-programmer page creation.

### Minimum Validation Requirement

Do not start full editor implementation until the competitive research matrix is complete and at least one landing-page validation pass is reviewed.

## MVP Scope

The MVP has one complete flow:

1. User creates an account.
2. User creates one site.
3. NestCMS creates a temporary preview subdomain.
4. User connects one custom domain.
5. User creates pages in a free canvas editor.
6. User edits text, style, and elements manually.
7. User uses the AI copilot from a side panel.
8. User accepts or rejects AI suggestions.
9. Draft changes autosave.
10. User clicks Publish to update the public page.

### Site Limits

MVP constraints:

- one site per account;
- one custom domain per site;
- one NestCMS preview subdomain per site;
- no multi-site workspace;
- no collaborators.

### Editor Scope

The MVP editor includes:

- free desktop canvas;
- automatic mobile output generated by system rules;
- basic elements: heading, text, button, image, box/container, simple form;
- properties panel for position, size, color, typography, link, and basic spacing;
- simple layer panel for selecting and reordering elements;
- undo/redo;
- autosave to draft;
- preview on NestCMS subdomain;
- publish button for the public snapshot.

### Publishing Scope

Publishing uses two main states:

- `draft`: editable autosaved state;
- `published`: stable public snapshot.

Preview renders the draft. The custom domain renders the published snapshot.

Publishing copies the validated draft state into a public immutable snapshot for that publication event.

### Domain Scope

The MVP supports:

- custom domain input;
- DNS instructions;
- verification status;
- automatic SSL;
- public routing to the latest published snapshot;
- temporary preview subdomain such as `site-slug.nestcms.app`.

## AI Copilot

The first AI capability is not full site generation. It is a contextual editing copilot inside the canvas.

### AI User Flow

1. User selects an element or a page area.
2. User enters a natural-language instruction.
3. Backend sends page context and selected element context to the AI provider.
4. AI returns structured suggested operations.
5. Side panel lists the proposed changes.
6. User applies or discards the suggestions.
7. Applied suggestions update the draft only.
8. Nothing reaches the published page until the user clicks Publish.

### AI Capabilities In MVP

The AI copilot can suggest:

- copy changes;
- style changes;
- new elements;
- simple element reorganization.

Examples:

- improve this headline;
- make this section more direct;
- add a stronger CTA;
- turn this paragraph into bullet points;
- adjust this copy for a local business;
- make this block feel more premium;
- create a variation for testing.

### AI Safety Rules

- The frontend never calls the AI provider directly.
- The backend mediates all AI requests.
- AI output must be structured as operations, not freeform code.
- User approval is required before operations are applied.
- AI applies only to the draft state.
- AI never publishes.
- AI suggestions must be reversible through undo/redo.
- AI must not generate hidden scripts, external trackers, or unsafe embed code in the MVP.

### AI Operation Model

AI output should map to an operation list such as:

- `updateText(elementId, text)`;
- `updateStyle(elementId, stylePatch)`;
- `createElement(parentId, elementDefinition)`;
- `moveElement(elementId, positionPatch)`;
- `deleteElement(elementId)`.

The MVP should prefer additive and editable suggestions. Destructive operations require explicit labeling in the side panel.

## Product Architecture

### Web Application

The product has:

- dashboard;
- site settings;
- domain settings;
- page list;
- canvas editor;
- preview;
- AI side panel;
- publishing controls.

### Backend Domains

Backend services should own:

- authentication;
- account;
- site;
- page;
- draft;
- published snapshot;
- domain;
- asset/media;
- autosave history;
- AI request mediation;
- publication jobs;
- usage metrics.

### Public Renderer

Published pages should be rendered by a public renderer separate from the editor runtime.

The renderer should:

- serve published snapshots;
- avoid loading editor-only code;
- optimize page performance;
- support custom-domain routing;
- isolate public rendering from draft state.

### Data Concepts

Core entities:

- `Account`;
- `User`;
- `Site`;
- `Domain`;
- `Page`;
- `PageDraft`;
- `PublishedPageSnapshot`;
- `CanvasElement`;
- `Asset`;
- `AiSuggestion`;
- `Publication`.

### Canvas Document

The canvas document should be stored as structured JSON, not as raw generated HTML.

Each element should include:

- stable id;
- type;
- parent/container reference;
- desktop layout properties;
- content properties;
- style properties;
- responsive behavior hints;
- accessibility fields where relevant.

The renderer can transform this document into public HTML/CSS.

## Non-Functional Requirements

- Public pages should load without editor bundle code.
- Draft autosave must be resilient to refreshes and network interruptions.
- Publishing should be explicit and recoverable.
- Custom domain status must be clear and actionable.
- AI requests should be rate-limited and logged.
- AI provider keys must stay server-side.
- The MVP should avoid plugin architecture until the core editor and publishing loop are stable.
- Mobile output should be predictable even when the desktop canvas is free-form.

## Future Backlog

The following items are intentionally outside MVP and should become backlog/issues after this spec is reviewed:

- blog/posts;
- editorial portal;
- knowledge base/documentation;
- digital content/product catalog;
- dynamic CMS collections;
- ready-made templates;
- section library;
- multi-site accounts;
- multiple domains;
- collaborators;
- RBAC;
- editorial approvals;
- version history and rollback;
- SEO/AEO assistant before publish;
- AI full-page generation from a briefing;
- AI mobile auto-fix;
- form inbox;
- traffic and conversion analytics;
- Google Analytics integration;
- Google Search Console integration;
- Meta Pixel integration;
- email marketing integrations;
- HTML/CSS export;
- headless API;
- embed/script publishing;
- white-label mode for agencies.

## Explicitly Out Of Scope For MVP

- ecommerce;
- payments;
- checkout;
- ERP integrations;
- tax/fiscal integrations;
- shipping integrations;
- marketplace of templates;
- native mobile app;
- real-time collaborative editing;
- enterprise CMS;
- robust headless CMS;
- multi-user portal.

## Key Risks

### Competitive Saturation

The market already has strong AI-enabled builders. NestCMS needs a narrow validated wedge before heavy implementation.

Mitigation: complete competitive matrix and landing-page validation before building the full editor.

### Canvas Complexity

A true free canvas can create layout, responsiveness, accessibility, and rendering complexity.

Mitigation: constrain MVP elements, generate mobile automatically with simple rules, and avoid advanced breakpoint editing.

### AI Reliability

AI may generate poor, inconsistent, or unsafe changes.

Mitigation: require structured operations, side-panel review, explicit apply, undo/redo, and draft-only application.

### Publishing And Domain Complexity

Custom domains and SSL introduce operational burden.

Mitigation: limit MVP to one site and one domain per account, provide clear DNS status, and separate draft preview from public published snapshots.

## Acceptance Criteria

Discovery/design is complete when:

- this document is committed;
- competitive matrix is created as a follow-up artifact;
- landing page validation plan is accepted;
- MVP scope is limited to one-site visual page publishing;
- AI scope is limited to contextual side-panel suggestions;
- future modules are tracked as backlog candidates rather than included in MVP.

The next step after this document is reviewed is to create an implementation plan and GitHub issue backlog from the approved scope.
