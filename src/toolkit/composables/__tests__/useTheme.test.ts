// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { nextTick } from "vue"

function mockLocalStorage() {
  const store: Record<string, string> = {}
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, val: string) => { store[key] = val }),
      clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]) }),
      removeItem: vi.fn((key: string) => { delete store[key] }),
      length: 0,
      key: vi.fn(() => null),
    },
    writable: true,
    configurable: true,
  })
}

beforeEach(() => {
  mockLocalStorage()
  document.documentElement.dataset.theme = ""
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
  }))
})

describe("useTheme", () => {
  it("default theme is 'system' when nothing in localStorage", async () => {
    vi.resetModules()
    const { useTheme } = await import("../../composables/useTheme")
    const { theme } = useTheme()
    expect(theme.value).toBe("system")
  })

  it("previous theme loaded from localStorage persists", async () => {
    vi.resetModules()
    window.localStorage.setItem("um-wtools-theme", "dark")
    const { useTheme } = await import("../../composables/useTheme")
    const { theme } = useTheme()
    expect(theme.value).toBe("dark")
  })

  it("changing theme.value updates localStorage", async () => {
    vi.resetModules()
    const { useTheme } = await import("../../composables/useTheme")
    const { theme } = useTheme()
    theme.value = "dark"
    await nextTick()
    expect(window.localStorage.setItem).toHaveBeenCalledWith("um-wtools-theme", "dark")
  })

  it("changing theme.value applies data-theme attribute", async () => {
    vi.resetModules()
    const { useTheme } = await import("../../composables/useTheme")
    const { theme } = useTheme()
    theme.value = "light"
    await nextTick()
    expect(document.documentElement.dataset.theme).toBe("light")
  })

  it("invalid localStorage values fall back to 'system'", async () => {
    vi.resetModules()
    window.localStorage.setItem("um-wtools-theme", "invalid")
    const { useTheme } = await import("../../composables/useTheme")
    const { theme } = useTheme()
    expect(theme.value).toBe("system")
  })
})
