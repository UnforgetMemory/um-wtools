import { describe, it, expect } from "vitest"
import type { DefineLocaleMessage } from "vue-i18n"
import en from "@/i18n/locales/en"
import zhCN from "@/i18n/locales/zh-CN"
import zhTW from "@/i18n/locales/zh-TW"
import ja from "@/i18n/locales/ja"
import ko from "@/i18n/locales/ko"

function getLeafPaths(obj: Record<string, any>, prefix = ""): string[] {
  const paths: string[] = []
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    const value = obj[key]
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...getLeafPaths(value as Record<string, any>, fullKey))
    } else {
      paths.push(fullKey)
    }
  }
  return paths
}

const allLocales: { name: string; messages: DefineLocaleMessage }[] = [
  { name: "en", messages: en },
  { name: "zh-CN", messages: zhCN },
  { name: "zh-TW", messages: zhTW },
  { name: "ja", messages: ja },
  { name: "ko", messages: ko },
]

describe("i18n locale integrity", () => {
  it.each(allLocales)("$name exports an object", ({ messages }) => {
    expect(messages).toBeDefined()
    expect(typeof messages).toBe("object")
  })

  describe("en.ts is a superset of every other locale", () => {
    const nonEnLocales = allLocales.filter((l) => l.name !== "en")

    it.each(nonEnLocales)("en.ts contains all keys from $name", ({ name, messages }) => {
      const enPaths = new Set(getLeafPaths(en))
      const localePaths = getLeafPaths(messages)
      const missing = localePaths.filter((p) => !enPaths.has(p))
      expect(missing, `Missing keys in en.ts: ${missing.join(", ")}`).toEqual([])
    })
  })

  describe("no locale has keys that en.ts does not", () => {
    const nonEnLocales = allLocales.filter((l) => l.name !== "en")
    const enPaths = new Set(getLeafPaths(en))

    it.each(nonEnLocales)("$name has no extra keys beyond en.ts", ({ messages }) => {
      const localePaths = getLeafPaths(messages)
      const extra = localePaths.filter((p) => !enPaths.has(p))
      expect(extra, `Extra keys in $name: ${extra.join(", ")}`).toEqual([])
    })
  })

  describe("all locales share the same top-level keys", () => {
    it.each(allLocales)("$name has the expected top-level keys", ({ messages }) => {
      const topLevelKeys = Object.keys(messages).sort()
      expect(topLevelKeys).toEqual(["base64", "disclaimer", "footer", "home", "magnet", "pdf", "theme", "timestamp"])
    })
  })
})
