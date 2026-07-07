<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useTheme } from "../toolkit/composables/useTheme"
import { useActiveTool } from "../toolkit/composables/useActiveTool"
import UIconButton from "../toolkit/ui/UIconButton.vue"

const { t, locale } = useI18n()
const { theme } = useTheme()
const { navigate, goHome } = useActiveTool()

const themeCycle = ["light", "dark", "system"] as const
const localeCycle = ["zh-CN", "en", "zh-TW", "ja", "ko"] as const
const localeLabel: Record<string, string> = {
  "zh-CN": "中",
  en: "EN",
  "zh-TW": "繁",
  ja: "日",
  ko: "한",
}

/** Cycle through light → dark → system theme modes. */
function cycleTheme() {
  const idx = themeCycle.indexOf(theme.value as "light" | "dark" | "system")
  theme.value = themeCycle[(idx + 1) % themeCycle.length]
}

/** Cycle through the supported locales in a fixed order. */
function toggleLocale() {
  const idx = localeCycle.indexOf(locale.value)
  locale.value = localeCycle[(idx + 1) % localeCycle.length]
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
        <a
          href="https://github.com/UnforgetMemory/um-wtools"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          :style="{ color: 'var(--color-text-muted)' }"
          :title="t('home.github')"
          :aria-label="t('home.github')"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" class="w-5 h-5">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
        <UIconButton :label="t('theme.title', { mode: theme })" @click="cycleTheme">
          {{ theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻" }}
        </UIconButton>
        <UIconButton :label="'Switch language'" @click="toggleLocale">
          {{ localeLabel[locale] || "EN" }}
        </UIconButton>
      </div>
    </div>
  </header>
</template>