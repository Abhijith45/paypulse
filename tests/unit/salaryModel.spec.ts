import { describe, it, expect } from 'vitest'
import {
  calculateSalaryBreakdown,
  calculateNewRegimeTax,
  calculateOldRegimeTax
} from '../../shared/utils/salaryModel'

describe('Salary Model — Forward Calculation Engine', () => {
  it('calculates zero income tax for ₹6 LPA under New Regime (Rebate 87A)', () => {
    const result = calculateSalaryBreakdown({
      annualCtc: 600000,
      regime: 'new',
      city: 'bengaluru',
      basicSalaryPercentage: 50,
      employerPfIncludedInCtc: true
    })

    // Standard deduction ₹75,000 applied
    expect(result.takeHome.standardDeductionApplied).toBe(75000)
    // Taxable income is well below ₹7,00,000
    expect(result.takeHome.annualTaxableIncome).toBeLessThanOrEqual(700000)
    // Income tax is 0 thanks to 87A rebate
    expect(result.deductions.incomeTaxAnnual).toBe(0)
    expect(result.deductions.incomeTaxMonthly).toBe(0)
    // Net take-home should be non-zero (Gross - EPF - PT)
    expect(result.takeHome.netInHandMonthly).toBeGreaterThan(40000)
  })

  it('verifies exact ₹0 tax liability at ₹7,75,000 CTC threshold under New Regime', () => {
    const result = calculateSalaryBreakdown({
      annualCtc: 775000,
      regime: 'new',
      basicSalaryPercentage: 50,
      employerPfIncludedInCtc: false // Gross = ₹7,75,000, Taxable = ₹7,00,000
    })

    expect(result.takeHome.annualTaxableIncome).toBe(700000)
    expect(result.deductions.incomeTaxAnnual).toBe(0)
  })

  it('correctly applies Section 87A Marginal Relief when taxable income is ₹7,05,000', () => {
    const tax = calculateNewRegimeTax(705000)
    expect(tax.marginalRelief).toBeGreaterThan(0)
    expect(tax.totalTax).toBe(5200)
  })

  it('calculates surcharges accurately for high earners above ₹50L and ₹1Cr', () => {
    const tax60L = calculateNewRegimeTax(6000000)
    expect(tax60L.surcharge).toBeGreaterThan(0)
    const expectedSurcharge = Math.round((tax60L.baseTax) * 0.10)
    expect(tax60L.surcharge).toBe(expectedSurcharge)

    const tax1Cr = calculateNewRegimeTax(12000000)
    const expectedSurcharge1Cr = Math.round((tax1Cr.baseTax) * 0.15)
    expect(tax1Cr.surcharge).toBe(expectedSurcharge1Cr)
  })

  it('accurately applies Surcharge Marginal Relief when income marginally crosses ₹50 Lakhs', () => {
    // Taxable income of ₹50,10,000 (exceeds ₹50L by ₹10,000)
    const tax50_1L = calculateNewRegimeTax(5010000)
    // Without relief, 10% surcharge on ₹11,93,000 is ₹1,19,300
    // With relief: Tax + Surcharge cannot exceed (Tax on 50L: ₹11,90,000) + ₹10,000 = ₹12,00,000
    // Surcharge is capped at ₹7,000 instead of ₹1,19,300
    expect(tax50_1L.surcharge).toBe(7000)
    expect(tax50_1L.baseTax + tax50_1L.surcharge).toBe(1200000)
    expect(tax50_1L.marginalRelief).toBe(112300)
    expect(tax50_1L.cess).toBe(48000)
    expect(tax50_1L.totalTax).toBe(1248000)
  })

  it('accurately applies Surcharge Marginal Relief when income marginally crosses ₹1 Crore', () => {
    // Taxable income of ₹1,01,00,000 (exceeds ₹1Cr by ₹1,00,000)
    const tax1_01Cr = calculateNewRegimeTax(10100000)
    // Payable cannot exceed (Payable on 1Cr: ₹29,59,000) + ₹1,00,000 = ₹30,59,000
    expect(tax1_01Cr.baseTax + tax1_01Cr.surcharge).toBe(3059000)
    expect(tax1_01Cr.marginalRelief).toBe(69000)
  })

  it('handles statutory EPF capping toggle (Uncapped 12% vs Capped ₹1,800/mo)', () => {
    const uncapped = calculateSalaryBreakdown({
      annualCtc: 1500000,
      regime: 'new',
      basicSalaryPercentage: 50,
      isEpfsStatutoryCapped: false
    })

    const capped = calculateSalaryBreakdown({
      annualCtc: 1500000,
      regime: 'new',
      basicSalaryPercentage: 50,
      isEpfsStatutoryCapped: true
    })

    expect(uncapped.deductions.employeePfAnnual).toBe(90000)
    expect(capped.deductions.employeePfAnnual).toBe(21600)
    expect(capped.takeHome.netInHandAnnual).toBeGreaterThan(uncapped.takeHome.netInHandAnnual)
  })

  it('calculates De-Jargonizer provisions for Gratuity and ESOP equity', () => {
    const withoutGratuity = calculateSalaryBreakdown({
      annualCtc: 1200000,
      regime: 'new',
      basicSalaryPercentage: 50,
      dejargonizer: { enabled: false }
    })

    const withGratuity = calculateSalaryBreakdown({
      annualCtc: 1200000,
      regime: 'new',
      basicSalaryPercentage: 50,
      dejargonizer: {
        enabled: true,
        hasGratuity: true,
        stockGrantTotal: 800000,
        stockVestingYears: 4,
        joiningBonus: 100000
      }
    })

    expect(withGratuity.deductions.gratuityAnnual).toBeGreaterThan(0)
    expect(withGratuity.takeHome.netInHandMonthly).toBeLessThan(withoutGratuity.takeHome.netInHandMonthly)
    expect(withGratuity.takeHome.nonCashMonthlyEquity).toBe(16667)
    expect(withGratuity.takeHome.oneTimeJoiningBonus).toBe(100000)
  })

  it('correctly calculates Old Tax Regime with standard deductions and HRA', () => {
    const oldResult = calculateSalaryBreakdown({
      annualCtc: 1200000,
      regime: 'old',
      city: 'mumbai',
      basicSalaryPercentage: 50,
      deduction80C: 150000,
      deduction80D: 25000
    })

    expect(oldResult.takeHome.standardDeductionApplied).toBe(50000)
    expect(oldResult.takeHome.annualTaxableIncome).toBeLessThan(1200000)
    expect(oldResult.deductions.incomeTaxAnnual).toBeGreaterThan(0)
  })

  it('correctly aggregates Section 80C deductions (employee PF + other 80C investments capped at ₹1.5L)', () => {
    // Basic = 5,00,000 -> Employee PF = 60,000
    // Additional 80C = 50,000 -> Total 80C = 1,10,000 (below 1.5L cap)
    const resultPartial = calculateSalaryBreakdown({
      annualCtc: 1000000,
      regime: 'old',
      basicSalaryPercentage: 50,
      deduction80C: 50000,
      deduction80D: 0,
      monthlyRentPaid: 0
    })

    // Gross = 10,00,000 - 60,000 (Employer PF) = 9,40,000
    // Deductions = 50,000 (Std) + (60,000 PF + 50,000 80C) = 1,60,000
    // Taxable = 9,40,000 - 1,60,000 = 7,80,000
    expect(resultPartial.takeHome.annualTaxableIncome).toBe(780000)

    // With 1,20,000 additional 80C -> 60,000 + 1,20,000 = 1,80,000 capped at 1,50,000
    const resultCapped = calculateSalaryBreakdown({
      annualCtc: 1000000,
      regime: 'old',
      basicSalaryPercentage: 50,
      deduction80C: 120000,
      deduction80D: 0,
      monthlyRentPaid: 0
    })
    // Taxable = 9,40,000 - 50,000 (Std) - 1,50,000 (80C capped) = 7,40,000
    expect(resultCapped.takeHome.annualTaxableIncome).toBe(740000)
  })

  // NEW TEST: 2-digit decimal percentage inputs
  it('correctly computes with granular 2-digit decimal percentage inputs (e.g. 12.35% variable, 42.5% basic)', () => {
    const decimalResult = calculateSalaryBreakdown({
      annualCtc: 1000000,
      regime: 'new',
      basicSalaryPercentage: 42.5,
      variablePayPercentage: 12.35,
      employerPfIncludedInCtc: true
    })

    // Variable bonus: 10,00,000 * 12.35% = ₹1,23,500
    expect(decimalResult.deductions.variableHoldbackAnnual).toBe(123500)
    expect(decimalResult.deductions.variableHoldbackMonthly).toBe(Math.round(123500 / 12))

    // Basic pay: 10,00,000 * 42.5% = ₹4,25,000
    // Employee PF: 12% of 4,25,000 = ₹51,000
    expect(decimalResult.deductions.employeePfAnnual).toBe(51000)
  })

  // NEW TEST: City changes reactively alter Professional Tax and Disposable Income
  it('updates Professional Tax and Disposable Income when city input changes', () => {
    const ctc = 1200000

    const bangalore = calculateSalaryBreakdown({
      annualCtc: ctc,
      regime: 'new',
      city: 'bengaluru'
    })

    const delhi = calculateSalaryBreakdown({
      annualCtc: ctc,
      regime: 'new',
      city: 'delhi-ncr'
    })

    const mumbai = calculateSalaryBreakdown({
      annualCtc: ctc,
      regime: 'new',
      city: 'mumbai'
    })

    const lucknow = calculateSalaryBreakdown({
      annualCtc: ctc,
      regime: 'new',
      city: 'lucknow'
    })

    // 1. Professional Tax difference
    // Delhi has ₹0 PT
    expect(delhi.deductions.professionalTaxAnnual).toBe(0)
    expect(delhi.deductions.professionalTaxMonthly).toBe(0)

    // Bengaluru has ₹2,400 PT
    expect(bangalore.deductions.professionalTaxAnnual).toBe(2400)
    expect(bangalore.deductions.professionalTaxMonthly).toBe(200)

    // Mumbai has ₹2,500 PT
    expect(mumbai.deductions.professionalTaxAnnual).toBe(2500)

    // Delhi in-hand is higher than Bengaluru by PT amount
    expect(delhi.takeHome.netInHandAnnual).toBe(bangalore.takeHome.netInHandAnnual + 2400)

    // 2. Disposable income difference after city rent
    // Lucknow rent is ₹8,000 vs Bengaluru ₹18,000 -> Lucknow saves ~₹10,000/mo in rent
    expect(lucknow.takeHome.estimatedMonthlyRent).toBe(8000)
    expect(bangalore.takeHome.estimatedMonthlyRent).toBe(18000)
    expect(lucknow.takeHome.estimatedMonthlyDisposableIncome).toBeGreaterThan(
      bangalore.takeHome.estimatedMonthlyDisposableIncome + 10000
    )
  })
})
