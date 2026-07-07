import { ref, watch } from "vue"
import type { ThemeMode } from "../types"

const STORAGE_KEY = "um-wtools-theme"

const theme = ref<ThemeMode>(loadTheme())

/** Load the persisted theme from localStorage, falling back to "system". */
function loadTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored
  }
  return "system"
}

/**
 * Apply a theme mode to the document root element.
 *
 * In "system" mode, delegates to the OS-level prefers-color-scheme media query.
 */
function applyTheme(t: ThemeMode): void {
  const isDark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.dataset.theme = isDark ? "dark" : "light"
}

applyTheme(theme.value)

// Persist theme changes to localStorage and apply the new mode.
watch(theme, (val) => {
  localStorage.setItem(STORAGE_KEY, val)
  applyTheme(val)
})

// Listen for OS-level scheme changes so system mode stays in sync without a page reload.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (theme.value === "system") {
    applyTheme("system")
  }
})

/**
 * Access the reactive theme mode.
 *
 * The value is persisted to localStorage and re-applied on next visit.
 * Set `theme.value` to "light", "dark", or "system" to change.
 */
export function useTheme() {
  return { theme }
}