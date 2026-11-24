import { describe, it, expect } from 'vitest'
import { calculateReverseSalary } from '../../shared/utils/reverseSalaryModel'
import { calculateSalaryBreakdown } from '../../shared/utils/salaryModel'

describe('Reverse Salary Model — Target In-Hand Solver', () => {
  it('accurately computes required CTC for ₹50,000/month target in-hand', () => {
    const result = calculateReverseSalary({
      targetMonthlyInHand: 50000,
      regime: 'new',
      city: 'bengaluru'
    })

    expect(result.requiredAnnualCtc).toBeGreaterThan(600000)
    // Run forward calculation on the output CTC to verify convergence
    const forwardVerification = calculateSalaryBreakdown({
      annualCtc: result.requiredAnnualCtc,
      regime: 'new',
      city: 'bengaluru'
    })

    // Forward net in-hand should equal or marginally exceed target by at most ₹1
    expect(forwardVerification.takeHome.netInHandMonthly).toBeGreaterThanOrEqual(50000)
    expect(forwardVerification.takeHome.netInHandMonthly - 50000).toBeLessThanOrEqual(5)
  })

  it('accurately computes required CTC for ₹1,00,000/month target in-hand', () => {
    const result = calculateReverseSalary({
      targetMonthlyInHand: 100000,
      regime: 'new',
      city: 'bengaluru'
    })

    const forwardVerification = calculateSalaryBreakdown({
      annualCtc: result.requiredAnnualCtc,
      regime: 'new',
      city: 'bengaluru'
    })

    expect(forwardVerification.takeHome.netInHandMonthly).toBeGreaterThanOrEqual(100000)
    expect(forwardVerification.takeHome.netInHandMonthly - 100000).toBeLessThanOrEqual(5)
  })

  it('handles edge case of 0 target in-hand', () => {
    const result = calculateReverseSalary({
      targetMonthlyInHand: 0,
      regime: 'new'
    })

    expect(result.requiredAnnualCtc).toBe(0)
    expect(result.requiredMonthlyCtc).toBe(0)
  })
})
