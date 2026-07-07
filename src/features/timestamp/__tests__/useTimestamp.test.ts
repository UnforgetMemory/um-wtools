import { describe, it, expect, vi, afterEach } from "vitest"
import { createApp, type App } from "vue"

vi.mock("vue-i18n", () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

import { useTimestamp } from "../application/useTimestamp"

function mountComposable() {
  let result!: ReturnType<typeof useTimestamp>
  const app = createApp({
    setup() {
      result = useTimestamp()
      return () => {}
    },
  })
  const root = document.createElement("div")
  app.mount(root)
  return { result, app }
}

describe("useTimestamp", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("initializes in realtime mode", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    expect(result.mode.value).toBe("realtime")
    app.unmount()
  })

  it("updates now.value periodically in realtime mode", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    const snap = result.now.value.getTime()
    vi.advanceTimersByTime(1000)
    expect(result.now.value.getTime() - snap).toBe(1000)
    app.unmount()
  })

  it("stops updating after unmount", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    app.unmount()
    const snap = result.now.value.getTime()
    vi.advanceTimersByTime(2000)
    expect(result.now.value.getTime()).toBe(snap)
  })

  it("toggleMode('manual') stops realtime updates", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    result.toggleMode("manual")
    expect(result.mode.value).toBe("manual")
    const snap = result.now.value.getTime()
    vi.advanceTimersByTime(1000)
    expect(result.now.value.getTime()).toBe(snap)
    app.unmount()
  })

  it("toggleMode('realtime') restarts updates", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    result.toggleMode("manual")
    result.toggleMode("realtime")
    expect(result.mode.value).toBe("realtime")
    const snap = result.now.value.getTime()
    vi.advanceTimersByTime(1000)
    expect(result.now.value.getTime()).toBeGreaterThan(snap)
    app.unmount()
  })

  it("parseInput parses valid ISO text", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    result.toggleMode("manual")
    result.inputText.value = "2024-01-15T10:30:00Z"
    result.parseInput()
    expect(result.parseResult.value.type).toBe("iso")
    expect(result.parsedDate.value).toBeInstanceOf(Date)
    app.unmount()
  })

  it("parseInput resets state for empty text", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    result.toggleMode("manual")
    result.inputText.value = "   "
    result.parseInput()
    expect(result.parseResult.value.type).toBeNull()
    expect(result.parseResult.value.date).toBeNull()
    expect(result.parsedDate.value).toBeNull()
    app.unmount()
  })

  it("results is non-null in realtime mode", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    expect(result.results.value).not.toBeNull()
    app.unmount()
  })

  it("results is null in manual mode without date", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    result.toggleMode("manual")
    expect(result.results.value).toBeNull()
    app.unmount()
  })

  it("results returns data after parsing input", () => {
    vi.useFakeTimers()
    const { result, app } = mountComposable()
    result.toggleMode("manual")
    result.inputText.value = "2024-01-15T10:30:00Z"
    result.parseInput()
    expect(result.results.value).not.toBeNull()
    expect(result.results.value?.unixSeconds).toBe(1705314600)
    app.unmount()
  })
})
