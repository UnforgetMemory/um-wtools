import { test, expect } from "@playwright/test"
import { Base64Page } from "../pages/Base64Page"
import { HomePage } from "../pages/HomePage"

test.describe("Base64 Tool", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await new HomePage(page).clickTool("base64")
  })

  test("B1: Encode text produces correct base64 output", async ({ page }) => {
    const b64 = new Base64Page(page)
    await b64.encode("Hello World")
    expect(await b64.getOutput()).toBe("SGVsbG8gV29ybGQ=")
  })

  test("B2: Decode base64 produces original text", async ({ page }) => {
    const b64 = new Base64Page(page)
    await b64.decode("SGVsbG8gV29ybGQ=")
    expect(await b64.getOutput()).toBe("Hello World")
  })

  test("B3: Auto mode detects and decodes base64 input", async ({ page }) => {
    const b64 = new Base64Page(page)
    await b64.auto("SGVsbG8gV29ybGQ=")
    expect(await b64.getOutput()).toContain("Hello World")
  })

  test("B4: Round slider changes round count display", async ({ page }) => {
    const b64 = new Base64Page(page)
    await expect(b64.roundDisplay).toContainText("1")
    await b64.roundSlider.fill("5")
    await page.waitForTimeout(300)
    await expect(b64.roundDisplay).toContainText("5")
  })

  test("B5: Copy button is visible when output is present", async ({ page }) => {
    const b64 = new Base64Page(page)
    await b64.encode("test")
    await expect(b64.copyBtn.first()).toBeVisible()
  })

  test("B6: Empty input produces empty output", async ({ page }) => {
    const b64 = new Base64Page(page)
    await b64.encode("")
    expect(await b64.getOutput()).toBe("")
  })
})
