<script setup lang="ts">
import AppHeader from "./layouts/AppHeader.vue"
import AppFooter from "./layouts/AppFooter.vue"
</script>

<template>
  <div class="min-h-screen flex flex-col" :style="{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }">
    <AppHeader />
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>