import { defineEventHandler, readBody, createError } from 'h3'
import { z } from 'zod'
import { calculateReverseSalary } from '~~/shared/utils/reverseSalaryModel'

const reverseInputSchema = z.object({
  targetMonthlyInHand: z.number().min(0).max(50000000),
  regime: z.enum(['new', 'old']),
  city: z.enum(['bengaluru', 'mumbai', 'delhi-ncr', 'pune', 'hyderabad', 'lucknow', 'jaipur', 'indore']).optional(),
  basicSalaryPercentage: z.number().min(10).max(80).optional(),
  employerPfIncludedInCtc: z.boolean().optional(),
  isEpfsStatutoryCapped: z.boolean().optional(),
  variablePayPercentage: z.number().min(0).max(60).optional(),
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
  const validation = reverseInputSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid reverse calculation parameters',
      data: validation.error.format()
    })
  }
  return calculateReverseSalary(validation.data)
})
