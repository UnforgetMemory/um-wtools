import { ref } from "vue"

/**
 * Clipboard composable with auto-reset "copied" feedback state.
 *
 * Uses the modern Clipboard API when available, falling back to
 * execCommand("copy") via a temporary textarea for older browsers.
 */
export function useClipboard() {
  const copied = ref(false)

  async function copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
      return true
    } catch {
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
      return true
    }
  }

  return { copied, copy }
}