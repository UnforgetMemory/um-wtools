import { describe, it, expect } from "vitest"
import { generatePdfHtml } from "../domain/pdf"

describe("generatePdfHtml", () => {
  it("defaults to A4 portrait with valid HTML structure", () => {
    const result = generatePdfHtml("<p>hello</p>", {})
    expect(result).toContain("<!DOCTYPE html>")
    expect(result).toContain("<html>")
    expect(result).toContain("<head>")
    expect(result).toContain("<style>")
    expect(result).toContain("<body>")
    expect(result).toContain("</html>")
    expect(result).toContain("@page { size: 210mm 297mm; margin: 20mm 15mm; }")
  })

  it("uses A4 landscape dimensions", () => {
    const result = generatePdfHtml("<p>hello</p>", { format: "a4", orientation: "landscape" })
    expect(result).toContain("@page { size: 297mm 210mm; margin: 20mm 15mm; }")
  })

  it("uses letter portrait dimensions", () => {
    const result = generatePdfHtml("<p>hello</p>", { format: "letter", orientation: "portrait" })
    expect(result).toContain("@page { size: 216mm 279mm; margin: 20mm 15mm; }")
  })

  it("uses letter landscape dimensions", () => {
    const result = generatePdfHtml("<p>hello</p>", { format: "letter", orientation: "landscape" })
    expect(result).toContain("@page { size: 279mm 216mm; margin: 20mm 15mm; }")
  })

  it("embeds input HTML inside the body tag", () => {
    const input = "<h1>Title</h1><p>Body</p>"
    const result = generatePdfHtml(input, {})
    expect(result).toContain(`<body>${input}</body>`)
  })

  it("produces valid HTML structure with empty string input", () => {
    const result = generatePdfHtml("", {})
    expect(result).toContain("<!DOCTYPE html>")
    expect(result).toContain("<html>")
    expect(result).toContain("<body></body>")
    expect(result).toContain("</html>")
  })

  it("handles HTML with special characters", () => {
    const input = `<p>"quotes" & 'apos' <script>alert(1)</script></p>`
    const result = generatePdfHtml(input, {})
    expect(result).toContain(input)
    expect(result).toContain("<!DOCTYPE html>")
  })
})
