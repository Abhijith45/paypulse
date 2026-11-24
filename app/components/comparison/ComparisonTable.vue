<script setup lang="ts">
import { computed } from 'vue'
import { formatIndianCurrency, formatLpa } from '~~/shared/utils/formatting'
import type { OfferComparisonDTO } from '~~/shared/types/comparison'

const props = defineProps<{
  comparison: OfferComparisonDTO
}>()

const oA = computed(() => props.comparison.offerA)
const oB = computed(() => props.comparison.offerB)
</script>

<template>
  <div class="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200 dark:border-[#272727] overflow-hidden shadow-sm">
    <!-- Comparison Delta Banner (Flat solid surface conforming to Figma Designer) -->
    <div class="bg-emerald-600 dark:bg-emerald-700 text-white p-6 text-center">
      <div class="text-xs uppercase tracking-wider font-semibold opacity-90 mb-1">
        Side-by-side comparison delta
      </div>

      <div class="text-3xl sm:text-4xl font-bold tracking-tight">
        <span v-if="comparison.monthlyInHandDelta > 0">Offer A delivers +{{ formatIndianCurrency(comparison.monthlyInHandDelta) }} / mo more</span>
        <span v-else-if="comparison.monthlyInHandDelta < 0">Offer B delivers +{{ formatIndianCurrency(Math.abs(comparison.monthlyInHandDelta)) }} / mo more</span>
        <span v-else>Both offers deliver equal net in-hand pay</span>
      </div>

      <div class="mt-2 text-xs sm:text-sm opacity-90 max-w-xl mx-auto font-normal">
        {{ comparison.summaryInsight }}
      </div>
    </div>

    <!-- Comparison Matrix Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-[#272727] bg-slate-50/75 dark:bg-[#1F1F1F]">
            <th class="py-3.5 px-4 font-semibold text-slate-500 dark:text-[#A3A3A3] uppercase text-xs">Metric</th>
            <th class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
              <div class="flex items-center gap-1.5">
                <span>Offer A ({{ oA.takeHome.cityInfo.name }})</span>
                <span v-if="comparison.winnerInHand === 'offerA'" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60">Winner</span>
              </div>
            </th>
            <th class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
              <div class="flex items-center gap-1.5">
                <span>Offer B ({{ oB.takeHome.cityInfo.name }})</span>
                <span v-if="comparison.winnerInHand === 'offerB'" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60">Winner</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-[#272727]">
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500 dark:text-[#A3A3A3]">Headline CTC</td>
            <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">{{ formatLpa(oA.input.annualCtc) }}</td>
            <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white">{{ formatLpa(oB.input.annualCtc) }}</td>
          </tr>
          <tr class="bg-emerald-50/40 dark:bg-emerald-950/20">
            <td class="py-3 px-4 font-semibold text-emerald-900 dark:text-emerald-300">Monthly in-hand</td>
            <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-base">
              {{ formatIndianCurrency(oA.takeHome.netInHandMonthly) }}
            </td>
            <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 text-base">
              {{ formatIndianCurrency(oB.takeHome.netInHandMonthly) }}
            </td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500 dark:text-[#A3A3A3]">Monthly income tax</td>
            <td class="py-3 px-4 text-rose-600 font-semibold">{{ formatIndianCurrency(oA.deductions.incomeTaxMonthly) }}</td>
            <td class="py-3 px-4 text-rose-600 font-semibold">{{ formatIndianCurrency(oB.deductions.incomeTaxMonthly) }}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500 dark:text-[#A3A3A3]">Employee EPF deduction</td>
            <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ formatIndianCurrency(oA.deductions.employeePfMonthly) }}</td>
            <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ formatIndianCurrency(oB.deductions.employeePfMonthly) }}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500 dark:text-[#A3A3A3]">Est. 1BHK median rent</td>
            <td class="py-3 px-4 text-slate-500 dark:text-[#737373]">~{{ formatIndianCurrency(oA.takeHome.estimatedMonthlyRent) }}</td>
            <td class="py-3 px-4 text-slate-500 dark:text-[#737373]">~{{ formatIndianCurrency(oB.takeHome.estimatedMonthlyRent) }}</td>
          </tr>
          <tr class="bg-slate-50 dark:bg-[#1F1F1F]">
            <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
              Disposable income after rent
            </td>
            <td class="py-3 px-4 font-bold text-slate-900 dark:text-white text-base">
              {{ formatIndianCurrency(oA.takeHome.estimatedMonthlyDisposableIncome) }}
            </td>
            <td class="py-3 px-4 font-bold text-slate-900 dark:text-white text-base">
              {{ formatIndianCurrency(oB.takeHome.estimatedMonthlyDisposableIncome) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
