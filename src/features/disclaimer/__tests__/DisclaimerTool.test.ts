import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import { createRouter, createMemoryHistory } from "vue-router"
import { createI18n } from "vue-i18n"
import DisclaimerTool from "../ui/DisclaimerTool.vue"
import en from "../../../i18n/locales/en"

const Stub = { template: "<div />" }

const routes = [
  { path: "/", name: "home", component: Stub },
  { path: "/disclaimer", name: "disclaimer", component: DisclaimerTool },
]

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en },
})

function createTestRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}

describe("DisclaimerTool", () => {
  it("renders the page title", async () => {
    const router = createTestRouter()
    const wrapper = mount(DisclaimerTool, {
      global: { plugins: [i18n, router] },
    })
    await router.isReady()
    await router.push({ name: "disclaimer" })

    expect(wrapper.text()).toContain("Disclaimer & Terms of Use")
  })

  it("renders the last updated date", async () => {
    const router = createTestRouter()
    const wrapper = mount(DisclaimerTool, {
      global: { plugins: [i18n, router] },
    })
    await router.isReady()
    await router.push({ name: "disclaimer" })

    expect(wrapper.text()).toContain("Last updated: July 2026")
  })

  it("renders the intro paragraph", async () => {
    const router = createTestRouter()
    const wrapper = mount(DisclaimerTool, {
      global: { plugins: [i18n, router] },
    })
    await router.isReady()
    await router.push({ name: "disclaimer" })

    expect(wrapper.text()).toContain("terms of use for um-wtools")
  })

  it("renders all 6 disclaimer sections", async () => {
    const router = createTestRouter()
    const wrapper = mount(DisclaimerTool, {
      global: { plugins: [i18n, router] },
    })
    await router.isReady()
    await router.push({ name: "disclaimer" })

    const sections = wrapper.findAll("section")
    expect(sections).toHaveLength(6)
    expect(sections[0].text()).toContain("1. Service Description")
    expect(sections[5].text()).toContain("6. Dispute Resolution")
  })

  it("renders the privacy notice", async () => {
    const router = createTestRouter()
    const wrapper = mount(DisclaimerTool, {
      global: { plugins: [i18n, router] },
    })
    await router.isReady()
    await router.push({ name: "disclaimer" })

    expect(wrapper.text()).toContain("All processing is done locally in your browser")
  })

  it("renders a back button that navigates to home", async () => {
    const router = createTestRouter()
    const wrapper = mount(DisclaimerTool, {
      global: { plugins: [i18n, router] },
    })
    await router.isReady()
    await router.push({ name: "disclaimer" })

    const backBtn = wrapper.find("button")
    expect(backBtn.exists()).toBe(true)

    await backBtn.trigger("click")
    await new Promise((r) => setTimeout(r, 0))
    expect(router.currentRoute.value.name).toBe("home")
  })
})
