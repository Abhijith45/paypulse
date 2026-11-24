export type TaxRegime = 'new' | 'old'

export type CityKey =
  | 'bengaluru'
  | 'mumbai'
  | 'delhi-ncr'
  | 'pune'
  | 'hyderabad'
  | 'lucknow'
  | 'jaipur'
  | 'indore'

export type CityTier = 'tier-1' | 'tier-2'

export interface CityInfo {
  key: CityKey
  name: string
  tier: CityTier
  isMetroHra: boolean
  medianRent1BHK: number
  baselineLivingCost: number
  professionalTaxAnnual: number
  description: string
}

export interface DeJargonizerInputs {
  enabled: boolean
  hasGratuity: boolean
  stockGrantTotal: number
  stockVestingYears: number
  joiningBonus: number
}

export interface SalaryInputDTO {
  annualCtc: number
  regime: TaxRegime
  basicSalaryPercentage?: number
  employerPfIncludedInCtc?: boolean
  isEpfsStatutoryCapped?: boolean
  city?: CityKey
  variablePayPercentage?: number
  deduction80C?: number
  deduction80D?: number
  monthlyRentPaid?: number
  dejargonizer?: Partial<DeJargonizerInputs>
}

export interface DeductionBreakdown {
  incomeTaxMonthly: number
  incomeTaxAnnual: number
  cessAnnual: number
  employeePfMonthly: number
  employeePfAnnual: number
  employerPfMonthly: number
  employerPfAnnual: number
  professionalTaxMonthly: number
  professionalTaxAnnual: number
  gratuityMonthly: number
  gratuityAnnual: number
  variableHoldbackMonthly: number
  variableHoldbackAnnual: number
  totalDeductionsMonthly: number
  totalDeductionsAnnual: number
}

export interface TakeHomeBreakdown {
  grossSalaryMonthly: number
  grossSalaryAnnual: number
  netInHandMonthly: number
  netInHandAnnual: number
  annualTaxableIncome: number
  standardDeductionApplied: number
  rebate87AApplied: number
  marginalReliefApplied: number
  surchargeApplied: number
  effectiveTaxRatePercentage: number
  cashInHandMonthly: number
  nonCashMonthlyEquity: number
  oneTimeJoiningBonus: number
  cityInfo: CityInfo
  estimatedMonthlyRent: number
  estimatedMonthlyLivingCost: number
  estimatedMonthlyDisposableIncome: number
}

export interface SalaryBreakdownDTO {
  input: SalaryInputDTO
  deductions: DeductionBreakdown
  takeHome: TakeHomeBreakdown
  visualSegments: {
    netInHandPercentage: number
    taxPercentage: number
    pfPercentage: number
    variablePercentage: number
    gratuityPercentage: number
  }
}

export interface ReverseSalaryInputDTO {
  targetMonthlyInHand: number
  regime: TaxRegime
  city?: CityKey
  basicSalaryPercentage?: number
  employerPfIncludedInCtc?: boolean
  isEpfsStatutoryCapped?: boolean
  variablePayPercentage?: number
  dejargonizer?: Partial<DeJargonizerInputs>
}

export interface ReverseSalaryOutputDTO {
  targetMonthlyInHand: number
  requiredAnnualCtc: number
  requiredMonthlyCtc: number
  breakdown: SalaryBreakdownDTO
}
