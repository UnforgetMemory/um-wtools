import { renderPreview, renderForPdf } from "../domain/markdown"
import { generatePdfHtml } from "../domain/pdf"
import type { PdfOptions } from "../../../toolkit/types"

/**
 * PDF generation composable wrapping markdown rendering and browser print.
 */
export function usePdf() {
  function preview(markdown: string): string {
    return renderPreview(markdown)
  }

  function printToPdf(markdown: string, options: PdfOptions = {}): void {
    const rawHtml = renderForPdf(markdown)
    const styledHtml = generatePdfHtml(rawHtml, options)

    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"
    iframe.style.top = "-9999px"
    iframe.style.left = "-9999px"
    iframe.style.width = "0"
    iframe.style.height = "0"
    iframe.srcdoc = styledHtml
    document.body.appendChild(iframe)

    iframe.onload = () => {
      setTimeout(() => {
        try { iframe.contentWindow?.print() } catch { /* Browser may block print (mobile, popup blocker). */ }
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe)
        }, 100)
      }, 300)
    }
  }

  return { preview, printToPdf }
}