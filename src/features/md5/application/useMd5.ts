import { ref, computed } from "vue"
import { md5 as md5Hash } from "../domain/md5"

/**
 * MD5 composable wrapping the domain-layer pure function.
 *
 * Provides reactive input/output state and a copy helper for the UI.
 */
export function useMd5() {
  const input = ref("")
  const output = computed(() => {
    if (!input.value.trim()) return ""
    return md5Hash(input.value)
  })

  return { input, output }
}