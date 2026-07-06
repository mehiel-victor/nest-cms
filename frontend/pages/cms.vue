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
const waitlistSection = ref<HTMLElement | null>(null)
const comparisonSection = ref<HTMLElement | null>(null)
let comparisonObserver: IntersectionObserver | null = null

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

const goToWaitlist = async () => {
  track('cms_primary_cta_clicked', { target: 'waitlist' })

  await nextTick()

  const target = waitlistSection.value
  if (!target) {
    return
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  target.focus({ preventScroll: true })
}

onMounted(() => {
  track('cms_landing_viewed', { route: '/cms' })

  const target = comparisonSection.value
  if (!target || typeof IntersectionObserver === 'undefined') {
    return
  }

  comparisonObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (!entry?.isIntersecting) {
      return
    }

    track('cms_competitor_section_viewed', { section: 'comparison' })
    comparisonObserver?.disconnect()
    comparisonObserver = null
  }, {
    threshold: 0.35
  })

  comparisonObserver.observe(target)
})

onUnmounted(() => {
  comparisonObserver?.disconnect()
  comparisonObserver = null
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
          <CButton color-scheme="green" size="lg" @click="goToWaitlist">
            <span class="icon-label">
              Entrar na lista
              <ArrowRight :size="18" aria-hidden="true" />
            </span>
          </CButton>
          <NuxtLink to="/demo" class="cms-secondary-link">
            Explorar demo atual
          </NuxtLink>
        </div>
      </div>

      <div class="cms-product-preview">
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
                :aria-pressed="selectedPrompt === prompt"
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

    <section ref="comparisonSection" class="cms-section cms-split">
      <div>
        <p class="eyebrow">Por que não outro builder?</p>
        <h2>Menos configuração, mais publicação.</h2>
        <p>
          O NestCMS começa menor: um site, páginas visuais, rascunho com autosave, publicação manual e IA ajudando no ponto exato da edição.
        </p>
      </div>
      <div class="cms-checklist">
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem plugins para manter.</div>
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem código para publicar a primeira página.</div>
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem IA aplicando mudanças sem revisão.</div>
        <div><CheckCircle2 :size="18" aria-hidden="true" /> Sem publicar rascunho incompleto por acidente.</div>
      </div>
    </section>

    <section id="waitlist" ref="waitlistSection" class="cms-section cms-waitlist" tabindex="-1">
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
        <p v-if="submitted" class="notice success" role="status" aria-live="polite">
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
