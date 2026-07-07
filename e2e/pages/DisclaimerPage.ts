import { type Page, type Locator, expect } from "@playwright/test"

export class DisclaimerPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get container() { return this.page.locator("main") }
  get backBtn(): Locator { return this.container.locator("button").filter({ hasText: "Home" }).or(this.container.locator("button").filter({ hasText: "首页" })) }
  get title(): Locator { return this.container.locator("h1") }
  get sections(): Locator { return this.container.locator("section") }

  async expectVisible() {
    await expect(this.backBtn).toBeVisible()
    await expect(this.title).toBeVisible()
    await expect(this.sections).not.toHaveCount(0)
  }

  async clickBack() { await this.backBtn.click() }
}
