/** Available tool tabs in the application. */
export type ToolTab = "base64" | "timestamp" | "disclaimer" | "magnet" | "md5"

/** Supported theme modes for the application. */
export type ThemeMode = "light" | "dark" | "system"

/**
 * Result of a base64 encode/decode/auto-detect operation.
 *
 * `isValid` indicates success; when false, `errorCode` and `error`
 * provide machine-readable and human-readable failure details.
 */
export interface Base64Result {
  output: string
  rounds: number
  isValid: boolean
  error?: string
  errorCode?: string
}


