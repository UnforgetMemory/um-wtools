import { type Page, type Locator, expect } from "@playwright/test"

export class TimestampPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get container() { return this.page.locator("main") }
  get realtimeTab(): Locator { return this.container.locator("button").filter({ hasText: "Live" }).or(this.container.locator("button").filter({ hasText: "实时" })) }
  get manualTab(): Locator { return this.container.locator("button").filter({ hasText: "Manual" }).or(this.container.locator("button").filter({ hasText: "手动" })) }
  get inputArea(): Locator { return this.container.locator("textarea").first() }
  get detectedBadge(): Locator { return this.container.locator("span.rounded-full") }
  get unixSecondsCard(): Locator { return this.container.locator("p:has-text('Unix Seconds')") }
  get timezoneTable(): Locator { return this.container.locator("table") }
  get copyBtns(): Locator { return this.container.locator("button").filter({ hasText: "Copy" }).or(this.container.locator("button").filter({ hasText: "复制" })) }
  get errorMsg(): Locator { return this.container.locator("text=Invalid").or(this.container.locator("text=无效")) }

  async switchManual() { await this.manualTab.click() }
  async switchRealtime() { await this.realtimeTab.click() }
  async enterTimestamp(val: string) {
    await this.switchManual()
    await this.inputArea.fill(val)
    await this.page.waitForTimeout(500)
  }
}
