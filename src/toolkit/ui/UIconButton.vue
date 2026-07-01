<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  size?: "sm" | "md"
  disabled?: boolean
}>(), { size: "md", disabled: false })
</script>

<template>
  <button
    :disabled="disabled"
    :title="label"
    :aria-label="label"
    :class="[
      'inline-flex items-center justify-center rounded-md transition-all duration-200 hover:bg-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-40',
      size === 'sm' ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-base',
    ]"
    :style="{ color: 'var(--color-text-muted)' }"
  >
    <slot />
  </button>
</template>