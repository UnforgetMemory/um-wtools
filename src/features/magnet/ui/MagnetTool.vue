<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"
import { useMagnet } from "../application/useMagnet"
import { formatBytes, torrentToMagnetUri } from "../domain/magnet"
import UButton from "../../../toolkit/ui/UButton.vue"
import UCard from "../../../toolkit/ui/UCard.vue"
import UTextarea from "../../../toolkit/ui/UTextarea.vue"
import UTabNav from "../../../toolkit/ui/UTabNav.vue"

const { t } = useI18n()
const {
  tab, magnetInput, parsed, parseError, parseLoading,
  torrentFileName, headerInput, headerResult,
  doParse, handleTorrentUpload, switchTab,
} = useMagnet()

const magnetUri = computed(() => {
  if (!parsed.value) return ""
  return torrentToMagnetUri(parsed.value)
})

watch(magnetInput, () => {
  if (magnetInput.value.trim()) doParse()
  else { parsed.value = null; parseError.value = null }
})

const fileInput = ref<HTMLInputElement | null>(null)
const dragOver = ref(false)
function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) handleTorrentUpload(input.files[0])
}
function onDrop(e: DragEvent) {
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file?.name.endsWith(".torrent")) handleTorrentUpload(file)
}
function triggerFilePicker() { fileInput.value?.click() }

const copiedText = ref<string | null>(null)
async function copyValue(val: string) {
  try { await navigator.clipboard.writeText(val) } catch {
    const ta = document.createElement("textarea"); ta.value = val
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta)
  }
  copiedText.value = val
  setTimeout(() => { copiedText.value = null }, 2000)
}
function isCopied(val: string): boolean { return copiedText.value === val }

function headerTypeLabel(): string {
  if (headerResult.value.hasPrefix) return t("magnet.detectedMagnet")
  if (headerResult.value.infoHash) return t("magnet.detectedHash")
  return ""
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <UTabNav
        :tabs="[
          { id: 'parse', label: t('magnet.parse') },
          { id: 'header', label: t('magnet.header') },
        ]"
        :model-value="tab"
        @update:model-value="switchTab($event as 'parse' | 'header')"
      />
    </div>

    <!-- PARSE TAB -->
    <template v-if="tab === 'parse'">
      <UCard variant="bordered" padding="sm">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.magnetInput") }}</label>
            <UTextarea :model-value="magnetInput" rows="3" :placeholder="t('magnet.magnetPlaceholder')" @update:model-value="magnetInput = $event" />
          </div>
          <div class="flex items-center gap-3">
            <span class="flex-1 border-t" :style="{ borderColor: 'var(--color-border)' }" />
            <span class="text-xs font-medium" :style="{ color: 'var(--color-text-dim)' }">{{ t("magnet.orUpload") }}</span>
            <span class="flex-1 border-t" :style="{ borderColor: 'var(--color-border)' }" />
          </div>
          <div>
            <input ref="fileInput" type="file" accept=".torrent" class="hidden" @change="onFileSelected" />
            <div class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors"
              :class="{ 'drag-over': dragOver }"
              :style="{ borderColor: dragOver ? 'var(--color-accent)' : 'var(--color-border)', backgroundColor: dragOver ? 'var(--color-surface-alt)' : 'transparent' }"
              @click="triggerFilePicker" @dragover.prevent="dragOver = true" @dragleave="dragOver = false" @drop.prevent="onDrop"
            >
              <p class="text-sm" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.uploadTorrent") }}</p>
              <p v-if="torrentFileName" class="text-xs mt-1" :style="{ color: 'var(--color-text-dim)' }">{{ torrentFileName }}</p>
            </div>
          </div>
        </div>
      </UCard>

      <div v-if="parseLoading" class="text-center py-8"><p class="text-sm" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.parsing") }}</p></div>
      <div v-if="parseError && !parseLoading" class="p-4 rounded-md text-sm" :style="{ backgroundColor: 'var(--color-error)', color: 'white' }">{{ parseError }}</div>

      <template v-if="parsed && !parseLoading">
        <p class="text-sm font-semibold" :style="{ color: 'var(--color-text)' }">{{ t("magnet.parseResult") }}</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="hover-card" tabindex="0" @keydown.enter="copyValue(parsed!.infoHash)">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.infoHash") }}</p>
              <p class="text-sm font-mono break-all" :style="{ color: 'var(--color-text)' }">{{ parsed!.infoHash }}</p>
              <UButton size="sm" variant="ghost" class="mt-1 copy-btn" :class="{ 'is-copied': isCopied(parsed!.infoHash) }" @click="copyValue(parsed!.infoHash)">{{ isCopied(parsed!.infoHash) ? t("magnet.copied") : t("magnet.copy") }}</UButton>
            </UCard>
          </div>
          <div v-if="parsed!.name" class="hover-card" tabindex="0" @keydown.enter="copyValue(parsed!.name ?? '')">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.name") }}</p>
              <p class="text-sm break-all" :style="{ color: 'var(--color-text)' }">{{ parsed!.name }}</p>
              <UButton size="sm" variant="ghost" class="mt-1 copy-btn" :class="{ 'is-copied': isCopied(parsed!.name!) }" @click="copyValue(parsed!.name!)">{{ isCopied(parsed!.name!) ? t("magnet.copied") : t("magnet.copy") }}</UButton>
            </UCard>
          </div>
          <div v-if="parsed!.length != null">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.totalSize") }}</p>
              <p class="text-sm font-mono" :style="{ color: 'var(--color-text)' }">{{ formatBytes(parsed!.length) }}</p>
            </UCard>
          </div>
          <div v-if="parsed!.pieceLength != null">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.pieceLength") }}</p>
              <p class="text-sm font-mono" :style="{ color: 'var(--color-text)' }">{{ formatBytes(parsed!.pieceLength) }}</p>
            </UCard>
          </div>
          <div v-if="parsed!.pieces">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.pieces") }}</p>
              <p class="text-sm font-mono" :style="{ color: 'var(--color-text)' }">{{ parsed!.pieces.length.toLocaleString() }}</p>
            </UCard>
          </div>
          <div v-if="parsed!.private != null">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.private") }}</p>
              <p class="text-sm" :style="{ color: parsed!.private ? 'var(--color-error)' : 'var(--color-success)' }">{{ parsed!.private ? t("magnet.yes") : t("magnet.no") }}</p>
            </UCard>
          </div>
          <div v-if="parsed!.created">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.created") }}</p>
              <p class="text-sm" :style="{ color: 'var(--color-text)' }">{{ parsed!.created.toLocaleString() }}</p>
            </UCard>
          </div>
          <div v-if="parsed!.createdBy">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.createdBy") }}</p>
              <p class="text-sm" :style="{ color: 'var(--color-text)' }">{{ parsed!.createdBy }}</p>
            </UCard>
          </div>
          <div v-if="parsed!.comment" class="sm:col-span-2">
            <UCard variant="bordered" padding="sm">
              <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.comment") }}</p>
              <p class="text-sm" :style="{ color: 'var(--color-text)' }">{{ parsed!.comment }}</p>
            </UCard>
          </div>
        </div>

        <!-- torrent→magnet -->
        <div v-if="parsed!.files && parsed!.files.length > 0" class="hover-card" tabindex="0" @keydown.enter="copyValue(magnetUri)">
          <UCard variant="bordered" padding="sm">
            <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.magnetLink") }}</p>
            <p class="text-sm font-mono break-all" :style="{ color: 'var(--color-text)' }">{{ magnetUri }}</p>
            <UButton size="sm" variant="ghost" class="mt-1 copy-btn" :class="{ 'is-copied': isCopied(magnetUri) }" @click="copyValue(magnetUri)">{{ isCopied(magnetUri) ? t("magnet.copied") : t("magnet.copy") }}</UButton>
          </UCard>
        </div>

        <div v-if="parsed!.files && parsed!.files.length > 0">
          <p class="text-sm font-semibold mb-2" :style="{ color: 'var(--color-text)' }">{{ t("magnet.files") }} ({{ parsed!.files.length }})</p>
          <div class="space-y-1">
            <div v-for="(f, idx) in parsed!.files" :key="idx" class="flex items-center justify-between px-4 py-2 rounded-md text-sm" :style="{ backgroundColor: 'var(--color-surface-alt)' }">
              <span class="truncate flex-1" :style="{ color: 'var(--color-text)' }">{{ f.path }}</span>
              <span class="ml-3 font-mono text-xs shrink-0" :style="{ color: 'var(--color-text-dim)' }">{{ formatBytes(f.length) }}</span>
            </div>
          </div>
        </div>

        <div v-if="parsed!.announce && parsed!.announce.length > 0">
          <p class="text-sm font-semibold mb-2" :style="{ color: 'var(--color-text)' }">{{ t("magnet.trackers") }} ({{ parsed!.announce.length }})</p>
          <div class="space-y-1">
            <div v-for="(tr, idx) in parsed!.announce" :key="idx" class="px-4 py-2 rounded-md text-xs font-mono break-all" :style="{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-dim)' }">{{ tr }}</div>
          </div>
        </div>
      </template>
    </template>

    <!-- HEADER TAB -->
    <template v-if="tab === 'header'">
      <div>
        <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.headerInput") }}</label>
        <UTextarea :model-value="headerInput" rows="3" :placeholder="t('magnet.headerPlaceholder')" @update:model-value="headerInput = $event" />
        <div v-if="headerInput.trim()" class="mt-2">
          <span class="inline-block px-3 py-1 text-xs font-medium rounded-full"
            :style="{ backgroundColor: headerResult.infoHash ? 'var(--color-accent)' : 'var(--color-error)', color: headerResult.infoHash ? 'var(--color-accent-text)' : 'white' }"
          >{{ t("magnet.detected", { type: headerTypeLabel() || t("magnet.detectedUnknown") }) }}</span>
        </div>
        <div v-if="headerResult.infoHash" class="flex flex-wrap gap-3 mt-4">
          <UButton v-if="headerResult.hasPrefix" variant="primary" size="sm" @click="headerInput = headerResult.stripped">{{ t("magnet.btnStrip") }}</UButton>
          <UButton v-else variant="primary" size="sm" @click="headerInput = headerResult.prefixed">{{ t("magnet.btnAdd") }}</UButton>
        </div>
      </div>
      <div v-if="headerInput.trim()" class="grid grid-cols-1 gap-4">
        <div class="hover-card" tabindex="0" @keydown.enter="copyValue(headerResult.stripped)">
          <UCard variant="bordered" padding="sm">
            <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.resultStripped") }}</p>
            <p class="text-sm font-mono break-all" :style="{ color: 'var(--color-text)' }">{{ headerResult.stripped }}</p>
            <UButton size="sm" variant="ghost" class="mt-1 copy-btn" :class="{ 'is-copied': isCopied(headerResult.stripped) }" @click="copyValue(headerResult.stripped)">{{ isCopied(headerResult.stripped) ? t("magnet.copied") : t("magnet.copy") }}</UButton>
          </UCard>
        </div>
        <div class="hover-card" tabindex="0" @keydown.enter="copyValue(headerResult.prefixed)">
          <UCard variant="bordered" padding="sm">
            <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ t("magnet.resultPrefixed") }}</p>
            <p class="text-sm font-mono break-all" :style="{ color: 'var(--color-text)' }">{{ headerResult.prefixed }}</p>
            <UButton size="sm" variant="ghost" class="mt-1 copy-btn" :class="{ 'is-copied': isCopied(headerResult.prefixed) }" @click="copyValue(headerResult.prefixed)">{{ isCopied(headerResult.prefixed) ? t("magnet.copied") : t("magnet.copy") }}</UButton>
          </UCard>
        </div>
      </div>
    </template>

    <p class="text-xs" :style="{ color: 'var(--color-text-dim)' }">{{ t("magnet.privacy") }}</p>
  </div>
</template>

<style scoped>
.hover-card { position:relative; border-radius:0.75rem; cursor:default; outline:none; transition:background-color 0.25s ease, transform 0.2s ease; }
.hover-card:hover { transform:translateY(-2px); }
.hover-card:focus-visible { box-shadow:0 0 0 2px var(--color-accent), 0 0 0 4px var(--color-surface); }
.hover-card:active { transform:translateY(0); }
.hover-card :deep(.rounded-lg) { transition:background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; }
.hover-card:hover :deep(.rounded-lg) { background-color:var(--color-surface-alt) !important; border-color:var(--color-border-strong) !important; box-shadow:inset 3px 0 0 0 var(--color-accent), 0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04); }
[data-theme="dark"] .hover-card:hover :deep(.rounded-lg) { box-shadow:inset 3px 0 0 0 var(--color-accent), 0 4px 16px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2); }
@media (prefers-color-scheme:dark) { :root:not([data-theme="light"]):not([data-theme="dark"]) .hover-card:hover :deep(.rounded-lg) { box-shadow:inset 3px 0 0 0 var(--color-accent), 0 4px 16px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2); } }
.copy-btn { opacity:0.55; transition:opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease, transform 0.15s ease; }
.copy-btn:hover { opacity:1; }
.hover-card:hover .copy-btn { opacity:1; }
.copy-btn.is-copied { opacity:1 !important; color:var(--color-success) !important; }
[data-theme="dark"] .copy-btn.is-copied { color:oklch(0.6 0.18 150) !important; }
/* UTabNav hover uses its own scoped styles */
.drag-over { border-color:var(--color-accent) !important; }
</style>
