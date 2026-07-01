import { ref } from "vue"
import type { ToolTab } from "../types"

const activeTool = ref<ToolTab | null>(null)

export function useActiveTool() {
  function navigate(tab: ToolTab) {
    activeTool.value = tab
  }

  function goHome() {
    activeTool.value = null
  }

  return { activeTool, navigate, goHome }
}