import { describe, it, expect } from 'vitest'
import {
  parseCurrencyInput,
  formatIndianCurrency,
  formatLpa,
  getSalaryBracket
} from '../../shared/utils/formatting'

describe('Formatting & Suffix Parser Utilities', () => {
  it('parses decimal LPA inputs seamlessly', () => {
    expect(parseCurrencyInput('12.5')).toBe(1250000)
    expect(parseCurrencyInput('12.5L')).toBe(1250000)
    expect(parseCurrencyInput('12.5 LPA')).toBe(1250000)
    expect(parseCurrencyInput('6.75lakh')).toBe(675000)
  })

  it('parses raw numbers and numbers with Indian commas', () => {
    expect(parseCurrencyInput('12,50,000')).toBe(1250000)
    expect(parseCurrencyInput('1250000')).toBe(1250000)
    expect(parseCurrencyInput('₹15,00,000')).toBe(1500000)
  })

  it('parses Crores (Cr) and Thousands (k)', () => {
    expect(parseCurrencyInput('1.5Cr')).toBe(15000000)
    expect(parseCurrencyInput('85k')).toBe(85000)
    expect(parseCurrencyInput('500K')).toBe(500000)
  })

  it('handles numeric input values directly', () => {
    expect(parseCurrencyInput(12.5)).toBe(1250000)
    expect(parseCurrencyInput(1200000)).toBe(1200000)
    expect(parseCurrencyInput(0)).toBe(0)
  })

  it('formats amounts in Indian numbering with commas', () => {
    expect(formatIndianCurrency(1250000)).toBe('₹12,50,000')
    expect(formatIndianCurrency(600000)).toBe('₹6,00,000')
    expect(formatIndianCurrency(85000)).toBe('₹85,000')
    expect(formatIndianCurrency(0)).toBe('₹0')
  })

  it('formats amounts into readable LPA or Cr strings', () => {
    expect(formatLpa(1250000)).toBe('₹12.50 LPA')
    expect(formatLpa(15000000)).toBe('₹1.50 Cr')
    expect(formatLpa(600000)).toBe('₹6.00 LPA')
  })

  it('classifies salary into privacy-preserving telemetry brackets', () => {
    expect(getSalaryBracket(400000)).toBe('< 5 LPA')
    expect(getSalaryBracket(750000)).toBe('5-10 LPA')
    expect(getSalaryBracket(1500000)).toBe('10-20 LPA')
    expect(getSalaryBracket(3500000)).toBe('20-50 LPA')
    expect(getSalaryBracket(7500000)).toBe('> 50 LPA')
  })
})
