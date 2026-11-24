import type { SalaryBreakdownDTO, SalaryInputDTO } from './compensation'

export interface OfferComparisonDTO {
  offerA: SalaryBreakdownDTO
  offerB: SalaryBreakdownDTO
  monthlyInHandDelta: number
  annualInHandDelta: number
  monthlyDisposableDelta: number
  annualDisposableDelta: number
  winnerInHand: 'offerA' | 'offerB' | 'equal'
  winnerDisposable: 'offerA' | 'offerB' | 'equal'
  summaryInsight: string
}

export interface ComparisonSlugData {
  slug: string
  isCurated: boolean
  title: string
  headline: string
  description: string
  offerAInputs: SalaryInputDTO
  offerBInputs: SalaryInputDTO
  faqs: Array<{ question: string; answer: string }>
}
