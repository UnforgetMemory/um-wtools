import type { DefineLocaleMessage } from "vue-i18n"

const en: DefineLocaleMessage = {
  home: {
    subtitle: "Free client-side toolbox. All processing runs locally — no data leaves your browser.",
    base64Desc: "Multi-round Base64 encode/decode with auto-detection. Unicode safe.",
    pdfDesc: "Live Markdown preview, one-click PDF via native browser print.",
    open: "Open Tool",
  },
  nav: { base64: "Base64", markdownPdf: "Markdown → PDF" },
  theme: { title: "Theme: {mode}" },
  footer: { text: "um-wtools — Free client-side toolbox. Powered by Vue & Cloudflare Pages." },
  base64: {
    encode: "Encode", decode: "Decode", auto: "Auto", rounds: "Rounds:",
    inputLabel: { encode: "Plain Text", decode: "Base64 Input", auto: "Input (auto-detect)" },
    placeholder: { encode: "Enter text to encode...", decode: "Enter Base64 to decode...", auto: "Enter Base64 to auto-detect...", output: "Result will appear here..." },
    output: "Output", copy: "Copy", copied: "Copied!",
    privacy: "All processing is done locally in your browser. No data is sent to any server.",
    detected: "Detected {rounds} round(s) of Base64 encoding",
    error: { empty: "Input is empty", invalid: "Input contains non-Base64 characters", encodeFailed: "Encode failed: {msg}", decodeFailed: "Decode failed: {msg}", notBase64: "Input is not valid Base64 or could not be decoded" },
  },
  pdf: {
    page: "Page:", a4: "A4", letter: "Letter", portrait: "Portrait", landscape: "Landscape",
    download: "Download PDF", editor: "Markdown Editor", placeholder: "Type or paste Markdown here...", preview: "Preview",
    privacy: "Markdown is rendered locally. PDF uses your browser's native print-to-PDF.",
    printHint: "In print dialog: 'More settings' → uncheck 'Headers and footers' → Save PDF.",
    error: { failed: "PDF generation failed: {msg}" },
  },
}

export default en