<script setup lang="ts">
import { ref, computed } from 'vue'
import SmartCurrencyInput from './SmartCurrencyInput.vue'
import type { SalaryInputDTO, CityKey } from '~~/shared/types/compensation'
import { CITIES, getCityInfo } from '~~/shared/utils/presetsModel'
import { formatIndianCurrency } from '~~/shared/utils/formatting'

const props = defineProps<{
  modelValue: SalaryInputDTO
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: SalaryInputDTO): void
}>()

const showDeJargonizer = ref(props.modelValue.dejargonizer?.enabled ?? false)

const milestoneChips = [
  { label: '₹3.5L', value: 350000 },
  { label: '₹6L', value: 600000 },
  { label: '₹10L', value: 1000000 },
  { label: '₹15L', value: 1500000 },
  { label: '₹25L', value: 2500000 },
  { label: '₹40L', value: 4000000 }
]

function updateField<K extends keyof SalaryInputDTO>(key: K, val: SalaryInputDTO[K]) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: val
  })
}

function updateDejargonizer<K extends keyof NonNullable<SalaryInputDTO['dejargonizer']>>(
  key: K,
  val: any
) {
  emit('update:modelValue', {
    ...props.modelValue,
    dejargonizer: {
      ...props.modelValue.dejargonizer,
      [key]: val
    }
  })
}

function toggleDeJargonizer() {
  showDeJargonizer.value = !showDeJargonizer.value
  updateDejargonizer('enabled', showDeJargonizer.value)
}

// Decimal inputs handling for Variable Pay %
const variablePayInput = ref(props.modelValue.variablePayPercentage?.toString() ?? '0')

function syncVariablePay(val: number) {
  const clamped = Math.min(60, Math.max(0, val))
  const rounded = Number(clamped.toFixed(2))
  variablePayInput.value = rounded.toString()
  updateField('variablePayPercentage', rounded)
}

function onVariableInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!isNaN(parsed)) {
    syncVariablePay(parsed)
  }
}

function onVariableSliderChange(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!isNaN(parsed)) {
    syncVariablePay(parsed)
  }
}

// Decimal inputs handling for Basic Pay %
const basicPayInput = ref(props.modelValue.basicSalaryPercentage?.toString() ?? '50')

function syncBasicPay(val: number) {
  const clamped = Math.min(80, Math.max(10, val))
  const rounded = Number(clamped.toFixed(2))
  basicPayInput.value = rounded.toString()
  updateField('basicSalaryPercentage', rounded)
}

function onBasicInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!isNaN(parsed)) {
    syncBasicPay(parsed)
  }
}

function onBasicSliderChange(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = parseFloat(target.value)
  if (!isNaN(parsed)) {
    syncBasicPay(parsed)
  }
}

// Active city insight info
const activeCity = computed(() => getCityInfo(props.modelValue.city))

const citySavingsVsBangalore = computed(() => {
  const blr = CITIES.bengaluru
  const diff = blr.medianRent1BHK - activeCity.value.medianRent1BHK
  return diff
})
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
    <!-- Quick Milestone Chips -->
    <div>
      <div class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
        Popular Milestones
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="chip in milestoneChips"
          :key="chip.value"
          type="button"
          @click="updateField('annualCtc', chip.value)"
          :class="modelValue.annualCtc === chip.value
            ? 'bg-emerald-600 text-white font-bold shadow-sm'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium'"
          class="px-3 py-1.5 rounded-lg text-xs transition"
        >
          {{ chip.label }}
        </button>
      </div>
    </div>

    <!-- Primary Smart Currency Input -->
    <div>
      <SmartCurrencyInput
        :model-value="modelValue.annualCtc"
        @update:model-value="updateField('annualCtc', $event)"
      />

      <!-- Range Slider -->
      <div class="mt-3">
        <input
          type="range"
          min="100000"
          max="5000000"
          step="25000"
          :value="modelValue.annualCtc"
          @input="updateField('annualCtc', parseInt(($event.target as HTMLInputElement).value, 10))"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        <div class="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
          <span>₹1 Lakh</span>
          <span>₹25 Lakhs</span>
          <span>₹50 Lakhs</span>
        </div>
      </div>
    </div>

    <!-- Tax Regime & City Selectors -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
      <!-- Tax Regime -->
      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Tax Regime (FY 2025-26)
        </label>
        <div class="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            @click="updateField('regime', 'new')"
            :class="modelValue.regime === 'new'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'"
            class="py-2 text-xs rounded-lg transition"
          >
            New Regime
          </button>
          <button
            type="button"
            @click="updateField('regime', 'old')"
            :class="modelValue.regime === 'old'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 font-medium'"
            class="py-2 text-xs rounded-lg transition"
          >
            Old Regime
          </button>
        </div>
      </div>

      <!-- City Selector -->
      <div>
        <label for="city-select" class="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Work City / Cost of Living
        </label>
        <select
          id="city-select"
          :value="modelValue.city"
          @change="updateField('city', ($event.target as HTMLSelectElement).value as CityKey)"
          class="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-3 text-xs font-semibold text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          <option v-for="(city, key) in CITIES" :key="key" :value="key">
            {{ city.name }} ({{ city.tier === 'tier-1' ? 'Tier 1' : 'Tier 2' }} · 1BHK ~₹{{ (city.medianRent1BHK / 1000).toFixed(0) }}k)
          </option>
        </select>
      </div>
    </div>

    <!-- Reactive City Cost of Living Context Card -->
    <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
      <div class="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1.5">
        <span class="flex items-center gap-1.5">
          <span>📍</span>
          <span>{{ activeCity.name }} Profile ({{ activeCity.tier === 'tier-1' ? 'Tier 1 Metro' : 'Tier 2 City' }})</span>
        </span>
        <span
          v-if="activeCity.professionalTaxAnnual === 0"
          class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold"
        >
          ₹0 Professional Tax
        </span>
        <span
          v-else
          class="text-[10px] text-slate-500"
        >
          PT: {{ formatIndianCurrency(activeCity.professionalTaxAnnual) }}/yr
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-600 dark:text-slate-300 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
        <div>
          <span class="text-slate-400 block text-[10px]">Median 1BHK Rent:</span>
          <span class="font-bold text-slate-900 dark:text-white">~{{ formatIndianCurrency(activeCity.medianRent1BHK) }}/mo</span>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px]">Living Essentials:</span>
          <span class="font-bold text-slate-900 dark:text-white">~{{ formatIndianCurrency(activeCity.baselineLivingCost) }}/mo</span>
        </div>
        <div class="col-span-2 sm:col-span-1">
          <span class="text-slate-400 block text-[10px]">Rent vs Bengaluru:</span>
          <span
            v-if="citySavingsVsBangalore > 0"
            class="font-bold text-emerald-600 dark:text-emerald-400"
          >
            Save ~₹{{ citySavingsVsBangalore.toLocaleString('en-IN') }}/mo
          </span>
          <span
            v-else-if="citySavingsVsBangalore < 0"
            class="font-bold text-rose-500"
          >
            +₹{{ Math.abs(citySavingsVsBangalore).toLocaleString('en-IN') }}/mo higher
          </span>
          <span
            v-else
            class="font-bold text-slate-500"
          >
            Baseline tech hub
          </span>
        </div>
      </div>
    </div>

    <!-- Expandable Offer De-Jargonizer Accordion -->
    <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
      <button
        type="button"
        @click="toggleDeJargonizer"
        class="w-full flex items-center justify-between text-left py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition"
      >
        <span class="flex items-center gap-1.5">
          <span>⚙️ Advanced Settings & Salary Composition</span>
          <span v-if="showDeJargonizer" class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
        </span>
        <span class="text-sm font-mono">{{ showDeJargonizer ? '−' : '+' }}</span>
      </button>

      <div v-if="showDeJargonizer" class="mt-4 space-y-5 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
        <!-- Gratuity Provision -->
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <div class="font-semibold text-slate-800 dark:text-slate-200">Deduct Gratuity (4.81% of Basic)</div>
            <div class="text-[11px] text-slate-500">Withheld statutory provision employees never see monthly</div>
          </div>
          <input
            type="checkbox"
            :checked="modelValue.dejargonizer?.hasGratuity ?? true"
            @change="updateDejargonizer('hasGratuity', ($event.target as HTMLInputElement).checked)"
            class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
        </label>

        <!-- Statutory EPF Capping -->
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <div class="font-semibold text-slate-800 dark:text-slate-200">Cap EPF at Statutory ₹1,800/month</div>
            <div class="text-[11px] text-slate-500">Uncapped 12% is standard in Tech; Capped is common in legacy corporate</div>
          </div>
          <input
            type="checkbox"
            :checked="modelValue.isEpfsStatutoryCapped ?? false"
            @change="updateField('isEpfsStatutoryCapped', ($event.target as HTMLInputElement).checked)"
            class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
        </label>

        <!-- Employer PF Included -->
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <div class="font-semibold text-slate-800 dark:text-slate-200">Employer EPF Included in CTC</div>
            <div class="text-[11px] text-slate-500">Standard Indian corporate practice (deducted from gross)</div>
          </div>
          <input
            type="checkbox"
            :checked="modelValue.employerPfIncludedInCtc ?? true"
            @change="updateField('employerPfIncludedInCtc', ($event.target as HTMLInputElement).checked)"
            class="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
        </label>

        <!-- Granular Variable Pay %: Direct Number Input + Slider -->
        <div class="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
          <div class="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            <div>
              <span>Annual Variable / Performance Bonus:</span>
              <span class="text-[11px] text-slate-400 block font-normal">Supports 2-digit decimals (e.g. 12.35)</span>
            </div>
            <div class="flex items-center gap-1">
              <input
                type="number"
                step="0.01"
                min="0"
                max="60"
                :value="modelValue.variablePayPercentage ?? 0"
                @input="onVariableInputChange"
                @change="onVariableInputChange"
                @keydown.enter="onVariableInputChange"
                class="w-20 px-2 py-1 text-right text-xs font-bold rounded-lg border border-purple-300 dark:border-purple-700 bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono shadow-sm"
              />
              <span class="text-xs font-bold text-purple-600 dark:text-purple-400">%</span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="0.05"
            :value="modelValue.variablePayPercentage ?? 0"
            @input="onVariableSliderChange"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
            <span>60%</span>
          </div>
        </div>

        <!-- Granular Basic Pay %: Direct Number Input + Slider -->
        <div class="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
          <div class="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
            <div>
              <span>Basic Pay Percentage:</span>
              <span class="text-[11px] text-slate-400 block font-normal">Supports 2-digit decimals (e.g. 42.50)</span>
            </div>
            <div class="flex items-center gap-1">
              <input
                type="number"
                step="0.01"
                min="10"
                max="80"
                :value="modelValue.basicSalaryPercentage ?? 50"
                @input="onBasicInputChange"
                @change="onBasicInputChange"
                @keydown.enter="onBasicInputChange"
                class="w-20 px-2 py-1 text-right text-xs font-bold rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono shadow-sm"
              />
              <span class="text-xs font-bold text-blue-600 dark:text-blue-400">%</span>
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="0.05"
            :value="modelValue.basicSalaryPercentage ?? 50"
            @input="onBasicSliderChange"
            class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
            <span>10%</span>
            <span>40% (Standard)</span>
            <span>50% (Tech)</span>
            <span>80%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
