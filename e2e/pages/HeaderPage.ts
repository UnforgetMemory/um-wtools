import { type Page, type Locator, expect } from "@playwright/test"

export class HeaderPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get header() { return this.page.locator("header") }
  get logoImg(): Locator { return this.header.locator("img[alt='um-wtools']") }
  get homeBtn(): Locator { return this.header.locator("button:has(img[alt='um-wtools'])") }
  get githubLink(): Locator { return this.header.locator('a[href*="github.com"]') }
  get themeBtn(): Locator { return this.header.locator("button").filter({ hasText: /☀️|🌙|💻/ }) }
  get localeBtn(): Locator { return this.header.locator("button").filter({ hasText: /^(中|EN|繁|日|한)$/ }) }

  async expectVisible() {
    await expect(this.logoImg).toBeVisible()
    await expect(this.githubLink).toBeVisible()
    await expect(this.themeBtn).toBeVisible()
    await expect(this.localeBtn).toBeVisible()
  }

  async clickHome() { await this.homeBtn.click() }
  async cycleTheme() { await this.themeBtn.click() }
  async cycleLocale() { await this.localeBtn.click() }
}
