<script setup lang="ts">
import { ref } from 'vue'
import { useCalculator } from '../composables/useCalculator'
import { useReverseCalculator } from '../composables/useReverseCalculator'
import { useComparison } from '../composables/useComparison'

import CalculatorForm from '../components/calculator/CalculatorForm.vue'
import ReverseCalculatorForm from '../components/calculator/ReverseCalculatorForm.vue'
import BreakdownSummary from '../components/calculator/BreakdownSummary.vue'
import MobileStickyBar from '../components/calculator/MobileStickyBar.vue'
import ComparisonTable from '../components/comparison/ComparisonTable.vue'

// Active mode tab: 'forward' | 'reverse' | 'compare'
const activeTab = ref<'forward' | 'reverse' | 'compare'>('forward')

// Forward calculator controller
const calc = useCalculator()

// Reverse calculator controller
const rev = useReverseCalculator(75000)

// Dual comparison controller
const comp = useComparison()

useSeoMeta({
  title: 'PayPulse — Interactive CTC vs Take-Home Salary Hub',
  description: 'Accurately calculate your in-hand monthly salary from CTC under FY 2025-26 tax slabs, de-jargonize offers, and negotiate target in-hand pay.',
  ogTitle: 'PayPulse — Interactive CTC vs Take-Home Salary Hub',
  ogDescription: 'Instant in-hand calculation, offer letter de-jargonizer, and city comparison hub.'
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 sm:py-12">
    <!-- Hero Header -->
    <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 mb-3 border border-emerald-200 dark:border-emerald-800/60">
        <span>⚡ FY 2025–26 Tax Slabs Updated</span>
        <span>· ₹75k Standard Deduction</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
        Know Your <span class="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Real In-Hand</span> Monthly Salary
      </h1>

      <p class="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
        Cost-to-Company (CTC) is misleading. Calculate your exact bank credit, uncover withheld gratuity & ESOPs, and compare offers across Indian tech hubs.
      </p>
    </div>

    <!-- Mode Selector Tabs -->
    <div class="flex justify-center mb-8">
      <div class="inline-flex p-1.5 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl shadow-inner max-w-full overflow-x-auto">
        <button
          type="button"
          @click="activeTab = 'forward'"
          :class="activeTab === 'forward'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-semibold'"
          class="px-4 py-2 text-xs sm:text-sm rounded-xl transition whitespace-nowrap"
        >
          ⚡ Calculate Take-Home
        </button>

        <button
          type="button"
          @click="activeTab = 'reverse'"
          :class="activeTab === 'reverse'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-semibold'"
          class="px-4 py-2 text-xs sm:text-sm rounded-xl transition whitespace-nowrap"
        >
          🎯 Target In-Hand (Reverse)
        </button>

        <button
          type="button"
          @click="activeTab = 'compare'"
          :class="activeTab === 'compare'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-semibold'"
          class="px-4 py-2 text-xs sm:text-sm rounded-xl transition whitespace-nowrap"
        >
          ⚖️ Compare Two Offers
        </button>
      </div>
    </div>

    <!-- Tab 1: Forward Calculator Mode -->
    <div v-if="activeTab === 'forward'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Input Controls (Left Column) -->
      <div class="lg:col-span-7 space-y-6">
        <CalculatorForm v-model="calc.state.value" />
      </div>

      <!-- Output Breakdown (Right Column) -->
      <div class="lg:col-span-5 sticky top-20 space-y-6">
        <BreakdownSummary :breakdown="calc.breakdown.value" />
      </div>

      <!-- Mobile Sticky Bar -->
      <MobileStickyBar :breakdown="calc.breakdown.value" />
    </div>

    <!-- Tab 2: Reverse Negotiator Mode -->
    <div v-else-if="activeTab === 'reverse'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-7 space-y-6">
        <ReverseCalculatorForm
          v-model="rev.state.value"
          :reverse-result="rev.reverseResult.value"
        />
      </div>

      <div class="lg:col-span-5 sticky top-20 space-y-6">
        <BreakdownSummary :breakdown="rev.reverseResult.value.breakdown" />
      </div>

      <MobileStickyBar :breakdown="rev.reverseResult.value.breakdown" />
    </div>

    <!-- Tab 3: Dual Offer Comparison Mode -->
    <div v-else-if="activeTab === 'compare'" class="space-y-8">
      <ComparisonTable :comparison="comp.comparison.value" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div class="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
            <span>Offer A Configuration</span>
          </div>
          <CalculatorForm v-model="comp.offerA.state.value" />
        </div>

        <div>
          <div class="font-bold text-slate-900 dark:text-white text-base mb-3 flex items-center gap-2">
            <span>Offer B Configuration</span>
          </div>
          <CalculatorForm v-model="comp.offerB.state.value" />
        </div>
      </div>
    </div>
  </div>
</template>
