<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy | PayPulse — 100% Private & Client-Calculated',
  description: 'PayPulse zero-PII privacy policy. Learn why your salary numbers, financial calculations, and offer comparisons remain 100% private in your browser.'
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
        Privacy Policy
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Effective date: November 2026 · Last updated: Union Budget FY 2025–26 edition
      </p>
    </div>

    <!-- Core Guarantee Highlight Box -->
    <div class="p-5 sm:p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 mb-10">
      <div class="flex items-start gap-3">
        <span class="text-2xl">🔒</span>
        <div>
          <h2 class="text-base font-bold text-emerald-950 dark:text-emerald-200">
            Our Zero-PII & Client-Side Privacy Guarantee
          </h2>
          <p class="mt-1 text-xs sm:text-sm text-emerald-900/90 dark:text-emerald-300 leading-relaxed">
            Your salary and compensation data are entirely private. PayPulse operates on an <strong>in-memory isomorphic engine</strong>. Calculations happen directly inside your web browser. <strong>We do not record, transmit, log, or sell your salary numbers, offer letters, or financial figures to any database or third-party marketing network.</strong>
          </p>
        </div>
      </div>
    </div>

    <!-- Document Sections -->
    <div class="space-y-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <!-- Section 1 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          1. Information We Do Not Collect
        </h2>
        <p>
          Unlike traditional payroll software or corporate career portals, PayPulse is deliberately architected without mandatory account creation. Specifically:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
          <li>We <strong>do not</strong> ask for your name, email address, phone number, or employer identification.</li>
          <li>We <strong>do not</strong> request, store, or verify your Permanent Account Number (PAN), Aadhaar, or UAN EPF numbers.</li>
          <li>We <strong>do not</strong> persist the specific rupee values of your CTC, basic pay, stock grants, or monthly take-home pay on our servers.</li>
        </ul>
      </section>

      <!-- Section 2 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          2. How Client-Side Execution Works
        </h2>
        <p>
          When you enter a Cost-to-Company (CTC) figure or drag basic salary and variable pay sliders:
        </p>
        <ol class="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
          <li>The computational engine evaluates the Indian Income Tax Act slabs (New and Old Regimes), Provident Fund statutory formulas, Professional Tax rates, and city-specific rental baselines entirely in your local browser runtime.</li>
          <li>Once you refresh or close your browser tab, all calculation state in memory is discarded.</li>
          <li>If you intentionally use the <strong>"Share"</strong> or <strong>"Copy Comparison URL"</strong> feature, your selected numbers are serialized into the URL query parameters (e.g., <code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">?ctc=1200000&city=bengaluru</code>). Anyone with whom you choose to share that URL can view the calculations associated with those parameters.</li>
        </ol>
      </section>

      <!-- Section 3 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          3. Anonymized Aggregate Product Telemetry
        </h2>
        <p>
          To maintain server uptime, debug formula regressions, and optimize user experience across screen resolutions, PayPulse collects aggregate, coarse-grained event counters that contain <strong>zero Personally Identifiable Information (PII)</strong>:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-400">
          <li><strong>Salary Brackets:</strong> Coarse ranges (such as &lt;₹5 LPA, ₹5–10 LPA, ₹10–20 LPA, ₹20–50 LPA, &gt;₹50 LPA) rather than exact compensation numbers.</li>
          <li><strong>Feature Utilization:</strong> Event counts for toggling Reverse Mode, expanding the Offer De-Jargonizer, or selecting city comparisons.</li>
          <li><strong>Standard Infrastructure Logs:</strong> Content Delivery Networks (e.g. Vercel, Cloudflare) automatically process standard HTTP access logs (anonymized IP addresses, browser user agent) for DDoS mitigation, caching, and rate limiting.</li>
        </ul>
      </section>

      <!-- Section 4 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          4. Cookies and Local Storage
        </h2>
        <p>
          PayPulse does not utilize persistent advertising cookies, cross-site trackers, or third-party behavioral profiling scripts. Local browser storage or session storage may be utilized solely for transient client preferences, such as retaining your preferred Tax Regime selection or dark/light theme state across visits.
        </p>
      </section>

      <!-- Section 5 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          5. Community Salary Reviews & Feedback
        </h2>
        <p>
          When you voluntarily submit feedback or compensation transparency benchmarks via the <strong>"Submit Review"</strong> modal, submissions are treated as strictly anonymous. Do not include your real name, personal contact information, or proprietary enterprise secrets in review notes.
        </p>
      </section>

      <!-- Section 6 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          6. Compliance with Data Protection Laws
        </h2>
        <p>
          PayPulse is designed to follow the principles of data minimization and purpose limitation under India's <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> and international privacy standards. Because we do not collect personal identifiers, there is no personal data dossier stored for retrieval or deletion.
        </p>
      </section>

      <!-- Section 7 -->
      <section class="space-y-3">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          7. Contact & Inquiries
        </h2>
        <p>
          If you have questions regarding this Privacy Policy or have recommendations for improving data privacy on PayPulse, please open an issue on our GitHub repository or contact the project maintainers.
        </p>
      </section>
    </div>

    <!-- Bottom Navigation -->
    <div class="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
      <NuxtLink to="/terms" class="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold">
        Read Terms & Conditions →
      </NuxtLink>
      <NuxtLink to="/" class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
        Launch PayPulse Calculator
      </NuxtLink>
    </div>
  </div>
</template>
