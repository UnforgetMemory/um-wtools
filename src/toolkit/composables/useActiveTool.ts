import { computed } from "vue"
import { useRouter, useRoute } from "vue-router"
import type { ToolTab } from "../types"

/**
 * Active tool state backed by vue-router.
 *
 * `activeTool` is a computed derived from the current route name.
 * `navigate` and `goHome` delegate to the router, enabling proper
 * URL-based navigation with browser history support.
 */
export function useActiveTool() {
  const router = useRouter()
  const route = useRoute()

  const activeTool = computed<ToolTab | null>(() => {
    const name = route.name
    if (!name || name === "home") return null
    return name as ToolTab
  })

  function navigate(tab: ToolTab) {
    router.push({ name: tab })
  }

  function goHome() {
    router.push({ name: "home" })
  }

  return { activeTool, navigate, goHome }
}
