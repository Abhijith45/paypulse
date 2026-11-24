import { describe, it, expect } from 'vitest'
import { calculateSalaryBreakdown, calculateNewRegimeTax, calculateOldRegimeTax } from '../../shared/utils/salaryModel'
import { calculateReverseSalary } from '../../shared/utils/reverseSalaryModel'
import { parseCurrencyInput, formatIndianCurrency, formatLpa } from '../../shared/utils/formatting'
import { getCityInfo, CITIES } from '../../shared/utils/presetsModel'
import type { SalaryInputDTO, ReverseSalaryInputDTO } from '../../shared/types/compensation'

describe('PayPulse — Real-User Simulation & End-to-End Journey Test Suite', () => {

  // =========================================================================
  // JOURNEY 1: The Fresh Graduate / Low-Bracket Evaluator
  // =========================================================================
  describe('Journey 1: Fresh Graduate Entry-Level Offer Simulation', () => {
    it('TC-SIM-01: Simulates entry-level candidate typing "6.5L" with zero tax under 87A rebate', () => {
      // Step 1: User types shorthand "6.5L" into smart currency input
      const userInputString = '6.5L'
      const parsedCtc = parseCurrencyInput(userInputString)
      expect(parsedCtc).toBe(650000)

      // Step 2: System sets defaults (50% basic, employer PF included, New Regime, Bengaluru)
      const input: SalaryInputDTO = {
        annualCtc: parsedCtc,
        regime: 'new',
        city: 'bengaluru',
        basicSalaryPercentage: 50,
        variablePayPercentage: 0,
        employerPfIncludedInCtc: true,
        isEpfsStatutoryCapped: false
      }

      const result = calculateSalaryBreakdown(input)

      // Step 3: Verify tax liability is ₹0 because taxable income is below ₹7,00,000 threshold
      // Basic = ₹3,25,000. Employer PF = 12% = ₹39,000.
      // Gross = ₹6,50,000 - ₹39,000 = ₹6,11,000.
      // Standard deduction = ₹75,000. Taxable = ₹5,36,000.
      expect(result.takeHome.grossSalaryAnnual).toBe(611000)
      expect(result.takeHome.standardDeductionApplied).toBe(75000)
      expect(result.takeHome.annualTaxableIncome).toBe(536000)
      expect(result.deductions.incomeTaxAnnual).toBe(0)
      expect(result.takeHome.rebate87AApplied).toBeGreaterThan(0)

      // Step 4: Verify monthly in-hand credit after EPF (₹39,000/yr) and Karnataka PT (₹2,400/yr)
      // Net annual = 611000 - 39000 - 2400 = 5,69,600
      expect(result.takeHome.netInHandAnnual).toBe(569600)
      expect(result.takeHome.netInHandMonthly).toBe(Math.round(569600 / 12)) // ₹47,467/mo

      // Step 5: Verify real purchasing power in Bengaluru (Rent: ₹18,000, Living: ₹14,000)
      expect(result.takeHome.estimatedMonthlyRent).toBe(18000)
      expect(result.takeHome.estimatedMonthlyDisposableIncome).toBe(47467 - (18000 + 14000)) // ₹15,467/mo
    })
  })

  // =========================================================================
  // JOURNEY 2: Mid-Senior Engineer with Granular Decimals & De-Jargonizer
  // =========================================================================
  describe('Journey 2: Mid-Senior Tech Offer with Variable Bonus & Withheld Gratuity', () => {
    it('TC-SIM-02: Evaluates ₹22.5 LPA offer with 42.50% basic, 14.75% variable bonus, and gratuity deduction', () => {
      // Step 1: User types "22.5L"
      const parsedCtc = parseCurrencyInput('22.5L')
      expect(parsedCtc).toBe(2250000)

      // Step 2: User expands De-Jargonizer accordion and inputs custom granular percentages
      const input: SalaryInputDTO = {
        annualCtc: parsedCtc,
        regime: 'new',
        city: 'pune',
        basicSalaryPercentage: 42.5,
        variablePayPercentage: 14.75,
        employerPfIncludedInCtc: true,
        isEpfsStatutoryCapped: true, // Legacy corporate cap toggle
        dejargonizer: {
          enabled: true,
          hasGratuity: true,
          stockGrantTotal: 600000, // ₹6L over 4 years
          stockVestingYears: 4,
          joiningBonus: 100000
        }
      }

      const result = calculateSalaryBreakdown(input)

      // Step 3: Verify granular variable holdback (22.5L * 14.75% = ₹3,31,875)
      expect(result.deductions.variableHoldbackAnnual).toBe(331875)

      // Step 4: Verify Basic Pay = 22.5L * 42.5% = ₹9,56,250
      // Gratuity provision = (9,56,250 * 15) / (26 * 12) = ₹45,974
      expect(result.deductions.gratuityAnnual).toBe(45974)

      // Step 5: Verify EPF capped at ₹1,800/mo = ₹21,600/yr (since isEpfsStatutoryCapped is true)
      expect(result.deductions.employeePfAnnual).toBe(21600)
      expect(result.deductions.employerPfAnnual).toBe(21600)

      // Step 6: Verify Pune Professional Tax is ₹2,500/year (Maharashtra state tax)
      expect(result.deductions.professionalTaxAnnual).toBe(2500)

      // Step 7: Verify non-cash equity compensation (~₹12,500/mo) and joining bonus (₹1,00,000)
      expect(result.takeHome.nonCashMonthlyEquity).toBe(Math.round(600000 / 4 / 12)) // ₹12,500/mo
      expect(result.takeHome.oneTimeJoiningBonus).toBe(100000)

      // Step 8: Net in-hand reflects true monthly cash flow excluding variable bonus and paper equity
      expect(result.takeHome.netInHandMonthly).toBeGreaterThan(90000)
      expect(result.takeHome.effectiveTaxRatePercentage).toBeGreaterThan(0)
    })
  })

  // =========================================================================
  // JOURNEY 3: The Active Salary Negotiator (Reverse Calculator)
  // =========================================================================
  describe('Journey 3: Active Salary Negotiation (Target In-Hand to Required CTC)', () => {
    it('TC-SIM-03: Candidate wants exactly ₹1,00,000/mo in-hand — solves inverse CTC with high precision', () => {
      const targetMonthlyInHand = 100000 // ₹1,00,000 / mo
      const input: ReverseSalaryInputDTO = {
        targetMonthlyInHand,
        regime: 'new',
        city: 'bengaluru',
        basicSalaryPercentage: 50,
        variablePayPercentage: 0,
        employerPfIncludedInCtc: true,
        isEpfsStatutoryCapped: false
      }

      // Step 1: Solve inverse function
      const reverseResult = calculateReverseSalary(input)
      expect(reverseResult.requiredAnnualCtc).toBeGreaterThan(1200000)

      // Step 2: Feed the calculated CTC back into forward calculation engine to verify convergence
      const forwardVerification = calculateSalaryBreakdown({
        annualCtc: reverseResult.requiredAnnualCtc,
        regime: input.regime,
        city: input.city,
        basicSalaryPercentage: input.basicSalaryPercentage,
        variablePayPercentage: input.variablePayPercentage,
        employerPfIncludedInCtc: input.employerPfIncludedInCtc,
        isEpfsStatutoryCapped: input.isEpfsStatutoryCapped
      })

      // Step 3: Assert convergence error is within ±₹1 rupee
      const diff = Math.abs(forwardVerification.takeHome.netInHandMonthly - targetMonthlyInHand)
      expect(diff).toBeLessThanOrEqual(1)
    })

    it('TC-SIM-04: High-earning candidate targets ₹2,00,000/mo in-hand', () => {
      const targetMonthlyInHand = 200000
      const reverseResult = calculateReverseSalary({
        targetMonthlyInHand,
        regime: 'new',
        city: 'mumbai',
        basicSalaryPercentage: 50
      })

      const forwardCheck = calculateSalaryBreakdown({
        annualCtc: reverseResult.requiredAnnualCtc,
        regime: 'new',
        city: 'mumbai',
        basicSalaryPercentage: 50
      })

      expect(Math.abs(forwardCheck.takeHome.netInHandMonthly - targetMonthlyInHand)).toBeLessThanOrEqual(1)
    })
  })

  // =========================================================================
  // JOURNEY 4: Relocation Decision & Dual-Offer Comparison
  // =========================================================================
  describe('Journey 4: Dual-Offer Relocation Dilemma (Tier 1 vs Tier 2 Hub)', () => {
    it('TC-SIM-05: Compares Offer A (₹15 LPA in Bengaluru) vs Offer B (₹12 LPA in Lucknow)', () => {
      const offerA = calculateSalaryBreakdown({
        annualCtc: 1500000,
        regime: 'new',
        city: 'bengaluru',
        basicSalaryPercentage: 50
      })

      const offerB = calculateSalaryBreakdown({
        annualCtc: 1200000,
        regime: 'new',
        city: 'lucknow',
        basicSalaryPercentage: 50
      })

      // Step 1: Compare Monthly Take-Home Pay
      // Offer A in-hand: ₹1,00,527/mo. Offer B in-hand: ₹82,778/mo.
      const monthlyInHandDelta = offerA.takeHome.netInHandMonthly - offerB.takeHome.netInHandMonthly
      expect(monthlyInHandDelta).toBe(17749) // Bengaluru leads by ₹17,749/mo

      // Step 2: Factor in City Cost of Living (Rent + Baseline Living)
      // Bengaluru: Rent ₹18,000 + Living ₹14,000 = ₹32,000/mo
      // Lucknow: Rent ₹8,000 + Living ₹7,500 = ₹15,500/mo
      // Expense gap = ₹16,500/mo savings in Lucknow
      const expenseGap = (offerA.takeHome.estimatedMonthlyRent + offerA.takeHome.estimatedMonthlyLivingCost) -
                         (offerB.takeHome.estimatedMonthlyRent + offerB.takeHome.estimatedMonthlyLivingCost)
      expect(expenseGap).toBe(16500)

      // Step 3: Compare Real Disposable Savings Surplus
      // Bengaluru Disposable: ₹68,527. Lucknow Disposable: ₹66,778.
      // Despite ₹3 LPA headline CTC gap, net monthly surplus gap is only ~₹1,749/mo!
      const disposableDelta = offerA.takeHome.estimatedMonthlyDisposableIncome - offerB.takeHome.estimatedMonthlyDisposableIncome
      expect(disposableDelta).toBeLessThan(2000)
    })
  })

  // =========================================================================
  // JOURNEY 5: High-Earner Surcharge & Marginal Relief Protection
  // =========================================================================
  describe('Journey 5: High-Income Earner & Super-Rich Surcharge Protection', () => {
    it('TC-SIM-06: Verifies Surcharge Marginal Relief prevents negative returns at ₹50.1 LPA boundary', () => {
      // Direct comparison of taxable incomes: ₹50,00,000 vs ₹50,10,000
      const taxAt50L = calculateNewRegimeTax(5000000)
      const taxAt50_1L = calculateNewRegimeTax(5010000)

      // Excess income earned = ₹10,000
      const excessIncome = 5010000 - 5000000

      // In-tax before cess should increase by AT MOST the excess income (₹10,000)
      const basePlusSurchargeAt50L = taxAt50L.baseTax + taxAt50L.surcharge
      const basePlusSurchargeAt50_1L = taxAt50_1L.baseTax + taxAt50_1L.surcharge
      const preCessTaxDifference = basePlusSurchargeAt50_1L - basePlusSurchargeAt50L

      expect(preCessTaxDifference).toBe(excessIncome) // Exactly ₹10,000!
      expect(taxAt50_1L.marginalRelief).toBe(112300) // Relief of ₹1,12,300 saved the taxpayer
    })

    it('TC-SIM-07: Verifies ₹1.01 Cr boundary marginal relief under New Regime', () => {
      const taxAt1Cr = calculateNewRegimeTax(10000000)
      const taxAt1_01Cr = calculateNewRegimeTax(10100000)

      const excessIncome = 10100000 - 10000000 // ₹1,00,000
      const preCessDiff = (taxAt1_01Cr.baseTax + taxAt1_01Cr.surcharge) - (taxAt1Cr.baseTax + taxAt1Cr.surcharge)

      expect(preCessDiff).toBe(excessIncome)
      expect(taxAt1_01Cr.marginalRelief).toBe(69000)
    })
  })

  // =========================================================================
  // JOURNEY 6: Cross-City Professional Tax Invariance Check
  // =========================================================================
  describe('Journey 6: State-Level Professional Tax (PT) Act Compliance', () => {
    it('TC-SIM-08: Simulates candidate switching between Delhi-NCR (₹0 PT) and Mumbai (₹2,500 PT)', () => {
      const ctc = 1000000

      const delhi = calculateSalaryBreakdown({ annualCtc: ctc, regime: 'new', city: 'delhi-ncr' })
      const mumbai = calculateSalaryBreakdown({ annualCtc: ctc, regime: 'new', city: 'mumbai' })
      const bangalore = calculateSalaryBreakdown({ annualCtc: ctc, regime: 'new', city: 'bengaluru' })
      const jaipur = calculateSalaryBreakdown({ annualCtc: ctc, regime: 'new', city: 'jaipur' })

      // Delhi & Jaipur have no Professional Tax
      expect(delhi.deductions.professionalTaxAnnual).toBe(0)
      expect(jaipur.deductions.professionalTaxAnnual).toBe(0)

      // Maharashtra (Mumbai/Pune) has ₹2,500/year PT
      expect(mumbai.deductions.professionalTaxAnnual).toBe(2500)

      // Karnataka (Bengaluru) has ₹2,400/year PT
      expect(bangalore.deductions.professionalTaxAnnual).toBe(2400)

      // Take-home in Delhi exceeds Bengaluru by exactly ₹2,400/yr
      expect(delhi.takeHome.netInHandAnnual).toBe(bangalore.takeHome.netInHandAnnual + 2400)
    })
  })

  // =========================================================================
  // JOURNEY 7: Old vs New Regime Breakeven Simulation
  // =========================================================================
  describe('Journey 7: Tax Regime Breakeven Simulation (HRA + 80C + 80D)', () => {
    it('TC-SIM-09: Tests candidate with maximum deductions choosing between Old and New regimes', () => {
      const ctc = 1500000 // ₹15 LPA

      // New Regime: Flat ₹75,000 standard deduction
      const newRegimeResult = calculateSalaryBreakdown({
        annualCtc: ctc,
        regime: 'new',
        city: 'bengaluru',
        basicSalaryPercentage: 50
      })

      // Old Regime: ₹50k std + ₹1.5L (80C) + ₹25k (80D) + HRA exemption
      const oldRegimeResult = calculateSalaryBreakdown({
        annualCtc: ctc,
        regime: 'old',
        city: 'bengaluru',
        basicSalaryPercentage: 50,
        deduction80C: 150000,
        deduction80D: 25000,
        monthlyRentPaid: 25000 // User pays ₹25k/mo rent
      })

      // Under Budget 2024 revised slabs, New Regime tax at ₹15L is ₹1,11,280
      expect(newRegimeResult.deductions.incomeTaxAnnual).toBe(111280)

      // Old Regime with heavy deductions reduces taxable income significantly
      expect(oldRegimeResult.takeHome.annualTaxableIncome).toBeLessThan(newRegimeResult.takeHome.annualTaxableIncome)
    })
  })
})
