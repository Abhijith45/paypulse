import { describe, it } from 'vitest'
import { calculateSalaryBreakdown, calculateNewRegimeTax, calculateOldRegimeTax } from '../../shared/utils/salaryModel'

describe('Comprehensive Financial Ground-Truth Benchmarks', () => {
  it('outputs verification matrix across all salary tiers', () => {
    const testCases = [
      { label: '₹3.5 LPA (Fresher)', ctc: 350000, regime: 'new', city: 'bengaluru' },
      { label: '₹6.0 LPA (87A Nil Tax)', ctc: 600000, regime: 'new', city: 'bengaluru' },
      { label: '₹7.75 LPA (Max Tax-Free)', ctc: 775000, regime: 'new', city: 'bengaluru', employerPf: false },
      { label: '₹8.0 LPA (Tax Starts)', ctc: 800000, regime: 'new', city: 'bengaluru' },
      { label: '₹10.0 LPA', ctc: 1000000, regime: 'new', city: 'bengaluru' },
      { label: '₹12.0 LPA', ctc: 1200000, regime: 'new', city: 'bengaluru' },
      { label: '₹15.0 LPA', ctc: 1500000, regime: 'new', city: 'bengaluru' },
      { label: '₹25.0 LPA', ctc: 2500000, regime: 'new', city: 'bengaluru' },
      { label: '₹50.0 LPA (Boundary)', ctc: 5000000, regime: 'new', city: 'bengaluru' },
      { label: '₹51.0 LPA (Marginal Relief)', ctc: 5100000, regime: 'new', city: 'bengaluru' },
      { label: '₹1.00 Cr (10% Surcharge)', ctc: 10000000, regime: 'new', city: 'bengaluru' },
      { label: '₹1.01 Cr (15% Marginal Relief)', ctc: 10100000, regime: 'new', city: 'bengaluru' },
      { label: '₹2.00 Cr (15% Surcharge)', ctc: 20000000, regime: 'new', city: 'bengaluru' },
      { label: '₹2.01 Cr (25% Marginal Relief)', ctc: 20100000, regime: 'new', city: 'bengaluru' }
    ]

    const results = testCases.map(t => {
      const res = calculateSalaryBreakdown({
        annualCtc: t.ctc,
        regime: t.regime as any,
        city: t.city as any,
        employerPfIncludedInCtc: t.employerPf !== undefined ? t.employerPf : true,
        basicSalaryPercentage: 50
      })
      return {
        label: t.label,
        ctc: t.ctc,
        gross: res.takeHome.grossSalaryAnnual,
        taxable: res.takeHome.annualTaxableIncome,
        tax: res.deductions.incomeTaxAnnual,
        surcharge: res.takeHome.surchargeApplied,
        relief: res.takeHome.marginalReliefApplied,
        pf: res.deductions.employeePfAnnual,
        pt: res.deductions.professionalTaxAnnual,
        inHandAnnual: res.takeHome.netInHandAnnual,
        inHandMonthly: res.takeHome.netInHandMonthly
      }
    })

    console.table(results)

    // Direct Taxable Income comparisons (matching ClearTax / IT Department tax calculators)
    const directTaxableIncomes = [
      300000,
      500000,
      700000,
      705000,
      720000,
      750000,
      1000000,
      1200000,
      1500000,
      2000000,
      5000000,
      5010000,
      5100000,
      10000000,
      10100000,
      20000000,
      20100000
    ]

    const taxResults = directTaxableIncomes.map(taxable => {
      const taxNew = calculateNewRegimeTax(taxable)
      const taxOld = calculateOldRegimeTax(taxable)
      return {
        taxableIncome: taxable,
        new_baseTax: taxNew.baseTax,
        new_rebate87A: taxNew.rebate87A,
        new_marginalRelief: taxNew.marginalRelief,
        new_surcharge: taxNew.surcharge,
        new_cess: taxNew.cess,
        new_totalTax: taxNew.totalTax,
        old_totalTax: taxOld.totalTax
      }
    })

    console.table(taxResults)
  })
})
