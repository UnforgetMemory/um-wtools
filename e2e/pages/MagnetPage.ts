import type { Page } from "@playwright/test"

export default class MagnetPage {
  constructor(public readonly page: Page) {}

  async goto() {
    await this.page.goto("/magnet")
    await this.page.waitForLoadState("networkidle")
  }
}
