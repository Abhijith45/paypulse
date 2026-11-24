<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-[#000000] text-slate-900 dark:text-[#F5F5F5] font-sans antialiased selection:bg-emerald-500 selection:text-white">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/common/AppHeader.vue'
import AppFooter from '~/components/common/AppFooter.vue'
</script>
