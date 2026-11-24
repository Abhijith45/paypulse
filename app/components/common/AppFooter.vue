<template>
  <footer class="mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-10 text-xs text-slate-500">
    <div class="max-w-6xl mx-auto px-4 space-y-6">
      <!-- Comparison SEO Links Grid -->
      <div>
        <div class="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
          Popular Salary & City Comparisons
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <NuxtLink to="/compare/4lpa-vs-6lpa" class="hover:text-emerald-600 transition">₹4 LPA vs ₹6 LPA</NuxtLink>
          <NuxtLink to="/compare/6lpa-vs-8lpa" class="hover:text-emerald-600 transition">₹6 LPA vs ₹8 LPA</NuxtLink>
          <NuxtLink to="/compare/8lpa-vs-12lpa" class="hover:text-emerald-600 transition">₹8 LPA vs ₹12 LPA</NuxtLink>
          <NuxtLink to="/compare/12lpa-vs-18lpa" class="hover:text-emerald-600 transition">₹12 LPA vs ₹18 LPA</NuxtLink>
          <NuxtLink to="/compare/bengaluru-vs-lucknow-6lpa" class="hover:text-emerald-600 transition">Bengaluru vs Lucknow (6L)</NuxtLink>
          <NuxtLink to="/compare/pune-vs-hyderabad-8lpa" class="hover:text-emerald-600 transition">Pune vs Hyderabad (8L)</NuxtLink>
          <NuxtLink to="/compare/mumbai-vs-bengaluru-15lpa" class="hover:text-emerald-600 transition">Mumbai vs Bengaluru (15L)</NuxtLink>
        </div>
      </div>

      <!-- Legal Disclaimer -->
      <div class="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 leading-relaxed">
        <strong>Disclaimer:</strong> PayPulse provides educational estimates based on the Indian Union Budget FY 2025–26 tax slabs, standard EPF rules, and publicly reported median city living data. Actual payslips may vary based on exact employer structures, gratuity policies, and individual investments. Consult a qualified Chartered Accountant for official tax filing.
      </div>
    </div>
  </footer>
</template>
