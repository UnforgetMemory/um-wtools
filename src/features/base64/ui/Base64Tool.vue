<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { encode, decode, autoDetect } from "../domain/base64"
import { useClipboard } from "../../../toolkit/composables/useClipboard"
import UButton from "../../../toolkit/ui/UButton.vue"
import UCard from "../../../toolkit/ui/UCard.vue"
import UTextarea from "../../../toolkit/ui/UTextarea.vue"
import UTabNav from "../../../toolkit/ui/UTabNav.vue"

const { t } = useI18n()
const { copied, copy } = useClipboard()

const input = ref("")
const output = ref("")
const rounds = ref(1)
const mode = ref<"encode" | "decode" | "auto">("encode")
const error = ref<string | undefined>()
const roundBreakdown = ref<string[]>([])

/**
 * Run the selected base64 operation based on the current mode.
 *
 * - encode/decode: use the explicit round count from the slider
 * - auto: detect the number of encoding rounds automatically
 *
 * Clears previous output/error state when input is empty.
 */
function process() {
  if (!input.value.trim()) {
    output.value = ""
    error.value = undefined
    roundBreakdown.value = []
    return
  }
  const result = mode.value === "encode" ? encode(input.value, rounds.value)
    : mode.value === "decode" ? decode(input.value, rounds.value)
    : autoDetect(input.value, 20)
  output.value = result.output
  error.value = result.errorCode ? t(`base64.error.${result.errorCode}`, { msg: result.error ?? "" }) : result.error
  roundBreakdown.value = mode.value === "auto" && result.isValid
    ? [t("base64.detected", { rounds: result.rounds })]
    : []
}

// Re-run processing whenever input, mode, or round count changes.
watch([input, mode, rounds], process, { immediate: false })
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center gap-3">
      <UTabNav
        :tabs="[
          { id: 'encode', label: t('base64.encode') },
          { id: 'decode', label: t('base64.decode') },
          { id: 'auto', label: t('base64.auto') },
        ]"
        :model-value="mode"
        @update:model-value="mode = $event as 'encode' | 'decode' | 'auto'"
      />
      <!-- Round selector is disabled in auto mode because detection controls the round count. -->
      <div class="flex items-center gap-2" :style="{ color: 'var(--color-text-muted)' }">
        <label class="text-sm font-medium">{{ t("base64.rounds") }}</label>
        <input
          v-model.number="rounds"
          type="range" min="1" max="20"
          class="w-24"
          :disabled="mode === 'auto'"
          :style="{ accentColor: 'var(--color-accent)' }"
        />
        <span class="text-sm font-mono w-6 text-center" :style="{ color: 'var(--color-text)' }">{{ rounds }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text-muted)' }">
          {{ mode === "encode" ? t("base64.inputLabel.encode") : mode === "decode" ? t("base64.inputLabel.decode") : t("base64.inputLabel.auto") }}
        </label>
        <UTextarea
          :model-value="input"
          :placeholder="mode === 'encode' ? t('base64.placeholder.encode') : mode === 'decode' ? t('base64.placeholder.decode') : t('base64.placeholder.auto')"
          @update:model-value="input = $event"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text-muted)' }">
          {{ t("base64.output") }}
          <UButton v-if="output" size="sm" variant="secondary" @click="copy(output)">
            {{ copied ? t("base64.copied") : t("base64.copy") }}
          </UButton>
        </label>
        <UTextarea :model-value="output" readonly :placeholder="t('base64.placeholder.output')" />
      </div>
    </div>

    <!-- Show auto-detection result when applicable. -->
    <div v-if="roundBreakdown.length" class="p-3 rounded-md text-sm" :style="{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-muted)' }">
      <p v-for="line in roundBreakdown" :key="line">{{ line }}</p>
    </div>

    <div v-if="error" class="p-3 rounded-md text-sm" :style="{ backgroundColor: 'var(--color-error)', color: 'white' }">
      {{ error }}
    </div>

    <p class="text-xs" :style="{ color: 'var(--color-text-dim)' }">{{ t("base64.privacy") }}</p>
  </div>
</template>