import { test, expect } from "@playwright/test"
import { HomePage } from "../pages/HomePage"
import { HeaderPage } from "../pages/HeaderPage"
import { FooterPage } from "../pages/FooterPage"
import { DisclaimerPage } from "../pages/DisclaimerPage"

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("H1: renders all key elements", async ({ page }) => {
    await expect(new HomePage(page).title).toBeVisible()
    await expect(new HeaderPage(page).logoImg).toBeVisible()
    await expect(new FooterPage(page).brand).toBeVisible()
  })

  test("H2: clicking Base64 card navigates to Base64 tool", async ({ page }) => {
    await new HomePage(page).clickTool("base64")
    await expect(page.locator("main")).toContainText(/Encode|编码/)
  })

  test("H2: clicking Timestamp card navigates to Timestamp tool", async ({ page }) => {
    await new HomePage(page).clickTool("timestamp")
    await expect(page.locator("main")).toContainText(/Live Clock|实时|即時|リアルタイム|실시간/)
  })

  test("H2: clicking Markdown card navigates to Markdown tool", async ({ page }) => {
    await new HomePage(page).clickTool("markdown-pdf")
    await expect(page.locator("main")).toContainText(/Markdown|编辑器/)
  })

  test("H3: clicking disclaimer entry navigates to disclaimer page", async ({ page }) => {
    await new HomePage(page).clickDisclaimer()
    await expect(new DisclaimerPage(page).title).toBeVisible()
  })

  test("H4: clicking header title returns home from a tool", async ({ page }) => {
    await new HomePage(page).clickTool("base64")
    await expect(page.locator("main")).toContainText(/Encode|编码/)
    await new HeaderPage(page).clickHome()
    await expect(new HomePage(page).title).toBeVisible()
  })
})
