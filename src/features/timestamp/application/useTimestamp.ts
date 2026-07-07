import { ref, computed, onUnmounted } from "vue"
import { useI18n } from "vue-i18n"
import { parseTimestamp, computeResults, getAllTimezones } from "../domain/timestamp"
import type { ParseResult, TimestampResults, InputType } from "../domain/timestamp"

export type TimestampMode = "realtime" | "manual"

/**
 * Vue composable for the timestamp converter tool.
 *
 * Manages two modes:
 * - `realtime`: a live clock updated every second
 * - `manual`: user-provided input parsed into multiple timestamp formats
 *
 * Handles the realtime interval lifecycle so the clock stops ticking
 * when the component unmounts or when switching to manual mode.
 */
export function useTimestamp() {
  const { t } = useI18n()

  const mode = ref<TimestampMode>("realtime")
  const inputText = ref("")
  const now = ref(new Date())
  const parsedDate = ref<Date | null>(null)
  const parseResult = ref<ParseResult>({ type: null, date: null })

  let intervalId: ReturnType<typeof setInterval> | null = null

  /** Start the realtime clock by updating `now` every second. */
  function startRealtime() {
    stopRealtime()
    now.value = new Date()
    intervalId = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  /** Stop the realtime clock if it is running. */
  function stopRealtime() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /** Switch between realtime and manual mode, managing the clock interval accordingly. */
  function toggleMode(m: TimestampMode) {
    mode.value = m
    if (m === "realtime") {
      startRealtime()
    } else {
      stopRealtime()
    }
  }

  /** Parse the current manual input and update the parsed date state. */
  function parseInput() {
    if (!inputText.value.trim()) {
      parseResult.value = { type: null, date: null }
      parsedDate.value = null
      return
    }
    const result = parseTimestamp(inputText.value)
    parseResult.value = result
    parsedDate.value = result.date
  }

  /** Derived results based on the active mode: realtime `now` or manually parsed date. */
  const results = computed<TimestampResults | null>(() => {
    const date = mode.value === "realtime" ? now.value : parsedDate.value
    if (!date) return null
    return computeResults(date)
  })

  /** Localized label describing the detected input format (e.g. "Unix Seconds", "ISO 8601"). */
  const inputFormatLabel = computed<string>(() => {
    const type = parseResult.value.type
    if (!type) return ""
    const key =
      type === "unix-seconds"
        ? "timestamp.typeUnixSeconds"
        : type === "unix-milliseconds"
          ? "timestamp.typeUnixMilliseconds"
          : "timestamp.typeIso"
    return t(key)
  })

  // Start realtime on creation
  startRealtime()

  onUnmounted(() => {
    stopRealtime()
  })

  return {
    mode,
    inputText,
    now,
    parsedDate,
    parseResult,
    results,
    inputFormatLabel,
    toggleMode,
    parseInput,
    startRealtime,
    stopRealtime,
  }
}
