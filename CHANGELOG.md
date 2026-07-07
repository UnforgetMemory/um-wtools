# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2026-07-07

### Fixed

- **GitHub Actions deploy failure**: `cloudflare/wrangler-action@v4` does not reliably propagate `CLOUDFLARE_API_TOKEN` to the wrangler subprocess in non-interactive mode. Replaced action invocation with direct `pnpm exec wrangler pages deploy` step that explicitly passes the token via step-level `env:`. Removed unnecessary `CLOUDFLARE_ACCOUNT_ID` dependency (Pages deploy uses `--project-name`).
- **Gitignore coverage**: Added `.cortexkit/` to `.gitignore` to prevent OpenCode historian runtime data from being tracked.
- **Conditional deploy**: Cloudflare Pages deploy step now skips gracefully when `CLOUDFLARE_API_TOKEN` secret is not configured, instead of failing the workflow.

## [0.3.0] - 2026-07-07

### Added

- **Magnet Tool**: New 2-tab tool for magnet link and .torrent file processing.
  - **Parse tab**: Paste magnet URIs (or bare info hashes) and upload .torrent files via drag-and-drop or file picker. Displays full metadata — infoHash, name, total size, piece length/count, file list with sizes, tracker URLs, creation date, creator, comment, private flag.
  - **Torrent → Magnet conversion**: Parsed .torrent files generate a ready-to-copy magnet URI including infoHash, display name, tracker list, and file size.
  - **Header tab**: Add or remove the `magnet:?xt=urn:btih:` prefix with auto-detection of input type (magnet link / bare hash / unrecognized), dual copy buttons for both stripped and prefixed forms.
  - **Local-only processing**: All parsing is done client-side via `bencode` (WebTorrent ecosystem) and `magnet-uri`. No data leaves the browser.
  - **Full i18n**: All 5 locales with complete translation coverage.
  - **Test coverage**: 21 new unit tests (domain + composable), 5 new E2E tests with Page Object Model.

- **Default Public Trackers** (XIU2/TrackersListCollection): Curated list of 15 HTTP/HTTPS/WSS trackers injected as hints when a magnet link lacks its own trackers — improves peer discovery for metadata download and enables health checks.

- **P2P Metadata Download** (WebTorrent): One-click "Download Metadata from P2P Network" for magnet links — connects to the BitTorrent network via WebRTC, downloads the info dictionary (ut_metadata / BEP 9), and extracts the full file structure. Torrent is destroyed immediately after extraction (no data download).

- **Tracker Health Check**: Query HTTP/HTTPS trackers for seed/leecher/completed counts. Falls back to scrape endpoints when announce fails. Graceful error handling for CORS-limited trackers.

- **Disclaimer Section 7**: New "Magnet Tool & Public Trackers" section — discloses the use of XIU2/TrackersListCollection, notes no affiliation with tracker operators, and invites issue reports for tracker removal requests.

### Changed

- **UTabNav Component**: Rewritten from inline styles to CSS class-based design (`.is-active`). Hover states now handled within the component — active tab uses `opacity: 0.9` on hover, inactive tabs use `var(--color-surface-alt)`. Fixes dark-theme text disappearance bug when hovering the active tab.
- **Project version**: Bumped to 0.3.0.
- **Dependencies Added**: `bencode` (torrent file parsing), `magnet-uri` (magnet link parsing), `bencodec`, `webtorrent` (P2P metadata download).
- **Dependencies Removed**: `bencodec` (replaced by `bencode` from WebTorrent ecosystem).

### Fixed

- **UTabNav Dark Theme**: Active tab text no longer disappears on hover — `.is-active:hover` uses `opacity` instead of overriding background-color with `!important`.
- **.torrent File Parsing**: Rewrote `parseTorrentFile` to use single-pass raw bencode decode + `TextDecoder` for safe byte-string conversion. Eliminates double-decode inconsistency and handles non-UTF-8 torrents.
- **Disclaimer Section Leak**: Removed orphaned `disclaimer.section7` reference from `DisclaimerTool.vue` after i18n key cleanup.
- **i18n Key Cleanup**: Removed stale health-check and metadata-download keys from all 5 locales after scope simplification.

### Security

- **[Supply Chain](https://github.com/XIU2/TrackersListCollection)**: Default tracker list sourced from audited public collection. Trackers used only for peer discovery — no data sent beyond standard BitTorrent protocol messages.
- **Zero Vulnerabilities**: `pnpm audit` reports 0 known vulnerabilities.
- **Client-Side Only**: All magnet/torrent operations remain in-browser. No server requests beyond user-initiated tracker queries.
- **CSP Compatible**: No changes required to existing Content Security Policy.

### Technical

- **Domain/Application/UI Layers**: New feature follows established DDD pattern (`features/magnet/{domain,application,ui}/`).
- **Lazy WebTorrent Loading**: WebTorrent ESM bundle loaded via dynamic `import()` — separated as a build chunk (235 KB / 69 KB gzipped), not included in main bundle.
- **Dynamic Chunk Splitting**: `pnpm build` automatically splits WebTorrent into `webtorrent.min-*.js` via Vite's code-splitting.
- **Playwright E2E**: 31 total tests across all tools. Magnet tool E2E covers page load, tab navigation, magnet parsing, header operations.
- **Unit Tests**: 113 total tests across 12 test files — covers all domain logic, composable state machines, and i18n integrity.

### Added

- **vue-router Integration**: State-driven conditional rendering replaced with vue-router@4 (`createWebHistory`). URL-based navigation, browser history stack, deep linking — route names map 1:1 to ToolTab types.
- **Timestamp Converter**: Live clock with 18-timezone table (IANA DST-aware), manual input with auto-format detection (Unix seconds/ms/ISO 8601), dual copy buttons per timezone row.
- **Disclaimer Page**: Professional 6-section layout (service description, disclaimer, privacy, third-party links, terms changes, dispute resolution). Prominent homepage entry as first content block.
- **i18n Expansion**: 3 new locales — Traditional Chinese (zh-TW), Japanese (ja), Korean (ko). Language auto-detection from browser `navigator.languages` via BCP 47 subtag parsing. Language switcher cycles through all 5 locales in header.
- **Browser Language Auto-Detect**: First-load locale selection via full BCP 47 subtag parsing — handles `zh-Hant`/`zh-HK`/`zh-MO` → zh-TW, `zh-Hans` → zh-CN, complete fallback chain. SSR-safe.
- **CI/CD Pipeline**: GitHub Actions workflow — quality gate (install → test → build) on PR, plus Cloudflare Pages deployment on push to main.
- **Playwright E2E Suite**: 26 end-to-end tests across all pages (home, header, base64, markdown-pdf, timestamp, disclaimer) with Page Object Model architecture. 6 parallel workers, 4 workers in CI.
- **Unit Test Expansion**: 10 test files, 92 test cases, ~90% line coverage. New test modules: useTimestamp, useTheme, useClipboard, markdown domain, i18n integrity, useActiveTool (router-backed).

### Changed

- **Home Card Redesign**: Full-card click target (semantic `<button>` wrapping UCard). Hover feedback: translateY(-3px) lift, shadow deepening, background shift, visible border. Keyboard focus-visible support.
- **Interaction System**: All interactive components (UButton, USelect, UTabNav, UTextarea, timestamp cards) gain hover background changes with 200ms ease transitions, optimized for both light and dark oklch themes.
- **Copy Feedback**: Independent `isCopied(value)` tracking per button instead of shared ref. Each format button shows independent "Copied!" state.
- **Footer Design**: Modern minimal layout — brand + version on left, GitHub link on right. Version auto-reads from `package.json`.
- **Dependency Upgrades**: Vite 8.1.3, Vitest 4.1.10, wrangler 4.107.0. Removed deprecated `@types/dompurify` and `@types/marked`.

### Fixed

- **Duplicate Type Definitions**: `ThemeMode`/`Base64Result`/`PdfOptions` each defined twice in `types/index.ts` — deduplicated to single declarations.
- **Import Order**: `import type Base64Result` placed mid-file in `base64.ts` — moved to top.
- **Silent Catch**: Empty `catch` block in `usePdf.ts` — added `console.warn` with error context.
- **Hardcoded Label**: "ISO" button label hardcoded in timestamp timezone rows — replaced with `t("timestamp.copyIso")` i18n key across all 5 locales.

### Security

- **Zero Vulnerabilities**: `pnpm audit` reports 0 known vulnerabilities across all dependencies. Manual security review of all client-side operations confirms no data leaves the browser.

### Technical

- **Testing Infrastructure**: Playwright + Chromium for E2E, Vitest + jsdom for unit tests. `LD_LIBRARY_PATH` workaround for headless Chromium. CI runs quality gate with `--workers=4` to avoid dev-server contention.
- **Browser-Compatible Locale Detection**: Full BCP 47 subtag parsing — handles `zh-Hant-TW`, `zh-Hans-CN`, regional variants, and arbitrary locale identifiers. SSR fallback to `zh-CN`.

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
