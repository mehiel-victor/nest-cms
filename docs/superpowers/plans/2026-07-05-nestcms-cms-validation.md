# NestCMS CMS Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first validation package for repositioning NestCMS as an AI-assisted visual CMS before implementing the full editor.

**Architecture:** Keep the current Nuxt frontend intact and add a separate CMS validation route at `/cms`. Store validation CTA events locally in the browser for the first pass, document the competitive matrix in `docs/product`, and prepare GitHub issue copy from the approved backlog without building the full CMS yet.

**Tech Stack:** Nuxt 3.21.8, Vue 3.5.13, TypeScript 5.7.2, SCSS, Chakra UI Vue beta components already present, Lucide Vue icons, browser `localStorage`, Markdown docs.

## Global Constraints

- Do not start full editor implementation until the competitive research matrix is complete and at least one landing-page validation pass is reviewed.
- MVP product limit: one site per account, one custom domain per site, one NestCMS preview subdomain per site, no multi-site workspace, no collaborators.
- MVP editor scope remains future work: free desktop canvas, automatic mobile output, heading/text/button/image/box/form elements, properties panel, layers, undo/redo, autosave, preview, publish.
- AI MVP remains future work: contextual side-panel suggestions only, structured operations only, backend mediation only, user approval required, draft-only application, AI never publishes.
- Explicitly out of scope for this plan: ecommerce, payments, checkout, ERP, fiscal, shipping, marketplace, mobile app, real-time collaboration, enterprise CMS, robust headless CMS, multi-user portal.
- Preserve existing commerce demo pages and behavior unless a later migration plan explicitly removes them.
- Use only official competitor sources for the matrix; verify current pricing/features during implementation because competitor plans change.
- No AI provider key or real AI call is introduced in this validation phase.
- Avoid new dependencies unless a task explicitly requires one and explains why.

---

## Scope Check

The approved spec includes several independent subsystems: competitive research, validation landing page, canvas editor, AI copilot, backend domains, public renderer, custom domains, and backlog/issue creation.

This plan intentionally covers only the first independently shippable validation phase:

1. Competitive matrix.
2. `/cms` validation landing page.
3. Local validation event capture.
4. Backlog issue draft file.
5. Typecheck/build/manual QA.

Create separate future plans for:

- CMS editor canvas MVP.
- AI copilot backend mediation.
- Public renderer and publish snapshots.
- Custom domain and SSL routing.
- Auth/account/site backend.

## File Structure

- Create `docs/product/cms-competitive-research.md`
  - Owns the competitor matrix, source links, research notes, and positioning conclusions.

- Create `docs/product/cms-validation-backlog-issues.md`
  - Owns issue-ready backlog entries and `gh issue create` commands.

- Create `frontend/utils/cmsValidationEvents.ts`
  - Owns serializable local validation event types, storage key, event builder, event reader, and event reset helper.

- Create `frontend/pages/cms.vue`
  - Owns the public validation landing page at `/cms`, waitlist/contact form, AI-copilot positioning mock, feature proof points, and local CTA tracking.

- Modify `frontend/assets/scss/main.scss`
  - Adds page-specific styles for the `/cms` landing page using the current color tokens and responsive patterns.

- Modify `frontend/nuxt.config.ts`
  - Updates global title/description to stop positioning the whole product as only a commerce portfolio demo.

- Optional after verification: update `README.md`
  - Adds a short note that `/cms` is the validation route for the new product direction while existing demo routes remain available.

---

### Task 1: Competitive Matrix Artifact

**Files:**
- Create: `docs/product/cms-competitive-research.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-05-nestcms-cms-product-discovery-design.md`
- Produces: A researched source artifact that Task 2 and Task 4 can cite by path: `docs/product/cms-competitive-research.md`

- [ ] **Step 1: Create the research file with the fixed structure**

Create `docs/product/cms-competitive-research.md` with this content:

```markdown
# NestCMS CMS Competitive Research

Date: 2026-07-05
Status: validation artifact
Source spec: `docs/superpowers/specs/2026-07-05-nestcms-cms-product-discovery-design.md`

## Purpose

Compare NestCMS against established website/CMS builders before implementing the full editor. The goal is to validate whether a narrower AI-assisted visual CMS for solo creators has a credible wedge.

## Research Method

- Use official product, help, and pricing pages.
- Record the date each source was checked.
- Do not infer unavailable pricing or features.
- Prefer product docs over blog posts when both exist.
- Re-check pricing before using this matrix in sales or public copy.

## Positioning Under Test

NestCMS is an AI-assisted visual CMS for solo creators who want to publish professional pages on their own domain without depending on a developer.

## Matrix

| Platform | Primary target user | Learning curve | Canvas freedom | CMS/content model | AI site generation | AI copilot/editor | SEO/AEO | Custom domain | Hosting/SSL | Publish/preview/staging | Mobile/responsive workflow | Entry path for custom domain | Strongest advantages | Gaps for solo creators | Official sources checked |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Webflow | Marketing teams, designers, agencies, modern businesses | Higher than beginner builders | High visual control | Visual-first composable CMS | Yes | Yes, including pages/CMS items and assistant features | SEO and AEO positioning | Yes | Managed hosting/SSL | Webflow subdomain and custom domain publishing | Responsive design controls | Paid site plan needed for custom domain | Powerful design/CMS/hosting platform | May be too advanced for solo creators without design experience | https://webflow.com/ai, https://webflow.com/ai-site-builder, https://webflow.com/feature/cms, https://webflow.com/pricing |
| Wix | Small businesses and non-technical site owners | Low to medium | Drag-and-drop/freeform editing | CMS collections/content manager | Yes | Yes, including CMS collection generation | SEO tools and business tooling | Yes | Managed hosting/SSL | Built-in publishing | Mobile-friendly design tooling | Paid plan needed for custom domain | Ease of use, templates, business tools | May feel template-first or broad rather than focused | https://www.wix.com/, https://support.wix.com/en/article/about-wixs-ai-tools, https://support.wix.com/en/article/cms-formerly-content-manager-getting-started |
| Framer | Designers, startups, professional website teams | Medium | High visual canvas freedom | CMS collections and dynamic content | Yes | Yes, agents for pages, layouts, SEO, translation, code components | SEO and AEO scanner/SEO features | Yes | Managed hosting/SSL/global edge | Subdomain, custom domain, staging/versioning features | Visual responsive design | Paid plan needed for custom domain | Fast professional visual publishing with AI agents | May be too design-tool oriented for solo creators | https://www.framer.com/ai/, https://www.framer.com/cms/, https://www.framer.com/publish/, https://www.framer.com/pricing |
| WordPress.com | Bloggers, creators, businesses, broad website owners | Low to high depending on plugins/customization | Block/theme based, not pure free canvas by default | Mature CMS with posts/pages/media/users/plugins on eligible plans | Yes, AI website builder | AI and block editing features | SEO tools/plugins depending on plan | Yes | Managed hosting/SSL | Built-in publishing | Themes/block patterns responsive by theme | Paid plan needed for custom domain | CMS maturity, ecosystem, ownership story | Plugin/theme/plan complexity can confuse non-technical users | https://wordpress.com/, https://wordpress.com/pricing/, https://wordpress.com/features/ |
| Elementor | WordPress site creators, marketers, agencies | Medium | Drag-and-drop visual WordPress builder | WordPress CMS underneath | Yes, AI planning/site tools | Yes, AI and editor assistance | SEO tools/integrations | Yes with Elementor hosting or external host | Hosting available, SSL/CDN on hosting plans | WordPress publishing plus Elementor hosting options | Responsive builder controls | Elementor hosting or WordPress hosting/domain setup | WordPress ecosystem plus visual builder | Requires understanding WordPress hosting/plugins unless using managed path | https://elementor.com/, https://elementor.com/pricing/, https://elementor.com/hosting/ |
| Dorik | No-code creators, small businesses, simple sites | Low | Drag-and-drop builder | CMS, blog, custom collections | Yes | AI website/content tooling | SEO/analytics positioning | Yes | Managed hosting | Built-in publishing | Responsive no-code builder | Paid or plan-dependent custom domain path; re-check pricing | Simple no-code + AI + CMS package | May be less differentiated for users needing fine canvas control | https://dorik.com/, https://dorik.com/pricing |

## Initial Findings

1. AI is already table stakes in the category.
2. Custom domains and managed hosting are expected capabilities, not differentiators.
3. The strongest possible NestCMS wedge is not "AI site builder"; it is contextual AI editing inside a simpler visual CMS flow.
4. The full editor should not be implemented until the landing page tests whether this wedge resonates.

## Recommendation

Proceed with a validation landing page that tests:

- no-developer page publishing;
- own-domain publishing;
- AI copilot for improving selected page elements;
- simpler operating model than WordPress/plugins and professional design tools.
```

- [ ] **Step 2: Re-check official sources before committing**

Open each source listed in the matrix and verify that the statements remain accurate on the implementation date.

Run:

```bash
rg -n "https://|re-check" docs/product/cms-competitive-research.md
MISSING_PATTERN='T''BD|TO''DO|un''known'
rg -n "$MISSING_PATTERN" docs/product/cms-competitive-research.md
test $? -eq 1
```

Expected:

- Source URLs are present.
- No missing-marker matches appear.
- The phrase `re-check pricing` may appear only in cautionary prose, not as missing data.

- [ ] **Step 3: Commit the research artifact**

```bash
git add docs/product/cms-competitive-research.md
git commit -m "docs: add cms competitive research"
```

---

### Task 2: Local Validation Event Model

**Files:**
- Create: `frontend/utils/cmsValidationEvents.ts`

**Interfaces:**
- Consumes: Browser `localStorage`
- Produces:
  - `CmsValidationEventName`
  - `CmsValidationEvent`
  - `createCmsValidationEvent(name, metadata)`
  - `readCmsValidationEvents()`
  - `storeCmsValidationEvent(name, metadata)`
  - `clearCmsValidationEvents()`

- [ ] **Step 1: Create the utility file**

Create `frontend/utils/cmsValidationEvents.ts`:

```ts
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

const hasBrowserStorage = () => typeof window !== 'undefined' && !!window.localStorage

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

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as CmsValidationEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([event, ...events].slice(0, 100)))
  return event
}

export const clearCmsValidationEvents = () => {
  if (!hasBrowserStorage()) {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}
```

- [ ] **Step 2: Run typecheck and verify the new utility compiles**

Run:

```bash
cd frontend
npm run typecheck
```

Expected:

- PASS with no TypeScript errors from `frontend/utils/cmsValidationEvents.ts`.

- [ ] **Step 3: Commit the utility**

```bash
git add frontend/utils/cmsValidationEvents.ts
git commit -m "feat: add cms validation event storage"
```

---

### Task 3: CMS Validation Landing Page

**Files:**
- Create: `frontend/pages/cms.vue`
- Modify: `frontend/assets/scss/main.scss`
- Modify: `frontend/nuxt.config.ts`

**Interfaces:**
- Consumes:
  - `storeCmsValidationEvent(name, metadata)` from `frontend/utils/cmsValidationEvents.ts`
- Produces:
  - Public route `/cms`
  - Local waitlist capture state in the browser
  - CTA event records from Task 2

- [ ] **Step 1: Create `/cms` page**

Create `frontend/pages/cms.vue`:

```vue
<script setup lang="ts">
import { ArrowRight, Bot, CheckCircle2, Globe2, Layers3, MousePointer2, Sparkles, Wand2 } from '@lucide/vue'
import { CButton } from '@chakra-ui/c-button'
import { CInput } from '@chakra-ui/c-input'
import { storeCmsValidationEvent } from '~/utils/cmsValidationEvents'

definePageMeta({
  requiresAuth: false
})

useHead({
  title: 'NestCMS | CMS visual com IA para publicar páginas',
  meta: [
    {
      name: 'description',
      content: 'Crie e publique páginas profissionais no seu domínio com um CMS visual assistido por IA.'
    }
  ]
})

const form = reactive({
  name: '',
  email: '',
  business: ''
})

const submitted = ref(false)
const selectedPrompt = ref('melhore este título')

const prompts = [
  'melhore este título',
  'adicione um CTA mais forte',
  'deixe esta seção mais premium',
  'transforme este parágrafo em bullets'
]

const aiSuggestions = computed(() => [
  {
    title: 'Copy',
    text: selectedPrompt.value === 'adicione um CTA mais forte'
      ? 'Trocar o botão para "Quero publicar minha página" e reforçar o benefício no subtítulo.'
      : 'Deixar a mensagem mais direta para um criador solo entender o valor em poucos segundos.'
  },
  {
    title: 'Estilo',
    text: 'Aumentar contraste do CTA, reduzir ruído visual e manter espaçamento consistente.'
  },
  {
    title: 'Elemento',
    text: 'Adicionar uma prova rápida: domínio próprio, autosave e publicação controlada.'
  }
])

const track = (name: Parameters<typeof storeCmsValidationEvent>[0], metadata: Record<string, string | number | boolean> = {}) => {
  storeCmsValidationEvent(name, metadata)
}

const choosePrompt = (prompt: string) => {
  selectedPrompt.value = prompt
  track('cms_ai_demo_prompt_clicked', { prompt })
}

const submitWaitlist = () => {
  submitted.value = true
  track('cms_waitlist_submitted', {
    hasName: !!form.name.trim(),
    hasEmail: !!form.email.trim(),
    hasBusiness: !!form.business.trim()
  })
}

onMounted(() => {
  track('cms_landing_viewed', { route: '/cms' })
})
</script>

<template>
  <main class="cms-landing">
    <section class="cms-hero">
      <div class="cms-hero-copy">
        <p class="eyebrow">Editor visual com IA</p>
        <h1>Crie páginas profissionais no seu domínio sem depender de programador.</h1>
        <p>
          O NestCMS ajuda criadores solo a montar páginas visuais, melhorar conteúdo com IA e publicar com controle.
        </p>
        <div class="cms-actions">
          <a href="#waitlist" @click="track('cms_primary_cta_clicked', { target: 'waitlist' })">
            <CButton color-scheme="green" size="lg">
              <span class="icon-label">
                Entrar na lista
                <ArrowRight :size="18" aria-hidden="true" />
              </span>
            </CButton>
          </a>
          <NuxtLink to="/demo" class="cms-secondary-link">
            Explorar demo atual
          </NuxtLink>
        </div>
      </div>

      <div class="cms-product-preview" aria-label="Prévia conceitual do editor NestCMS">
        <div class="cms-browser-bar">
          <span />
          <span />
          <span />
          <strong>meusite.nestcms.app</strong>
        </div>
        <div class="cms-canvas-preview">
          <div class="cms-canvas-block hero-block">
            <small>Hero selecionado</small>
            <strong>Consultoria que transforma sua presença digital</strong>
            <p>Texto editável no canvas, com rascunho salvo automaticamente.</p>
          </div>
          <aside class="cms-ai-panel">
            <div class="cms-ai-panel-title">
              <Bot :size="18" aria-hidden="true" />
              Copiloto IA
            </div>
            <div class="cms-prompt-list">
              <button
                v-for="prompt in prompts"
                :key="prompt"
                type="button"
                :class="{ active: selectedPrompt === prompt }"
                @click="choosePrompt(prompt)"
              >
                {{ prompt }}
              </button>
            </div>
            <div class="cms-suggestion-list">
              <div v-for="suggestion in aiSuggestions" :key="suggestion.title" class="cms-suggestion">
                <strong>{{ suggestion.title }}</strong>
                <p>{{ suggestion.text }}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="cms-proof-grid" aria-label="Benefícios principais">
      <div class="cms-proof-item">
        <MousePointer2 :size="22" aria-hidden="true" />
        <h2>Canvas livre</h2>
        <p>Monte páginas visualmente, com controle direto de texto, imagens, botões e blocos.</p>
      </div>
      <div class="cms-proof-item">
        <Wand2 :size="22" aria-hidden="true" />
        <h2>IA contextual</h2>
        <p>Selecione um elemento e receba sugestões revisáveis de copy, estilo e novos elementos.</p>
      </div>
      <div class="cms-proof-item">
        <Globe2 :size="22" aria-hidden="true" />
        <h2>Domínio próprio</h2>
        <p>Publique em um domínio escolhido por você, com preview em subdomínio temporário.</p>
      </div>
    </section>

    <section class="cms-section cms-split">
      <div>
        <p class="eyebrow">Por que não outro builder?</p>
        <h2>Menos configuração, mais publicação.</h2>
        <p>
          O NestCMS começa menor: um site, páginas visuais, rascunho com autosave, publicação manual e IA ajudando no ponto exato da edição.
        </p>
      </div>
      <div class="cms-checklist" @mouseenter="track('cms_competitor_section_viewed', { section: 'comparison' })">
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem plugins para manter.</div>
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem código para publicar a primeira página.</div>
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem IA aplicando mudanças sem revisão.</div>
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem publicar rascunho incompleto por acidente.</div>
      </div>
    </section>

    <section id="waitlist" class="cms-section cms-waitlist">
      <div>
        <p class="eyebrow">Acesso antecipado</p>
        <h2>Quer testar quando o editor estiver pronto?</h2>
        <p>
          Conte o que você quer publicar e entre na lista para testar o editor visual do NestCMS.
        </p>
      </div>

      <form class="cms-form" @submit.prevent="submitWaitlist">
        <label>
          Nome
          <CInput v-model="form.name" />
        </label>
        <label>
          E-mail
          <CInput v-model="form.email" type="email" />
        </label>
        <label>
          O que você quer publicar?
          <textarea v-model="form.business" />
        </label>
        <CButton color-scheme="green" type="submit">
          <span class="icon-label">
            Registrar interesse
            <Sparkles :size="16" aria-hidden="true" />
          </span>
        </CButton>
        <p v-if="submitted" class="notice success">
          Interesse registrado para esta sessão de validação.
        </p>
      </form>
    </section>

    <section class="cms-section cms-roadmap">
      <div>
        <Layers3 :size="22" aria-hidden="true" />
        <h2>Backlog depois do MVP</h2>
        <p>Blog, portal editorial, knowledge base, coleções dinâmicas, SEO/AEO assistant, IA para página completa, analytics e white-label ficam para fases futuras.</p>
      </div>
    </section>
  </main>
</template>
```

- [ ] **Step 2: Add `/cms` styles**

Append this block to `frontend/assets/scss/main.scss` before the first `@media` block:

```scss
.cms-landing {
  min-height: 100vh;
  background: #f7faf8;
  color: var(--ink);
}

.cms-hero {
  min-height: 92vh;
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(420px, 1.12fr);
  gap: 36px;
  align-items: center;
  padding: 56px clamp(20px, 5vw, 72px) 32px;
}

.cms-hero-copy h1 {
  margin: 0;
  max-width: 760px;
  font-size: clamp(2.7rem, 7vw, 6.4rem);
  line-height: 0.96;
  letter-spacing: 0;
}

.cms-hero-copy p {
  margin: 18px 0 0;
  max-width: 620px;
  color: var(--muted);
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  line-height: 1.55;
}

.cms-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
}

.cms-secondary-link {
  color: var(--green-strong);
  font-weight: 800;
}

.cms-product-preview {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.cms-browser-bar {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border-bottom: 1px solid var(--line);
  background: #f3f7f4;
}

.cms-browser-bar span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #b7c5bd;
}

.cms-browser-bar strong {
  margin-left: 8px;
  color: var(--muted);
  font-size: 0.84rem;
}

.cms-canvas-preview {
  min-height: 520px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 18px;
  padding: 18px;
  background:
    linear-gradient(#eef4ef 1px, transparent 1px),
    linear-gradient(90deg, #eef4ef 1px, transparent 1px);
  background-size: 28px 28px;
}

.cms-canvas-block {
  align-self: center;
  margin-left: clamp(0px, 8vw, 80px);
  max-width: 420px;
  border: 2px solid var(--green);
  border-radius: 8px;
  background: #ffffff;
  padding: 22px;
  box-shadow: 0 18px 40px rgba(23, 33, 29, 0.1);
}

.cms-canvas-block small {
  display: block;
  margin-bottom: 10px;
  color: var(--green);
  font-weight: 850;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.cms-canvas-block strong {
  display: block;
  font-size: 1.55rem;
  line-height: 1.1;
}

.cms-canvas-block p {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.45;
}

.cms-ai-panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #10231d;
  color: #f4fbf7;
  padding: 14px;
  display: grid;
  gap: 12px;
}

.cms-ai-panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 850;
}

.cms-prompt-list {
  display: grid;
  gap: 8px;
}

.cms-prompt-list button {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(244, 251, 247, 0.78);
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.cms-prompt-list button.active,
.cms-prompt-list button:hover {
  background: #d9f4e8;
  color: #10231d;
}

.cms-suggestion-list {
  display: grid;
  gap: 8px;
}

.cms-suggestion {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  padding: 10px;
}

.cms-suggestion p {
  margin: 4px 0 0;
  color: rgba(244, 251, 247, 0.74);
  font-size: 0.86rem;
  line-height: 1.45;
}

.cms-proof-grid,
.cms-section {
  margin: 0 auto;
  width: min(1180px, calc(100% - 40px));
}

.cms-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 24px 0 56px;
}

.cms-proof-item,
.cms-section {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: var(--shadow);
  padding: 22px;
}

.cms-proof-item h2,
.cms-section h2 {
  margin: 12px 0 8px;
  font-size: 1.35rem;
}

.cms-proof-item p,
.cms-section p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.cms-split,
.cms-waitlist {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1.1fr);
  gap: 22px;
  align-items: start;
  margin-bottom: 18px;
}

.cms-checklist {
  display: grid;
  gap: 10px;
}

.cms-checklist div {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px;
}

.cms-form {
  display: grid;
  gap: 12px;
}

.cms-form label {
  display: grid;
  gap: 7px;
  font-weight: 760;
}

.cms-form textarea {
  min-height: 112px;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  resize: vertical;
}

.cms-roadmap {
  margin-bottom: 56px;
}
```

- [ ] **Step 3: Add responsive styles**

Add these rules inside the existing `@media (max-width: 1080px)` block:

```scss
  .cms-hero,
  .cms-split,
  .cms-waitlist {
    grid-template-columns: 1fr;
  }

  .cms-canvas-preview {
    grid-template-columns: 1fr;
  }

  .cms-ai-panel {
    order: -1;
  }

  .cms-proof-grid {
    grid-template-columns: 1fr;
  }
```

Add these rules inside the existing `@media (max-width: 720px)` block:

```scss
  .cms-hero {
    min-height: auto;
    padding: 32px 18px 24px;
  }

  .cms-canvas-preview {
    min-height: auto;
    padding: 12px;
  }

  .cms-canvas-block {
    margin-left: 0;
  }

  .cms-proof-grid,
  .cms-section {
    width: calc(100% - 24px);
  }
```

- [ ] **Step 4: Update global metadata**

Modify `frontend/nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  app: {
    head: {
      title: 'NestCMS',
      meta: [
        {
          name: 'description',
          content: 'AI-assisted visual CMS validation and frontend-only portfolio demo.'
        }
      ]
    }
  },
  vite: {
    server: {
      allowedHosts: true
    }
  }
})
```

- [ ] **Step 5: Run verification**

Run:

```bash
cd frontend
npm run typecheck
npm run build
```

Expected:

- `npm run typecheck` passes.
- `npm run build` completes without errors.
- `/cms` compiles as a public route.

- [ ] **Step 6: Commit the landing page**

```bash
git add frontend/pages/cms.vue frontend/assets/scss/main.scss frontend/nuxt.config.ts
git commit -m "feat: add cms validation landing page"
```

---

### Task 4: Backlog Issue Drafts

**Files:**
- Create: `docs/product/cms-validation-backlog-issues.md`

**Interfaces:**
- Consumes:
  - `docs/superpowers/specs/2026-07-05-nestcms-cms-product-discovery-design.md`
  - `docs/product/cms-competitive-research.md`
- Produces:
  - Issue-ready backlog grouped by milestone.
  - Optional `gh issue create` commands for GitHub.

- [ ] **Step 1: Create issue draft document**

Create `docs/product/cms-validation-backlog-issues.md`:

````markdown
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
````

- [ ] **Step 2: Verify issue draft has no missing markers**

Run:

```bash
MISSING_PATTERN='T''BD|TO''DO|place''holder|un''known|fi''ll in'
rg -n "$MISSING_PATTERN" docs/product/cms-validation-backlog-issues.md
test $? -eq 1
```

Expected:

- No matches.

- [ ] **Step 3: Commit issue draft document**

```bash
git add docs/product/cms-validation-backlog-issues.md
git commit -m "docs: draft cms validation issues"
```

---

### Task 5: README And Manual Validation Pass

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes:
  - `/cms` route from Task 3
  - research artifact from Task 1
  - issue drafts from Task 4
- Produces:
  - README route note
  - final verification evidence for this phase

- [ ] **Step 1: Add README note**

Add this section to `README.md` after the opening description:

```markdown
## CMS Product Validation

The current public demo remains frontend-only, but NestCMS is being repositioned into an AI-assisted visual CMS for solo creators.

Open `/cms` to review the validation landing page for the new direction. The route tests the positioning before full editor implementation:

- visual page publishing for solo creators;
- custom-domain publishing promise;
- AI copilot suggestions for copy, style, and page elements;
- draft-first publishing model.

The full CMS editor, AI backend mediation, public renderer, and custom-domain runtime require separate implementation plans after competitive research and landing-page validation are reviewed.
```

- [ ] **Step 2: Run full frontend verification**

Run:

```bash
cd frontend
npm run typecheck
npm run build
```

Expected:

- Typecheck passes.
- Build passes.

- [ ] **Step 3: Run local preview for manual QA**

Run:

```bash
cd frontend
npm run dev
```

Expected:

- Nuxt builds and prints a local preview URL.

Manual QA:

- Open `/cms`.
- Confirm hero text is visible on desktop and mobile width.
- Confirm primary CTA scrolls to the waitlist.
- Submit the waitlist form.
- Confirm success notice appears.
- Click all AI prompt chips.
- Confirm suggestions update.
- Open `/demo`.
- Confirm existing commerce demo route still renders.

- [ ] **Step 4: Commit README verification note**

```bash
git add README.md
git commit -m "docs: document cms validation route"
```

---

## Self-Review Checklist

- Spec coverage:
  - Competitive research matrix: Task 1.
  - Landing page validation plan: Task 3 and Task 5.
  - AI copilot positioning without real provider calls: Task 3.
  - Backlog/issues from future modules: Task 4.
  - No full editor implementation before validation: Global Constraints and Scope Check.

- Missing-marker scan:
  - Before completing this plan, run `MISSING_PATTERN='T''BD|TO''DO|place''holder|un''known|fi''ll in|implement late''r'; rg -n "$MISSING_PATTERN" docs/superpowers/plans/2026-07-05-nestcms-cms-validation.md; test $? -eq 1`.
  - Expected: no matches.

- Type consistency:
  - Task 2 exports `storeCmsValidationEvent`.
  - Task 3 imports `storeCmsValidationEvent` from `~/utils/cmsValidationEvents`.
  - Event names used in Task 3 are all included in `CmsValidationEventName`.

## Completion Criteria

This plan is complete when:

- competitive research artifact exists and is committed;
- `/cms` validation landing page exists and is committed;
- local validation events are captured in browser storage;
- issue draft document exists and is committed;
- README documents the route and scope;
- `npm run typecheck` and `npm run build` pass from `frontend`;
- manual QA confirms `/cms` and existing `/demo` both render.
