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
