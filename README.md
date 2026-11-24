# ⚡ PayPulse — Interactive CTC vs. Take-Home & Career Comparison Hub

> **Production-grade, ad-free, 100% private** salary calculator and career offer comparison platform built with **Nuxt 4**, **TypeScript**, **Tailwind CSS**, and **Zod**.

[![Tests](https://img.shields.io/badge/Vitest-30%2F30%20Passing-emerald)](file:///tests)
[![Nuxt](https://img.shields.io/badge/Nuxt-4%20Compat-00DC82)](https://nuxt.com)
[![Tax Year](https://img.shields.io/badge/Union%20Budget-FY%202025--26-blue)](https://incometax.gov.in)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-green)](#privacy--trust)

---

## 🌟 Why PayPulse?

In India's tech ecosystem, headline **Cost-to-Company (CTC)** figures are notoriously misleading. Offers are inflated with:
* **Withheld Benefits:** Gratuity (~4.81% of basic pay) which employees never see monthly.
* **Paper Wealth:** 4-Year ESOPs bundled into Year-1 CTC.
* **One-Time Cash:** Joining bonuses that disappear after year one.
* **Tax Illusions:** Complex tax slabs, surcharge cliffs (>₹50L), and Section 87A marginal relief.

**PayPulse** provides instant, transparent CTC-to-Take-Home breakdowns, solves the reverse negotiation problem (*"I want ₹1L in hand, what CTC should I ask HR?"*), and provides side-by-side city purchasing power comparisons.

---

## 🚀 Key Features

### 1. ⚡ Interactive CTC-to-Take-Home Calculator
* **Smart Suffix Currency Input:** Type `12.5`, `12.5L`, `85k`, or `12,50,000` with 0ms live parsing.
* **FY 2025–26 Tax Slabs:** Includes the revised ₹75,000 standard deduction, Section 87A rebate for taxable income up to ₹7,00,000, and exact Section 87A Marginal Relief.
* **Zero-Dependency SVG Visualizer:** Lightweight, responsive horizontal stacked distribution bar showing Net In-Hand, Taxes, EPF, and Variable Bonus.
* **Offer De-Jargonizer Mode:** Deduct statutory gratuity provisions (4.81%), amortize 4-year ESOP grants, and isolate 1st-year joining bonuses.
* **EPF Capping Toggle:** Seamlessly switch between Uncapped 12% (tech standard) and statutory ₹1,800/month cap (traditional corporate standard).

### 2. 🎯 Target In-Hand (Reverse Calculator)
* Input your desired monthly bank credit (e.g., `₹1,00,000 / month`).
* Solves the inverse tax equation using monotonic binary search (<1ms) to compute the **Minimum CTC to quote HR**.

### 3. ⚖️ Side-by-Side Offer & City Comparison
* Compare two offers (Offer A vs. Offer B) across different CTCs, variable pay %, and cities.
* Computes **Estimated Monthly Disposable Income after Rent** using curated median 1BHK rent baselines across 8 Indian tech hubs (Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Lucknow, Jaipur, Indore).

### 4. 🌐 Programmatic SEO Routes (`/compare/[slug]`)
* Curated high-intent comparison pages (e.g., `/compare/4lpa-vs-6lpa`, `/compare/bengaluru-vs-lucknow-6lpa`).
* Dynamic slug parser resolving arbitrary comparisons on the fly with zero database requirement.
* Schema.org `FAQPage` and `FinancialProduct` JSON-LD structured data.

### 5. 📱 Mobile-First Ergonomics
* Sleek persistent bottom bar for mobile screens ($<768\text{px}$) showing live take-home pay, expandable into a swipeable breakdown drawer.

### 6. 📤 Virality & Sharing Kit
* Dynamic OpenGraph SVG cards (`/api/og`).
* 1-Click formatted LinkedIn / X markdown post snippet.
* Client-side canvas PNG summary exporter.

---

## 🏛️ Clean Isomorphic MVC Architecture

PayPulse implements a strict Model-View-Controller pattern optimized for Nuxt 4:

```text
paypulse/
├── shared/
│   ├── types/                     # Model Contracts & DTOs
│   │   ├── compensation.ts
│   │   ├── comparison.ts
│   │   └── analytics.ts
│   └── utils/                     # Pure Isomorphic Model Engines (0ms Client & Server)
│       ├── salaryModel.ts         # Forward tax slabs, marginal relief, EPF capping
│       ├── reverseSalaryModel.ts  # Binary search inverse CTC solver
│       ├── presetsModel.ts        # City rental indices & dynamic slug parser
│       └── formatting.ts          # Suffix parser & Indian numbering
├── server/
│   └── api/                       # Server Controllers (Validated with Zod)
│       ├── calculate.post.ts      # Forward calculation endpoint
│       ├── reverse.post.ts        # Reverse target in-hand endpoint
│       ├── comparisons/[slug].get.ts # Curated & dynamic comparison resolver
│       └── og.get.ts              # Dynamic SVG OpenGraph generator
├── app/
│   ├── composables/               # Client Controllers (Reactive State & URL Sync)
│   │   ├── useCalculator.ts
│   │   ├── useReverseCalculator.ts
│   │   └── useComparison.ts
│   ├── components/                # Presentation Views
│   │   ├── calculator/            # SmartCurrencyInput, CalculatorForm, StackedBarChart...
│   │   ├── comparison/            # ComparisonTable
│   │   └── share/                 # ShareModal
│   └── pages/                     # SSR Routes
│       ├── index.vue              # Main 3-mode calculator & comparison hub
│       └── compare/[slug].vue     # Programmatic SSR SEO comparison template
└── tests/                         # Vitest Unit & Integration Suites
```

---

## 🧪 Financial Verification Test Matrix

All test cases are verified via automated Vitest suites:

| Test Case | Scenario / Inputs | Expected Output | Status |
|---|---|---|---|
| **Fresher 87A Rebate** | CTC ₹6,00,000, New Regime | Taxable: ₹5.25L · Income Tax: ₹0 | ✅ Verified |
| **Marginal Relief Cliff** | Taxable Income: ₹7,05,000 | Tax capped at ₹5,000 + Cess = ₹5,200 | ✅ Verified |
| **High Earner Surcharge** | CTC ₹60 LPA / ₹1.2 Cr | 10% / 15% surcharge before Cess | ✅ Verified |
| **Statutory EPF Cap** | CTC ₹15 LPA, Cap ON | PF = ₹1,800/mo (₹21,600/yr) vs ₹90,000 | ✅ Verified |
| **De-Jargonizer Gratuity** | CTC ₹12 LPA, Gratuity ON | Withheld gratuity isolated from monthly cash | ✅ Verified |
| **Reverse In-Hand Solver** | Target: ₹1,00,000/mo | Converges to required CTC within ₹1 | ✅ Verified |

---

## 🛠️ Quickstart & Local Development

### Prerequisites
* Node.js $\ge 18.x$ (Tested on Node v24)
* npm $\ge 10.x$

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Run unit & integration test suites
npm test

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build & Preview
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔒 Privacy & Trust
PayPulse is **100% Client-Side & Private**. We do not collect, transmit, or store user salary numbers. Telemetry records only anonymized salary brackets (e.g. `6-10 LPA`) without personal identifiers.
