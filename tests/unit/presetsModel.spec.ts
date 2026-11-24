import { describe, it, expect } from 'vitest'
import {
  CITIES,
  getCityInfo,
  parseComparisonSlug
} from '../../shared/utils/presetsModel'

describe('Presets Model & Dynamic Slug Parser', () => {
  it('provides comprehensive city indices with rent and living baselines', () => {
    const blr = getCityInfo('bengaluru')
    expect(blr.name).toBe('Bengaluru')
    expect(blr.tier).toBe('tier-1')
    expect(blr.medianRent1BHK).toBe(18000)
    expect(blr.isMetroHra).toBe(true)

    const lko = getCityInfo('lucknow')
    expect(lko.name).toBe('Lucknow')
    expect(lko.tier).toBe('tier-2')
    expect(lko.medianRent1BHK).toBe(8000)
    expect(lko.isMetroHra).toBe(false)
  })

  it('resolves curated SEO comparison slugs', () => {
    const curated = parseComparisonSlug('6lpa-vs-8lpa')
    expect(curated).not.toBeNull()
    expect(curated?.isCurated).toBe(true)
    expect(curated?.offerAInputs.annualCtc).toBe(600000)
    expect(curated?.offerBInputs.annualCtc).toBe(800000)
    expect(curated?.faqs.length).toBeGreaterThan(0)
  })

  it('dynamically parses arbitrary CTC comparison slugs', () => {
    const dynamic = parseComparisonSlug('5lpa-vs-10lpa')
    expect(dynamic).not.toBeNull()
    expect(dynamic?.isCurated).toBe(false)
    expect(dynamic?.offerAInputs.annualCtc).toBe(500000)
    expect(dynamic?.offerBInputs.annualCtc).toBe(1000000)
  })

  it('dynamically parses city comparison slugs with CTC', () => {
    const dynamicCity = parseComparisonSlug('mumbai-vs-pune-12lpa')
    expect(dynamicCity).not.toBeNull()
    expect(dynamicCity?.isCurated).toBe(false)
    expect(dynamicCity?.offerAInputs.city).toBe('mumbai')
    expect(dynamicCity?.offerBInputs.city).toBe('pune')
    expect(dynamicCity?.offerAInputs.annualCtc).toBe(1200000)
  })

  it('returns null for completely invalid slugs', () => {
    expect(parseComparisonSlug('invalid-random-slug')).toBeNull()
    expect(parseComparisonSlug('foo-bar')).toBeNull()
  })
})
