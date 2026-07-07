import { createI18n } from "vue-i18n"
import zhCN from "./locales/zh-CN"
import zhTW from "./locales/zh-TW"
import en from "./locales/en"
import ja from "./locales/ja"
import ko from "./locales/ko"

const SUPPORTED_LOCALES = new Set(["zh-CN", "zh-TW", "en", "ja", "ko"])

function detectLocale(lang: string): string | null {
  if (SUPPORTED_LOCALES.has(lang)) return lang

  const parts = lang.split("-")
  const language = parts[0]

  // Chinese script variants: Hant (Traditional) → zh-TW, default → zh-CN
  if (language === "zh") {
    if (parts.includes("Hant") || parts.some(p => ["TW", "HK", "MO"].includes(p))) {
      return "zh-TW"
    }
    return "zh-CN"
  }

  for (const loc of SUPPORTED_LOCALES) {
    if (loc.startsWith(language)) return loc
  }

  return null
}

function pickBrowserLocale(): string {
  const langs =
    typeof navigator !== "undefined"
      ? (navigator.languages as readonly string[]) ?? [navigator.language]
      : []
  for (const raw of langs) {
    const matched = detectLocale(raw)
    if (matched) return matched
  }
  return "zh-CN"
}

/**
 * Vue i18n instance configured for Composition API (`legacy: false`).
 *
 * Initial locale is determined by the browser's language preference;
 * English is used as the fallback when a translation key is missing
 * in the active locale.
 */
const i18n = createI18n({
  legacy: false,
  locale: pickBrowserLocale(),
  fallbackLocale: "en",
  messages: { "zh-CN": zhCN, "zh-TW": zhTW, en, ja, ko },
})

export default i18n