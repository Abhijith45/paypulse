<script setup lang="ts">
import { ref } from 'vue'

const showShareToast = ref(false)

async function copyPageUrl() {
  if (typeof window === 'undefined') return
  try {
    await navigator.clipboard.writeText(window.location.href)
    showShareToast.value = true
    setTimeout(() => {
      showShareToast.value = false
    }, 2000)
  } catch {
    // ignore
  }
}
</script>

<template>
  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-30">
    <div class="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
      <!-- Brand Logo & Tagline -->
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
          ⚡
        </div>
        <div>
          <div class="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
            PayPulse
          </div>
          <div class="text-[10px] font-medium text-slate-500 tracking-wide">
            CTC vs Take-Home Hub
          </div>
        </div>
      </NuxtLink>

      <!-- Trust Badge & Share Action -->
      <div class="flex items-center gap-3">
        <div class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span>🔒</span>
          <span>100% Private & Client-Calculated</span>
        </div>

        <button
          type="button"
          @click="copyPageUrl"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
        >
          <span>🔗</span>
          <span>Share</span>
        </button>

        <span
          v-if="showShareToast"
          class="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in"
        >
          Copied!
        </span>
      </div>
    </div>
  </header>
</template>
