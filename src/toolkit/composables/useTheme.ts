import { ref, watch } from "vue"
import type { ThemeMode } from "../types"

const STORAGE_KEY = "um-wtools-theme"

const theme = ref<ThemeMode>(loadTheme())

function loadTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored
  }
  return "system"
}

function applyTheme(t: ThemeMode): void {
  const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.dataset.theme = isDark ? "dark" : "light"
}

applyTheme(theme.value)

watch(theme, (val) => {
  localStorage.setItem(STORAGE_KEY, val)
  applyTheme(val)
})

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (theme.value === "system") {
    applyTheme("system")
  }
})

export function useTheme() {
  return { theme }
}