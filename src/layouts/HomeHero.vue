<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useActiveTool } from "../toolkit/composables/useActiveTool"

const { t } = useI18n()
const { navigate } = useActiveTool()

const tools = [
  { id: "base64" as const, title: "Base64", descKey: "base64Desc" },
  { id: "timestamp" as const, title: "Timestamp", descKey: "timestampDesc" },
  { id: "magnet" as const, title: "Magnet", descKey: "magnetDesc" },
  
  { id: "md5" as const, title: "MD5", descKey: "md5Desc" },
]
</script>

<template>
  <div class="flex flex-col items-center text-center py-12 sm:py-20">
    <img src="/logo.webp" alt="um-wtools" class="h-20 w-20 rounded-2xl mb-6" />
    <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-3" :style="{ color: 'var(--color-text)' }">um-wtools</h2>
    <p class="text-base max-w-md mb-10" :style="{ color: 'var(--color-text-muted)' }">
      {{ t("home.subtitle") }}
    </p>
    <!-- Disclaimer entry (first content item) -->
    <div class="w-full max-w-2xl mb-6">
      <button
        class="w-full rounded-lg px-6 py-4 text-sm transition-all duration-200 flex items-center justify-center gap-2"
        :style="{
          color: 'var(--color-text-muted)',
          border: '1px solid var(--color-border)',
        }"
        @click="navigate('disclaimer')"
      >
        <svg viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd"/>
        </svg>
        {{ t("home.disclaimerDesc") }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
      <button
        v-for="tool in tools"
        :key="tool.id"
        class="tool-card rounded-lg p-8 text-left w-full transition-all duration-200"
        :style="{
          backgroundColor: 'var(--color-surface-card)',
          color: 'var(--color-text)',
        }"
        @click="navigate(tool.id)"
      >
        <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--color-text)' }">{{ tool.title }}</h3>
        <p class="text-sm leading-relaxed" :style="{ color: 'var(--color-text-muted)' }">{{ t(`home.${tool.descKey}`) }}</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.tool-card {
  cursor: pointer;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  outline: none;
  transition: all 0.2s ease;
}
.tool-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06);
  border-color: var(--color-border);
  background-color: var(--color-surface-alt) !important;
}
.tool-card:focus-visible {
  box-shadow: 0 0 0 2px var(--color-text);
}
.tool-card:active {
  transform: translateY(-1px);
}

/* Dark: data-theme attribute */
[data-theme="dark"] .tool-card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
}
[data-theme="dark"] .tool-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25);
  border-color: var(--color-border-strong);
}

/* Dark: system preference fallback */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) .tool-card {
    box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
  }
  :root:not([data-theme="light"]):not([data-theme="dark"]) .tool-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.25);
    border-color: var(--color-border-strong);
  }
}
</style>
