import { type Page, type Locator, expect } from "@playwright/test"

export class MarkdownPdfPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get container() { return this.page.locator("main") }
  get editorArea(): Locator { return this.container.locator("textarea").first() }
  get previewArea(): Locator { return this.container.locator(".preview-area") }
  get pageSelect(): Locator { return this.container.locator("select").first() }
  get orientationSelect(): Locator { return this.container.locator("select").nth(1) }
  get downloadBtn(): Locator { return this.container.locator("button").filter({ hasText: "Download" }).or(this.container.locator("button").filter({ hasText: "下载" })) }

  async setMarkdown(md: string) {
    await this.editorArea.fill(md)
    await this.page.waitForTimeout(800)
  }
}
