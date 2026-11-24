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
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
    <div>
      <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 mb-2">
        🎯 Target In-Hand Negotiator
      </div>
      <h3 class="text-base font-bold text-slate-900 dark:text-white">
        What Monthly In-Hand Pay Do You Want in Your Bank Account?
      </h3>
      <p class="text-xs text-slate-500 mt-0.5">
        PayPulse solves the inverse tax and deduction equation to calculate the exact CTC to quote HR.
      </p>
    </div>

    <!-- Quick Target Chips -->
    <div>
      <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
        Target Milestones
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in targetChips"
          :key="chip.value"
          type="button"
          @click="setTarget(chip.value)"
          :class="modelValue.targetMonthlyInHand === chip.value
            ? 'bg-purple-600 text-white font-bold shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium'"
          class="px-3 py-1.5 rounded-lg text-xs transition"
        >
          {{ chip.label }}
        </button>
      </div>
    </div>

    <!-- Target Monthly Input -->
    <div>
      <SmartCurrencyInput
        label="Desired Monthly In-Hand Salary"
        placeholder="e.g. 100000 or 1L"
        :model-value="modelValue.targetMonthlyInHand"
        @update:model-value="setTarget($event)"
      />
    </div>

    <!-- Reverse Calculation Output Hero Card -->
    <div class="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-200 dark:border-purple-800/40 rounded-2xl p-6 text-center">
      <div class="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1">
        Minimum Annual CTC to Quote HR
      </div>

      <div class="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
        {{ formatLpa(reverseResult.requiredAnnualCtc) }}
      </div>

      <div class="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-2">
        Exact CTC: {{ formatIndianCurrency(reverseResult.requiredAnnualCtc) }} / year
      </div>

      <div class="mt-4 pt-4 border-t border-purple-100 dark:border-purple-900/30 text-xs text-slate-500 grid grid-cols-2 gap-2 text-left">
        <div>
          <span class="text-slate-400">Monthly Gross CTC:</span>
          <span class="font-bold text-slate-800 dark:text-slate-200 block">{{ formatIndianCurrency(reverseResult.requiredMonthlyCtc) }}</span>
        </div>
        <div>
          <span class="text-slate-400">Est. Annual Taxes & PF:</span>
          <span class="font-bold text-rose-600 dark:text-rose-400 block">{{ formatIndianCurrency(reverseResult.requiredAnnualCtc - (modelValue.targetMonthlyInHand * 12)) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
