<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatIndianCurrency } from '~~/shared/utils/formatting'
import type { SalaryBreakdownDTO } from '~~/shared/types/compensation'
import { CITIES } from '~~/shared/utils/presetsModel'
import StackedBarChart from './StackedBarChart.vue'
import ShareModal from '../share/ShareModal.vue'

const props = defineProps<{
  breakdown: SalaryBreakdownDTO
}>()

const showShareModal = ref(false)

const t = computed(() => props.breakdown.takeHome)
const d = computed(() => props.breakdown.deductions)
const isNewRegime = computed(() => props.breakdown.input.regime === 'new')
const effectiveRate = computed(() => t.value.effectiveTaxRatePercentage)

const rentDiffVsBangalore = computed(() => {
  const blr = CITIES.bengaluru
  return blr.medianRent1BHK - t.value.estimatedMonthlyRent
})
</script>

<template>
  <div class="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200 dark:border-[#272727] p-6 shadow-sm space-y-6">
    <!-- Hero Take-Home Display -->
    <div class="text-center pb-6 border-b border-slate-100 dark:border-[#272727]">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-3 border border-emerald-200/80 dark:border-emerald-800/60">
        <span>⚡ Estimated in-hand pay</span>
        <span v-if="t.annualTaxableIncome <= 700000 && isNewRegime" class="font-bold">· 100% Tax-Free</span>
      </div>

      <div class="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
        {{ formatIndianCurrency(t.netInHandMonthly) }}
        <span class="text-lg sm:text-xl font-normal text-slate-500 dark:text-[#A3A3A3]">/ month</span>
      </div>

      <div class="mt-2 text-sm text-slate-600 dark:text-[#A3A3A3] font-medium">
        Annual net take-home: <span class="font-semibold text-slate-900 dark:text-white">{{ formatIndianCurrency(t.netInHandAnnual) }}</span>
      </div>

      <div v-if="effectiveRate > 0" class="mt-1 text-xs text-slate-500 dark:text-[#737373]">
        Effective tax rate: <span class="font-semibold text-rose-600 dark:text-rose-400">{{ effectiveRate }}%</span>
      </div>

      <!-- Prominent Real Purchasing Power Card (Nested radius: 16 -> 12) -->
      <div class="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-[#1F1F1F] border border-slate-200/80 dark:border-[#313131] text-left transition-all duration-300">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] font-semibold text-slate-500 dark:text-[#A3A3A3] flex items-center gap-1.5">
            <span>📍</span>
            <span>Real disposable income in {{ t.cityInfo.name }}</span>
          </span>
          <span
            v-if="rentDiffVsBangalore > 0"
            class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
          >
            +₹{{ rentDiffVsBangalore.toLocaleString('en-IN') }}/mo rent savings
          </span>
          <span
            v-else-if="rentDiffVsBangalore < 0"
            class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60"
          >
            -₹{{ Math.abs(rentDiffVsBangalore).toLocaleString('en-IN') }}/mo higher rent
          </span>
          <span
            v-else
            class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#272727] text-slate-700 dark:text-[#A3A3A3]"
          >
            Baseline tech hub
          </span>
        </div>

        <div class="flex items-baseline justify-between mt-1">
          <div>
            <div class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {{ formatIndianCurrency(t.estimatedMonthlyDisposableIncome) }}
              <span class="text-xs font-normal text-slate-500 dark:text-[#737373]">/ month</span>
            </div>
            <div class="text-[11px] text-slate-500 dark:text-[#A3A3A3] mt-0.5">
              Net surplus after {{ t.cityInfo.name }} 1BHK rent (~{{ formatIndianCurrency(t.estimatedMonthlyRent) }}) & essentials (~{{ formatIndianCurrency(t.estimatedMonthlyLivingCost) }})
            </div>
          </div>
        </div>
      </div>

      <!-- 1-Click Share & Export Trigger -->
      <div class="mt-4">
        <button
          type="button"
          @click="showShareModal = true"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1F1F] dark:hover:bg-[#272727] text-slate-700 dark:text-slate-200 border border-transparent dark:border-[#313131] transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          <span>📤</span>
          <span>Share or export PNG</span>
        </button>
      </div>
    </div>

    <!-- Visual Distribution Bar -->
    <div class="py-2 border-b border-slate-100 dark:border-[#272727]">
      <div class="text-xs font-semibold text-slate-500 dark:text-[#A3A3A3] mb-3">
        Salary allocation breakdown
      </div>
      <StackedBarChart :breakdown="breakdown" />
    </div>

    <!-- Itemized Deductions Matrix -->
    <div class="py-2 space-y-2.5 text-sm">
      <div class="text-xs font-semibold text-slate-500 dark:text-[#A3A3A3] mb-2">
        Monthly deductions summary
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-[#A3A3A3]">
        <span>Gross monthly salary</span>
        <span class="font-semibold text-slate-900 dark:text-white">{{ formatIndianCurrency(t.grossSalaryMonthly) }}</span>
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-[#A3A3A3]">
        <span class="flex items-center gap-1.5">
          <span>Income tax & cess</span>
          <span v-if="t.rebate87AApplied > 0 && d.incomeTaxAnnual === 0" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold">
            Sec 87A rebate
          </span>
          <span v-if="t.marginalReliefApplied > 0" class="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-semibold">
            Marginal relief
          </span>
        </span>
        <span class="font-semibold text-rose-600 dark:text-rose-400">-{{ formatIndianCurrency(d.incomeTaxMonthly) }}</span>
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-[#A3A3A3]">
        <span>Employee Provident Fund (EPF)</span>
        <span class="font-semibold text-slate-700 dark:text-slate-200">-{{ formatIndianCurrency(d.employeePfMonthly) }}</span>
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-[#A3A3A3]">
        <span class="flex items-center gap-1.5">
          <span>Professional tax ({{ t.cityInfo.name }})</span>
          <span v-if="d.professionalTaxAnnual === 0" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold">
            Exempt
          </span>
        </span>
        <span class="font-semibold" :class="d.professionalTaxAnnual === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'">
          {{ d.professionalTaxAnnual === 0 ? '₹0' : `-${formatIndianCurrency(d.professionalTaxMonthly)}` }}
        </span>
      </div>

      <div v-if="d.gratuityMonthly > 0" class="flex items-center justify-between text-amber-600 dark:text-amber-400">
        <span>Withheld gratuity accrual</span>
        <span class="font-semibold">-{{ formatIndianCurrency(d.gratuityMonthly) }}</span>
      </div>

      <div v-if="d.variableHoldbackMonthly > 0" class="flex items-center justify-between text-purple-600 dark:text-purple-400">
        <span>Variable pay (annual bonus holdback)</span>
        <span class="font-semibold">-{{ formatIndianCurrency(d.variableHoldbackMonthly) }}</span>
      </div>
    </div>

    <!-- Share Modal -->
    <ShareModal
      :breakdown="breakdown"
      :is-open="showShareModal"
      @close="showShareModal = false"
    />
  </div>
</template>
