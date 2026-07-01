import { marked } from "marked"
import DOMPurify from "dompurify"

marked.setOptions({
  gfm: true,
  breaks: false,
})

export function renderPreview(markdown: string): string {
  if (!markdown.trim()) return ""
  try {
    const raw = marked.parse(markdown) as string
    return DOMPurify.sanitize(raw)
  } catch (err) {
    return `<p style="color:red">Render error: ${(err as Error).message}</p>`
  }
}

export function renderForPdf(markdown: string): string {
  if (!markdown.trim()) return ""
  try {
    const raw = marked.parse(markdown) as string
    return DOMPurify.sanitize(raw)
  } catch {
    return "<p>Render error</p>"
  }
}