import type {
  SalaryInputDTO,
  SalaryBreakdownDTO,
  DeductionBreakdown,
  TakeHomeBreakdown,
  TaxRegime
} from '../types/compensation'
import { getCityInfo } from './presetsModel'

/**
 * Computes income tax liability under the New Tax Regime (FY 2025-26 Budget revision)
 * Standard Deduction: ₹75,000
 * Slabs:
 *   0 - 3L: 0%
 *   3L - 7L: 5%
 *   7L - 10L: 10%
 *   10L - 12L: 15%
 *   12L - 15L: 20%
 *   > 15L: 30%
 * Section 87A full rebate up to ₹7,00,000 taxable income.
 * Marginal relief applied for taxable income marginally exceeding ₹7,00,000.
 */
export function calculateNewRegimeTax(taxableIncome: number): {
  baseTax: number
  rebate87A: number
  marginalRelief: number
  surcharge: number
  cess: number
  totalTax: number
} {
  if (taxableIncome <= 0) {
    return { baseTax: 0, rebate87A: 0, marginalRelief: 0, surcharge: 0, cess: 0, totalTax: 0 }
  }

  // Calculate raw slab tax
  let rawTax = 0
  if (taxableIncome > 1500000) {
    rawTax += (taxableIncome - 1500000) * 0.30 + 140000
  } else if (taxableIncome > 1200000) {
    rawTax += (taxableIncome - 1200000) * 0.20 + 80000
  } else if (taxableIncome > 1000000) {
    rawTax += (taxableIncome - 1000000) * 0.15 + 50000
  } else if (taxableIncome > 700000) {
    rawTax += (taxableIncome - 700000) * 0.10 + 20000
  } else if (taxableIncome > 300000) {
    rawTax += (taxableIncome - 300000) * 0.05
  }

  let rebate87A = 0
  let marginalRelief87A = 0
  let taxAfterRebateAndRelief = rawTax

  // Section 87A rebate up to ₹7,00,000 taxable income (max ₹20,000 rebate)
  if (taxableIncome <= 700000) {
    rebate87A = rawTax
    taxAfterRebateAndRelief = 0
  } else {
    // Marginal relief check: Tax payable cannot exceed (Taxable Income - 7,00,000)
    const excessIncome = taxableIncome - 700000
    if (rawTax > excessIncome) {
      marginalRelief87A = rawTax - excessIncome
      taxAfterRebateAndRelief = excessIncome
    }
  }

  // Surcharges for high income earners under New Regime with Marginal Relief
  let surcharge = 0
  let marginalReliefSurcharge = 0

  if (taxableIncome > 20000000) {
    // 25% surcharge above 2 Cr
    // Tax at 2 Cr = 140,000 + (1,85,00,000 * 0.30) = 56,90,000
    // Surcharge at 2 Cr (15%) = 56,90,000 * 0.15 = 8,53,500
    // Total payable at 2 Cr = 56,90,000 + 8,53,500 = 65,43,500
    const rawSurcharge = taxAfterRebateAndRelief * 0.25
    const totalWithoutMarginalRelief = taxAfterRebateAndRelief + rawSurcharge
    const maxPayable = 6543500 + (taxableIncome - 20000000)
    if (totalWithoutMarginalRelief > maxPayable) {
      marginalReliefSurcharge = totalWithoutMarginalRelief - maxPayable
      surcharge = Math.max(0, rawSurcharge - marginalReliefSurcharge)
    } else {
      surcharge = rawSurcharge
    }
  } else if (taxableIncome > 10000000) {
    // 15% surcharge above 1 Cr up to 2 Cr
    // Tax at 1 Cr = 140,000 + (85,00,000 * 0.30) = 26,90,000
    // Surcharge at 1 Cr (10%) = 26,90,000 * 0.10 = 2,69,000
    // Total payable at 1 Cr = 26,90,000 + 2,69,000 = 29,59,000
    const rawSurcharge = taxAfterRebateAndRelief * 0.15
    const totalWithoutMarginalRelief = taxAfterRebateAndRelief + rawSurcharge
    const maxPayable = 2959000 + (taxableIncome - 10000000)
    if (totalWithoutMarginalRelief > maxPayable) {
      marginalReliefSurcharge = totalWithoutMarginalRelief - maxPayable
      surcharge = Math.max(0, rawSurcharge - marginalReliefSurcharge)
    } else {
      surcharge = rawSurcharge
    }
  } else if (taxableIncome > 5000000) {
    // 10% surcharge above 50 Lakhs up to 1 Cr
    // Tax at 50 Lakhs = 140,000 + (35,00,000 * 0.30) = 11,90,000
    // Surcharge at 50 Lakhs = 0
    // Total payable at 50 Lakhs = 11,90,000
    const rawSurcharge = taxAfterRebateAndRelief * 0.10
    const totalWithoutMarginalRelief = taxAfterRebateAndRelief + rawSurcharge
    const maxPayable = 1190000 + (taxableIncome - 5000000)
    if (totalWithoutMarginalRelief > maxPayable) {
      marginalReliefSurcharge = totalWithoutMarginalRelief - maxPayable
      surcharge = Math.max(0, rawSurcharge - marginalReliefSurcharge)
    } else {
      surcharge = rawSurcharge
    }
  }

  // Health and Education Cess: 4% on (Tax + Surcharge)
  const cess = Math.round((taxAfterRebateAndRelief + surcharge) * 0.04)
  const totalTax = Math.round(taxAfterRebateAndRelief + surcharge + cess)
  const totalMarginalRelief = marginalRelief87A + marginalReliefSurcharge

  return {
    baseTax: Math.round(rawTax),
    rebate87A: Math.round(rebate87A),
    marginalRelief: Math.round(totalMarginalRelief),
    surcharge: Math.round(surcharge),
    cess,
    totalTax
  }
}

/**
 * Computes income tax liability under Old Tax Regime
 * Standard Deduction: ₹50,000
 * Slabs:
 *   0 - 2.5L: 0%
 *   2.5L - 5L: 5%
 *   5L - 10L: 20%
 *   > 10L: 30%
 * Rebate 87A up to ₹5,00,000 (max ₹12,500).
 */
export function calculateOldRegimeTax(taxableIncome: number): {
  baseTax: number
  rebate87A: number
  marginalRelief: number
  surcharge: number
  cess: number
  totalTax: number
} {
  if (taxableIncome <= 0) {
    return { baseTax: 0, rebate87A: 0, marginalRelief: 0, surcharge: 0, cess: 0, totalTax: 0 }
  }

  let rawTax = 0
  if (taxableIncome > 1000000) {
    rawTax += (taxableIncome - 1000000) * 0.30 + 112500
  } else if (taxableIncome > 500000) {
    rawTax += (taxableIncome - 500000) * 0.20 + 12500
  } else if (taxableIncome > 250000) {
    rawTax += (taxableIncome - 250000) * 0.05
  }

  let rebate87A = 0
  let taxAfterRebate = rawTax
  if (taxableIncome <= 500000) {
    rebate87A = rawTax
    taxAfterRebate = 0
  }

  let surcharge = 0
  let marginalReliefSurcharge = 0

  if (taxableIncome > 50000000) {
    // 37% surcharge above 5 Cr
    // Tax at 5 Cr = 1,12,500 + 1,47,00,000 = 1,48,12,500
    // Surcharge at 5 Cr (25%) = 37,03,125
    // Total payable at 5 Cr = 1,85,15,625
    const rawSurcharge = taxAfterRebate * 0.37
    const totalWithoutMarginalRelief = taxAfterRebate + rawSurcharge
    const maxPayable = 18515625 + (taxableIncome - 50000000)
    if (totalWithoutMarginalRelief > maxPayable) {
      marginalReliefSurcharge = totalWithoutMarginalRelief - maxPayable
      surcharge = Math.max(0, rawSurcharge - marginalReliefSurcharge)
    } else {
      surcharge = rawSurcharge
    }
  } else if (taxableIncome > 20000000) {
    // 25% surcharge above 2 Cr
    // Tax at 2 Cr = 1,12,500 + 57,00,000 = 58,12,500
    // Surcharge at 2 Cr (15%) = 8,71,875
    // Total payable at 2 Cr = 66,84,375
    const rawSurcharge = taxAfterRebate * 0.25
    const totalWithoutMarginalRelief = taxAfterRebate + rawSurcharge
    const maxPayable = 6684375 + (taxableIncome - 20000000)
    if (totalWithoutMarginalRelief > maxPayable) {
      marginalReliefSurcharge = totalWithoutMarginalRelief - maxPayable
      surcharge = Math.max(0, rawSurcharge - marginalReliefSurcharge)
    } else {
      surcharge = rawSurcharge
    }
  } else if (taxableIncome > 10000000) {
    // 15% surcharge above 1 Cr
    // Tax at 1 Cr = 1,12,500 + 27,00,000 = 28,12,500
    // Surcharge at 1 Cr (10%) = 2,81,250
    // Total payable at 1 Cr = 30,93,750
    const rawSurcharge = taxAfterRebate * 0.15
    const totalWithoutMarginalRelief = taxAfterRebate + rawSurcharge
    const maxPayable = 3093750 + (taxableIncome - 10000000)
    if (totalWithoutMarginalRelief > maxPayable) {
      marginalReliefSurcharge = totalWithoutMarginalRelief - maxPayable
      surcharge = Math.max(0, rawSurcharge - marginalReliefSurcharge)
    } else {
      surcharge = rawSurcharge
    }
  } else if (taxableIncome > 5000000) {
    // 10% surcharge above 50 Lakhs
    // Tax at 50 Lakhs = 1,12,500 + 12,00,000 = 13,12,500
    // Surcharge at 50 Lakhs = 0
    // Total payable at 50 Lakhs = 13,12,500
    const rawSurcharge = taxAfterRebate * 0.10
    const totalWithoutMarginalRelief = taxAfterRebate + rawSurcharge
    const maxPayable = 1312500 + (taxableIncome - 5000000)
    if (totalWithoutMarginalRelief > maxPayable) {
      marginalReliefSurcharge = totalWithoutMarginalRelief - maxPayable
      surcharge = Math.max(0, rawSurcharge - marginalReliefSurcharge)
    } else {
      surcharge = rawSurcharge
    }
  }

  const cess = Math.round((taxAfterRebate + surcharge) * 0.04)
  const totalTax = Math.round(taxAfterRebate + surcharge + cess)

  return {
    baseTax: Math.round(rawTax),
    rebate87A: Math.round(rebate87A),
    marginalRelief: Math.round(marginalReliefSurcharge),
    surcharge: Math.round(surcharge),
    cess,
    totalTax
  }
}

/**
 * Main Isomorphic Salary Calculation Engine
 * Operates in pure integer rupees with zero UI dependencies.
 * Supports granular float percentages (e.g. 12.35% variable, 42.5% basic).
 */
export function calculateSalaryBreakdown(input: SalaryInputDTO): SalaryBreakdownDTO {
  const ctc = Math.max(0, Math.round(input.annualCtc || 0))
  const regime: TaxRegime = input.regime === 'old' ? 'old' : 'new'

  // Granular decimal percentage support (10% to 80% for basic, 0% to 60% for variable)
  const basicPct = Math.min(80, Math.max(10, typeof input.basicSalaryPercentage === 'number' ? input.basicSalaryPercentage : 50)) / 100
  const variablePct = Math.min(60, Math.max(0, typeof input.variablePayPercentage === 'number' ? input.variablePayPercentage : 0)) / 100

  const employerPfIncluded = input.employerPfIncludedInCtc ?? true
  const isEpfsCapped = input.isEpfsStatutoryCapped ?? false

  const cityInfo = getCityInfo(input.city)

  // 1. Basic Pay calculation
  const basicSalaryAnnual = Math.round(ctc * basicPct)
  const basicSalaryMonthly = Math.round(basicSalaryAnnual / 12)

  // 2. EPF calculations (12% of basic, or capped at ₹1,800/mo = ₹21,600/yr)
  const statutoryCapAnnual = 1800 * 12 // ₹21,600
  const standardPfAnnual = Math.round(basicSalaryAnnual * 0.12)
  const epfAnnual = isEpfsCapped ? Math.min(standardPfAnnual, statutoryCapAnnual) : standardPfAnnual
  const epfMonthly = Math.round(epfAnnual / 12)

  const employeePfAnnual = epfAnnual
  const employeePfMonthly = epfMonthly
  const employerPfAnnual = epfAnnual
  const employerPfMonthly = epfMonthly

  // 3. Variable Pay (Bonus) holdback
  const variablePayAnnual = Math.round(ctc * variablePct)
  const variablePayMonthly = Math.round(variablePayAnnual / 12)

  // 4. Professional Tax (State specific based on City)
  const ptAnnualRate = cityInfo.professionalTaxAnnual ?? 2400
  const professionalTaxAnnual = ctc > 150000 ? ptAnnualRate : 0
  const professionalTaxMonthly = Math.round(professionalTaxAnnual / 12)

  // 5. De-Jargonizer: Gratuity & ESOPs
  const dejargon = input.dejargonizer
  const hasGratuity = dejargon?.enabled && dejargon?.hasGratuity
  // Gratuity provision is 15/26 of half-month basic per year = (15 / 26) * (Basic / 12) * 12 ~ 4.81% of basic
  const gratuityAnnual = hasGratuity ? Math.round((basicSalaryAnnual * 15) / (26 * 12)) : 0
  const gratuityMonthly = Math.round(gratuityAnnual / 12)

  // 6. Gross Salary (Monthly Inflow before deductions)
  let grossSalaryAnnual = ctc - variablePayAnnual
  if (employerPfIncluded) {
    grossSalaryAnnual -= employerPfAnnual
  }
  if (hasGratuity) {
    grossSalaryAnnual -= gratuityAnnual
  }
  grossSalaryAnnual = Math.max(0, grossSalaryAnnual)
  const grossSalaryMonthly = Math.round(grossSalaryAnnual / 12)

  // 7. Income Tax Deductions & Calculations
  let standardDeduction = 0
  let annualTaxableIncome = 0
  let taxResult = { baseTax: 0, rebate87A: 0, marginalRelief: 0, surcharge: 0, cess: 0, totalTax: 0 }

  if (regime === 'new') {
    standardDeduction = 75000
    annualTaxableIncome = Math.max(0, grossSalaryAnnual - standardDeduction)
    taxResult = calculateNewRegimeTax(annualTaxableIncome)
  } else {
    // Old Regime
    standardDeduction = 50000
    const deduction80CInput = input.deduction80C !== undefined ? input.deduction80C : 150000
    // Section 80C cap is ₹1,50,000 combining employee PF + additional investments (PPF, ELSS, etc.)
    const total80C = input.deduction80C !== undefined
      ? Math.min(150000, deduction80CInput + employeePfAnnual)
      : Math.min(150000, Math.max(150000, employeePfAnnual))
    const deduction80D = Math.min(25000, input.deduction80D ?? 25000)

    // HRA Exemption based on city metro status and rent
    const hraPercent = cityInfo.isMetroHra ? 0.50 : 0.40
    const hraReceived = Math.round(basicSalaryAnnual * hraPercent)
    const annualRent = (input.monthlyRentPaid ?? cityInfo.medianRent1BHK) * 12
    const rentMinus10PctBasic = Math.max(0, annualRent - basicSalaryAnnual * 0.10)
    const hraExemption = Math.min(hraReceived, rentMinus10PctBasic)

    const totalOldDeductions = standardDeduction + total80C + deduction80D + hraExemption
    annualTaxableIncome = Math.max(0, grossSalaryAnnual - totalOldDeductions)
    taxResult = calculateOldRegimeTax(annualTaxableIncome)
  }

  const incomeTaxAnnual = taxResult.totalTax
  const incomeTaxMonthly = Math.round(incomeTaxAnnual / 12)

  // 8. Total Deductions
  const totalDeductionsAnnual = incomeTaxAnnual + employeePfAnnual + professionalTaxAnnual
  const totalDeductionsMonthly = Math.round(totalDeductionsAnnual / 12)

  // 9. Net In-Hand Take Home Pay
  const netInHandAnnual = Math.max(0, grossSalaryAnnual - totalDeductionsAnnual)
  const netInHandMonthly = Math.round(netInHandAnnual / 12)

  // 10. De-Jargonizer Equity & Cash metrics
  const stockGrantTotal = dejargon?.enabled ? (dejargon.stockGrantTotal ?? 0) : 0
  const stockVestingYears = (dejargon?.enabled ? dejargon.stockVestingYears : 4) || 4
  const nonCashMonthlyEquity = Math.round(stockGrantTotal / stockVestingYears / 12)
  const oneTimeJoiningBonus = dejargon?.enabled ? (dejargon.joiningBonus ?? 0) : 0

  // 11. Cost-of-Living & Disposable Income
  const estimatedMonthlyRent = cityInfo.medianRent1BHK
  const estimatedMonthlyLivingCost = cityInfo.baselineLivingCost
  const estimatedMonthlyDisposableIncome = Math.round(
    netInHandMonthly - (estimatedMonthlyRent + estimatedMonthlyLivingCost)
  )

  const effectiveTaxRate = grossSalaryAnnual > 0
    ? parseFloat(((incomeTaxAnnual / grossSalaryAnnual) * 100).toFixed(2))
    : 0

  // 12. Visual Distribution Percentages (relative to CTC)
  const safeCtc = ctc > 0 ? ctc : 1
  const netPct = parseFloat(((netInHandAnnual / safeCtc) * 100).toFixed(1))
  const taxPct = parseFloat(((incomeTaxAnnual / safeCtc) * 100).toFixed(1))
  const pfPct = parseFloat((((employeePfAnnual + (employerPfIncluded ? employerPfAnnual : 0)) / safeCtc) * 100).toFixed(1))
  const varPct = parseFloat(((variablePayAnnual / safeCtc) * 100).toFixed(1))
  const gratPct = parseFloat(((gratuityAnnual / safeCtc) * 100).toFixed(1))

  const deductions: DeductionBreakdown = {
    incomeTaxMonthly,
    incomeTaxAnnual,
    cessAnnual: taxResult.cess,
    employeePfMonthly,
    employeePfAnnual,
    employerPfMonthly,
    employerPfAnnual,
    professionalTaxMonthly,
    professionalTaxAnnual,
    gratuityMonthly,
    gratuityAnnual,
    variableHoldbackMonthly: variablePayMonthly,
    variableHoldbackAnnual: variablePayAnnual,
    totalDeductionsMonthly,
    totalDeductionsAnnual
  }

  const takeHome: TakeHomeBreakdown = {
    grossSalaryMonthly,
    grossSalaryAnnual,
    netInHandMonthly,
    netInHandAnnual,
    annualTaxableIncome,
    standardDeductionApplied: standardDeduction,
    rebate87AApplied: taxResult.rebate87A,
    marginalReliefApplied: taxResult.marginalRelief,
    surchargeApplied: taxResult.surcharge,
    effectiveTaxRatePercentage: effectiveTaxRate,
    cashInHandMonthly: netInHandMonthly,
    nonCashMonthlyEquity,
    oneTimeJoiningBonus,
    cityInfo,
    estimatedMonthlyRent,
    estimatedMonthlyLivingCost,
    estimatedMonthlyDisposableIncome
  }

  return {
    input,
    deductions,
    takeHome,
    visualSegments: {
      netInHandPercentage: netPct,
      taxPercentage: taxPct,
      pfPercentage: pfPct,
      variablePercentage: varPct,
      gratuityPercentage: gratPct
    }
  }
}
