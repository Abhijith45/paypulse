import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-15',
  future: {
    compatibilityVersion: 4,
  },
  alias: {
    '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    '~~/shared': fileURLToPath(new URL('./shared', import.meta.url))
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      title: 'PayPulse — CTC vs Take-Home & Career Comparison Hub',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Accurately calculate your in-hand monthly salary from CTC, de-jargonize Indian corporate offers, and compare living costs across tech hubs.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  devtools: { enabled: false }
})
