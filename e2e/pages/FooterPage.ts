import { type Page, type Locator, expect } from "@playwright/test"

export class FooterPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get footer() { return this.page.locator("footer") }
  get brand(): Locator { return this.footer.locator("text=um-wtools").first() }
  get githubLink(): Locator { return this.footer.locator('a[href*="github.com"]') }

  async expectVisible() {
    await expect(this.brand).toBeVisible()
    await expect(this.githubLink).toBeVisible()
  }
}
