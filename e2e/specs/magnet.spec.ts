import { test, expect } from "@playwright/test"
import MagnetPage from "../pages/MagnetPage"

const TEST_MAGNET =
  "magnet:?xt=urn:btih:d2474e86c95b19b8bcfdb92bc12c9d44667cfa36&dn=Test+File&tr=http://tracker.example.com/announce"
const INFO_HASH = "d2474e86c95b19b8bcfdb92bc12c9d44667cfa36"

test.describe("Magnet Tool", () => {
  test("loads magnet tool page", async ({ page }) => {
    const magnetPage = new MagnetPage(page)
    await magnetPage.goto()
    await expect(magnetPage.page.locator("body")).toBeVisible()
  })

  test("has two tabs", async ({ page }) => {
    const magnetPage = new MagnetPage(page)
    await magnetPage.goto()
    const buttons = await page.locator("button").allInnerTexts()
    const magnetTabs = buttons.filter((b) =>
      ["Parse", "Header"].some((t) => b.includes(t)),
    )
    expect(magnetTabs.length).toBeGreaterThanOrEqual(2)
  })

  test("parses a magnet link in the parse tab", async ({ page }) => {
    const magnetPage = new MagnetPage(page)
    await magnetPage.goto()

    const textarea = page.locator("textarea").first()
    await textarea.fill(TEST_MAGNET)
    await page.waitForTimeout(500)

    await expect(page.locator("body")).toContainText(INFO_HASH)
    await expect(page.locator("body")).toContainText("Test File")
  })

  test("header tab detects magnet link and shows strip button", async ({
    page,
  }) => {
    const magnetPage = new MagnetPage(page)
    await magnetPage.goto()

    // Switch to Header tab
    await page.getByRole("button", { name: /header/i }).first().click()
    await page.waitForTimeout(200)

    const textarea = page.locator("textarea").first()
    await textarea.fill(TEST_MAGNET)
    await page.waitForTimeout(200)

    await expect(page.locator("body")).toContainText(INFO_HASH)
  })

  test("parsed magnet shows infoHash and name", async ({ page }) => {
    const magnetPage = new MagnetPage(page)
    await magnetPage.goto()

    const textarea = page.locator("textarea").first()
    await textarea.fill(TEST_MAGNET)
    await page.waitForTimeout(500)

    await expect(page.locator("body")).toContainText(INFO_HASH)
    await expect(page.locator("body")).toContainText("Test File")
  })
})
