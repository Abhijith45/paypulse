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
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
    <!-- Comparison Delta Banner -->
    <div class="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center">
      <div class="text-xs uppercase tracking-wider font-bold opacity-80 mb-1">
        Side-by-Side Comparison Delta
      </div>

      <div class="text-3xl sm:text-4xl font-black">
        <span v-if="comparison.monthlyInHandDelta > 0">Offer A wins by +{{ formatIndianCurrency(comparison.monthlyInHandDelta) }} / mo</span>
        <span v-else-if="comparison.monthlyInHandDelta < 0">Offer B wins by +{{ formatIndianCurrency(Math.abs(comparison.monthlyInHandDelta)) }} / mo</span>
        <span v-else>Both Offers Deliver Equal Net In-Hand Pay</span>
      </div>

      <div class="mt-2 text-xs sm:text-sm opacity-90 max-w-xl mx-auto font-medium">
        {{ comparison.summaryInsight }}
      </div>
    </div>

    <!-- Comparison Matrix Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50">
            <th class="py-3.5 px-4 font-bold text-slate-500 uppercase text-xs">Metric</th>
            <th class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
              <div class="flex items-center gap-1.5">
                <span>Offer A ({{ oA.takeHome.cityInfo.name }})</span>
                <span v-if="comparison.winnerInHand === 'offerA'" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">Winner</span>
              </div>
            </th>
            <th class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
              <div class="flex items-center gap-1.5">
                <span>Offer B ({{ oB.takeHome.cityInfo.name }})</span>
                <span v-if="comparison.winnerInHand === 'offerB'" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">Winner</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500">Headline CTC</td>
            <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">{{ formatLpa(oA.input.annualCtc) }}</td>
            <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">{{ formatLpa(oB.input.annualCtc) }}</td>
          </tr>
          <tr class="bg-emerald-50/40 dark:bg-emerald-950/20">
            <td class="py-3 px-4 font-bold text-emerald-900 dark:text-emerald-300">Monthly In-Hand</td>
            <td class="py-3 px-4 font-black text-emerald-600 dark:text-emerald-400 text-base">
              {{ formatIndianCurrency(oA.takeHome.netInHandMonthly) }}
            </td>
            <td class="py-3 px-4 font-black text-emerald-600 dark:text-emerald-400 text-base">
              {{ formatIndianCurrency(oB.takeHome.netInHandMonthly) }}
            </td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500">Monthly Income Tax</td>
            <td class="py-3 px-4 text-rose-600 font-semibold">{{ formatIndianCurrency(oA.deductions.incomeTaxMonthly) }}</td>
            <td class="py-3 px-4 text-rose-600 font-semibold">{{ formatIndianCurrency(oB.deductions.incomeTaxMonthly) }}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500">Employee EPF Deduction</td>
            <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ formatIndianCurrency(oA.deductions.employeePfMonthly) }}</td>
            <td class="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{{ formatIndianCurrency(oB.deductions.employeePfMonthly) }}</td>
          </tr>
          <tr>
            <td class="py-3 px-4 font-medium text-slate-500">Est. 1BHK Median Rent</td>
            <td class="py-3 px-4 text-slate-500">~{{ formatIndianCurrency(oA.takeHome.estimatedMonthlyRent) }}</td>
            <td class="py-3 px-4 text-slate-500">~{{ formatIndianCurrency(oB.takeHome.estimatedMonthlyRent) }}</td>
          </tr>
          <tr class="bg-slate-50 dark:bg-slate-800/40">
            <td class="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
              Disposable Income after Rent
            </td>
            <td class="py-3 px-4 font-black text-slate-900 dark:text-white text-base">
              {{ formatIndianCurrency(oA.takeHome.estimatedMonthlyDisposableIncome) }}
            </td>
            <td class="py-3 px-4 font-black text-slate-900 dark:text-white text-base">
              {{ formatIndianCurrency(oB.takeHome.estimatedMonthlyDisposableIncome) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
