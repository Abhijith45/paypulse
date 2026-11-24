<script setup lang="ts">
import { ref } from 'vue'
import SubmitReviewModal from './SubmitReviewModal.vue'

const showShareToast = ref(false)
const showReviewModal = ref(false)

async function copyPageUrl() {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(window.location.href)
    showShareToast.value = true
    setTimeout(() => {
      showShareToast.value = false
    }, 2000)
  } catch {
    // fallback
  }
}
</script>

<template>
  <header class="border-b border-slate-200 dark:border-[#272727] bg-white/90 dark:bg-[#181818]/90 backdrop-blur sticky top-0 z-30 transition-colors">
    <!-- Navbar Container with strict [flex, space-between] layout -->
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between" style="display: flex; justify-content: space-between; align-items: center;">
      <!-- Left: "PayPulse" Text Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500/30 rounded-xl p-1 -m-1 transition">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-base shadow-sm group-hover:scale-105 transition-transform">
          ⚡
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            PayPulse
          </span>
          <span class="text-[10px] font-medium text-slate-500 dark:text-[#A3A3A3] tracking-wide mt-0.5">
            CTC vs Take-Home Hub
          </span>
        </div>
      </NuxtLink>

      <!-- Right: Actions & "Submit Review" CTA -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <!-- 100% Private Trust Pill -->
        <NuxtLink
          to="/privacy"
          class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1F1F] dark:hover:bg-[#272727] text-slate-600 dark:text-[#A3A3A3] border border-transparent dark:border-[#313131] transition"
          title="Zero PII. Learn how your salary data stays in your browser."
        >
          <span>🔒</span>
          <span>100% Private</span>
        </NuxtLink>

        <!-- Share Button -->
        <button
          type="button"
          @click="copyPageUrl"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1F1F] dark:hover:bg-[#272727] text-slate-700 dark:text-slate-200 border border-transparent dark:border-[#313131] transition focus:outline-none focus:ring-2 focus:ring-slate-400/20"
        >
          <span>🔗</span>
          <span class="hidden sm:inline">Share</span>
        </button>

        <span
          v-if="showShareToast"
          class="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in"
        >
          Copied!
        </span>

        <!-- Primary CTA: Submit Review -->
        <button
          type="button"
          @click="showReviewModal = true"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition-all shadow-sm shadow-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
        >
          <span>✍️</span>
          <span>Submit Review</span>
        </button>
      </div>
    </div>

    <!-- Submit Review Modal -->
    <SubmitReviewModal v-model="showReviewModal" />
  </header>
</template>
