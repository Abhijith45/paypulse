import type {
  ReverseSalaryInputDTO,
  ReverseSalaryOutputDTO,
  SalaryInputDTO
} from '../types/compensation'
import { calculateSalaryBreakdown } from './salaryModel'

/**
 * Reverse Salary Calculator:
 * Solves CTC = f^-1(Target In-Hand) using monotonic binary search.
 * Converges to exact rupee precision in ~25 iterations (<1ms).
 */
export function calculateReverseSalary(input: ReverseSalaryInputDTO): ReverseSalaryOutputDTO {
  const targetMonthly = Math.max(0, Math.round(input.targetMonthlyInHand || 0))
  const targetAnnual = targetMonthly * 12

  if (targetMonthly <= 0) {
    const baseBreakdown = calculateSalaryBreakdown({
      annualCtc: 0,
      regime: input.regime,
      city: input.city,
      basicSalaryPercentage: input.basicSalaryPercentage,
      employerPfIncludedInCtc: input.employerPfIncludedInCtc,
      isEpfsStatutoryCapped: input.isEpfsStatutoryCapped,
      variablePayPercentage: input.variablePayPercentage,
      dejargonizer: input.dejargonizer
    })
    return {
      targetMonthlyInHand: 0,
      requiredAnnualCtc: 0,
      requiredMonthlyCtc: 0,
      breakdown: baseBreakdown
    }
  }

  // Binary search boundaries
  let low = targetAnnual
  let high = Math.max(targetAnnual * 3, 500000000) // Upper limit up to ₹50 Cr
  let bestCtc = low

  const baseInput: Omit<SalaryInputDTO, 'annualCtc'> = {
    regime: input.regime,
    city: input.city,
    basicSalaryPercentage: input.basicSalaryPercentage,
    employerPfIncludedInCtc: input.employerPfIncludedInCtc,
    isEpfsStatutoryCapped: input.isEpfsStatutoryCapped,
    variablePayPercentage: input.variablePayPercentage,
    dejargonizer: input.dejargonizer
  }

  // Perform binary search
  for (let i = 0; i < 35; i++) {
    if (low >= high) break
    const mid = Math.floor((low + high) / 2)
    const breakdown = calculateSalaryBreakdown({
      ...baseInput,
      annualCtc: mid
    })

    const inHand = breakdown.takeHome.netInHandAnnual

    if (inHand >= targetAnnual) {
      bestCtc = mid
      high = mid
    } else {
      low = mid + 1
    }
  }

  const finalBreakdown = calculateSalaryBreakdown({
    ...baseInput,
    annualCtc: bestCtc
  })

  return {
    targetMonthlyInHand: targetMonthly,
    requiredAnnualCtc: bestCtc,
    requiredMonthlyCtc: Math.round(bestCtc / 12),
    breakdown: finalBreakdown
  }
}
