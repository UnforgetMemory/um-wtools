import { test, expect } from "@playwright/test"
import { DisclaimerPage } from "../pages/DisclaimerPage"
import { HomePage } from "../pages/HomePage"

test.describe("Disclaimer Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await new HomePage(page).clickDisclaimer()
  })

  test("D1: Shows sections with titles and back button", async ({ page }) => {
    const d = new DisclaimerPage(page)
    await expect(d.title).toBeVisible()
    await expect(d.sections).not.toHaveCount(0)
  })

  test("D2: Back to home works", async ({ page }) => {
    await new DisclaimerPage(page).clickBack()
    await expect(new HomePage(page).title).toBeVisible()
  })
})
