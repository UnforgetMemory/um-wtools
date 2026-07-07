import { marked } from "marked"
import DOMPurify from "dompurify"

marked.setOptions({
  gfm: true,
  breaks: false,
})

/**
 * Render markdown to sanitized HTML for live preview.
 *
 * The output is safe for `v-html` because DOMPurify strips any script
 * tags, event handlers, and other XSS vectors.
 */
export function renderPreview(markdown: string): string {
  if (!markdown.trim()) return ""
  try {
    const raw = marked.parse(markdown) as string
    return DOMPurify.sanitize(raw)
  } catch (err) {
    return `<p style="color:red">Render error: ${(err as Error).message}</p>`
  }
}

/**
 * Render markdown to sanitized HTML for PDF generation.
 *
 * Same sanitization as renderPreview but returns a generic error message
 * on failure so PDF output never leaks unexpected content.
 */
export function renderForPdf(markdown: string): string {
  if (!markdown.trim()) return ""
  try {
    const raw = marked.parse(markdown) as string
    return DOMPurify.sanitize(raw)
  } catch {
    return "<p>Render error</p>"
  }
}