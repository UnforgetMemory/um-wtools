import { test, expect } from "@playwright/test"
import { HeaderPage } from "../pages/HeaderPage"

test.describe("Header", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("HD1: GitHub link points to correct repo", async ({ page }) => {
    const header = new HeaderPage(page)
    await expect(header.githubLink).toHaveAttribute("href", "https://github.com/UnforgetMemory/um-wtools")
    await expect(header.githubLink).toHaveAttribute("target", "_blank")
  })

  test("HD2: theme button cycles through 3 states", async ({ page }) => {
    const header = new HeaderPage(page)
    const initial = (await header.themeBtn.textContent())?.trim() || "☀️"
    const order = ["☀️", "🌙", "💻"]
    const startIdx = order.indexOf(initial)
    expect(startIdx).toBeGreaterThanOrEqual(0)

    await header.cycleTheme()
    expect((await header.themeBtn.textContent())?.trim()).toBe(order[(startIdx + 1) % 3])

    await header.cycleTheme()
    expect((await header.themeBtn.textContent())?.trim()).toBe(order[(startIdx + 2) % 3])

    await header.cycleTheme()
    expect((await header.themeBtn.textContent())?.trim()).toBe(order[startIdx])
  })

  test("HD3: locale button cycles through 5 languages", async ({ page }) => {
    const header = new HeaderPage(page)
    const cycle = ["中", "EN", "繁", "日", "한"]
    const initial = (await header.localeBtn.textContent())?.trim() || ""
    const startIdx = cycle.indexOf(initial)
    expect(startIdx).toBeGreaterThanOrEqual(0)
    for (let i = 1; i <= 5; i++) {
      await header.cycleLocale()
      await expect(header.localeBtn).toContainText(cycle[(startIdx + i) % 5])
    }
  })
})
