import { test, expect } from "@playwright/test"
import { MarkdownPdfPage } from "../pages/MarkdownPdfPage"
import { HomePage } from "../pages/HomePage"

test.describe("Markdown→PDF Tool", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await new HomePage(page).clickTool("markdown-pdf")
  })

  test("M1: Default preview renders markdown correctly", async ({ page }) => {
    const md = new MarkdownPdfPage(page)
    await expect(md.previewArea).toContainText("Hello World")
    await expect(md.previewArea).toContainText("Markdown")
  })

  test("M2: Editing markdown updates the preview", async ({ page }) => {
    const md = new MarkdownPdfPage(page)
    await md.setMarkdown("# New Title\n\nNew **content**")
    await expect(md.previewArea).toContainText("New Title")
    await expect(md.previewArea).toContainText("content")
  })

  test("M3: Page format and orientation selectors work", async ({ page }) => {
    const md = new MarkdownPdfPage(page)
    await expect(md.pageSelect).toHaveValue("a4")
    await expect(md.orientationSelect).toHaveValue("portrait")
    await md.pageSelect.selectOption("letter")
    await expect(md.pageSelect).toHaveValue("letter")
    await md.orientationSelect.selectOption("landscape")
    await expect(md.orientationSelect).toHaveValue("landscape")
  })

  test("M4: Download button is enabled", async ({ page }) => {
    const md = new MarkdownPdfPage(page)
    await expect(md.downloadBtn).toBeEnabled()
  })
})
