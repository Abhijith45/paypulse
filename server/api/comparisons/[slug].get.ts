import { defineEventHandler, getRouterParam, createError } from 'h3'
import { parseComparisonSlug } from '~~/shared/utils/presetsModel'
import { calculateSalaryBreakdown } from '~~/shared/utils/salaryModel'
import type { OfferComparisonDTO } from '~~/shared/types/comparison'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug parameter is required' })
  }

  const slugData = parseComparisonSlug(slug)
  if (!slugData) {
    throw createError({ statusCode: 404, statusMessage: `Comparison '${slug}' not found` })
  }

  const offerA = calculateSalaryBreakdown(slugData.offerAInputs)
  const offerB = calculateSalaryBreakdown(slugData.offerBInputs)

  const monthlyInHandDelta = offerA.takeHome.netInHandMonthly - offerB.takeHome.netInHandMonthly
  const annualInHandDelta = offerA.takeHome.netInHandAnnual - offerB.takeHome.netInHandAnnual
  const monthlyDisposableDelta = offerA.takeHome.estimatedMonthlyDisposableIncome - offerB.takeHome.estimatedMonthlyDisposableIncome
  const annualDisposableDelta = monthlyDisposableDelta * 12

  let winnerInHand: 'offerA' | 'offerB' | 'equal' = 'equal'
  if (monthlyInHandDelta > 0) winnerInHand = 'offerA'
  else if (monthlyInHandDelta < 0) winnerInHand = 'offerB'

  let winnerDisposable: 'offerA' | 'offerB' | 'equal' = 'equal'
  if (monthlyDisposableDelta > 0) winnerDisposable = 'offerA'
  else if (monthlyDisposableDelta < 0) winnerDisposable = 'offerB'

  let summaryInsight = ''
  if (offerA.input.city !== offerB.input.city && offerA.input.annualCtc === offerB.input.annualCtc) {
    const cityA = offerA.takeHome.cityInfo
    const cityB = offerB.takeHome.cityInfo
    const rentDiff = Math.abs(cityA.medianRent1BHK - cityB.medianRent1BHK)
    const cheaper = cityA.medianRent1BHK < cityB.medianRent1BHK ? cityA.name : cityB.name
    summaryInsight = `At the same CTC, living in ${cheaper} provides ~₹${rentDiff.toLocaleString('en-IN')}/month in rental savings, yielding higher real disposable income.`
  } else if (monthlyInHandDelta !== 0) {
    const higherOffer = monthlyInHandDelta > 0 ? 'Offer A' : 'Offer B'
    summaryInsight = `${higherOffer} delivers ₹${Math.abs(monthlyInHandDelta).toLocaleString('en-IN')}/month more in bank account take-home pay.`
  } else {
    summaryInsight = 'Both offers provide equivalent net take-home compensation.'
  }

  const comparison: OfferComparisonDTO = {
    offerA,
    offerB,
    monthlyInHandDelta,
    annualInHandDelta,
    monthlyDisposableDelta,
    annualDisposableDelta,
    winnerInHand,
    winnerDisposable,
    summaryInsight
  }

  return {
    slugData,
    comparison
  }
})
