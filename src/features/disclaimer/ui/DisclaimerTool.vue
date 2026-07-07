<script setup lang="ts">
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useActiveTool } from "../../../toolkit/composables/useActiveTool"

const { t } = useI18n()
const { goHome } = useActiveTool()

/**
 * Build the disclaimer sections from i18n strings.
 *
 * Each section pairs a localized title with its body text.
 * The order matches the legal document structure in the locale files.
 */
const sections = computed(() => [
  { title: t("disclaimer.section1Title"), body: t("disclaimer.section1Body") },
  { title: t("disclaimer.section2Title"), body: t("disclaimer.section2Body") },
  { title: t("disclaimer.section3Title"), body: t("disclaimer.section3Body") },
  { title: t("disclaimer.section4Title"), body: t("disclaimer.section4Body") },
  { title: t("disclaimer.section5Title"), body: t("disclaimer.section5Body") },
  { title: t("disclaimer.section6Title"), body: t("disclaimer.section6Body") },
])
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <!-- Back link -->
    <button
      class="inline-flex items-center gap-1 text-sm transition-colors hover:opacity-70"
      :style="{ color: 'var(--color-text-muted)' }"
      @click="goHome"
    >
      <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clip-rule="evenodd"/></svg>
      {{ t("home.title") || "Home" }}
    </button>

    <!-- Header -->
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight" :style="{ color: 'var(--color-text)' }">
        {{ t("disclaimer.title") }}
      </h1>
      <p class="text-xs mt-1.5 font-medium tracking-wide" :style="{ color: 'var(--color-text-dim)' }">
        {{ t("disclaimer.lastUpdated") }}
      </p>
    </div>

    <!-- Intro -->
    <p class="text-sm leading-relaxed" :style="{ color: 'var(--color-text-muted)' }">
      {{ t("disclaimer.intro") }}
    </p>

    <!-- Sections -->
    <div class="space-y-6">
      <section
        v-for="(s, i) in sections"
        :key="i"
        class="rounded-lg p-5 transition-colors"
        :style="{ backgroundColor: 'var(--color-surface-card)' }"
      >
        <h2 class="text-base font-semibold mb-2" :style="{ color: 'var(--color-text)' }">
          {{ s.title }}
        </h2>
        <p class="text-sm leading-relaxed" :style="{ color: 'var(--color-text-muted)' }">
          {{ s.body }}
        </p>
      </section>
    </div>

    <!-- Privacy note -->
    <p class="text-xs text-center" :style="{ color: 'var(--color-text-dim)' }">
      {{ t("base64.privacy") }}
    </p>
  </div>
</template>
