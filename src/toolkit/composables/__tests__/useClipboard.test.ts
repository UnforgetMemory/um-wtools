// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useClipboard } from "../../composables/useClipboard"

describe("useClipboard", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it("starts with copied as false", () => {
    const { copied } = useClipboard()
    expect(copied.value).toBe(false)
  })

  it("copy() calls navigator.clipboard.writeText with the text", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
    })

    const { copy } = useClipboard()
    await copy("hello")

    expect(writeText).toHaveBeenCalledWith("hello")
  })

  it("copied becomes true after copy and resets after 2000ms", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
    })

    const { copy, copied } = useClipboard()
    await copy("hello")
    expect(copied.value).toBe(true)

    await vi.advanceTimersByTimeAsync(2000)
    expect(copied.value).toBe(false)
  })

  it("falls back to document.execCommand when writeText throws", async () => {
    const execCommand = vi.fn().mockReturnValue(true)
    Object.defineProperty(document, "execCommand", {
      value: execCommand,
      writable: true,
    })

    const writeText = vi.fn().mockRejectedValue(new Error("clipboard denied"))
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
    })

    const { copy, copied } = useClipboard()
    const result = await copy("fallback text")

    expect(result).toBe(true)
    expect(copied.value).toBe(true)
    expect(execCommand).toHaveBeenCalledWith("copy")
  })
})
