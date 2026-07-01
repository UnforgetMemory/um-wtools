<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { useActiveTool } from "../toolkit/composables/useActiveTool"
import UCard from "../toolkit/ui/UCard.vue"
import UButton from "../toolkit/ui/UButton.vue"

const { t } = useI18n()
const { navigate } = useActiveTool()
</script>

<template>
  <div class="flex flex-col items-center text-center py-12 sm:py-20">
    <img src="/logo.webp" alt="um-wtools" class="h-20 w-20 rounded-2xl mb-6" />
    <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-3" :style="{ color: 'var(--color-text)' }">um-wtools</h2>
    <p class="text-base max-w-md mb-10" :style="{ color: 'var(--color-text-muted)' }">
      {{ t("home.subtitle") }}
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
      <UCard variant="elevated" padding="lg">
        <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--color-text)' }">Base64</h3>
        <p class="text-sm mb-4" :style="{ color: 'var(--color-text-muted)' }">{{ t("home.base64Desc") }}</p>
        <UButton variant="primary" size="md" @click="navigate('base64')">
          {{ t("home.open") }}
        </UButton>
      </UCard>
      <UCard variant="elevated" padding="lg">
        <h3 class="text-lg font-semibold mb-2" :style="{ color: 'var(--color-text)' }">Markdown → PDF</h3>
        <p class="text-sm mb-4" :style="{ color: 'var(--color-text-muted)' }">{{ t("home.pdfDesc") }}</p>
        <UButton variant="primary" size="md" @click="navigate('markdown-pdf')">
          {{ t("home.open") }}
        </UButton>
      </UCard>
    </div>
  </div>
</template>