import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SalaryInputDTO, SalaryBreakdownDTO, TaxRegime, CityKey } from '~~/shared/types/compensation'
import { calculateSalaryBreakdown } from '~~/shared/utils/salaryModel'
import { parseCurrencyInput } from '~~/shared/utils/formatting'

export function useCalculator(initialOverrides?: Partial<SalaryInputDTO>) {
  const route = useRoute()
  const router = useRouter()

  const state = ref<SalaryInputDTO>({
    annualCtc: initialOverrides?.annualCtc ?? 600000,
    regime: initialOverrides?.regime ?? 'new',
    basicSalaryPercentage: initialOverrides?.basicSalaryPercentage ?? 50,
    employerPfIncludedInCtc: initialOverrides?.employerPfIncludedInCtc ?? true,
    isEpfsStatutoryCapped: initialOverrides?.isEpfsStatutoryCapped ?? false,
    city: initialOverrides?.city ?? 'bengaluru',
    variablePayPercentage: initialOverrides?.variablePayPercentage ?? 0,
    deduction80C: initialOverrides?.deduction80C ?? 150000,
    deduction80D: initialOverrides?.deduction80D ?? 25000,
    dejargonizer: {
      enabled: initialOverrides?.dejargonizer?.enabled ?? false,
      hasGratuity: initialOverrides?.dejargonizer?.hasGratuity ?? true,
      stockGrantTotal: initialOverrides?.dejargonizer?.stockGrantTotal ?? 0,
      stockVestingYears: initialOverrides?.dejargonizer?.stockVestingYears ?? 4,
      joiningBonus: initialOverrides?.dejargonizer?.joiningBonus ?? 0
    }
  })

  onMounted(() => {
    if (!route || !route.query) return
    const q = route.query

    if (q.ctc) {
      const parsed = parseCurrencyInput(q.ctc as string)
      if (parsed > 0) state.value.annualCtc = parsed
    }
    if (q.regime && (q.regime === 'new' || q.regime === 'old')) {
      state.value.regime = q.regime as TaxRegime
    }
    if (q.city) {
      state.value.city = q.city as CityKey
    }
    if (q.basic) {
      const b = parseFloat(q.basic as string)
      if (!isNaN(b) && b >= 10 && b <= 80) state.value.basicSalaryPercentage = Number(b.toFixed(2))
    }
    if (q.var) {
      const v = parseFloat(q.var as string)
      if (!isNaN(v) && v >= 0 && v <= 60) state.value.variablePayPercentage = Number(v.toFixed(2))
    }
    if (q.pfCap !== undefined) {
      state.value.isEpfsStatutoryCapped = q.pfCap === '1' || q.pfCap === 'true'
    }
    if (q.pfInc !== undefined) {
      state.value.employerPfIncludedInCtc = q.pfInc === '1' || q.pfInc === 'true'
    }
    if (q.dejargon === '1' || q.dejargon === 'true') {
      if (state.value.dejargonizer) state.value.dejargonizer.enabled = true
    }
  })

  let urlSyncTimeout: any = null
  watch(
    () => state.value,
    (val) => {
      if (typeof window === 'undefined') return
      clearTimeout(urlSyncTimeout)
      urlSyncTimeout = setTimeout(() => {
        try {
          const url = new URL(window.location.href)
          url.searchParams.set('ctc', val.annualCtc.toString())
          url.searchParams.set('regime', val.regime)
          if (val.city) url.searchParams.set('city', val.city)
          if (val.basicSalaryPercentage !== 50 && val.basicSalaryPercentage !== undefined) {
            url.searchParams.set('basic', val.basicSalaryPercentage.toString())
          }
          if (val.variablePayPercentage !== undefined && val.variablePayPercentage > 0) {
            url.searchParams.set('var', val.variablePayPercentage.toString())
          } else {
            url.searchParams.delete('var')
          }
          if (val.isEpfsStatutoryCapped) url.searchParams.set('pfCap', '1')
          else url.searchParams.delete('pfCap')
          if (!val.employerPfIncludedInCtc) url.searchParams.set('pfInc', '0')
          else url.searchParams.delete('pfInc')
          if (val.dejargonizer?.enabled) url.searchParams.set('dejargon', '1')
          else url.searchParams.delete('dejargon')

          window.history.replaceState({}, '', url.toString())
        } catch {}
      }, 250)
    },
    { deep: true }
  )

  const breakdown = computed<SalaryBreakdownDTO>(() => {
    return calculateSalaryBreakdown(state.value)
  })

  function setCtc(amount: number) {
    state.value.annualCtc = Math.max(0, Math.round(amount))
  }

  function applyMilestone(amount: number) {
    setCtc(amount)
  }

  function setRegime(regime: TaxRegime) {
    state.value.regime = regime
  }

  function setCity(city: CityKey) {
    state.value.city = city
  }

  async function copyShareableUrl(): Promise<boolean> {
    if (typeof window === 'undefined') return false
    try {
      await navigator.clipboard.writeText(window.location.href)
      return true
    } catch {
      return false
    }
  }

  return {
    state,
    breakdown,
    setCtc,
    applyMilestone,
    setRegime,
    setCity,
    copyShareableUrl
  }
}
