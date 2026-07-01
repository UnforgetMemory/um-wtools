<script setup lang="ts">
withDefaults(defineProps<{
  variant?: "default" | "elevated" | "bordered"
  padding?: "sm" | "md" | "lg"
}>(), { variant: "default", padding: "md" })
</script>

<template>
  <div
    :class="[
      'rounded-lg transition-shadow',
      padding === 'sm' && 'p-4',
      padding === 'md' && 'p-6',
      padding === 'lg' && 'p-8',
      variant === 'elevated' && 'shadow-sm',
      variant === 'bordered' && 'border',
    ]"
    :style="{
      backgroundColor: 'var(--color-surface-card)',
      borderColor: variant === 'bordered' ? 'var(--color-border)' : undefined,
      boxShadow: variant === 'elevated' ? '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' : undefined,
    }"
  >
    <slot />
  </div>
</template>