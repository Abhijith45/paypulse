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
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
    <!-- Hero Take-Home Display -->
    <div class="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mb-3 border border-emerald-200 dark:border-emerald-800/40">
        <span>⚡ Estimated In-Hand Pay</span>
        <span v-if="t.annualTaxableIncome <= 700000 && isNewRegime" class="font-bold">· 100% Tax-Free</span>
      </div>

      <div class="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
        {{ formatIndianCurrency(t.netInHandMonthly) }}
        <span class="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400">/ month</span>
      </div>

      <div class="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
        Annual Net Take-Home: <span class="font-bold text-slate-800 dark:text-slate-200">{{ formatIndianCurrency(t.netInHandAnnual) }}</span>
      </div>

      <div v-if="effectiveRate > 0" class="mt-1 text-xs text-slate-500">
        Effective Tax Rate: <span class="font-semibold text-rose-600 dark:text-rose-400">{{ effectiveRate }}%</span>
      </div>

      <!-- Prominent Real Purchasing Power Banner (Immediately reacts to city changes) -->
      <div class="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-left transition-all duration-300">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>📍</span>
            <span>Real Disposable in {{ t.cityInfo.name }}</span>
          </span>
          <span
            v-if="rentDiffVsBangalore > 0"
            class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          >
            +₹{{ rentDiffVsBangalore.toLocaleString('en-IN') }}/mo rent savings
          </span>
          <span
            v-else-if="rentDiffVsBangalore < 0"
            class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
          >
            -₹{{ Math.abs(rentDiffVsBangalore).toLocaleString('en-IN') }}/mo higher rent
          </span>
          <span
            v-else
            class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
          >
            Baseline Tech Hub
          </span>
        </div>

        <div class="flex items-baseline justify-between mt-1">
          <div>
            <div class="text-2xl font-black text-slate-900 dark:text-white">
              {{ formatIndianCurrency(t.estimatedMonthlyDisposableIncome) }}
              <span class="text-xs font-normal text-slate-500">/ month</span>
            </div>
            <div class="text-[11px] text-slate-500 mt-0.5">
              Net savings after {{ t.cityInfo.name }} 1BHK rent (~{{ formatIndianCurrency(t.estimatedMonthlyRent) }}) & essentials (~{{ formatIndianCurrency(t.estimatedMonthlyLivingCost) }})
            </div>
          </div>
        </div>
      </div>

      <!-- 1-Click Share & Export Trigger -->
      <div class="mt-4">
        <button
          type="button"
          @click="showShareModal = true"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
        >
          <span>📤</span>
          <span>Share / Export PNG</span>
        </button>
      </div>
    </div>

    <!-- Visual Distribution Bar -->
    <div class="py-2 border-b border-slate-100 dark:border-slate-800">
      <div class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
        Salary Allocation Breakdown
      </div>
      <StackedBarChart :breakdown="breakdown" />
    </div>

    <!-- Itemized Deductions Matrix -->
    <div class="py-2 space-y-2.5 text-sm">
      <div class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
        Monthly Deductions Summary
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <span>Gross Monthly Salary</span>
        <span class="font-bold text-slate-900 dark:text-white">{{ formatIndianCurrency(t.grossSalaryMonthly) }}</span>
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <span class="flex items-center gap-1">
          <span>Income Tax & Cess</span>
          <span v-if="t.rebate87AApplied > 0 && d.incomeTaxAnnual === 0" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
            Sec 87A Rebate
          </span>
          <span v-if="t.marginalReliefApplied > 0" class="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold">
            Marginal Relief
          </span>
        </span>
        <span class="font-semibold text-rose-600 dark:text-rose-400">-{{ formatIndianCurrency(d.incomeTaxMonthly) }}</span>
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <span>Employee Provident Fund (EPF)</span>
        <span class="font-semibold text-slate-700 dark:text-slate-200">-{{ formatIndianCurrency(d.employeePfMonthly) }}</span>
      </div>

      <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
        <span class="flex items-center gap-1">
          <span>Professional Tax ({{ t.cityInfo.name }})</span>
          <span v-if="d.professionalTaxAnnual === 0" class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
            Exempt
          </span>
        </span>
        <span class="font-semibold" :class="d.professionalTaxAnnual === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'">
          {{ d.professionalTaxAnnual === 0 ? '₹0' : `-${formatIndianCurrency(d.professionalTaxMonthly)}` }}
        </span>
      </div>

      <div v-if="d.gratuityMonthly > 0" class="flex items-center justify-between text-amber-600 dark:text-amber-400">
        <span>Withheld Gratuity Accrual</span>
        <span class="font-semibold">-{{ formatIndianCurrency(d.gratuityMonthly) }}</span>
      </div>

      <div v-if="d.variableHoldbackMonthly > 0" class="flex items-center justify-between text-purple-600 dark:text-purple-400">
        <span>Variable Pay (Annual Bonus Holdback)</span>
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
