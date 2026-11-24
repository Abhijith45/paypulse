<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<style>
/* Smooth typography and layout base */
html {
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}
</style>
