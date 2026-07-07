import { type Page, type Locator, expect } from "@playwright/test"

export class Base64Page {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  private get container() { return this.page.locator("main") }
  get encodeTab(): Locator { return this.container.locator("button").filter({ hasText: "Encode" }).or(this.container.locator("button").filter({ hasText: "编码" })) }
  get decodeTab(): Locator { return this.container.locator("button").filter({ hasText: "Decode" }).or(this.container.locator("button").filter({ hasText: "解码" })) }
  get autoTab(): Locator { return this.container.locator("button").filter({ hasText: "Auto" }).or(this.container.locator("button").filter({ hasText: "自动" })) }
  get inputArea(): Locator { return this.container.locator("textarea").first() }
  get outputArea(): Locator { return this.container.locator("textarea").nth(1) }
  get roundSlider(): Locator { return this.container.locator('input[type="range"]') }
  get roundDisplay(): Locator { return this.container.locator("span.font-mono").first() }
  get copyBtn(): Locator { return this.container.locator("button").filter({ hasText: "Copy" }).or(this.container.locator("button").filter({ hasText: "复制" })) }

  async encode(text: string) {
    await this.encodeTab.click()
    await this.inputArea.fill(text)
    await this.page.waitForTimeout(400)
  }

  async decode(b64: string) {
    await this.decodeTab.click()
    await this.inputArea.fill(b64)
    await this.page.waitForTimeout(400)
  }

  async auto(input: string) {
    await this.autoTab.click()
    await this.inputArea.fill(input)
    await this.page.waitForTimeout(400)
  }

  async getOutput(): Promise<string> {
    return (await this.outputArea.inputValue()) || ""
  }
}
