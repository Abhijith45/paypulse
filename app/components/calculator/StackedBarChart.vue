<script setup lang="ts">
import { computed } from 'vue'
import { formatIndianCurrency } from '~~/shared/utils/formatting'
import type { SalaryBreakdownDTO } from '~~/shared/types/compensation'

const props = defineProps<{
  breakdown: SalaryBreakdownDTO
}>()

const segments = computed(() => {
  const d = props.breakdown.deductions
  const t = props.breakdown.takeHome
  const ctc = props.breakdown.input.annualCtc || 1

  return [
    {
      label: 'Net In-Hand',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      annual: t.netInHandAnnual,
      monthly: t.netInHandMonthly,
      percentage: props.breakdown.visualSegments.netInHandPercentage
    },
    {
      label: 'Income Tax',
      color: 'bg-rose-500',
      textColor: 'text-rose-600 dark:text-rose-400',
      annual: d.incomeTaxAnnual,
      monthly: d.incomeTaxMonthly,
      percentage: props.breakdown.visualSegments.taxPercentage
    },
    {
      label: 'EPF & Gratuity',
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      annual: d.employeePfAnnual + (props.breakdown.input.employerPfIncludedInCtc ? d.employerPfAnnual : 0) + d.gratuityAnnual,
      monthly: d.employeePfMonthly + (props.breakdown.input.employerPfIncludedInCtc ? d.employerPfMonthly : 0) + d.gratuityMonthly,
      percentage: props.breakdown.visualSegments.pfPercentage + props.breakdown.visualSegments.gratuityPercentage
    },
    {
      label: 'Variable Bonus',
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      annual: d.variableHoldbackAnnual,
      monthly: d.variableHoldbackMonthly,
      percentage: props.breakdown.visualSegments.variablePercentage
    }
  ].filter(s => s.percentage > 0)
})
</script>

<template>
  <div class="w-full">
    <!-- Visual Multi-segment Bar -->
    <div class="h-3.5 w-full flex rounded-full overflow-hidden bg-slate-100 dark:bg-[#1F1F1F] border border-slate-200/60 dark:border-[#272727]">
      <div
        v-for="seg in segments"
        :key="seg.label"
        :class="seg.color"
        :style="{ width: `${seg.percentage}%` }"
        class="h-full transition-all duration-300 relative group"
        :title="`${seg.label}: ${seg.percentage}%`"
      />
    </div>

    <!-- Legend -->
    <div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
      <div
        v-for="seg in segments"
        :key="seg.label"
        class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#1F1F1F] border border-slate-200/80 dark:border-[#313131]"
      >
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="seg.color" />
        <div class="truncate">
          <div class="font-medium text-slate-500 dark:text-[#A3A3A3] text-[11px] truncate">{{ seg.label }}</div>
          <div class="font-semibold text-slate-900 dark:text-white">{{ seg.percentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>
