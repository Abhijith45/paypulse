<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { parseCurrencyInput, formatIndianCurrency, formatLpa } from '~~/shared/utils/formatting'

const props = withDefaults(
  defineProps<{
    modelValue: number
    label?: string
    placeholder?: string
    id?: string
  }>(),
  {
    label: 'Annual CTC (Cost to Company)',
    placeholder: 'e.g. 12.5L or 12,50,000',
    id: 'ctc-input'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const rawInput = ref(props.modelValue > 0 ? formatIndianCurrency(props.modelValue) : '')

watch(
  () => props.modelValue,
  (newVal) => {
    const currentParsed = parseCurrencyInput(rawInput.value)
    if (currentParsed !== newVal) {
      rawInput.value = newVal > 0 ? formatIndianCurrency(newVal) : ''
    }
  }
)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  rawInput.value = target.value
  const parsed = parseCurrencyInput(target.value)
  emit('update:modelValue', parsed)
}

function onBlur() {
  const parsed = parseCurrencyInput(rawInput.value)
  if (parsed > 0) {
    rawInput.value = formatIndianCurrency(parsed)
  }
}

const lpaBadge = computed(() => {
  const parsed = parseCurrencyInput(rawInput.value)
  if (parsed <= 0) return null
  return formatLpa(parsed)
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-1.5">
      <label :for="id" class="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
        <span>{{ label }}</span>
      </label>
      <span
        v-if="lpaBadge"
        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
      >
        {{ lpaBadge }}
      </span>
    </div>

    <div class="relative rounded-xl shadow-sm">
      <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
        ₹
      </div>
      <input
        :id="id"
        type="text"
        :value="rawInput"
        :placeholder="placeholder"
        @input="onInput"
        @blur="onBlur"
        class="block w-full rounded-xl border border-slate-300 dark:border-[#313131] bg-white dark:bg-[#1F1F1F] py-3 pl-8 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#737373] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-base font-semibold transition"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-xs font-semibold text-slate-400 dark:text-[#737373]">
        INR
      </div>
    </div>
    <p class="mt-1.5 text-xs text-slate-500 dark:text-[#A3A3A3]">
      Type shorthand like <code class="font-mono bg-slate-100 dark:bg-[#1F1F1F] px-1 py-0.5 rounded border border-slate-200/60 dark:border-[#313131]">12.5</code>, <code class="font-mono bg-slate-100 dark:bg-[#1F1F1F] px-1 py-0.5 rounded border border-slate-200/60 dark:border-[#313131]">12.5L</code>, or full rupee numbers.
    </p>
  </div>
</template>
