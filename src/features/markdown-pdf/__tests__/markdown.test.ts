import { describe, it, expect, vi } from "vitest"

vi.mock("dompurify", () => ({
  default: {
    sanitize: (html: string) => html,
  },
}))

vi.mock("marked", () => ({
  marked: {
    setOptions: vi.fn(),
    parse: vi.fn((md: string) => {
      let html = md
      if (html.startsWith("# ")) return `<h1>${html.slice(2)}</h1>`
      if (html.startsWith("## ")) return `<h2>${html.slice(3)}</h2>`
      html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      html = html.replace(/\*(.*?)\*/g, "<em>$1</em>")
      html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      if (!html.startsWith("<h")) {
        html = `<p>${html}</p>`
      }
      return html
    }),
  },
}))

import { marked } from "marked"
import { renderPreview, renderForPdf } from "../domain/markdown"

describe("Markdown rendering", () => {
  describe("renderPreview", () => {
    it("returns empty string for empty input", () => {
      expect(renderPreview("")).toBe("")
      expect(renderPreview("   ")).toBe("")
    })

    it("wraps plain text in paragraph", () => {
      expect(renderPreview("hello")).toBe("<p>hello</p>")
    })

    it("converts headings to HTML", () => {
      expect(renderPreview("# Heading")).toBe("<h1>Heading</h1>")
      expect(renderPreview("## Subheading")).toBe("<h2>Subheading</h2>")
    })

    it("converts GFM features correctly", () => {
      expect(renderPreview("**bold** and *italic*")).toBe(
        "<p><strong>bold</strong> and <em>italic</em></p>",
      )
      expect(renderPreview("[link](https://example.com)")).toBe(
        '<p><a href="https://example.com">link</a></p>',
      )
    })

    it("returns error message when marked.parse throws", () => {
      marked.parse.mockImplementation(() => {
        throw new Error("forced parse error")
      })

      expect(renderPreview("test")).toBe(
        '<p style="color:red">Render error: forced parse error</p>',
      )

      marked.parse.mockRestore()
    })
  })

  describe("renderForPdf", () => {
    it("returns same output as renderPreview for normal cases", () => {
      expect(renderForPdf("hello")).toBe(renderPreview("hello"))
      expect(renderForPdf("# Title")).toBe(renderPreview("# Title"))
      expect(renderForPdf("**bold**")).toBe(renderPreview("**bold**"))
    })

    it("returns generic error message on parse failure", () => {
      marked.parse.mockImplementation(() => {
        throw new Error("anything")
      })

      expect(renderForPdf("test")).toBe("<p>Render error</p>")

      marked.parse.mockRestore()
    })
  })
})
