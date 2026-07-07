<script setup lang="ts">
const props = withDefaults(defineProps<{
  tabs: { id: string; label: string }[]
  modelValue: string
}>(), {})

const emit = defineEmits<{ "update:modelValue": [v: string] }>()
</script>

<template>
  <div class="tab-nav-container">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-nav-btn"
      :class="{ 'is-active': modelValue === tab.id }"
      @click="emit('update:modelValue', tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-nav-container {
  display: flex;
  border-radius: 0.375rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.tab-nav-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
  color: var(--color-text-muted);
  background-color: transparent;
  cursor: pointer;
  outline: none;
}
.tab-nav-btn:hover {
  background-color: var(--color-surface-alt);
}
.tab-nav-btn:focus-visible {
  box-shadow: inset 0 0 0 2px var(--color-accent);
}

.tab-nav-btn.is-active {
  color: var(--color-accent-text);
  background-color: var(--color-accent);
}
.tab-nav-btn.is-active:hover {
  opacity: 0.9;
}
</style>
