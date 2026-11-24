import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { calculateSalaryBreakdown } from '~~/shared/utils/salaryModel'

const salaryInputSchema = z.object({
  annualCtc: z.number().min(0).max(1000000000),
  regime: z.enum(['new', 'old']),
  basicSalaryPercentage: z.number().min(10).max(80).optional(),
  employerPfIncludedInCtc: z.boolean().optional(),
  isEpfsStatutoryCapped: z.boolean().optional(),
  city: z.enum(['bengaluru', 'mumbai', 'delhi-ncr', 'pune', 'hyderabad', 'lucknow', 'jaipur', 'indore']).optional(),
  variablePayPercentage: z.number().min(0).max(60).optional(),
  deduction80C: z.number().min(0).max(500000).optional(),
  deduction80D: z.number().min(0).max(100000).optional(),
  monthlyRentPaid: z.number().min(0).max(1000000).optional(),
  dejargonizer: z.object({
    enabled: z.boolean(),
    hasGratuity: z.boolean().optional(),
    stockGrantTotal: z.number().min(0).optional(),
    stockVestingYears: z.number().min(1).max(10).optional(),
    joiningBonus: z.number().min(0).optional()
  }).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validation = salaryInputSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid salary input parameters',
      data: validation.error.format()
    })
  }
  return calculateSalaryBreakdown(validation.data)
})
