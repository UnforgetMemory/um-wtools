<script setup lang="ts">
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"
import { usePdf } from "../application/usePdf"
import UButton from "../../../toolkit/ui/UButton.vue"
import UTextarea from "../../../toolkit/ui/UTextarea.vue"
import USelect from "../../../toolkit/ui/USelect.vue"

const { preview, printToPdf } = usePdf()
const { t } = useI18n()

const markdown = ref(`# Hello World\n\nThis is a **Markdown** document.\n\n- Bullet list item\n- Another item`)
const previewHtml = ref("")
const error = ref<string | undefined>()
const pageFormat = ref("a4")
const pageOrientation = ref("portrait")

function updatePreview() { previewHtml.value = preview(markdown.value) }

watch(markdown, () => {
  const timer = setTimeout(updatePreview, 500)
  return () => clearTimeout(timer)
}, { deep: true })
updatePreview()

function downloadPdf() {
  error.value = undefined
  try {
    printToPdf(markdown.value, { format: pageFormat.value as "a4" | "letter", orientation: pageOrientation.value as "portrait" | "landscape" })
  } catch (err) {
    error.value = t("pdf.error.failed", { msg: (err as Error).message })
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <label class="text-sm font-medium" :style="{ color: 'var(--color-text-muted)' }">{{ t("pdf.page") }}</label>
        <USelect
          :model-value="pageFormat"
          :options="[{ value: 'a4', label: t('pdf.a4') }, { value: 'letter', label: t('pdf.letter') }]"
          @update:model-value="pageFormat = $event"
        />
        <USelect
          :model-value="pageOrientation"
          :options="[{ value: 'portrait', label: t('pdf.portrait') }, { value: 'landscape', label: t('pdf.landscape') }]"
          @update:model-value="pageOrientation = $event"
        />
      </div>
      <UButton variant="primary" :disabled="!markdown.trim()" @click="downloadPdf">
        {{ t("pdf.download") }}
      </UButton>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text-muted)' }">{{ t("pdf.editor") }}</label>
        <UTextarea :model-value="markdown" :placeholder="t('pdf.placeholder')" @update:model-value="markdown = $event" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text-muted)' }">{{ t("pdf.preview") }}</label>
        <div class="preview-area w-full h-96 p-4 rounded-lg border overflow-auto text-sm leading-relaxed"
          :style="{
            backgroundColor: 'var(--color-surface-card)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }"
          v-html="previewHtml"
        />
      </div>
    </div>

    <div v-if="error" class="p-3 rounded-md text-sm" :style="{ backgroundColor: 'var(--color-error)', color: 'white' }">
      {{ error }}
    </div>

    <p class="text-xs" :style="{ color: 'var(--color-text-dim)' }">{{ t("pdf.privacy") }}</p>
    <p v-if="!error" class="text-xs" :style="{ color: 'var(--color-text-dim)' }">
      {{ t("pdf.printHint") }}
    </p>
  </div>
</template>

<style>
.preview-area h1 { font-size: 1.5em; font-weight: 700; margin: 0.8em 0 0.4em; }
.preview-area h2 { font-size: 1.25em; font-weight: 600; margin: 0.7em 0 0.3em; }
.preview-area h3 { font-size: 1.1em; font-weight: 600; margin: 0.6em 0 0.3em; }
.preview-area p { margin: 0 0 0.5em; }
.preview-area ul, .preview-area ol { padding-left: 1.5em; margin: 0.3em 0; }
.preview-area li { margin-bottom: 0.15em; }
.preview-area code { background: var(--color-surface-alt); padding: 0.1em 0.3em; border-radius: 0.2em; font-size: 0.9em; font-family: var(--font-mono); }
.preview-area pre { background: var(--color-surface-alt); padding: 0.8em; border-radius: 0.5em; overflow-x: auto; margin: 0.5em 0; }
.preview-area pre code { background: none; padding: 0; }
.preview-area blockquote { border-left: 3px solid var(--color-border); margin: 0.5em 0; padding: 0.2em 0 0.2em 0.8em; color: var(--color-text-muted); }
.preview-area table { border-collapse: collapse; width: 100%; margin: 0.5em 0; }
.preview-area th, .preview-area td { border: 1px solid var(--color-border); padding: 0.3em 0.5em; text-align: left; }
.preview-area th { background: var(--color-surface-alt); font-weight: 600; }
.preview-area hr { border: none; border-top: 1px solid var(--color-border); margin: 1em 0; }
.preview-area img { max-width: 100%; }
.preview-area a { color: var(--color-text); text-decoration: underline; }
.preview-area input[type="checkbox"] { width: 1em; height: 1em; margin-right: 0.3em; vertical-align: middle; }
</style>