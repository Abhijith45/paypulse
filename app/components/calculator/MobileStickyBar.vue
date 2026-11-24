<script setup lang="ts">
import { ref } from 'vue'
import { formatIndianCurrency } from '~~/shared/utils/formatting'
import type { SalaryBreakdownDTO } from '~~/shared/types/compensation'
import BreakdownSummary from './BreakdownSummary.vue'

const props = defineProps<{
  breakdown: SalaryBreakdownDTO
}>()

const isDrawerOpen = ref(false)

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value
}
</script>

<template>
  <div>
    <!-- Sticky Bottom Bar (Visible on mobile screens < md) -->
    <div class="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-3 shadow-lg">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Estimated In-Hand</div>
          <div class="text-xl font-black text-slate-900 dark:text-white">
            {{ formatIndianCurrency(breakdown.takeHome.netInHandMonthly) }}
            <span class="text-xs font-normal text-slate-500">/ mo</span>
          </div>
        </div>

        <button
          type="button"
          @click="toggleDrawer"
          class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition flex items-center gap-1.5"
        >
          <span>View Breakdown</span>
          <span>{{ isDrawerOpen ? '↓' : '↑' }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer Modal -->
    <div
      v-if="isDrawerOpen"
      class="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end transition-opacity"
      @click.self="toggleDrawer"
    >
      <div class="bg-white dark:bg-slate-900 rounded-t-3xl max-h-[85vh] overflow-y-auto p-4 border-t border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom">
        <div class="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="font-bold text-slate-900 dark:text-white text-base">Detailed Breakdown</div>
          <button
            type="button"
            @click="toggleDrawer"
            class="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
          >
            ✕ Close
          </button>
        </div>

        <BreakdownSummary :breakdown="breakdown" />
      </div>
    </div>
  </div>
</template>
