# Product Requirements Document (PRD): PayPulse — Interactive CTC vs. Take-Home & Career Comparison Hub

## 1. Document Control & Overview
* **Product Name:** PayPulse
* **Version:** 2.0 (Production-Ready Architecture, UX & Analytics)
* **Author:** Abhijeet Rawat
* **Consulting Perspectives:** Senior Product Designer, Product Analyst & Senior Software Engineer (10+ YOE)
* **Target Stack:** Nuxt 4 (Vue 3 Composition API, TypeScript, Nitro Server), Tailwind CSS, Lucide Icons, Zod (Validation), @vueuse/core
* **Architecture Pattern:** Clean Isomorphic MVC-Style Nuxt Architecture:
  * **Model (`shared/types/` & `shared/utils/`):** Pure TypeScript types, financial calculation engines (tax slabs, marginal relief, EPF capping, gratuity, ESOP vesting, disposable income, reverse CTC engine), and curated city baseline data. Zero DOM/Vue dependencies, shared seamlessly across server and client.
  * **Controller (`server/api/` & `app/composables/`):** Zod-validated server endpoints for API consumers/crawlers, and client reactive state controllers (`useCalculator.ts`, `useComparison.ts`) syncing URL query state and 60fps sliders.
  * **View (`app/pages/` & `app/components/`):** Pure presentation components, smart suffix-parsing inputs, accessible range sliders, sticky mobile bottom sheet, lightweight SVG/CSS stacked distribution visualizer, and SSR SEO comparison views.
* **Hosting Target:** Vercel / Netlify / Cloudflare Pages (Edge SSR)

---

## 2. Problem Statement & Opportunity
In the Indian tech and corporate ecosystem, headline Cost-to-Company (CTC) is notoriously misleading. Offers are heavily inflated by:
1. **Withheld benefits:** Gratuity (~4.81% of basic pay) which employees never receive monthly.
2. **Paper wealth / non-cash components:** Multi-year ESOPs/RSUs vesting over 4 years bundled into annual CTC.
3. **One-time compensation:** First-year joining/retention bonuses that disappear in year two.
4. **Tax illusions:** Complex tax slabs, surcharge thresholds (>₹50L), and Section 87A marginal relief cliffs.

Furthermore, when evaluating multiple job offers or relocating across cities (e.g., ₹12 LPA in Bengaluru vs. ₹9.5 LPA in Lucknow or Jaipur), job seekers lack an ad-free, private, side-by-side comparison tool that calculates both statutory take-home pay and realistic disposable income after rent.

Additionally, active job seekers lack an intuitive **"Reverse Calculator"** to determine what exact CTC to quote HR during salary negotiations when aiming for a target monthly in-hand savings goal.

**Goal:** Build a blazing-fast, ad-free, 100% private, SSR-first Nuxt application that provides instant CTC-to-take-home breakdowns, reverse CTC negotiation calculation, offer de-jargonizing, dual-offer city comparisons, dynamic programmatic SEO routes, and one-click viral share cards tailored for LinkedIn and X.

---

## 3. Target Audience & Personas
1. **The Offer Evaluator (Primary):** Freshers and early-to-mid career professionals (0–5 years) comparing multiple offer letters with varying components (ESOPs, joining bonuses, variable pay).
2. **The Active Salary Negotiator:** Candidates interviewing with HR who need to quickly determine the exact CTC required for a target in-hand monthly take-home.
3. **The City Relocator:** Software engineers weighing Tier-1 relocation offers against Tier-2 remote/hybrid salaries.
4. **The Tech Leader & Recruiter (Growth / Social):** Hiring managers, recruiters, and HR professionals sharing transparent salary benchmarks on LinkedIn.

---

## 4. Financial Calculation Engine Specification (Model Layer)

The calculation engine is located in `shared/utils/salaryModel.ts` and operates in deterministic integer rupees.

### 4.1 Income Tax Regimes (FY 2025–26 Baseline)
* **Default: New Tax Regime (Budget 2024 / FY 2025–26 Revision):**
  * **Standard Deduction:** ₹75,000 for salaried employees.
  * **Section 87A Rebate & Marginal Relief:**
    * Full tax rebate for taxable income up to ₹7,00,000 (effective tax-free salary up to ₹7,75,000 with standard deduction).
    * Exact Marginal Relief implemented: For taxable income marginally exceeding ₹7,00,000, tax liability is capped at the income exceeding ₹7,00,000.
  * **Tax Slabs:**
    * Up to ₹3,00,000: Nil
    * ₹3,00,001 to ₹7,00,000: 5%
    * ₹7,00,001 to ₹10,00,000: 10%
    * ₹10,00,001 to ₹12,00,000: 15%
    * ₹12,00,001 to ₹15,00,000: 20%
    * Above ₹15,00,000: 30%
  * **Surcharges for High Earners (New Regime):**
    * > ₹50,00,000 to ₹1,00,00,000: 10% surcharge on tax.
    * > ₹1,00,00,000 to ₹2,00,00,000: 15% surcharge on tax.
    * > ₹2,00,00,000: 25% surcharge on tax.
  * **Health & Education Cess:** 4% on calculated tax + surcharge.

* **Optional: Old Tax Regime:**
  * **Standard Deduction:** ₹50,000.
  * **Standard Allowances & Deductions (Streamlined inputs):**
    * Section 80C: User adjustable up to ₹1,50,000 (default ₹1,50,000 when toggled).
    * Section 80D: Preset health insurance deduction (default ₹25,000).
    * HRA Exemption: Computed dynamically based on Basic Pay, Metro status (50% vs 40%), and estimated rent.
  * **Old Regime Slabs:**
    * Up to ₹2,50,000: Nil
    * ₹2,50,001 to ₹5,00,000: 5% (Section 87A rebate applies up to ₹5,00,000 taxable income)
    * ₹5,00,001 to ₹10,00,000: 20%
    * Above ₹10,00,000: 30%
  * **Cess:** 4% on tax liability.

### 4.2 Provident Fund (EPF) Rules
* **Basic Pay:** User-configurable slider from 30% to 60% of CTC (default 50%).
* **Employee EPF:** 12% of Basic Pay.
  * *EPF Capping Setting:* Toggle between **Uncapped 12% of Basic** (standard for tech startups & MNCs) vs **Statutory Cap of ₹1,800/month** (₹21,600/year, standard in manufacturing & legacy corporate).
* **Employer EPF:** 12% of Basic Pay. Toggleable:
  * *Option A (Standard Corporate Practice):* Deducted from headline CTC.
  * *Option B:* Provided over and above CTC.

### 4.3 Offer De-Jargonizer: Gratuity, ESOPs & Joining Bonus
* **Gratuity Deduction (4.81% of Basic Pay):**
  * When enabled in Advanced Mode, deducts statutory gratuity provision (~₹basic × 15/26/12) from monthly CTC, showing users why their monthly payout is lower than CTC / 12.
* **ESOP / Stock Component (4-Year Vesting Amortization):**
  * Allows users to input total stock grant. Displays monthly cash in-hand separately from non-cash equity compensation.
* **One-Time Joining Bonus:**
  * Separates Year-1 one-time cash from ongoing recurring monthly take-home pay.

### 4.4 Target In-Hand (Reverse Calculator Engine)
* Solves the inverse function:
  $$CTC = f^{-1}(\text{Target In-Hand})$$
  Given a desired net monthly take-home pay (e.g. ₹1,00,000/mo), computes the exact minimum annual CTC to quote HR under the chosen regime and city assumptions.

### 4.5 City Cost of Living & Disposable Income Engine
Maintained in `shared/utils/presetsModel.ts`:
* **Tier-1 Tech Hubs:**
  * **Bengaluru:** Median 1BHK rent ~₹18,000/mo, living baseline ~₹14,000/mo. Metro HRA: 50%.
  * **Mumbai:** Median 1BHK rent ~₹28,000/mo, living baseline ~₹16,000/mo. Metro HRA: 50%.
  * **Delhi NCR (Gurugram/Noida):** Median 1BHK rent ~₹17,000/mo, living baseline ~₹13,000/mo. Metro HRA: 50%.
  * **Pune:** Median 1BHK rent ~₹14,000/mo, living baseline ~₹12,000/mo. Non-Metro HRA: 40%.
  * **Hyderabad:** Median 1BHK rent ~₹13,500/mo, living baseline ~₹11,500/mo. Non-Metro HRA: 40%.
* **Tier-2 Emerging Tech Cities:**
  * **Lucknow:** Median 1BHK rent ~₹8,000/mo, living baseline ~₹7,500/mo. Non-Metro HRA: 40%.
  * **Jaipur:** Median 1BHK rent ~₹8,500/mo, living baseline ~₹8,000/mo. Non-Metro HRA: 40%.
  * **Indore:** Median 1BHK rent ~₹7,500/mo, living baseline ~₹7,000/mo. Non-Metro HRA: 40%.
* **Estimated Disposable Income:**
  $$\text{Monthly Disposable Income} = \text{Monthly Take-Home} - (\text{Median City Rent} + \text{Baseline Living Cost})$$

---

## 5. User Experience & Production Design Specifications

### 5.1 Smart Dual-Unit Input with Instant Suffix Parsing
* Accepts standard user inputs naturally:
  * Typing `12.5` or `12.5L` ➔ Parses instantaneously to `₹12,50,000`.
  * Typing `1250000` ➔ Formats dynamically with Indian commas `₹ 12,50,000`.
  * Typing `85k` ➔ Interpreted as ₹85,000/month or ₹10.2 LPA depending on active mode.
* Includes a real-time badge: `₹12.50 Lakhs / yr` and a 1-click **Per Month / Per Year** view toggle.

### 5.2 Mode Selector: Forward Calculator vs Target In-Hand Reverse Mode
* Clean toggle tab on the calculator header:
  * **Tab 1: Calculate Take-Home (Forward)**
  * **Tab 2: Target In-Hand (Reverse Negotiation)**
* Instant transition: switching to Reverse Mode keeps the user's active tax regime and city selections intact.

### 5.3 Mobile Ergonomics: Sticky Real-Time Bottom Sheet
* On screens $<768\text{px}$:
  * As the user interacts with sliders, a sleek persistent bottom bar displays:
    **"Net In-Hand: ₹84,200/mo · Tap for breakdown ↑"**
  * Tapping or swiping up smoothly transitions to a modal bottom sheet displaying the itemized deductions, visual distribution bar, and sharing controls.
  * Eliminates the severe mobile frustration of having to scroll down to view results.

### 5.4 Dual-Tier Input: Quick Mode vs Offer De-Jargonizer
* **Quick Mode (Default):** CTC input, quick milestone chips (`3.5L`, `6L`, `10L`, `15L`, `25L`, `40L`), Tax Regime, and City. Zero clutter, under 10 seconds to get the answer.
* **Advanced / De-Jargonizer Mode (Expandable Accordion):**
  * Gratuity toggle (4.81% of basic).
  * 4-Year ESOP grant amount.
  * 1st-Year Joining Bonus.
  * EPF capping (Uncapped vs ₹1,800/mo cap).
  * Custom Basic Pay % (30% to 60%).

### 5.5 High-Virality Social Sharing Kit
* **1-Click LinkedIn / X Markdown Snippet:**
  ```text
  Offer Comparison Breakdown via PayPulse:
  🔹 Offer A: ₹12 LPA (Bengaluru) ➔ In-Hand: ₹84,200/mo | Disposable: ~₹52,200/mo
  🔹 Offer B: ₹9 LPA (Lucknow) ➔ In-Hand: ₹67,100/mo | Disposable: ~₹51,600/mo
  💡 Net savings gap is only ₹600/mo despite ₹3 LPA CTC difference!
  Calculate yours: https://paypulse.in/compare/bengaluru-vs-lucknow-6lpa
  ```
* **Dynamic OpenGraph Meta Card (`/api/og`):**
  * Generates high-contrast dynamic SVG preview cards for social embeds.
* **Download Summary Card as PNG:**
  * Clean branded canvas card export ready for LinkedIn or Instagram stories.

---

## 6. Privacy, Trust & Analytics Architecture

### 6.1 Zero-PII & Client-Side Privacy Guarantee
* Salary data is sensitive. The application operates with a prominent trust badge:
  **"🔒 100% Private & Client-Calculated. We never store, transmit, or sell your salary numbers."**
* Calculations happen isomorphically in memory. No database writes for calculation inputs.

### 6.2 Anonymized Range Telemetry (Product Analytics)
To evaluate product health and conversion drop-offs without invading user privacy:
* Event triggers:
  * `calculate_completed`: Records anonymized bracket (`<5 LPA`, `5-10 LPA`, `10-20 LPA`, `20-50 LPA`, `>50 LPA`), tax regime, and city.
  * `reverse_mode_used`: Tracks target in-hand bracket.
  * `dejargonizer_expanded`: Measures interest in advanced offer breakdown.
  * `comparison_mode_toggled`: Records city pair compared (e.g. `BLR_vs_LKO`).
  * `social_share_clicked`: Tracks `copy_link`, `copy_linkedin`, or `download_png`.

---

## 7. Technical Architecture (Nuxt MVC Mapping)

```text
paypulse/
├── shared/
│   ├── types/
│   │   ├── compensation.ts        # Input DTOs, Output DTOs, DeJargonizer types
│   │   ├── comparison.ts          # Comparison schemas & Slug definitions
│   │   └── analytics.ts           # Anonymized telemetry event types
│   └── utils/
│       ├── salaryModel.ts         # Pure engine: Forward tax, marginal relief, surcharges
│       ├── reverseSalaryModel.ts  # Inverse engine: Target in-hand to required CTC
│       ├── presetsModel.ts        # City rental indices, curated slugs & dynamic parser
│       └── formatting.ts          # Suffix parser ('12.5L' -> 1250000) & Indian currency
├── server/
│   ├── api/
│   │   ├── calculate.post.ts      # Validates input with Zod and computes breakdown
│   │   ├── reverse.post.ts        # Validates target in-hand and computes required CTC
│   │   ├── comparisons/
│   │   │   └── [slug].get.ts      # Resolves curated or dynamic comparison slug
│   │   └── og.get.ts              # Generates dynamic SVG/OG card for social sharing
├── app/
│   ├── composables/
│   │   ├── useCalculator.ts       # Reactive client controller: state, sync with URL
│   │   ├── useReverseCalculator.ts# Target in-hand controller
│   │   ├── useComparison.ts       # Multi-offer state manager & delta calculations
│   │   └── useAnalytics.ts        # Zero-PII anonymized event logger
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader.vue      # Clean header with privacy badge
│   │   │   └── AppFooter.vue      # Disclaimer and GitHub/portfolio links
│   │   ├── calculator/
│   │   │   ├── SmartCurrencyInput.vue # Suffix-parsing input with '12.5L' support
│   │   │   ├── CalculatorForm.vue # Input sliders, chips, toggles, de-jargonizer
│   │   │   ├── ReverseCalculatorForm.vue # Desired in-hand to CTC negotiator
│   │   │   ├── BreakdownSummary.vue # Monthly/annual cards & take-home hero
│   │   │   ├── MobileStickyBar.vue# Sticky bottom bar & drawer for mobile
│   │   │   └── StackedBarChart.vue # Pure SVG/CSS responsive distribution visualizer
│   │   ├── comparison/
│   │   │   ├── ComparisonTable.vue# Side-by-side Offer A vs Offer B matrix
│   │   │   └── CityInsightCard.vue# Cost-of-living & disposable income card
│   │   └── share/
│   │       ├── ShareModal.vue     # Copy link, LinkedIn copy snippet, PNG exporter
│   │       └── QuickPresets.vue   # Milestone chips & popular comparison links
│   ├── pages/
│   │   ├── index.vue              # Main calculator & comparison view
│   │   └── compare/
│   │       └── [slug].vue         # SSR Programmatic SEO comparison page
│   └── app.vue
├── nuxt.config.ts                 # Nuxt 4 configuration, Tailwind, SEO modules
└── tailwind.config.ts
```

---

## 8. Non-Functional Requirements & Performance
* **Speed:** Lighthouse Performance score $\ge 95$; First Contentful Paint (FCP) $< 0.8\text{s}$; cumulative layout shift (CLS) $= 0$.
* **SEO:** Lighthouse SEO score $= 100$; Schema.org `FinancialProduct` & `FAQPage` JSON-LD structured data on all `/compare/[slug]` routes.
* **Accessibility:** WCAG AA compliant. All inputs have associated labels, sliders are keyboard controllable via arrow keys, contrast ratios $\ge 4.5:1$.
* **Bundle Efficiency:** Zero heavyweight charting libraries; pure SVG/CSS components for maximum speed and zero hydration overhead.
* **Disclaimer:** Persistent, prominent advisory: *"PayPulse estimates are intended for career planning and educational purposes. Actual payslips may vary based on company policies, gratuity rules, and individual tax declarations."*

---

## 9. Antigravity Implementation Milestones & Acceptance Criteria

### Milestone 1: Project Scaffold & Pure Isomorphic Model
* Initialize Nuxt project with TypeScript and Tailwind CSS.
* Implement `shared/types/compensation.ts` and `shared/utils/salaryModel.ts`:
  * FY 2025-26 New Regime with ₹75k std deduction and exact Section 87A Marginal Relief.
  * Surcharges (10%, 15%, 25%) for high earners (>₹50L, >₹1Cr, >₹2Cr).
  * EPF capping (Uncapped 12% vs ₹1,800/mo cap).
  * Gratuity provision (4.81% of basic), ESOP vesting, and joining bonus.
* Implement `shared/utils/reverseSalaryModel.ts` (Target in-hand to required CTC).
* Implement `shared/utils/presetsModel.ts` (City COL data and dynamic slug parser).
* Implement `shared/utils/formatting.ts` (Smart suffix parser e.g. `12.5L` -> `1250000`).
* **Acceptance Criteria:** 100% passing Vitest test suite covering edge cases:
  * Rebate threshold ₹7.0L and marginal relief at ₹7.05L.
  * Surcharge test at ₹60 LPA and ₹1.2 Cr.
  * Capped vs Uncapped EPF difference.
  * Reverse calculation convergence within ₹1 rupee.

### Milestone 2: Server API & Controllers
* Build `server/api/calculate.post.ts` and `server/api/reverse.post.ts` with Zod validation.
* Build `server/api/comparisons/[slug].get.ts` handling both curated slugs and dynamic pattern slugs.
* Build `server/api/og.get.ts` for dynamic SVG social previews.
* **Acceptance Criteria:** API returns expected JSON responses, rejects invalid ranges with descriptive 400 errors, and resolves dynamic slugs gracefully.

### Milestone 3: Interactive Calculator View & Mobile Sticky Drawer
* Build `app/composables/useCalculator.ts` with reactive state and bidirectional URL query sync.
* Build `SmartCurrencyInput.vue` (handles `12.5`, `12.5L`, `1250000`).
* Build `CalculatorForm.vue`, `ReverseCalculatorForm.vue`, `BreakdownSummary.vue`, and lightweight `StackedBarChart.vue`.
* Build `MobileStickyBar.vue` with smooth sheet expansion on mobile viewports.
* **Acceptance Criteria:** Dragging sliders updates numbers in real-time at 60fps; typing `12.5L` immediately parses to ₹12,50,000; mobile sticky bar updates live without layout shift.

### Milestone 4: Dual-Offer Comparison & Programmatic SEO Pages
* Build `ComparisonTable.vue` and `CityInsightCard.vue`.
* Implement `app/pages/compare/[slug].vue` with full SSR hydration, dynamic meta tags (`useSeoMeta`), and FAQ accordion.
* Add "Customize These Numbers" flow linking directly to the main calculator.
* **Acceptance Criteria:** `curl` inspection of `/compare/6lpa-vs-8lpa` returns complete SSR HTML with title, meta tags, and rendered comparison table.

### Milestone 5: Virality Kit, Verification & Launch
* Build `ShareModal.vue` with 1-click formatted LinkedIn/X text snippet and PNG summary download.
* Verify Lighthouse score $\ge 95$ across Desktop and Mobile.
* Prepare comprehensive `README.md` with architectural diagrams highlighting clean Nuxt MVC principles.
