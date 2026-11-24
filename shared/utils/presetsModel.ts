import type { CityInfo, CityKey } from '../types/compensation'
import type { ComparisonSlugData } from '../types/comparison'

export const CITIES: Record<CityKey, CityInfo> = {
  bengaluru: {
    key: 'bengaluru',
    name: 'Bengaluru',
    tier: 'tier-1',
    isMetroHra: true,
    medianRent1BHK: 18000,
    baselineLivingCost: 14000,
    professionalTaxAnnual: 2400, // Karnataka: ₹200/mo
    description: 'India\'s Silicon Valley with prime tech opportunities, but higher median rents in tech corridors (Whitefield, HSR, Bellandur).'
  },
  mumbai: {
    key: 'mumbai',
    name: 'Mumbai',
    tier: 'tier-1',
    isMetroHra: true,
    medianRent1BHK: 28000,
    baselineLivingCost: 16000,
    professionalTaxAnnual: 2500, // Maharashtra: ₹200 for 11 months + ₹300 in Feb
    description: 'Financial capital with top compensation packages, balanced by the highest real estate & rental costs in India.'
  },
  'delhi-ncr': {
    key: 'delhi-ncr',
    name: 'Delhi NCR (Gurugram / Noida)',
    tier: 'tier-1',
    isMetroHra: true,
    medianRent1BHK: 17000,
    baselineLivingCost: 13000,
    professionalTaxAnnual: 0, // Delhi has NO Professional Tax
    description: 'Major corporate & startup ecosystem across Cyber City and Expressway sectors, with moderate-to-high living expenses.'
  },
  pune: {
    key: 'pune',
    name: 'Pune',
    tier: 'tier-1',
    isMetroHra: false,
    medianRent1BHK: 14000,
    baselineLivingCost: 12000,
    professionalTaxAnnual: 2500, // Maharashtra: ₹2,500/yr
    description: 'High concentration of IT campuses (Hinjawadi, Kharadi) with relatively affordable rental markets compared to Mumbai/Bengaluru.'
  },
  hyderabad: {
    key: 'hyderabad',
    name: 'Hyderabad',
    tier: 'tier-1',
    isMetroHra: false,
    medianRent1BHK: 13500,
    baselineLivingCost: 11500,
    professionalTaxAnnual: 2400, // Telangana: ₹200/mo
    description: 'Fast-growing tech powerhouse (HITEC City, Gachibowli) known for excellent infrastructure and strong purchasing power.'
  },
  lucknow: {
    key: 'lucknow',
    name: 'Lucknow',
    tier: 'tier-2',
    isMetroHra: false,
    medianRent1BHK: 8000,
    baselineLivingCost: 7500,
    professionalTaxAnnual: 2400, // Uttar Pradesh: ₹200/mo
    description: 'Prominent Tier-2 capital with booming remote/hybrid culture, offering ~60% lower living costs than Bengaluru.'
  },
  jaipur: {
    key: 'jaipur',
    name: 'Jaipur',
    tier: 'tier-2',
    isMetroHra: false,
    medianRent1BHK: 8500,
    baselineLivingCost: 8000,
    professionalTaxAnnual: 0, // Rajasthan has NO Professional Tax on salaried employees
    description: 'Rapidly emerging tech and startup destination in North India with very competitive residential costs.'
  },
  indore: {
    key: 'indore',
    name: 'Indore',
    tier: 'tier-2',
    isMetroHra: false,
    medianRent1BHK: 7500,
    baselineLivingCost: 7000,
    professionalTaxAnnual: 2500, // Madhya Pradesh: ₹2,500/yr
    description: 'Cleanest city in India with growing IT hubs (Super Corridor) offering exceptional lifestyle affordability.'
  }
}

export function getCityInfo(key?: string): CityInfo {
  if (key && key in CITIES) {
    return CITIES[key as CityKey]
  }
  return CITIES.bengaluru
}

export const CURATED_COMPARISONS: Record<string, ComparisonSlugData> = {
  '4lpa-vs-6lpa': {
    slug: '4lpa-vs-6lpa',
    isCurated: true,
    title: '₹4 LPA vs. ₹6 LPA In-Hand Salary Comparison',
    headline: '₹4 Lakhs vs ₹6 Lakhs CTC: Real In-Hand Difference',
    description: 'Compare the net monthly take-home salary, income tax rebate under Section 87A, and EPF deductions between ₹4 LPA and ₹6 LPA offers.',
    offerAInputs: { annualCtc: 400000, regime: 'new', city: 'bengaluru' },
    offerBInputs: { annualCtc: 600000, regime: 'new', city: 'bengaluru' },
    faqs: [
      {
        question: 'Do I pay income tax on ₹4 LPA or ₹6 LPA in FY 2025-26?',
        answer: 'Under the New Tax Regime, both ₹4 LPA and ₹6 LPA are completely tax-free thanks to the ₹75,000 Standard Deduction and the Section 87A rebate for income up to ₹7,00,000.'
      },
      {
        question: 'What is the actual monthly in-hand difference between ₹4 LPA and ₹6 LPA?',
        answer: 'You will pocket approximately ₹14,000 to ₹15,000 more every month, with the only deductions being statutory EPF and professional tax.'
      }
    ]
  },
  '6lpa-vs-8lpa': {
    slug: '6lpa-vs-8lpa',
    isCurated: true,
    title: '₹6 LPA vs. ₹8 LPA In-Hand Salary Comparison',
    headline: '₹6 Lakhs vs ₹8 Lakhs CTC: Crossing the Tax-Free Threshold',
    description: 'See what happens to your monthly take-home when stepping from ₹6 LPA into ₹8 LPA, including the first tax bracket under the New Tax Regime.',
    offerAInputs: { annualCtc: 600000, regime: 'new', city: 'bengaluru' },
    offerBInputs: { annualCtc: 800000, regime: 'new', city: 'bengaluru' },
    faqs: [
      {
        question: 'Does ₹8 LPA incur income tax in New Regime?',
        answer: 'With the standard deduction of ₹75,000, taxable income for ₹8 LPA is ₹7,25,000. Marginal relief ensures you do not face a sudden tax cliff.'
      }
    ]
  },
  '8lpa-vs-12lpa': {
    slug: '8lpa-vs-12lpa',
    isCurated: true,
    title: '₹8 LPA vs. ₹12 LPA Salary & Career Jump Breakdown',
    headline: '₹8 Lakhs vs ₹12 Lakhs CTC: The Mid-Level Tech Transition',
    description: 'Detailed analysis of tax brackets, EPF deductions, and net monthly take-home when switching jobs from ₹8 LPA to ₹12 LPA.',
    offerAInputs: { annualCtc: 800000, regime: 'new', city: 'bengaluru' },
    offerBInputs: { annualCtc: 1200000, regime: 'new', city: 'bengaluru' },
    faqs: [
      {
        question: 'How much higher is the monthly in-hand at ₹12 LPA compared to ₹8 LPA?',
        answer: 'The net monthly in-hand jumps by ~₹25,000 to ₹27,000 depending on variable pay and PF choices.'
      }
    ]
  },
  '12lpa-vs-18lpa': {
    slug: '12lpa-vs-18lpa',
    isCurated: true,
    title: '₹12 LPA vs. ₹18 LPA Senior Tech Salary Comparison',
    headline: '₹12 Lakhs vs ₹18 Lakhs CTC: Senior Engineering In-Hand',
    description: 'Compare higher tax slabs (15% to 20%), EPF accumulation, and monthly disposable cash between ₹12 LPA and ₹18 LPA.',
    offerAInputs: { annualCtc: 1200000, regime: 'new', city: 'bengaluru' },
    offerBInputs: { annualCtc: 1800000, regime: 'new', city: 'bengaluru' },
    faqs: [
      {
        question: 'Is Old or New Tax Regime better at ₹18 LPA?',
        answer: 'Unless you have over ₹3.75 Lakhs in combined 80C, 80D, NPS, and large HRA exemptions, the New Tax Regime delivers higher take-home pay at ₹18 LPA.'
      }
    ]
  },
  'bengaluru-vs-lucknow-6lpa': {
    slug: 'bengaluru-vs-lucknow-6lpa',
    isCurated: true,
    title: 'Bengaluru vs. Lucknow at ₹6 LPA: Real Purchasing Power',
    headline: '₹6 LPA in Bengaluru vs Lucknow: Where Do You Save More?',
    description: 'Calculate the real disposable income of earning ₹6 LPA in Bengaluru compared to working remotely or locally in Lucknow with ~60% lower rent.',
    offerAInputs: { annualCtc: 600000, regime: 'new', city: 'bengaluru' },
    offerBInputs: { annualCtc: 600000, regime: 'new', city: 'lucknow' },
    faqs: [
      {
        question: 'Can you save more on ₹6 LPA in Lucknow than Bengaluru?',
        answer: 'Yes. While the in-hand salary is very comparable, the ~₹10,000/month lower rental cost in Lucknow yields significantly higher disposable savings.'
      }
    ]
  },
  'pune-vs-hyderabad-8lpa': {
    slug: 'pune-vs-hyderabad-8lpa',
    isCurated: true,
    title: 'Pune vs. Hyderabad at ₹8 LPA: Tech Hub Showdown',
    headline: 'Pune vs Hyderabad at ₹8 Lakhs CTC: In-Hand & Cost of Living',
    description: 'Side-by-side comparison of tech hubs Pune and Hyderabad for an ₹8 LPA compensation package.',
    offerAInputs: { annualCtc: 800000, regime: 'new', city: 'pune' },
    offerBInputs: { annualCtc: 800000, regime: 'new', city: 'hyderabad' },
    faqs: [
      {
        question: 'How do living costs compare between Pune and Hyderabad?',
        answer: 'Both cities have very comparable rental and dining baselines (~₹25,000/month total living expenses for a single professional), providing similar savings potential.'
      }
    ]
  },
  'mumbai-vs-bengaluru-15lpa': {
    slug: 'mumbai-vs-bengaluru-15lpa',
    isCurated: true,
    title: 'Mumbai vs. Bengaluru at ₹15 LPA: Metro Relocation Analysis',
    headline: '₹15 Lakhs in Mumbai vs Bengaluru: Rent Impact on In-Hand Pay',
    description: 'Examine how Mumbai\'s premium rental market impacts your actual disposable income compared to Bengaluru at ₹15 LPA.',
    offerAInputs: { annualCtc: 1500000, regime: 'new', city: 'mumbai' },
    offerBInputs: { annualCtc: 1500000, regime: 'new', city: 'bengaluru' },
    faqs: [
      {
        question: 'Why is disposable income lower in Mumbai at the same CTC?',
        answer: 'Median 1BHK rent in central/western Mumbai (~₹28,000/mo) is approximately ₹10,000/mo higher than comparable IT corridors in Bengaluru.'
      }
    ]
  }
}

export function parseComparisonSlug(slug: string): ComparisonSlugData | null {
  const normalized = slug.trim().toLowerCase()

  if (normalized in CURATED_COMPARISONS) {
    return CURATED_COMPARISONS[normalized]
  }

  const ctcMatch = normalized.match(/^(\d+(?:\.\d+)?)(?:lpa)?-vs-(\d+(?:\.\d+)?)(?:lpa)?$/)
  if (ctcMatch) {
    const ctc1 = parseFloat(ctcMatch[1]) * 100000
    const ctc2 = parseFloat(ctcMatch[2]) * 100000
    if (ctc1 > 0 && ctc2 > 0) {
      return {
        slug: normalized,
        isCurated: false,
        title: `₹${ctcMatch[1]} LPA vs. ₹${ctcMatch[2]} LPA Salary Comparison`,
        headline: `₹${ctcMatch[1]} LPA vs. ₹${ctcMatch[2]} LPA In-Hand Pay Breakdown`,
        description: `Compare monthly take-home, income tax, and EPF deductions between ₹${ctcMatch[1]} LPA and ₹${ctcMatch[2]} LPA under Indian tax rules.`,
        offerAInputs: { annualCtc: ctc1, regime: 'new', city: 'bengaluru' },
        offerBInputs: { annualCtc: ctc2, regime: 'new', city: 'bengaluru' },
        faqs: [
          {
            question: `What is the monthly in-hand difference between ₹${ctcMatch[1]} LPA and ₹${ctcMatch[2]} LPA?`,
            answer: 'PayPulse calculates the exact net in-hand difference after statutory EPF, taxes, and cess.'
          }
        ]
      }
    }
  }

  const cityMatch = normalized.match(/^([a-z\-]+)-vs-([a-z\-]+)-(\d+(?:\.\d+)?)(?:lpa)?$/)
  if (cityMatch) {
    const city1Key = cityMatch[1] as CityKey
    const city2Key = cityMatch[2] as CityKey
    const ctc = parseFloat(cityMatch[3]) * 100000

    if (city1Key in CITIES && city2Key in CITIES && ctc > 0) {
      const city1 = CITIES[city1Key]
      const city2 = CITIES[city2Key]
      return {
        slug: normalized,
        isCurated: false,
        title: `${city1.name} vs. ${city2.name} at ₹${cityMatch[3]} LPA: Purchasing Power Comparison`,
        headline: `Living in ${city1.name} vs. ${city2.name} at ₹${cityMatch[3]} Lakhs CTC`,
        description: `Compare living costs, median rent, and disposable savings between ${city1.name} and ${city2.name} for an ₹${cityMatch[3]} LPA offer.`,
        offerAInputs: { annualCtc: ctc, regime: 'new', city: city1Key },
        offerBInputs: { annualCtc: ctc, regime: 'new', city: city2Key },
        faqs: [
          {
            question: `Which city offers higher savings between ${city1.name} and ${city2.name}?`,
            answer: `Based on median 1BHK rent (${city1.name}: ₹${city1.medianRent1BHK.toLocaleString('en-IN')}/mo vs ${city2.name}: ₹${city2.medianRent1BHK.toLocaleString('en-IN')}/mo), PayPulse shows your true disposable income.`
          }
        ]
      }
    }
  }

  return null
}
