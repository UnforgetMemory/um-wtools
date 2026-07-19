<script setup lang="ts">
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useMd5 } from "../application/useMd5"
import { useClipboard } from "../../../toolkit/composables/useClipboard"
import UTextarea from "../../../toolkit/ui/UTextarea.vue"

const { input, output } = useMd5()
const { t } = useI18n()
const { copied, copy } = useClipboard()

const uppercase = ref(false)
const displayOutput = computed(() => {
  if (!output.value) return ""
  return uppercase.value ? output.value.toUpperCase() : output.value
})

function onCopyOutput() {
  if (displayOutput.value) copy(displayOutput.value)
}
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold" :style="{ color: 'var(--color-text)' }">{{ t("md5.title") }}</h2>

    <div class="p-6 rounded-lg" :style="{ backgroundColor: 'var(--color-surface-card)' }">
      <label class="block text-sm font-medium mb-3" :style="{ color: 'var(--color-text-muted)' }">
        {{ t("md5.input") }}
      </label>
      <UTextarea
        :model-value="input"
        :placeholder="t('md5.placeholder')"
        @update:model-value="input = $event"
      />
    </div>

    <div v-if="output" class="p-6 rounded-lg" :style="{ backgroundColor: 'var(--color-surface-card)' }">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium" :style="{ color: 'var(--color-text-muted)' }">{{ t("md5.output") }}</span>
        <label class="flex items-center gap-1.5 cursor-pointer select-none text-xs"
          :style="{ color: 'var(--color-text-muted)' }">
          <span :style="{ color: uppercase ? 'var(--color-text)' : 'var(--color-text-dim)' }">a</span>
          <span class="relative inline-block w-8 h-4 rounded-full transition-colors"
            :style="{
              backgroundColor: uppercase ? 'var(--color-accent)' : 'var(--color-border)',
            }"
            @click="uppercase = !uppercase"
          >
            <span class="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform"
              :class="uppercase ? 'translate-x-4' : 'translate-x-0'"
            />
          </span>
          <span :style="{ color: uppercase ? 'var(--color-text-dim)' : 'var(--color-text)' }">A</span>
        </label>
      </div>
      <div
        class="relative rounded-lg border cursor-pointer font-mono text-sm transition-colors select-all"
        :style="{
          borderColor: copied ? 'var(--color-success)' : 'var(--color-border)',
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-surface-alt)',
        }"
        @click="onCopyOutput"
      >
        <div class="p-4 break-all tracking-wide">{{ displayOutput }}</div>
        <div class="absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
          <span class="text-[10px] px-2 py-0.5 rounded-full transition-opacity"
            :style="{
              color: 'var(--color-text-dim)',
              backgroundColor: 'var(--color-surface-card)',
              opacity: copied ? 1 : 0.7,
            }"
          >
            {{ copied ? t("md5.copied") : t("md5.clickCopy") }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="p-6 rounded-lg text-sm text-center"
      :style="{ color: 'var(--color-text-dim)', backgroundColor: 'var(--color-surface-card)' }">
      {{ t("md5.waiting") }}
    </div>

    <p class="text-xs" :style="{ color: 'var(--color-text-dim)' }">{{ t("md5.privacy") }}</p>
  </div>
</template>