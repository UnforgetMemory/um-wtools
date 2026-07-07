import { type Page, type Locator, expect } from "@playwright/test"

export class HomePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  get logo(): Locator { return this.page.locator("main img[alt='um-wtools']") }
  get title(): Locator { return this.page.locator("main h2:has-text('um-wtools')") }
  get disclaimBtn(): Locator { return this.page.locator("main button").filter({ hasText: /Disclaimer|免责|免責|免責事項|면책/ }) }

  toolCard(id: string): Locator {
    const map: Record<string, string> = { base64: "Base64", timestamp: "Timestamp", "markdown-pdf": "Markdown" }
    return this.page.locator("main button.tool-card").filter({ hasText: map[id] })
  }

  async expectVisible() {
    await expect(this.logo).toBeVisible()
    await expect(this.title).toBeVisible()
    await expect(this.disclaimBtn).toBeVisible()
    await expect(this.toolCard("base64")).toBeVisible()
    await expect(this.toolCard("timestamp")).toBeVisible()
    await expect(this.toolCard("markdown-pdf")).toBeVisible()
  }

  async clickTool(id: string) {
    await this.toolCard(id).click()
  }

  async clickDisclaimer() {
    await this.disclaimBtn.click()
  }
}
