<script setup lang="ts">
import { provide } from "vue"
import { useActiveTool } from "./toolkit/composables/useActiveTool"
import AppHeader from "./layouts/AppHeader.vue"
import AppFooter from "./layouts/AppFooter.vue"
import HomeHero from "./layouts/HomeHero.vue"
import Base64Tool from "./features/base64/ui/Base64Tool.vue"
import MarkdownPdfTool from "./features/markdown-pdf/ui/MarkdownPdfTool.vue"

const { activeTool } = useActiveTool()
provide("activeTool", activeTool)
</script>

<template>
  <div class="min-h-screen flex flex-col" :style="{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }">
    <AppHeader />
    <main class="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <HomeHero v-if="activeTool === null" />
      <Base64Tool v-else-if="activeTool === 'base64'" />
      <MarkdownPdfTool v-else-if="activeTool === 'markdown-pdf'" />
    </main>
    <AppFooter />
  </div>
</template>