<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(defineProps<{
  modelValue: string
  options: { value: string; label: string }[]
  disabled?: boolean
  placeholder?: string
}>(), { disabled: false })

const emit = defineEmits<{ "update:modelValue": [v: string] }>()

/**
 * Two-way binding computed for v-model support.
 *
 * Wraps the `modelValue` prop in a getter/setter so the native
 * `<select>` can use `v-model` while still emitting the expected
 * `update:modelValue` event to the parent.
 */
const selected = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
})
</script>

<template>
  <select
    v-model="selected"
    :disabled="disabled"
    class="px-3 py-1.5 rounded-md text-sm border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-shadow disabled:opacity-40 disabled:cursor-not-allowed"
    :style="{
      backgroundColor: 'var(--color-surface-alt)',
      borderColor: 'var(--color-border)',
      color: 'var(--color-text)',
    }"
  >
    <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
    <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
  </select>
</template>