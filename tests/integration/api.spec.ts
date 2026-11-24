import { describe, it, expect, vi } from 'vitest'
import calculateHandler from '../../server/api/calculate.post'
import reverseHandler from '../../server/api/reverse.post'
import comparisonHandler from '../../server/api/comparisons/[slug].get'
import ogHandler from '../../server/api/og.get'

// Helper to simulate H3 event in Vitest
function createMockEvent(options: {
  body?: any
  params?: Record<string, string>
  query?: Record<string, string>
}) {
  const headers: Record<string, string> = {}
  return {
    node: {
      req: {
        headers: {},
        method: options.body ? 'POST' : 'GET'
      },
      res: {
        setHeader: (k: string, v: string) => { headers[k] = v }
      }
    },
    context: {
      params: options.params || {}
    },
    _body: options.body,
    _query: options.query || {},
    _headers: headers
  } as any
}

// Mock h3 / nitro utilities if running in node environment
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    readBody: async (event: any) => event._body,
    getRouterParam: (event: any, param: string) => event.context.params?.[param],
    getQuery: (event: any) => event._query,
    setHeader: (event: any, key: string, value: string) => {
      event._headers[key] = value
    },
    createError: (err: { statusCode: number; statusMessage: string; data?: any }) => {
      const error = new Error(err.statusMessage) as any
      error.statusCode = err.statusCode
      error.data = err.data
      return error
    }
  }
})

describe('Server API Endpoints (Phase 2)', () => {
  describe('POST /api/calculate', () => {
    it('returns structured salary breakdown for valid input', async () => {
      const event = createMockEvent({
        body: {
          annualCtc: 1200000,
          regime: 'new',
          city: 'bengaluru',
          basicSalaryPercentage: 50,
          employerPfIncludedInCtc: true
        }
      })

      const response = await calculateHandler(event)
      expect(response).toBeDefined()
      expect(response.takeHome.netInHandMonthly).toBeGreaterThan(70000)
      expect(response.deductions.employeePfAnnual).toBe(72000)
    })

    it('rejects invalid payload with 400 Bad Request', async () => {
      const event = createMockEvent({
        body: {
          annualCtc: -5000, // Invalid negative CTC
          regime: 'invalid-regime'
        }
      })

      await expect(calculateHandler(event)).rejects.toMatchObject({
        statusCode: 400
      })
    })
  })

  describe('POST /api/reverse', () => {
    it('returns required CTC for valid target in-hand', async () => {
      const event = createMockEvent({
        body: {
          targetMonthlyInHand: 75000,
          regime: 'new',
          city: 'bengaluru'
        }
      })

      const response = await reverseHandler(event)
      expect(response).toBeDefined()
      expect(response.requiredAnnualCtc).toBeGreaterThan(900000)
      expect(response.breakdown.takeHome.netInHandMonthly).toBeGreaterThanOrEqual(75000)
    })

    it('rejects negative target in-hand with 400 Bad Request', async () => {
      const event = createMockEvent({
        body: {
          targetMonthlyInHand: -1000,
          regime: 'new'
        }
      })

      await expect(reverseHandler(event)).rejects.toMatchObject({
        statusCode: 400
      })
    })
  })

  describe('GET /api/comparisons/[slug]', () => {
    it('resolves curated comparison slug successfully', async () => {
      const event = createMockEvent({
        params: { slug: '6lpa-vs-8lpa' }
      })

      const response = await comparisonHandler(event)
      expect(response.slugData.title).toContain('₹6 LPA vs. ₹8 LPA')
      expect(response.comparison.winnerInHand).toBe('offerB')
      expect(response.comparison.monthlyInHandDelta).toBeLessThan(0) // Offer A < Offer B
    })

    it('dynamically resolves arbitrary comparison slug', async () => {
      const event = createMockEvent({
        params: { slug: '10lpa-vs-15lpa' }
      })

      const response = await comparisonHandler(event)
      expect(response.slugData.isCurated).toBe(false)
      expect(response.slugData.offerAInputs.annualCtc).toBe(1000000)
      expect(response.slugData.offerBInputs.annualCtc).toBe(1500000)
    })

    it('returns 404 for unparseable comparison slug', async () => {
      const event = createMockEvent({
        params: { slug: 'some-completely-invalid-slug' }
      })

      await expect(comparisonHandler(event)).rejects.toMatchObject({
        statusCode: 404
      })
    })
  })

  describe('GET /api/og', () => {
    it('generates valid SVG image with proper Content-Type header', async () => {
      const event = createMockEvent({
        query: {
          title: 'Offer Comparison: Bengaluru vs Lucknow',
          inHand: '₹84,200/mo'
        }
      })

      const svg = await ogHandler(event)
      expect(typeof svg).toBe('string')
      expect(svg).toContain('<svg')
      expect(svg).toContain('Offer Comparison: Bengaluru vs Lucknow')
      expect(svg).toContain('₹84,200/mo')
      expect(event._headers['Content-Type']).toBe('image/svg+xml')
    })
  })
})
