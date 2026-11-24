import { ref, computed } from 'vue'
import type { ReverseSalaryInputDTO, ReverseSalaryOutputDTO, TaxRegime, CityKey } from '~~/shared/types/compensation'
import { calculateReverseSalary } from '~~/shared/utils/reverseSalaryModel'

export function useReverseCalculator(initialTargetMonthly = 75000) {
  const state = ref<ReverseSalaryInputDTO>({
    targetMonthlyInHand: initialTargetMonthly,
    regime: 'new',
    city: 'bengaluru',
    basicSalaryPercentage: 50,
    employerPfIncludedInCtc: true,
    isEpfsStatutoryCapped: false,
    variablePayPercentage: 0
  })

  const reverseResult = computed<ReverseSalaryOutputDTO>(() => {
    return calculateReverseSalary(state.value)
  })

  function setTarget(monthly: number) {
    state.value.targetMonthlyInHand = Math.max(0, Math.round(monthly))
  }

  function setRegime(regime: TaxRegime) {
    state.value.regime = regime
  }

  function setCity(city: CityKey) {
    state.value.city = city
  }

  return {
    state,
    reverseResult,
    setTarget,
    setRegime,
    setCity
  }
}
