import { describe, it, expect, vi } from "vitest"
import { createApp } from "vue"

vi.mock("vue-i18n", () => ({ useI18n: () => ({ t: (k: string) => k }) }))
import { useMagnet } from "../application/useMagnet"

function mount() {
  let r!: ReturnType<typeof useMagnet>
  const app = createApp({ setup() { r = useMagnet(); return () => {} } })
  app.mount(document.createElement("div"))
  return r
}

describe("useMagnet", () => {
  it("initialises with parse tab", () => { expect(mount().tab.value).toBe("parse") })
  it("switches tabs", () => {
    const m = mount()
    m.switchTab("header")
    expect(m.tab.value).toBe("header")
  })
  it("headerResult auto-computes", () => {
    const m = mount()
    m.switchTab("header")
    m.headerInput.value = "magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36"
    expect(m.headerResult.value.hasPrefix).toBe(true)
  })
  it("doParse parses magnet link", async () => {
    const m = mount()
    m.magnetInput.value = "magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Test"
    await m.doParse()
    expect(m.parsed.value?.infoHash).toBe("d2474e86c95b19b8bcfdb92bc12c9d44667cfa36")
    expect(m.parsed.value?.name).toBe("Test")
  })
})
