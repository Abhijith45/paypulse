import { ref, computed } from 'vue'
import { useCalculator } from './useCalculator'
import type { OfferComparisonDTO } from '~~/shared/types/comparison'

export function useComparison() {
  const offerA = useCalculator({ annualCtc: 800000, city: 'bengaluru' })
  const offerB = useCalculator({ annualCtc: 650000, city: 'lucknow' })

  const comparison = computed<OfferComparisonDTO>(() => {
    const bA = offerA.breakdown.value
    const bB = offerB.breakdown.value

    const monthlyInHandDelta = bA.takeHome.netInHandMonthly - bB.takeHome.netInHandMonthly
    const annualInHandDelta = bA.takeHome.netInHandAnnual - bB.takeHome.netInHandAnnual
    const monthlyDisposableDelta = bA.takeHome.estimatedMonthlyDisposableIncome - bB.takeHome.estimatedMonthlyDisposableIncome
    const annualDisposableDelta = monthlyDisposableDelta * 12

    let winnerInHand: 'offerA' | 'offerB' | 'equal' = 'equal'
    if (monthlyInHandDelta > 0) winnerInHand = 'offerA'
    else if (monthlyInHandDelta < 0) winnerInHand = 'offerB'

    let winnerDisposable: 'offerA' | 'offerB' | 'equal' = 'equal'
    if (monthlyDisposableDelta > 0) winnerDisposable = 'offerA'
    else if (monthlyDisposableDelta < 0) winnerDisposable = 'offerB'

    let summaryInsight = ''
    if (bA.input.city !== bB.input.city && bA.input.annualCtc === bB.input.annualCtc) {
      const cityA = bA.takeHome.cityInfo
      const cityB = bB.takeHome.cityInfo
      const rentDiff = Math.abs(cityA.medianRent1BHK - cityB.medianRent1BHK)
      const cheaper = cityA.medianRent1BHK < cityB.medianRent1BHK ? cityA.name : cityB.name
      summaryInsight = `At the same CTC, living in ${cheaper} provides ~₹${rentDiff.toLocaleString('en-IN')}/month in rental savings, yielding higher real disposable income.`
    } else if (monthlyInHandDelta !== 0) {
      const higher = monthlyInHandDelta > 0 ? 'Offer A' : 'Offer B'
      summaryInsight = `${higher} delivers ₹${Math.abs(monthlyInHandDelta).toLocaleString('en-IN')}/month more in net take-home bank inflow.`
    } else {
      summaryInsight = 'Both offers provide equivalent net take-home pay.'
    }

    return {
      offerA: bA,
      offerB: bB,
      monthlyInHandDelta,
      annualInHandDelta,
      monthlyDisposableDelta,
      annualDisposableDelta,
      winnerInHand,
      winnerDisposable,
      summaryInsight
    }
  })

  return {
    offerA,
    offerB,
    comparison
  }
}
