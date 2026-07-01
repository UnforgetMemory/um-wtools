<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  rows?: number
}>(), { readonly: false, disabled: false, rows: 12 })

const emit = defineEmits<{ "update:modelValue": [v: string] }>()
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :readonly="readonly"
    :disabled="disabled"
    :rows="rows"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    class="w-full p-4 rounded-lg border resize-y font-mono text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-shadow disabled:opacity-40"
    :style="{
      backgroundColor: readonly ? 'transparent' : 'var(--color-surface-alt)',
      borderColor: 'var(--color-border)',
      color: 'var(--color-text)',
    }"
  />
</template>