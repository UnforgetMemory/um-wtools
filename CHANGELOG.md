# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-01

### Added

- **Base64 Tool**: Multi-round encode/decode with auto-detection (max 20 rounds). Unicode safe via TextEncoder/TextDecoder.
- **Markdown → PDF Tool**: Live preview with `marked` + DOMPurify, one-click PDF output via native browser print.
- **Theme System**: Light/dark/system-follow modes with CSS custom properties (oklch). Persisted in localStorage.
- **Internationalization**: vue-i18n v11 (Composition API, `legacy: false`). Supports 简体中文 (default) and English.
- **DDD Architecture**: Domain-driven module structure with `features/base64` and `features/markdown-pdf` each containing `domain/application/ui` layers.
- **Shared Component Library**: `UButton`, `UCard`, `USelect`, `UTextarea`, `UTabNav`, `UIconButton` with theme-adaptive styling.
- **Landing Page**: Hero section with tool cards, click-to-navigate entry flow.
- **Warm-Neutral Color Palette**: Light mode `oklch(0.97 0.005 30)` / Dark mode `oklch(0.12 0.008 50)` with `color-scheme` support.

### Security

- **XSS Prevention**: All markdown-rendered HTML sanitized by DOMPurify before v-html injection.
- **Content Security Policy**: CSP meta tag restricts script sources (`script-src 'self'`).
- **Type Safety**: Replaced unsafe `(err as Error)` casts with proper `instanceof` checking throughout.

### Technical

- **Toolchain**: Vite+ (`vp`) unified CLI, Vue 3.6 Composition API, TypeScript strict mode.
- **Styling**: Tailwind CSS v4 with `@theme` design tokens, responsive grid/flex layout.
- **Testing**: Vitest with 12 test cases covering Base64 encode/decode/autoDetect round-trips.
- **Deployment**: Cloudflare Pages ready with `_headers` caching rules and `.cloudflare/pages.toml` config.
