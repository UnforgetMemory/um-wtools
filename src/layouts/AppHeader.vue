<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useTheme } from "../toolkit/composables/useTheme"
import { useActiveTool } from "../toolkit/composables/useActiveTool"
import UIconButton from "../toolkit/ui/UIconButton.vue"

const { t, locale } = useI18n()
const { theme } = useTheme()
const { navigate, goHome } = useActiveTool()

const themeCycle = ["light", "dark", "system"] as const

function cycleTheme() {
  const idx = themeCycle.indexOf(theme.value as "light" | "dark" | "system")
  theme.value = themeCycle[(idx + 1) % themeCycle.length]
}

function toggleLocale() {
  locale.value = locale.value === "zh-CN" ? "en" : "zh-CN"
}
</script>

<template>
  <header class="border-b" :style="{ borderColor: 'var(--color-border)' }">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <button @click="goHome" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.webp" alt="um-wtools" class="h-8 w-8 rounded-lg" />
        <h1 class="text-lg font-semibold tracking-tight" :style="{ color: 'var(--color-text)' }">um-wtools</h1>
      </button>
      <div class="flex items-center gap-1">
        <UIconButton :label="t('theme.title', { mode: theme })" @click="cycleTheme">
          {{ theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻" }}
        </UIconButton>
        <UIconButton :label="'Switch language'" @click="toggleLocale">
          {{ locale === "zh-CN" ? "EN" : "中" }}
        </UIconButton>
      </div>
    </div>
  </header>
</template>