import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"
import {
  parseMagnetUri,
  parseTorrentFile,
  computeHeaderResult,
} from "../domain/magnet"
import type { MagnetTab, MagnetParsed, MagnetHeaderResult } from "../domain/magnet"

export type { MagnetTab, MagnetParsed, MagnetHeaderResult }

export function useMagnet() {
  const { t } = useI18n()

  const tab = ref<MagnetTab>("parse")

  /* ---- Parse ---- */
  const magnetInput = ref("")
  const parsed = ref<MagnetParsed | null>(null)
  const parseError = ref<string | null>(null)
  const parseLoading = ref(false)
  const torrentFileName = ref<string | null>(null)

  /* ---- Header ---- */
  const headerInput = ref("")
  const headerResult = computed<MagnetHeaderResult>(() => computeHeaderResult(headerInput.value))

  async function doParse() {
    const text = magnetInput.value.trim()
    if (!text && !torrentFileName.value) {
      parsed.value = null; parseError.value = t("magnet.error.empty"); return
    }
    if (text) {
      parseLoading.value = true; parseError.value = null; parsed.value = null
      try {
        const r = parseMagnetUri(text)
        if (r) parsed.value = r
        else parseError.value = t("magnet.error.invalidInput")
      } finally { parseLoading.value = false }
    }
  }

  async function handleTorrentUpload(file: File) {
    torrentFileName.value = file.name
    parseLoading.value = true; parseError.value = null; parsed.value = null
    try {
      const buf = new Uint8Array(await file.arrayBuffer())
      const r = await parseTorrentFile(buf)
      if (r) parsed.value = r
      else parseError.value = t("magnet.error.invalidTorrent")
    } catch (err) {
      parseError.value = t("magnet.error.parseFailed", { msg: err instanceof Error ? err.message : String(err) })
    } finally { parseLoading.value = false }
  }

  function switchTab(newTab: MagnetTab) {
    tab.value = newTab
  }

  return {
    tab,
    magnetInput, parsed, parseError, parseLoading, torrentFileName,
    headerInput, headerResult,
    doParse, handleTorrentUpload, switchTab,
  }
}
