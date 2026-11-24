<script setup lang="ts">
useSeoMeta({
  title: 'Terms & Conditions | PayPulse — Legal Disclaimer & Terms of Use',
  description: 'Terms and Conditions for using PayPulse. Understand calculation methodologies, educational disclaimers, intellectual property, and limitations of liability.'
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12 sm:py-16">
    <!-- Breadcrumb & Header -->
    <div class="mb-8">
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-4">
        <span>←</span>
        <span>Back to Calculator</span>
      </NuxtLink>
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
        Terms and Conditions
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Effective date: November 2026 · Governing jurisdiction: Republic of India
      </p>
    </div>

    <!-- Legal Advisory Disclaimer Highlight -->
    <div class="p-5 sm:p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 mb-10">
      <div class="flex items-start gap-3">
        <span class="text-2xl">⚖️</span>
        <div>
          <h2 class="text-base font-bold text-amber-950 dark:text-amber-200">
            Educational & Informational Disclaimer
          </h2>
          <p class="mt-1 text-xs sm:text-sm text-amber-900/90 dark:text-amber-300 leading-relaxed">
            PayPulse is an open educational tool designed for career benchmarking, offer evaluation, and general financial awareness. <strong>PayPulse does not provide certified tax, legal, or investment advisory services.</strong> Calculations are mathematical estimations based on the Indian Union Budget (FY 2024–25 & FY 2025–26) and prevailing statutory regulations. Consult a qualified Chartered Accountant (CA) for official tax filing and personal planning.
          </p>
        </div>
      </div>
    </div>

    <!-- Document Sections -->
    <div class="space-y-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <!-- Section 1 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          1. Agreement to Terms
        </h2>
        <p>
          By accessing or utilizing PayPulse (the "Platform", "Service", or "Application"), you confirm that you have read, understood, and agreed to be bound by these Terms and Conditions. If you do not agree with any part of these terms, your sole remedy is to cease using the Service.
        </p>
      </section>

      <!-- Section 2 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          2. Nature of the Calculation Models & Tolerances
        </h2>
        <p>
          PayPulse models complex Indian compensation structures into clear formulas:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
          <li><strong>Income Tax Models:</strong> Based on the Income Tax Department of India guidelines, including standard deductions, Section 87A full rebates, Section 87A marginal relief, surcharge rates (10%, 15%, 25%), surcharge marginal relief, and 4% Health & Education cess.</li>
          <li><strong>Employee Provident Fund (EPF):</strong> Evaluates employee and employer contributions at 12% of basic salary or the statutory ceiling (₹1,800/month) as configured by the user.</li>
          <li><strong>Gratuity Provisions:</strong> Estimates statutory accruals under the Payment of Gratuity Act (15/26 days per completed year of service) amortized on a monthly basis.</li>
          <li><strong>City Living Indices:</strong> Median rent and living costs reflect public crowdsourced indices and are intended as relative comparative indicators across cities, not guaranteed market rent quotes.</li>
        </ul>
        <p class="text-xs text-slate-500">
          Actual company payslips may vary based on exact employer corporate policies, customized flexi-benefit baskets, voluntary provident funds (VPF), professional tax rounding rules, and individual investment declarations.
        </p>
      </section>

      <!-- Section 3 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          3. No Professional or Fiduciary Relationship
        </h2>
        <p>
          Use of PayPulse does not create an accountant-client, attorney-client, or financial fiduciary relationship between you and PayPulse, its developers, or its contributors. We strongly recommend cross-checking your offer letters with an employer's Human Resources department and reviewing form 16 / tax computations with a licensed tax professional.
        </p>
      </section>

      <!-- Section 4 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          4. Intellectual Property Rights
        </h2>
        <p>
          All software code, visual design, interactive widgets, logos, formulas, and written editorial materials on PayPulse are the intellectual property of PayPulse and its licensors. You may use the platform for personal, non-commercial salary planning, and you may share generated comparison summaries and calculation URLs with attribution. Automated scraping, bulk harvesting, or cloning of the user interface for commercial redistribution without prior written consent is strictly prohibited.
        </p>
      </section>

      <!-- Section 5 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          5. Acceptable Use Policy
        </h2>
        <p>
          When accessing PayPulse or utilizing the "Submit Review" feature, you agree not to:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
          <li>Submit unlawful, defamatory, abusive, or trade-secret-infringing content in review fields.</li>
          <li>Engage in automated denial-of-service (DoS) attacks, crawler exploitation, or disruption of server availability.</li>
          <li>Misrepresent PayPulse calculation outputs as certified government documents or legally binding employment contracts.</li>
        </ul>
      </section>

      <!-- Section 6 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          6. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law, PayPulse and its maintainers shall not be liable for any direct, indirect, consequential, punitive, or incidental damages, including but not limited to loss of income, employment disputes, negotiation outcomes, or tax penalties resulting from reliance on the application's calculations, errors, omissions, or downtime.
        </p>
      </section>

      <!-- Section 7 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          7. Modifications and Severability
        </h2>
        <p>
          We reserve the right to modify these Terms and Conditions or adjust calculation formulas in response to parliamentary Union Budget amendments, CBDT circulars, or statutory revisions. Continued use of PayPulse following updates signifies your acceptance of the revised Terms.
        </p>
      </section>
    </div>

    <!-- Bottom Navigation -->
    <div class="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
      <NuxtLink to="/privacy" class="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold">
        ← View Privacy Policy
      </NuxtLink>
      <NuxtLink to="/" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
        Launch PayPulse Calculator
      </NuxtLink>
    </div>
  </div>
</template>
