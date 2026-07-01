export type ToolTab = "base64" | "markdown-pdf"

export type ThemeMode = "light" | "dark" | "system"

export interface Base64Result {
  output: string
  rounds: number
  isValid: boolean
  error?: string
  errorCode?: string
}

export interface PdfOptions {
  format?: "a4" | "letter"
  orientation?: "portrait" | "landscape"
}