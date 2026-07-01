<script setup lang="ts">
const props = withDefaults(defineProps<{
  tabs: { id: string; label: string }[]
  modelValue: string
}>(), {})

const emit = defineEmits<{ "update:modelValue": [v: string] }>()
</script>

<template>
  <div class="flex rounded-md overflow-hidden border" :style="{ borderColor: 'var(--color-border)' }">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="emit('update:modelValue', tab.id)"
      class="px-4 py-2 text-sm font-medium transition-all duration-200"
      :style="{
        backgroundColor: modelValue === tab.id ? 'var(--color-accent)' : 'transparent',
        color: modelValue === tab.id ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
      }"
    >
      {{ tab.label }}
    </button>
  </div>
</template>