<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useI18n } from "vue-i18n"
import { useTimestamp } from "../application/useTimestamp"
import UButton from "../../../toolkit/ui/UButton.vue"
import UCard from "../../../toolkit/ui/UCard.vue"
import UTextarea from "../../../toolkit/ui/UTextarea.vue"
import UTabNav from "../../../toolkit/ui/UTabNav.vue"

const { t } = useI18n()
const {
  mode, inputText, now, parsedDate, parseResult,
  results, inputFormatLabel, toggleMode, parseInput,
} = useTimestamp()

watch(inputText, parseInput)

const copiedText = ref<string | null>(null)
const justCopied = ref<string | null>(null)

/**
 * Copy a value to the clipboard with a fallback for older browsers.
 *
 * Uses the modern Clipboard API first, then falls back to creating a
 * temporary textarea and using `execCommand("copy")`.
 */
async function copyValue(val: string) {
  try {
    await navigator.clipboard.writeText(val)
  } catch {
    const ta = document.createElement("textarea")
    ta.value = val
    document.body.appendChild(ta)
    ta.select()
    document.execCommand("copy")
    document.body.removeChild(ta)
  }
  copiedText.value = val
  justCopied.value = val
  setTimeout(() => { justCopied.value = null }, 600)
  setTimeout(() => { copiedText.value = null }, 2000)
}

/** Check whether a specific value is currently shown as copied. */
function isCopied(val: string): boolean {
  return copiedText.value === val
}

/** Check whether a value just got copied (for flash animation). */
function isJustCopied(val: string): boolean {
  return justCopied.value === val
}

/** Format a Date as a short localized date string (e.g. "Mon, Jul 7, 2026"). */
function dateStr(d: Date): string {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", weekday: "short" })
}

/** Format a Date as a 24-hour time string (e.g. "14:30:45"). */
function timeStr(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Mode tabs -->
    <div>
      <UTabNav
        :tabs="[
          { id: 'realtime', label: t('timestamp.realTime') },
          { id: 'manual', label: t('timestamp.manual') },
        ]"
        :model-value="mode"
        @update:model-value="toggleMode($event as 'realtime' | 'manual')"
      />
    </div>

    <!-- Real-time mode -->
    <template v-if="mode === 'realtime'">
      <div class="hover-clock">
        <UCard variant="elevated" padding="lg">
          <div class="flex items-center gap-2 mb-2">
            <span class="live-dot" />
            <p class="text-xs font-medium uppercase tracking-wider" :style="{ color: 'var(--color-text-muted)' }">
              {{ t("timestamp.currentTime") }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-sm mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ dateStr(now) }}</p>
            <p class="clock-time text-5xl sm:text-6xl font-mono font-bold tracking-wider" :style="{ color: 'var(--color-accent)' }">
              {{ timeStr(now) }}
            </p>
          </div>
        </UCard>
      </div>
    </template>

    <!-- Manual mode -->
    <template v-if="mode === 'manual'">
      <div>
        <label class="block text-sm font-medium mb-2" :style="{ color: 'var(--color-text-muted)' }">
          {{ t("timestamp.timestampInput") }}
        </label>
        <UTextarea
          :model-value="inputText"
          rows="4"
          :placeholder="t('timestamp.placeholderInput')"
          @update:model-value="inputText = $event"
        />
        <div v-if="inputFormatLabel" class="mt-2">
          <span
            class="inline-block px-3 py-1 text-xs font-medium rounded-full"
            :style="{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }"
          >
            {{ t("timestamp.detected", { type: inputFormatLabel }) }}
          </span>
        </div>
      </div>
    </template>

    <!-- Summary (displayed in both modes when results available) -->
    <div v-if="results" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div
        v-for="(item, idx) in [
          { label: t('timestamp.unixSeconds'), val: String(results.unixSeconds) },
          { label: t('timestamp.unixMilliseconds'), val: String(results.unixMilliseconds) },
          { label: t('timestamp.isoLocal'), val: results.isoLocal },
        ]"
        :key="idx"
        class="hover-card"
        tabindex="0"
        @keydown.enter="copyValue(item.val)"
      >
        <UCard variant="bordered" padding="sm">
          <p class="text-xs font-medium mb-1" :style="{ color: 'var(--color-text-muted)' }">{{ item.label }}</p>
          <p class="text-sm font-mono break-all" :style="{ color: 'var(--color-text)' }">{{ item.val }}</p>
          <UButton
            size="sm"
            variant="ghost"
            class="mt-1 copy-btn"
            :class="{
              'is-copied': isCopied(item.val),
              'copy-flash': isJustCopied(item.val),
            }"
            @click="copyValue(item.val)"
          >
            {{ isCopied(item.val) ? t("timestamp.copied") : t("timestamp.copy") }}
          </UButton>
        </UCard>
      </div>
    </div>

    <!-- Timezone table: desktop uses a table, mobile uses stacked cards. -->
    <div v-if="results">
      <div class="hidden md:block">
        <table class="w-full text-sm rounded-lg overflow-hidden" :style="{ borderCollapse: 'separate', borderSpacing: '0 3px' }">
          <thead>
            <tr class="text-xs font-medium uppercase tracking-wider" :style="{ color: 'var(--color-text-muted)' }">
              <th class="text-left px-4 py-2 w-[120px]">{{ t("timestamp.timezone") }}</th>
              <th class="text-left px-4 py-2">{{ t("timestamp.isoFormat") }}</th>
              <th class="text-left px-4 py-2">{{ t("timestamp.humanReadable") }}</th>
              <th class="text-right px-4 py-2 w-[100px]">{{ t("timestamp.copy") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tzr in results.timezones" :key="tzr.tz.id"
              class="tz-row rounded-md"
              :style="{ backgroundColor: 'var(--color-surface-alt)' }"
              tabindex="0"
              @keydown.enter="copyValue(tzr.iso)"
            >
              <td class="px-4 py-2.5 font-medium" :style="{ color: 'var(--color-text)' }">
                <span class="block text-xs" :style="{ color: 'var(--color-text-dim)' }">{{ tzr.tz.city }}</span>
                <span>{{ tzr.tz.id }}</span>
              </td>
              <td class="px-4 py-2.5 font-mono text-xs" :style="{ color: 'var(--color-text)' }">
                {{ tzr.iso }}
              </td>
              <td class="px-4 py-2.5 text-xs" :style="{ color: 'var(--color-text)' }">
                <span class="line-clamp-1">{{ tzr.human }}</span>
              </td>
              <td class="px-4 py-2.5 text-right">
                <div class="inline-flex gap-1">
                  <UButton
                    size="sm" variant="ghost"
                    class="copy-btn"
                    :class="{
                      'is-copied': isCopied(tzr.iso),
                      'copy-flash': isJustCopied(tzr.iso),
                    }"
                    @click="copyValue(tzr.iso)"
                  >
                    {{ isCopied(tzr.iso) ? t("timestamp.copied") : t("timestamp.copyIso") }}
                  </UButton>
                  <UButton
                    size="sm" variant="ghost"
                    class="copy-btn"
                    :class="{
                      'is-copied': isCopied(tzr.human),
                      'copy-flash': isJustCopied(tzr.human),
                    }"
                    @click="copyValue(tzr.human)"
                  >
                    {{ isCopied(tzr.human) ? t("timestamp.copied") : t("timestamp.copy") }}
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: card layout instead of table for small screens. -->
      <div class="md:hidden space-y-3">
        <div
          v-for="tzr in results.timezones" :key="tzr.tz.id"
          class="hover-card"
          tabindex="0"
          @keydown.enter="copyValue(tzr.iso)"
        >
          <UCard variant="bordered" padding="sm">
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-sm" :style="{ color: 'var(--color-text)' }">{{ tzr.tz.city }}</span>
              <span class="text-xs" :style="{ color: 'var(--color-text-dim)' }">{{ tzr.tz.id }}</span>
            </div>
            <div class="space-y-1.5">
              <div class="flex items-start justify-between gap-2">
                <span class="font-mono text-xs break-all" :style="{ color: 'var(--color-text)' }">{{ tzr.iso }}</span>
                <UButton
                  size="sm" variant="ghost"
                  class="copy-btn shrink-0"
                  :class="{
                    'is-copied': isCopied(tzr.iso),
                    'copy-flash': isJustCopied(tzr.iso),
                  }"
                  @click="copyValue(tzr.iso)"
                >
                  {{ isCopied(tzr.iso) ? t("timestamp.copied") : t("timestamp.copyIso") }}
                </UButton>
              </div>
              <div class="flex items-start justify-between gap-2">
                <span class="text-xs" :style="{ color: 'var(--color-text)' }">{{ tzr.human }}</span>
                <UButton
                  size="sm" variant="ghost"
                  class="copy-btn shrink-0"
                  :class="{
                    'is-copied': isCopied(tzr.human),
                    'copy-flash': isJustCopied(tzr.human),
                  }"
                  @click="copyValue(tzr.human)"
                >
                  {{ isCopied(tzr.human) ? t("timestamp.copied") : t("timestamp.copy") }}
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="mode === 'manual' && inputText && !results" class="p-4 rounded-md text-sm" :style="{ backgroundColor: 'var(--color-error)', color: 'white' }">
      {{ t("timestamp.error.invalid") }}
    </div>

    <!-- Privacy note -->
    <p class="text-xs" :style="{ color: 'var(--color-text-dim)' }">{{ t("timestamp.privacy") }}</p>
  </div>
</template>

<style scoped>
/* ============================================
   Interactive card — summary & mobile cards
   ============================================ */
.hover-card {
  position: relative;
  border-radius: 0.75rem;
  cursor: default;
  outline: none;
  transition: background-color 0.25s ease, transform 0.2s ease;
}
.hover-card:hover {
  transform: translateY(-2px);
}
.hover-card:focus-visible {
  box-shadow: 0 0 0 2px var(--color-accent), 0 0 0 4px var(--color-surface);
}
.hover-card:active {
  transform: translateY(0);
}

/* UCard inside hover-card — elevate on hover */
.hover-card :deep(.rounded-lg) {
  transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}
.hover-card:hover :deep(.rounded-lg) {
  background-color: var(--color-surface-alt) !important;
  border-color: var(--color-border-strong) !important;
  box-shadow:
    inset 3px 0 0 0 var(--color-accent),
    0 4px 16px rgba(0,0,0,0.07),
    0 1px 4px rgba(0,0,0,0.04);
}

/* Dark-mode shadow overrides */
[data-theme="dark"] .hover-card:hover :deep(.rounded-lg) {
  box-shadow:
    inset 3px 0 0 0 var(--color-accent),
    0 4px 16px rgba(0,0,0,0.35),
    0 1px 4px rgba(0,0,0,0.2);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) .hover-card:hover :deep(.rounded-lg) {
    box-shadow:
      inset 3px 0 0 0 var(--color-accent),
      0 4px 16px rgba(0,0,0,0.35),
      0 1px 4px rgba(0,0,0,0.2);
  }
}

/* ============================================
   Timezone table row
   ============================================ */
.tz-row {
  position: relative;
  cursor: default;
  outline: none;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
.tz-row:hover {
  background-color: var(--color-surface-hover) !important;
}
.tz-row:focus-visible {
  box-shadow: inset 0 0 0 2px var(--color-accent);
}

/* Dark-mode row hover accent */
[data-theme="dark"] .tz-row:hover {
  box-shadow: inset 3px 0 0 0 var(--color-accent);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) .tz-row:hover {
    box-shadow: inset 3px 0 0 0 var(--color-accent);
  }
}

/* ============================================
   Real-time clock card — hover + live indicator
   ============================================ */
.hover-clock :deep(.rounded-lg) {
  transition: box-shadow 0.25s ease;
}
.hover-clock:hover :deep(.rounded-lg) {
  box-shadow:
    0 2px 8px rgba(0,0,0,0.07),
    0 1px 3px rgba(0,0,0,0.04);
}
[data-theme="dark"] .hover-clock:hover :deep(.rounded-lg) {
  box-shadow: 0 2px 12px rgba(0,0,0,0.35);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]):not([data-theme="dark"]) .hover-clock:hover :deep(.rounded-lg) {
    box-shadow: 0 2px 12px rgba(0,0,0,0.35);
  }
}

.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: oklch(0.55 0.18 150);
  box-shadow: 0 0 6px oklch(0.55 0.18 150 / 0.5);
  animation: live-pulse 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes live-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.clock-time {
  transition: color 0.3s ease;
}
.hover-clock:hover .clock-time {
  opacity: 0.85;
}

/* ============================================
   Buttons — copy action
   ============================================ */
.copy-btn {
  opacity: 0.55;
  transition: opacity 0.2s ease, background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
}
.copy-btn:hover {
  opacity: 1;
}

/* Reveal on parent hover */
.hover-card:hover .copy-btn,
.tz-row:hover .copy-btn {
  opacity: 1;
}

/* Copied success state */
.copy-btn.is-copied {
  opacity: 1 !important;
  color: var(--color-success) !important;
}
[data-theme="dark"] .copy-btn.is-copied {
  color: oklch(0.6 0.18 150) !important;
}
.copy-btn.is-copied:hover {
  background-color: oklch(0.55 0.18 150 / 0.12) !important;
}
[data-theme="dark"] .copy-btn.is-copied:hover {
  background-color: oklch(0.6 0.18 150 / 0.15) !important;
}

/* Copy success flash animation */
.copy-flash {
  animation: flash-pop 0.35s ease-out;
}
@keyframes flash-pop {
  0% { transform: scale(0.85); opacity: 0.4; }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

/* ============================================
   Tab nav — hover on inactive tabs
   ============================================ */
</style>
