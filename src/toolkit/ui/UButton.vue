<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}>(), { variant: "primary", size: "md", disabled: false })

const btnStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.variant === "primary") {
    s.backgroundColor = "var(--color-accent)"
    s.color = "var(--color-accent-text)"
  } else if (props.variant === "danger") {
    s.backgroundColor = "var(--color-error)"
    s.color = "white"
  } else if (props.variant === "secondary") {
    s.borderColor = "var(--color-border)"
    s.color = "var(--color-text)"
  } else if (props.variant === "ghost") {
    s.color = "var(--color-text)"
  }
  return s
})
</script>

<template>
  <button
    :disabled="disabled"
    :style="btnStyle"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed',
      size === 'sm' && 'px-3 py-1.5 text-xs',
      size === 'md' && 'px-5 py-2 text-sm',
      size === 'lg' && 'px-7 py-3 text-base',
      variant === 'primary' && 'shadow-sm hover:opacity-90',
      variant === 'secondary' && 'border hover:bg-surface-alt',
      variant === 'ghost' && 'hover:bg-surface-alt',
      variant === 'danger' && 'hover:opacity-90',
    ]"
  >
    <slot />
  </button>
</template>