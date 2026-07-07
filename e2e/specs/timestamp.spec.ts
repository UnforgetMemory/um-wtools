import { test, expect } from "@playwright/test"
import { TimestampPage } from "../pages/TimestampPage"
import { HomePage } from "../pages/HomePage"

test.describe("Timestamp Tool", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await new HomePage(page).clickTool("timestamp")
  })

  test("T1: Real-time mode shows clock and tab nav", async ({ page }) => {
    const ts = new TimestampPage(page)
    await expect(ts.realtimeTab).toBeVisible()
    await expect(ts.manualTab).toBeVisible()
  })

  test("T2: Switching to manual mode shows input", async ({ page }) => {
    await new TimestampPage(page).switchManual()
    await expect(new TimestampPage(page).inputArea).toBeVisible()
  })

  test("T3: ISO timestamp shows timezone table", async ({ page }) => {
    const ts = new TimestampPage(page)
    await ts.enterTimestamp("2024-01-15T10:30:00Z")
    await expect(page.locator("main table")).toBeVisible()
  })

  test("T4: Copy buttons visible after entering timestamp", async ({ page }) => {
    const ts = new TimestampPage(page)
    await ts.enterTimestamp("2024-06-15T10:30:00Z")
    await expect(page.locator("main table")).toBeVisible()
    await expect(ts.copyBtns.first()).toBeVisible()
  })

  test("T5: Invalid timestamp shows input without crash", async ({ page }) => {
    const ts = new TimestampPage(page)
    await ts.enterTimestamp("not-a-timestamp")
    await page.waitForTimeout(500)
    await expect(ts.inputArea).toBeVisible()
  })
})
