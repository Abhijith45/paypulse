# PayPulse — Engineering & Implementation Development Plan (v2.0)

This document outlines the step-by-step engineering execution plan for **PayPulse**, mapping directly to the production-grade specifications in [PRD v2.0](file:///c:/Users/Abhijeet%20Rawat/Desktop/PayPulse/docs/product_requirements_document.md).

---

## 1. Architectural Strategy: The Isomorphic MVC Pattern

PayPulse adopts a Clean Isomorphic MVC pattern in Nuxt 4:

```mermaid
flowchart TD
    subgraph Model ["Model Layer (Pure TypeScript & Logic in shared/)"]
        Types["shared/types/compensation.ts<br/>shared/types/comparison.ts<br/>shared/types/analytics.ts"]
        ForwardEngine["shared/utils/salaryModel.ts<br/>(FY 2025-26 Tax Slabs, 87A Marginal Relief, Surcharges, Gratuity, EPF Capping)"]
        ReverseEngine["shared/utils/reverseSalaryModel.ts<br/>(Target In-Hand ➔ Required CTC Solver)"]
        Presets["shared/utils/presetsModel.ts<br/>(City COL Indices & Dynamic Slug Parser)"]
        Formatting["shared/utils/formatting.ts<br/>(Smart Suffix Parser: '12.5L' ➔ 1250000)"]
    end

    subgraph Controller ["Controller Layer"]
        ServerAPI["server/api/calculate.post.ts<br/>server/api/reverse.post.ts<br/>server/api/comparisons/[slug].get.ts<br/>server/api/og.get.ts"]
        ClientComposables["app/composables/useCalculator.ts<br/>app/composables/useReverseCalculator.ts<br/>app/composables/useComparison.ts<br/>app/composables/useAnalytics.ts"]
    end

    subgraph View ["View Layer (Nuxt 4 / Vue 3)"]
        HomeView["app/pages/index.vue<br/>(Forward & Reverse Hub)"]
        SEOView["app/pages/compare/[slug].vue<br/>(SSR Comparison Page)"]
        Components["app/components/<br/>(SmartCurrencyInput, CalculatorForm, ReverseCalculatorForm, StackedBarChart, ComparisonTable, MobileStickyBar)"]
    end

    Model -->|Isomorphic Client Import (0ms latency)| ClientComposables
    Model -->|Server Import for API/SSR| ServerAPI
    ClientComposables --> HomeView
    ServerAPI --> SEOView
    HomeView --> Components
    SEOView --> Components
```

---

## 2. Phased Implementation Roadmap

### Phase 1: Project Scaffolding & Pure Isomorphic Model Engine
**Objective:** Establish the Nuxt 4 workspace and implement pure mathematical and parsing logic with 100% test coverage.

- [x] **Task 1.1:** Initialize Nuxt project with TypeScript, Tailwind CSS, Lucide icons, `@vueuse/core`, and `zod`.
  - Configure `nuxt.config.ts` with Tailwind, SEO headers, and SSR.
- [x] **Task 1.2:** Define shared TypeScript interfaces:
  - `shared/types/compensation.ts` (`SalaryInputDTO`, `SalaryBreakdownDTO`, `DeJargonizerOptions`, `ReverseSalaryInputDTO`, `ReverseSalaryOutputDTO`, `TaxRegime`, `CityInfo`).
  - `shared/types/comparison.ts` (`ComparisonSlugData`, `OfferComparisonDTO`).
  - `shared/types/analytics.ts` (`TelemetryEvent`, `SalaryBracket`).
- [x] **Task 1.3:** Implement smart input parser & currency formatting (`shared/utils/formatting.ts`):
  - Parse suffix inputs (`12.5`, `12.5L`, `12.5 LPA`, `85k`, `1250000`) into integer rupees.
  - Indian Lakhs/Crores display formatting (`₹12.50 Lakhs`, `₹12,50,000`).
- [x] **Task 1.4:** Implement forward calculation engine (`shared/utils/salaryModel.ts`):
  - FY 2025–26 New Regime with ₹75k standard deduction.
  - Exact Section 87A Marginal Relief formula:
    $$\text{If } 7,00,000 < \text{Taxable Income} \le 7,27,777: \text{Tax} = \min(\text{Slab Tax}, \text{Taxable Income} - 7,00,000)$$
  - High-earner surcharges (10% > ₹50L, 15% > ₹1Cr, 25% > ₹2Cr) + 4% Cess.
  - EPF statutory capping toggle (Uncapped 12% vs ₹1,800/month cap).
  - De-Jargonizer: Gratuity deduction (4.81% of basic), 4-year ESOP amortization, and one-time joining bonus separation.
  - Old Tax Regime (₹50k standard deduction, 80C up to ₹1.5L, 80D, HRA exemption).
- [x] **Task 1.5:** Implement reverse calculation engine (`shared/utils/reverseSalaryModel.ts`):
  - Inverse solver using binary search / numerical convergence to find exact CTC for target in-hand monthly pay.
- [x] **Task 1.6:** Implement city indices & dynamic slug parser (`shared/utils/presetsModel.ts`):
  - Curated median 1BHK rent and baseline living expenses for Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, Lucknow, Jaipur, Indore.
  - Dynamic slug parser matching `[ctc1]lpa-vs-[ctc2]lpa` and `[city1]-vs-[city2]-[ctc]lpa`.
- [x] **Task 1.7:** Comprehensive Vitest Unit Tests:
  - Verify edge cases: ₹3.5L, ₹7.0L, ₹7.05L (marginal relief test), ₹15L, ₹60L (surcharge test), and EPF capped vs uncapped.
  - Verify reverse calculator parity: `calculate(reverseCalculate(target)) === target`.

---

### Phase 2: Server API Controllers & Endpoints
**Objective:** Provide validated endpoints for external API consumers, social scrapers, and SSR routes.

- [x] **Task 2.1:** Implement `POST /api/calculate`:
  - Zod validation for `SalaryInputDTO`. Returns structured breakdown.
- [x] **Task 2.2:** Implement `POST /api/reverse`:
  - Zod validation for `ReverseSalaryInputDTO`. Returns required CTC and itemized breakdown.
- [x] **Task 2.3:** Implement `GET /api/comparisons/[slug]`:
  - Route handler parsing slug via `presetsModel.ts`. Returns comparison data or clean 404 for invalid slugs.
- [x] **Task 2.4:** Implement `GET /api/og`:
  - Generates lightweight SVG/PNG image dynamically with salary figures for LinkedIn/Twitter previews.

---

### Phase 3: Interactive UI & Mobile Ergonomics
**Objective:** Build high-conversion, responsive UI components with real-time feedback.

- [x] **Task 3.1:** Implement client composables:
  - `app/composables/useCalculator.ts`: Reactive state, bidirectional URL query sync.
  - `app/composables/useReverseCalculator.ts`: Target in-hand state manager.
  - `app/composables/useAnalytics.ts`: Anonymous bracket telemetry logger.
- [x] **Task 3.2:** Build calculator components:
  - `SmartCurrencyInput.vue`: Live suffix parser pill, Lakh indicator, and format switcher.
  - `CalculatorForm.vue`: Sliders, milestone chips, regime switch, and expandable "Offer De-Jargonizer" accordion (Gratuity, ESOPs, Bonus, EPF Cap).
  - `ReverseCalculatorForm.vue`: Desired monthly in-hand slider and required CTC display.
  - `BreakdownSummary.vue`: High-contrast monthly & annual take-home hero card with itemized deduction breakdown.
  - `StackedBarChart.vue`: Lightweight responsive SVG/CSS stacked percentage visualizer.
  - `MobileStickyBar.vue`: Persistent bottom bar for mobile screens (<768px) with swipeable/expandable breakdown drawer.
- [x] **Task 3.3:** Integrate `app/pages/index.vue`:
  - Mode selector (Forward Calculator vs Target In-Hand vs Dual Offer Comparison).

---

### Phase 4: Dual-Offer Comparison & Programmatic SEO Pages
**Objective:** Deliver side-by-side comparison tools and server-rendered SEO landing pages.

- [x] **Task 4.1:** Implement `app/composables/useComparison.ts`:
  - Manages Offer A vs Offer B states and delta computations.
- [x] **Task 4.2:** Build comparison components:
  - `ComparisonTable.vue`: Clean side-by-side metric matrix with winner badges.
  - `CityInsightCard.vue`: Highlights rent differences, disposable income, and lifestyle commentary.
- [x] **Task 4.3:** Build programmatic SEO template `app/pages/compare/[slug].vue`:
  - Server-side data fetching with `useFetch`.
  - Dynamic `useSeoMeta()`: custom page title, meta description, OpenGraph tags, Twitter card.
  - Schema.org JSON-LD structured data (`FinancialProduct` and `FAQPage`).
  - "Customize These Numbers" button redirecting to interactive calculator with pre-populated values.

---

### Phase 5: Virality Kit, Verification & Launch
**Objective:** Maximize organic reach and ensure production-grade performance.

- [x] **Task 5.1:** Build `ShareModal.vue`:
  - 1-click formatted LinkedIn/X markdown copy snippet.
  - Copy shareable URL with toast alert.
  - "Download Summary Card as PNG" client-side canvas exporter.
- [x] **Task 5.2:** Production Auditing:
  - Nuxt 4 SSR production bundle built with 0 errors.
  - Mobile responsiveness verification across $360\text{px}$ to $1440\text{px}$.
- [x] **Task 5.3:** Documentation & Assets:
  - Production `README.md` with architecture diagrams and deployment instructions.

---

## 3. Financial Test Case Verification Matrix

| Test Case | Scenario / Inputs | Expected Output | Verification Criteria |
|---|---|---|---|
| **Fresher 87A Rebate** | CTC ₹6,00,000, New Regime, 50% Basic | Taxable: ₹5.25L. Income Tax: ₹0. | Zero tax; only EPF and PT deducted. |
| **Marginal Relief Cliff** | Taxable Income: ₹7,05,000 | Tax capped at ₹5,000 (not normal slab ₹25,500). | Marginal relief caps tax strictly to excess income over ₹7L. |
| **High Earner Surcharge** | CTC ₹60,00,000, New Regime | Taxable: ₹59.25L. Surcharge: 10% on tax. | Surcharge accurately calculated before 4% cess. |
| **De-Jargonizer Gratuity** | CTC ₹12,00,000, Basic 50%, Gratuity ON | Gratuity: ₹28,846/yr deducted from monthly cash. | Monthly in-hand reflects true cash inflow minus withheld gratuity. |
| **Statutory EPF Capped** | CTC ₹15,00,000, EPF Cap ON | Employee EPF: ₹1,800/mo (₹21,600/yr). | Take-home is higher than uncapped (12% of ₹7.5L = ₹90,000/yr). |
| **Reverse In-Hand Convergence** | Target In-Hand: ₹1,00,000/mo | Computes required CTC (~₹14.2 LPA New Regime). | Forward calculation on output yields exactly ₹1,00,000/mo. |
