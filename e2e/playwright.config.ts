import { defineConfig } from "@playwright/test"
import { resolve } from "path"

const chromiumLibDir = resolve(
  process.env.HOME || "/home/um",
  ".cache/ms-playwright/chromium-1228/chrome-linux64",
)

export default defineConfig({
  testDir: "./specs",
  outputDir: "./test-results",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: {
      env: {
        ...process.env,
        LD_LIBRARY_PATH: `${chromiumLibDir}:${process.env.LD_LIBRARY_PATH || ""}`,
      },
    },
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
})
