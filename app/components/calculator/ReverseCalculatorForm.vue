<script setup lang="ts">
import { computed } from 'vue'
import SmartCurrencyInput from './SmartCurrencyInput.vue'
import { formatIndianCurrency, formatLpa } from '~~/shared/utils/formatting'
import type { ReverseSalaryInputDTO, ReverseSalaryOutputDTO } from '~~/shared/types/compensation'

const props = defineProps<{
  modelValue: ReverseSalaryInputDTO
  reverseResult: ReverseSalaryOutputDTO
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: ReverseSalaryInputDTO): void
}>()

const targetChips = [
  { label: '₹50k/mo', value: 50000 },
  { label: '₹75k/mo', value: 75000 },
  { label: '₹1 Lakh/mo', value: 100000 },
  { label: '₹1.5 Lakh/mo', value: 150000 },
  { label: '₹2 Lakh/mo', value: 200000 }
]

function setTarget(amount: number) {
  emit('update:modelValue', {
    ...props.modelValue,
    targetMonthlyInHand: amount
  })
}
</script>

<template>
  <div class="bg-white dark:bg-[#181818] rounded-2xl border border-slate-200 dark:border-[#272727] p-6 shadow-sm space-y-6">
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-3 border border-emerald-200/80 dark:border-emerald-800/60">
        <span>🎯 Target in-hand negotiator</span>
      </div>
      <h3 class="text-base font-bold text-slate-900 dark:text-white">
        What monthly in-hand pay do you want in your bank account?
      </h3>
      <p class="text-xs text-slate-500 dark:text-[#A3A3A3] mt-1">
        PayPulse solves the inverse tax and deduction equation to calculate the exact CTC to quote HR.
      </p>
    </div>

    <!-- Quick Target Chips -->
    <div>
      <div class="text-xs font-semibold text-slate-500 dark:text-[#A3A3A3] mb-2.5">
        Target milestones
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in targetChips"
          :key="chip.value"
          type="button"
          @click="setTarget(chip.value)"
          :class="modelValue.targetMonthlyInHand === chip.value
            ? 'bg-emerald-600 text-white font-semibold shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1F1F] dark:hover:bg-[#272727] text-slate-700 dark:text-[#A3A3A3] font-medium border border-transparent dark:border-[#313131]'"
          class="px-3 py-1.5 rounded-lg text-xs transition focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
        >
          {{ chip.label }}
        </button>
      </div>
    </div>

    <!-- Target Monthly Input -->
    <div>
      <SmartCurrencyInput
        label="Desired monthly in-hand salary"
        placeholder="e.g. 100000 or 1L"
        :model-value="modelValue.targetMonthlyInHand"
        @update:model-value="setTarget($event)"
      />
    </div>

    <!-- Reverse Calculation Output Hero Card (Nested radius: 16 -> 12, flat surface) -->
    <div class="bg-slate-50 dark:bg-[#1F1F1F] border border-slate-200/80 dark:border-[#313131] rounded-xl p-6 text-center">
      <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
        Minimum annual CTC to quote HR
      </div>

      <div class="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
        {{ formatLpa(reverseResult.requiredAnnualCtc) }}
      </div>

      <div class="text-sm font-semibold text-slate-600 dark:text-[#A3A3A3] mt-2">
        Exact CTC: {{ formatIndianCurrency(reverseResult.requiredAnnualCtc) }} / year
      </div>

      <div class="mt-4 pt-4 border-t border-slate-200/60 dark:border-[#272727] text-xs text-slate-500 dark:text-[#A3A3A3] grid grid-cols-2 gap-2 text-left">
        <div>
          <span class="text-slate-400 dark:text-[#737373] block text-[11px]">Monthly gross CTC:</span>
          <span class="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{{ formatIndianCurrency(reverseResult.requiredMonthlyCtc) }}</span>
        </div>
        <div>
          <span class="text-slate-400 dark:text-[#737373] block text-[11px]">Est. annual taxes & PF:</span>
          <span class="font-semibold text-rose-600 dark:text-rose-400 block mt-0.5">{{ formatIndianCurrency(reverseResult.requiredAnnualCtc - (modelValue.targetMonthlyInHand * 12)) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
