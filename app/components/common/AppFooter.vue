<script setup lang="ts">
import { ref } from 'vue'
import SubmitReviewModal from './SubmitReviewModal.vue'

const showReviewModal = ref(false)
</script>

<template>
  <footer class="mt-20 border-t border-slate-200 dark:border-[#272727] bg-white dark:bg-[#181818] text-xs text-slate-500 dark:text-[#A3A3A3] transition-colors">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <!-- Top 4-Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <!-- Col 1: Brand & Mission -->
        <div class="space-y-3">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <span class="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              PayPulse
            </span>
          </NuxtLink>
          <p class="text-xs text-slate-600 dark:text-[#A3A3A3] leading-relaxed">
            India's open, 100% private CTC-to-take-home calculation engine and career comparison hub. Verified against Union Budget FY 2025–26 tax slabs.
          </p>
          <div class="pt-1 flex items-center gap-2">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
              <span>🔒</span>
              <span>Zero-PII architecture</span>
            </span>
          </div>
        </div>

        <!-- Col 2: Interactive Calculators -->
        <div>
          <div class="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
            Salary calculators
          </div>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                Take-home pay calculator
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                Target in-hand reverse negotiator
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                Offer de-jargonizer & gratuity
              </NuxtLink>
            </li>
            <li>
              <button
                type="button"
                @click="showReviewModal = true"
                class="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left cursor-pointer flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400"
              >
                <span>✍️</span>
                <span>Submit anonymous review</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Col 3: Popular Salary Comparisons -->
        <div>
          <div class="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
            Popular comparisons
          </div>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/compare/4lpa-vs-6lpa" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                ₹4 LPA vs ₹6 LPA
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compare/6lpa-vs-8lpa" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                ₹6 LPA vs ₹8 LPA
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compare/8lpa-vs-12lpa" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                ₹8 LPA vs ₹12 LPA
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compare/12lpa-vs-18lpa" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                ₹12 LPA vs ₹18 LPA
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compare/bengaluru-vs-lucknow-6lpa" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                Bengaluru vs Lucknow (6L)
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/compare/mumbai-vs-bengaluru-15lpa" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                Mumbai vs Bengaluru (15L)
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 4: Trust & Legal Links -->
        <div>
          <div class="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
            Trust & legal
          </div>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/privacy"
                class="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5 font-medium"
              >
                <span>🔒</span>
                <span>Privacy Policy</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/terms"
                class="hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5 font-medium"
              >
                <span>📜</span>
                <span>Terms and Conditions</span>
              </NuxtLink>
            </li>
            <li>
              <span class="text-slate-400 dark:text-[#737373] block text-[11px]">
                Budget FY 2025–26 compliant
              </span>
            </li>
            <li>
              <span class="text-slate-400 dark:text-[#737373] block text-[11px]">
                Section 87A marginal relief verified
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Legal Advisory Box -->
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#1F1F1F] border border-slate-200/80 dark:border-[#313131] text-[11px] text-slate-500 dark:text-[#A3A3A3] leading-relaxed space-y-1 mb-8">
        <div>
          <strong>Educational disclaimer:</strong> PayPulse provides mathematical estimations based on the Indian Union Budget FY 2024–25 / FY 2025–26 tax slabs, statutory EPF rules, and publicly reported median city living data. Actual payslips may vary based on exact employer structures, flexi-benefit declarations, and gratuity policies.
        </div>
        <div>
          PayPulse does not provide certified tax, legal, or investment advice. Always consult a qualified Chartered Accountant (CA) for official tax filing and personal planning.
        </div>
      </div>

      <!-- Bottom Bar with Copyright & Direct Links -->
      <div class="pt-6 border-t border-slate-200 dark:border-[#272727] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-[#737373]">
        <div>
          © 2026 PayPulse. Built for Indian tech and corporate professionals.
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/privacy" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Privacy policy
          </NuxtLink>
          <span class="text-slate-300 dark:text-[#313131]">·</span>
          <NuxtLink to="/terms" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Terms and conditions
          </NuxtLink>
          <span class="text-slate-300 dark:text-[#313131]">·</span>
          <NuxtLink to="/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Calculator
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Review Modal Triggered from Footer Link -->
    <SubmitReviewModal v-model="showReviewModal" />
  </footer>
</template>
