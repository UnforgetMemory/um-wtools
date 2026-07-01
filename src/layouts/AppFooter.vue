<script setup lang="ts">
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>

<template>
  <footer class="border-t py-6 text-center text-sm" :style="{ borderColor: 'var(--color-border)', color: 'var(--color-text-dim)' }">
    <p>{{ t("footer.text") }}</p>
  </footer>
</template>