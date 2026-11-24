<script setup lang="ts">
import { useRoute, createError, useSeoMeta, useHead } from '#app'
import ComparisonTable from '~/components/comparison/ComparisonTable.vue'
import { formatLpa, formatIndianCurrency } from '~~/shared/utils/formatting'

const route = useRoute()
const slug = (route.params.slug as string) || ''

const { data, error } = await useFetch(`/api/comparisons/${slug}`)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Comparison '${slug}' not found`,
    fatal: true
  })
}

const slugData = data.value.slugData
const comparison = data.value.comparison

const oA = comparison.offerA
const oB = comparison.offerB

useSeoMeta({
  title: `${slugData.title} | PayPulse`,
  description: slugData.description,
  ogTitle: `${slugData.title} | PayPulse`,
  ogDescription: slugData.description,
  ogImage: `/api/og?title=${encodeURIComponent(slugData.title)}&subtitle=${encodeURIComponent(slugData.headline)}`,
  twitterCard: 'summary_large_image'
})

// Schema.org FAQPage structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: slugData.faqs.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      })
    }
  ]
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10">
    <!-- Breadcrumb -->
    <nav class="text-xs font-semibold text-slate-500 flex items-center gap-2">
      <NuxtLink to="/" class="hover:text-emerald-600 transition">Home</NuxtLink>
      <span>/</span>
      <span>Compare</span>
      <span>/</span>
      <span class="text-slate-800 dark:text-slate-200 truncate">{{ slug }}</span>
    </nav>

    <!-- Header Section -->
    <div class="text-center max-w-3xl mx-auto space-y-3">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <span>⚖️ Verified Comparison Benchmark</span>
      </div>

      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        {{ slugData.headline }}
      </h1>

      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400">
        {{ slugData.description }}
      </p>
    </div>

    <!-- Comparison Table Component -->
    <ComparisonTable :comparison="comparison" />

    <!-- Customize Numbers CTA Card -->
    <div class="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 class="text-lg font-black text-slate-900 dark:text-white">
          Want to test different numbers or adjust variable pay?
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Open the interactive calculator pre-loaded with these exact parameters and tweak sliders live.
        </p>
      </div>

      <NuxtLink
        :to="`/?ctc=${oA.input.annualCtc}&regime=${oA.input.regime}&city=${oA.input.city}`"
        class="shrink-0 px-5 py-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition"
      >
        Customize in Live Calculator ➔
      </NuxtLink>
    </div>

    <!-- FAQ Accordion Section -->
    <div v-if="slugData.faqs && slugData.faqs.length" class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white">
        Frequently Asked Questions
      </h2>

      <div class="space-y-3">
        <div
          v-for="(faq, i) in slugData.faqs"
          :key="i"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5"
        >
          <div class="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
            {{ faq.question }}
          </div>
          <div class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
