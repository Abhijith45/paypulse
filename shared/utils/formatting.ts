import type { SalaryBracket } from '../types/analytics'

/**
 * Smart currency parser:
 * Accepts inputs like '12.5', '12.5L', '12.5 LPA', '85k', '1.2Cr', or '12,50,000'
 * and converts them into an integer rupee amount.
 */
export function parseCurrencyInput(raw: string | number): number {
  if (typeof raw === 'number') {
    if (isNaN(raw) || raw < 0) return 0
    // If user enters a number <= 100, treat as LPA (e.g. 12.5 -> 12,50,000)
    if (raw > 0 && raw <= 100) {
      return Math.round(raw * 100000)
    }
    return Math.round(raw)
  }

  if (!raw || typeof raw !== 'string') return 0

  const cleaned = raw.trim().toLowerCase().replace(/[₹,\s]/g, '')
  if (!cleaned) return 0

  // Crore format (e.g. 1.2cr)
  if (cleaned.includes('cr')) {
    const num = parseFloat(cleaned.replace('cr', ''))
    return isNaN(num) ? 0 : Math.round(num * 10000000)
  }

  // Lakh format (e.g. 12.5l, 12.5lpa, 12.5lakh)
  if (cleaned.includes('lpa') || cleaned.includes('lakh') || cleaned.includes('l')) {
    const num = parseFloat(cleaned.replace(/lpa|lakh|l/g, ''))
    return isNaN(num) ? 0 : Math.round(num * 100000)
  }

  // Thousands format (e.g. 85k)
  if (cleaned.includes('k')) {
    const num = parseFloat(cleaned.replace('k', ''))
    return isNaN(num) ? 0 : Math.round(num * 1000)
  }

  // Pure numeric string
  const parsed = parseFloat(cleaned)
  if (isNaN(parsed)) return 0

  // If user entered a decimal or small number <= 100 without suffix, assume Lakhs
  if (parsed > 0 && parsed <= 100) {
    return Math.round(parsed * 100000)
  }

  return Math.round(parsed)
}

/**
 * Formats a rupee amount in Indian numbering system (e.g. ₹12,50,000)
 */
export function formatIndianCurrency(amount: number): string {
  if (isNaN(amount)) return '₹0'
  const rounded = Math.round(amount)
  const isNegative = rounded < 0
  const absStr = Math.abs(rounded).toString()

  let lastThree = absStr.substring(absStr.length - 3)
  const otherNumbers = absStr.substring(0, absStr.length - 3)
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
  return `${isNegative ? '-' : ''}₹${formatted}`
}

/**
 * Formats a rupee amount to LPA / Cr string:
 * 12,50,000 -> "₹12.50 LPA"
 * 1,50,00,000 -> "₹1.50 Cr"
 * 45,000 -> "₹45,000"
 */
export function formatLpa(amount: number): string {
  if (isNaN(amount) || amount === 0) return '₹0 LPA'

  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2)
    return `₹${cr} Cr`
  }

  if (amount >= 100000) {
    const lpa = (amount / 100000).toFixed(2)
    return `₹${lpa} LPA`
  }

  return formatIndianCurrency(amount)
}

/**
 * Derives the anonymized salary bracket for privacy-first telemetry
 */
export function getSalaryBracket(annualCtc: number): SalaryBracket {
  if (annualCtc < 500000) return '< 5 LPA'
  if (annualCtc <= 1000000) return '5-10 LPA'
  if (annualCtc <= 2000000) return '10-20 LPA'
  if (annualCtc <= 5000000) return '20-50 LPA'
  return '> 50 LPA'
}
