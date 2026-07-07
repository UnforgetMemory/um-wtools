import type { PdfOptions } from "../../../toolkit/types"

/**
 * Wrap sanitized markdown HTML in a print-optimized HTML document.
 *
 * Includes full @page rules, typography styles, table borders, code blocks,
 * and page-break control so the printed PDF matches modern document standards.
 */
export function generatePdfHtml(markdownHtml: string, options: PdfOptions): string {
  const isLandscape = options.orientation === "landscape"
  const pageSize = {
    a4: { width: isLandscape ? "297mm" : "210mm", height: isLandscape ? "210mm" : "297mm" },
    letter: { width: isLandscape ? "279mm" : "216mm", height: isLandscape ? "216mm" : "279mm" },
  }[options.format || "a4"]

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title></title>
<style>
  @page { size: ${pageSize.width} ${pageSize.height}; margin: 20mm 15mm; }

  * { box-sizing: border-box; }

  body {
    font-family: "Inter","SF Pro",system-ui,-apple-system,sans-serif;
    font-size: 11pt; line-height: 1.7; color: #1a1a1a;
    margin: 0; padding: 0;
  }

  /* Headings */
  h1 { font-size: 22pt; margin-top: 24pt; margin-bottom: 12pt; font-weight: 700; }
  h2 { font-size: 16pt; margin-top: 20pt; margin-bottom: 10pt; font-weight: 600; }
  h3 { font-size: 13pt; margin-top: 16pt; margin-bottom: 8pt; font-weight: 600; }
  h4 { font-size: 11pt; margin-top: 12pt; margin-bottom: 6pt; font-weight: 600; }
  h5 { font-size: 10pt; margin-top: 10pt; margin-bottom: 4pt; font-weight: 600; }
  h6 { font-size: 9pt; margin-top: 8pt; margin-bottom: 4pt; font-weight: 600; color: #666; }

  /* Paragraphs and spacing */
  p { margin: 0 0 8pt 0; }
  p:empty { margin: 0; height: 8pt; }
  p + p { margin-top: 4pt; }

  /* Inline code */
  code {
    font-family: "JetBrains Mono","SF Mono",ui-monospace,monospace;
    font-size: 9pt; background: #f0f0f0; padding: 1pt 4pt;
    border-radius: 3pt; word-break: break-word;
  }
  pre {
    background: #f5f5f5; padding: 10pt 12pt; border-radius: 4pt;
    overflow-x: auto; margin: 10pt 0; line-height: 1.5;
  }
  pre code { background: none; padding: 0; border-radius: 0; }

  /* Blockquotes */
  blockquote {
    border-left: 3pt solid #ccc; margin: 10pt 0; padding: 4pt 0 4pt 12pt;
    color: #555; font-style: italic;
  }
  blockquote p { margin: 2pt 0; }

  /* Lists */
  ul, ol { margin: 6pt 0; padding-left: 22pt; }
  li { margin-bottom: 3pt; }
  li > ul, li > ol { margin: 2pt 0; }

  /* Task lists */
  input[type="checkbox"] {
    appearance: none; -webkit-appearance: none;
    width: 9pt; height: 9pt; margin: 0 4pt 0 -18pt;
    border: 1.2pt solid #555; border-radius: 2pt;
    display: inline-block; vertical-align: middle;
    position: relative; top: -0.5pt;
  }
  input[type="checkbox"][checked] {
    background: #1a1a1a; border-color: #1a1a1a;
  }
  input[type="checkbox"][checked]::after {
    content: ""; display: block;
    position: absolute; left: 2pt; top: 0.5pt;
    width: 3pt; height: 5pt;
    border: solid white; border-width: 0 1.5pt 1.5pt 0;
    transform: rotate(45deg);
  }
  li:has(input[type="checkbox"]) { list-style: none; margin-left: 0; }

  /* Horizontal rules */
  hr {
    border: none; border-top: 1pt solid #ddd; margin: 16pt 0;
  }

  /* Strikethrough */
  del { color: #999; text-decoration: line-through; }

  /* Tables */
  table {
    border-collapse: collapse; width: 100%; margin: 10pt 0;
    font-size: 10pt; -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  th, td { border: 1pt solid #ddd; padding: 6pt 10pt; text-align: left; }
  th {
    background: #f5f5f5; font-weight: 600;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }

  /* Images */
  img { max-width: 100%; height: auto; margin: 8pt 0; }

  /* Links */
  a { color: #2563eb; text-decoration: underline; }

  /* Strong / emphasis */
  strong { font-weight: 700; }
  em { font-style: italic; }

  /* Superscript / subscript */
  sup { font-size: 8pt; vertical-align: super; }
  sub { font-size: 8pt; vertical-align: sub; }

  /* Page break control */
  h1, h2, h3 { page-break-after: avoid; }
  pre, blockquote, table { page-break-inside: avoid; }

  /* Force color printing */
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style></head><body>${markdownHtml}</body></html>`
}