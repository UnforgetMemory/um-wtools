import { describe, it, expect } from "vitest"
import { createRouter, createMemoryHistory } from "vue-router"
import { mount } from "@vue/test-utils"
import { defineComponent } from "vue"
import { useActiveTool } from "../useActiveTool"

const Stub = { template: "<div />" }

const routes = [
  { path: "/", name: "home", component: Stub },
  { path: "/base64", name: "base64", component: Stub },
  { path: "/markdown-pdf", name: "markdown-pdf", component: Stub },
  { path: "/timestamp", name: "timestamp", component: Stub },
  { path: "/disclaimer", name: "disclaimer", component: Stub },
]

const TestComponent = defineComponent({
  setup() {
    return useActiveTool()
  },
  template: "<div />",
})

function createTestRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}

describe("useActiveTool", () => {
  it("starts with activeTool as null on home route", async () => {
    const router = createTestRouter()
    const wrapper = mount(TestComponent, { global: { plugins: [router] } })
    await router.isReady()
    expect(wrapper.componentVM.activeTool).toBeNull()
  })

  it("navigate('base64') sets activeTool to 'base64'", async () => {
    const router = createTestRouter()
    const wrapper = mount(TestComponent, { global: { plugins: [router] } })
    await router.isReady()

    await router.push({ name: "base64" })
    expect(wrapper.componentVM.activeTool).toBe("base64")
  })

  it("navigate('markdown-pdf') switches to another tab", async () => {
    const router = createTestRouter()
    const wrapper = mount(TestComponent, { global: { plugins: [router] } })
    await router.isReady()

    await router.push({ name: "base64" })
    await router.push({ name: "markdown-pdf" })
    expect(wrapper.componentVM.activeTool).toBe("markdown-pdf")
  })

  it("navigate('timestamp') switches", async () => {
    const router = createTestRouter()
    const wrapper = mount(TestComponent, { global: { plugins: [router] } })
    await router.isReady()

    await router.push({ name: "base64" })
    await router.push({ name: "timestamp" })
    expect(wrapper.componentVM.activeTool).toBe("timestamp")
  })

  it("navigate('disclaimer') switches", async () => {
    const router = createTestRouter()
    const wrapper = mount(TestComponent, { global: { plugins: [router] } })
    await router.isReady()

    await router.push({ name: "base64" })
    await router.push({ name: "disclaimer" })
    expect(wrapper.componentVM.activeTool).toBe("disclaimer")
  })

  it("goHome() resets to null", async () => {
    const router = createTestRouter()
    const wrapper = mount(TestComponent, { global: { plugins: [router] } })
    await router.isReady()

    await router.push({ name: "base64" })
    expect(wrapper.componentVM.activeTool).toBe("base64")

    await router.push({ name: "home" })
    expect(wrapper.componentVM.activeTool).toBeNull()
  })

  it("activeTool stays null when an unknown route is visited", async () => {
    const router = createTestRouter()
    const wrapper = mount(TestComponent, { global: { plugins: [router] } })
    await router.isReady()

    await router.push("/nonexistent")
    expect(wrapper.componentVM.activeTool).toBeNull()
  })
})
