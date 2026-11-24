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

    <!-- Header Section (Strict Figma Designer Rules: max-w-[680px], dual gradient text) -->
    <div class="text-center max-w-[680px] mx-auto space-y-3">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
        <span>⚖️ Verified comparison benchmark</span>
      </div>

      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-black to-[#666666] dark:from-white dark:to-[#9B9B9B] bg-clip-text text-transparent">
        {{ slugData.headline }}
      </h1>

      <p class="text-sm sm:text-base text-slate-600 dark:text-[#A3A3A3] leading-relaxed">
        {{ slugData.description }}
      </p>
    </div>

    <!-- Comparison Table Component -->
    <ComparisonTable :comparison="comparison" />

    <!-- Customize Numbers CTA Card (Flat surface, nested radius 16 -> 12) -->
    <div class="bg-slate-50 dark:bg-[#181818] border border-slate-200 dark:border-[#272727] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Want to test different numbers or adjust variable pay?
        </h3>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-[#A3A3A3] mt-1">
          Open the interactive calculator pre-loaded with these exact parameters and tweak sliders live.
        </p>
      </div>

      <NuxtLink
        :to="`/?ctc=${oA.input.annualCtc}&regime=${oA.input.regime}&city=${oA.input.city}`"
        class="shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      >
        Customize in live calculator →
      </NuxtLink>
    </div>

    <!-- FAQ Accordion Section -->
    <div v-if="slugData.faqs && slugData.faqs.length" class="space-y-4 pt-4 border-t border-slate-200 dark:border-[#272727]">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
        Frequently asked questions
      </h2>

      <div class="space-y-3">
        <div
          v-for="(faq, i) in slugData.faqs"
          :key="i"
          class="bg-white dark:bg-[#181818] border border-slate-200 dark:border-[#272727] rounded-xl p-5"
        >
          <div class="font-semibold text-sm text-slate-900 dark:text-white mb-1.5">
            {{ faq.question }}
          </div>
          <div class="text-xs text-slate-600 dark:text-[#A3A3A3] leading-relaxed">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
