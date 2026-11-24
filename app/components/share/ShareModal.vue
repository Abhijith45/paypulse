<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatIndianCurrency, formatLpa } from '~~/shared/utils/formatting'
import type { SalaryBreakdownDTO } from '~~/shared/types/compensation'

const props = defineProps<{
  breakdown: SalaryBreakdownDTO
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const copiedText = ref(false)
const copiedUrl = ref(false)

const t = computed(() => props.breakdown.takeHome)
const d = computed(() => props.breakdown.deductions)
const ctc = computed(() => props.breakdown.input.annualCtc)

const socialSnippet = computed(() => {
  const ctcStr = formatLpa(ctc.value)
  const inHandStr = formatIndianCurrency(t.value.netInHandMonthly)
  const disposableStr = formatIndianCurrency(t.value.estimatedMonthlyDisposableIncome)
  const cityName = t.value.cityInfo.name

  return `📊 Salary Breakdown via PayPulse:
🔹 Annual CTC: ${ctcStr} (${cityName})
💰 Net In-Hand: ${inHandStr}/month
📍 Est. Disposable Savings after Rent: ~${disposableStr}/month
🔒 Calculated privately with FY 2025-26 Tax Slabs.

Check your exact take-home: ${typeof window !== 'undefined' ? window.location.href : 'https://paypulse.in'}

#SalaryTransparency #Careers #TechIndia #IncomeTax`
})

async function copySnippet() {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(socialSnippet.value)
    copiedText.value = true
    setTimeout(() => { copiedText.value = false }, 2000)
  } catch {}
}

async function copyUrl() {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(window.location.href)
    copiedUrl.value = true
    setTimeout(() => { copiedUrl.value = false }, 2000)
  } catch {}
}

function downloadCardAsPng() {
  if (typeof window === 'undefined') return

  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 420
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const gradient = ctx.createLinearGradient(0, 0, 800, 420)
  gradient.addColorStop(0, '#0f172a')
  gradient.addColorStop(1, '#1e293b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 800, 420)

  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 2
  ctx.strokeRect(20, 20, 760, 380)

  ctx.fillStyle = '#10b981'
  ctx.font = 'bold 16px system-ui, sans-serif'
  ctx.fillText('⚡ PAYPULSE SALARY SUMMARY', 50, 65)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 30px system-ui, sans-serif'
  ctx.fillText(`${formatLpa(ctc.value)} in ${t.value.cityInfo.name}`, 50, 115)

  ctx.fillStyle = '#10b981'
  ctx.font = 'bold 46px system-ui, sans-serif'
  ctx.fillText(`${formatIndianCurrency(t.value.netInHandMonthly)} / month`, 50, 190)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '16px system-ui, sans-serif'
  ctx.fillText(`Annual Take-Home: ${formatIndianCurrency(t.value.netInHandAnnual)}`, 50, 225)

  ctx.fillStyle = '#cbd5e1'
  ctx.font = '16px system-ui, sans-serif'
  ctx.fillText(`Income Tax: ${formatIndianCurrency(d.value.incomeTaxMonthly)}/mo`, 50, 290)
  ctx.fillText(`EPF Deduction: ${formatIndianCurrency(d.value.employeePfMonthly)}/mo`, 300, 290)
  ctx.fillText(`Disposable after Rent: ~${formatIndianCurrency(t.value.estimatedMonthlyDisposableIncome)}/mo`, 50, 330)

  ctx.fillStyle = '#64748b'
  ctx.font = '14px system-ui, sans-serif'
  ctx.fillText('Calculated with PayPulse · FY 2025-26 New Tax Regime', 50, 375)

  const link = document.createElement('a')
  link.download = `paypulse-${ctc.value}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div class="font-black text-slate-900 dark:text-white text-lg">
          Share Your Calculation
        </div>
        <button
          type="button"
          @click="emit('close')"
          class="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
        >
          ✕
        </button>
      </div>

      <div>
        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Shareable Link
        </label>
        <div class="flex gap-2">
          <button
            type="button"
            @click="copyUrl"
            class="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-2"
          >
            <span>🔗</span>
            <span>{{ copiedUrl ? 'Copied Link to Clipboard!' : 'Copy Shareable Link' }}</span>
          </button>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label class="text-xs font-bold uppercase tracking-wider text-slate-500">
            Formatted Post Snippet (LinkedIn / X)
          </label>
          <button
            type="button"
            @click="copySnippet"
            class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {{ copiedText ? '✓ Copied!' : 'Copy Text' }}
          </button>
        </div>
        <textarea
          readonly
          :value="socialSnippet"
          rows="5"
          class="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 resize-none focus:outline-none"
        />
      </div>

      <div>
        <button
          type="button"
          @click="downloadCardAsPng"
          class="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md transition flex items-center justify-center gap-2"
        >
          <span>🖼️</span>
          <span>Download Summary Card as PNG</span>
        </button>
      </div>
    </div>
  </div>
</template>
