# serverless-toolbox - Work Plan

## TL;DR (For humans)

**What you'll get**: A modern, artistic, single-page web app deployable for free on Cloudflare Pages. Two fully client-side tools: (1) multi-round Base64 encode/decode with auto-detection, and (2) Markdown-to-PDF with live preview. No backend, no server costs, managed with Vite+ (`vp`) unified toolchain.

**Why this approach**:

- **Vite+ (`vp`) + Vue 3.6 + TypeScript** gives component reusability, clean reactivity, excellent dev experience, and a single unified CLI (`vp`) for dev/build/test/lint/format.
- **Tailwind CSS v4** via Vite plugin gives rapid, consistent styling with modern features (oklch, container queries, light-dark()).
- **mdpdf-core** for PDF: pure JS, vector-based output (~2MB), works natively in browser, no WASM or Node.js runtime required.
- **Cloudflare Pages** static hosting: free tier, Git integration, global CDN. Zero maintenance.

**What it will NOT do**: No user accounts, no data persistence, no server-side processing, no multi-user collaboration. All processing is client-side and ephemeral.

**Effort**: ~15-20 focused implementation todos across 4 waves. Estimated 4-8 hours of execution time for a worker.

**Risk**: Low. Pure client-side architecture means no server infrastructure risk. PDF generation is the only nontrivial integration, but `mdpdf-core` is browser-tested.

**Decisions**:

- Hosting: Cloudflare Pages (static)
- Stack: Vite+ (`vp`) + Vue 3.6 + TypeScript + Tailwind CSS v4
- PDF: `mdpdf-core` (pdf-lib backend, vector-based, browser-native)
- Base64: Pure TS composable, no library
- WASM: Not used (not needed for these use cases; native browser APIs sufficient)
- Toolchain: Vite+ unified CLI (`vp dev`, `vp build`, `vp test`, `vp check`) replaces separate Vite/Vitest/Oxlint scripts

## Scope

**IN**:

- Single-page app with tab/nav switching between Base64 and Markdown→PDF tools
- Base64 tool: iterative encode/decode with max-depth guard (default 20 rounds), Unicode-safe, auto-detect mode
- Markdown→PDF tool: live preview, configurable page size/margins, one-click PDF download
- Responsive layout: mobile-first, works on phone/tablet/desktop
- Modern artistic UI: custom theme with design tokens, smooth transitions, clean typography
- Cloudflare Pages deployment config (wrangler.toml / pages build)
- TypeScript strict mode, ESLint, Prettier

**OUT**:

- No backend/Worker functions (pure static site)
- No user auth or data persistence
- No collaborative features
- No support for exotic Base64 variants (URL-safe, base32, etc.) — standard Base64 only
- No LaTeX/MathJax support in Markdown (can be added later)
- No multi-file batch processing

## Verification strategy

Agent-executed QA for every todo (happy + failure paths). Verification tiers:

1. **Build verification**: `vp build` succeeds, `dist/` contains static assets
2. **Dev server verification**: `vp dev` launches, tools render and function in browser
3. **Unit test verification**: `vp test` passes for Base64 round-trip correctness and PDF header validation
4. **Deployment verification**: Cloudflare Pages preview deploy succeeds

Note: Cloudflare Pages requires a one-time manual project creation (`wrangler pages project create`) before the first automated deploy. After that, all deploys are fully automated.

## Execution strategy

Three implementation waves:

- **Wave 1**: Scaffold Vite + Vue 3.6 + TS + Tailwind project, establish shared Vue UI shell and tab routing
- **Wave 2**: Build Base64 tool (Vue composable + Vue component + tests)
- **Wave 3**: Build Markdown→PDF tool (Vue composable + Vue component + tests)
- **Wave 4**: Polish, responsive testing, Cloudflare Pages deploy config, final build check

Dependency order: Wave 1 must complete before Waves 2/3. Waves 2 and 3 are independent and can be parallelized.

## Todos

### Wave 1: Project Foundation

**[T1] Initialize Vite + Vue 3.6 + TypeScript project scaffold**

- References: Vite docs (vitejs.dev), Vue 3.6 docs (vuejs.org)
- Create `package.json` with scripts: `deploy` (custom), all other commands use `vp` (built-in: `vp dev`, `vp build`, `vp test`, `vp check`, `vp preview`)
- Create `tsconfig.json` (strict: true, target esnext, module esnext, with Vue 3.6 types)
- Create `vite.config.ts` with Vue plugin (`@vitejs/plugin-vue`) and Tailwind CSS v4 plugin (`@tailwindcss/vite`)
- Create `index.html` entry point with Vue mount point
- Acceptance: `vp dev` launches Vite+ dev server without errors, Vue app mounts, `#app` element contains rendered Vue component tree
- Happy QA: `vp dev` opens, Vue app renders at localhost with header/footer, Vue devtools shows mounted instance
- Failure QA: Missing dependency or config typo throws on startup; verify by intentionally breaking `vite.config.ts` and confirming clear error
- Commit: `chore: scaffold Vite + Vue 3.6 + TS + Tailwind v4 project`

**[T1.5] Set up test infrastructure (Vitest + Vue Test Utils)**

- References: Vitest docs (vitest.dev), Vue Test Utils docs (test-utils.vuejs.org)
- Install `vitest`, `@vitest/coverage-v8`, `@vue/test-utils`, `@testing-library/vue` as dev dependencies
- Create `vitest.config.ts` with Vite + Vue integration
- Create `src/__tests__/` directory with a sample Vue component smoke test
- Add `test:coverage` script to `package.json` (basic test uses `vp test` built-in)
- Acceptance: `vp test` executes successfully, all tests pass, Vue components mount in tests
- Happy QA: Run `vp test`, all tests pass
- Failure QA: Write a failing test, verify `vp test` exits non-zero and shows failure
- Commit: `chore: set up Vitest + Vue Test Utils test infrastructure`

**[T2] Install and configure core dependencies**

- References: npm registry for `mdpdf-core`, `tailwindcss`, `@tailwindcss/vite`, `vue`
- Install: `vue`, `vueuse`, `mdpdf-core`, `tailwindcss`, `@tailwindcss/vite`, `@types/node` (for Vite config types only)
- Dev dependencies: `vitest`, `@vitest/coverage-v8`, `@vue/test-utils`, `@testing-library/vue`, `lighthouse`, `wrangler`
- Create `src/style.css` with `@import "tailwindcss"` and custom `@theme` block
- Configure Tailwind theme tokens: colors, fonts, spacing, radii in `@theme`
- Acceptance: `vp build` succeeds and CSS is bundled
- Happy QA: Build completes, `dist/assets/*.css` exists and contains Tailwind classes
- Failure QA: Remove `@import` line, build should fail or produce unstyled page; confirm
- Commit: `chore: install and configure Tailwind v4 + mdpdf-core + Vue`

**[T3] Build shared UI shell and navigation**

- References: Vue 3.6 docs (vuejs.org), Composition API with `<script setup>`
- Create `src/App.vue` as root component with tab-based routing between Base64 and Markdown tools
- Create `src/components/Header.vue` with app title and tool tabs (using `<script setup>`)
- Create `src/components/Footer.vue` with Cloudflare deploy badge/link
- Create `src/main.ts` as Vue app entry point (createApp + mount)
- Implement responsive layout: mobile-first, max-width container, centered content
- Acceptance: App renders with header, two clickable tabs, and footer; clicking tabs switches active state
- Happy QA: Click "Base64" tab highlights it and shows placeholder content area, click "Markdown" tab switches highlight and shows its placeholder area, layout works on 375px width
- Failure QA: Simulate missing component import — verify Vue shows clear error in dev mode; verify that removing a required SFC file causes a build error
- Commit: `feat: add shared Vue UI shell with tab navigation`

### Wave 2: Base64 Tool

**[T4] Implement Base64 multi-round engine (Vue composable)**

- References: MDN `btoa`, `atob`, `TextEncoder`, `TextDecoder`, Vue 3.6 Composition API
- Create `src/tools/base64/useBase64.ts` as Vue composable
- Implement `encode(text: string, rounds: number): string` — iterative `btoa` with UTF-8 safe encoding
- Implement `decode(text: string, rounds: number): string` — iterative `atob` with UTF-8 safe decoding
- Implement `autoDetect(text: string, maxRounds: number = 20): { decoded: string; rounds: number; isValid: boolean }` — iteratively decode until result is no longer valid Base64 or max rounds reached
- Add input validation: reject non-Base64 characters in decode mode with clear error
- Acceptance: Composable passes round-trip tests (encode→decode returns original for 1-20 rounds)
- Happy QA: Encode "Hello 世界" 3 times, decode 3 times returns exact original; auto-detect decodes 3-layer nested string
- Failure QA: Decode invalid Base64 string "!!!" returns error; decode 21 rounds hits max guard and stops
- Commit: `feat: implement multi-round Base64 encode/decode composable`

**[T5] Build Base64 tool Vue component**

- References: Vue 3.6 docs, `<script setup>` syntax, Tailwind CSS v4
- Create `src/tools/base64/Base64Tool.vue`
- UI elements: textarea input, round count slider/input (1-20), mode toggle (encode/decode/auto), action button, output textarea, copy button
- Use `useBase64` composable for all logic
- Real-time output update on input change (debounced 300ms via VueUse `watchDebounced`)
- Show per-round breakdown in auto mode (e.g., "Round 1: SGVsbG8=, Round 2: SGVsbG8=, Final: Hello")
- Responsive: stacks vertically on mobile, side-by-side on desktop
- Acceptance: All UI elements render and function, copy button works, auto mode shows round breakdown
- Happy QA: Paste nested Base64, select auto, see progressive decode with round count
- Failure QA: Empty input shows placeholder state, extremely long input (>100KB) doesn't freeze UI
- Commit: `feat: build Base64 tool Vue component with multi-round support`

### Wave 3: Markdown-to-PDF Tool

**[T6] Integrate mdpdf-core PDF engine (Vue composable)**

- References: mdpdf-core docs (github.com/gllm/mdpdf-core), pdf-lib docs, Vue 3.6 Composition API
- Create `src/tools/pdf/usePdf.ts` as Vue composable
- Initialize `createBrowserPdfEngine()` with sensible defaults: A4 page, 72pt margins, page numbers enabled
- Implement `generatePdf(markdown: string, options?: PdfOptions): Blob` — returns PDF blob for download
- Implement `generatePreview(markdown: string): HTMLElement` — renders styled HTML preview (optional, for side-by-side view)
- Add error handling: invalid markdown should not crash, show error message
- Acceptance: Composable `generatePdf` returns valid PDF blob with correct MIME type
- Happy QA: Convert "# Hello\n\nWorld" markdown to PDF, open in viewer, shows heading and text on A4 page
- Failure QA: Pass extremely large markdown (1MB), verify engine completes or times out gracefully; pass malformed markdown, verify no crash
- Commit: `feat: integrate mdpdf-core PDF generation composable`

**[T7] Build Markdown-to-PDF tool Vue component**

- References: Vue 3.6 docs, `<script setup>` syntax, Tailwind CSS v4
- Create `src/tools/pdf/MarkdownPdfTool.vue`
- Use `usePdf` composable for all PDF logic
- UI elements: split-pane layout (markdown editor left, PDF preview right on desktop; stacked on mobile), toolbar (page size selector, margins, download button)
- Editor: textarea with monospace font, tab-size 2, line numbers optional
- Preview: iframe or embedded PDF viewer (browser native `<embed>` or `<iframe>`)
- Download: trigger blob download with filename `document.pdf`
- Debounce preview updates (500ms) via VueUse `watchDebounced` to avoid excessive regeneration
- Acceptance: Editor and preview render, download produces valid PDF, layout is responsive
- Happy QA: Type markdown with headings/lists/code block, see live preview update, click download, open PDF in external viewer
- Failure QA: Paste markdown with invalid HTML, preview sanitizes; click download before any input, produces minimal valid PDF
- Commit: `feat: build Markdown-to-PDF tool Vue component with live preview`

### Wave 4: Polish & Deploy

**[T8] Add theme system and artistic polish**

- References: CSS `light-dark()`, `oklch()`, `@layer`
- Implement theme toggle (light/dark/system) with CSS custom properties
- Refine typography: font stack (system-ui + fallbacks), line heights, letter spacing
- Add micro-interactions: button hover states, tab transitions, copy-to-clipboard feedback
- Ensure contrast ratios meet WCAG AA (4.5:1 for text)
- Acceptance: Theme toggle persists in localStorage, dark mode is fully styled, contrast check deferred to T10 Lighthouse audit
- Happy QA: Toggle dark mode, verify all elements re-theme correctly, copy button shows "Copied!" tooltip
- Failure QA: Verify theme toggle survives page reload; verify CSS custom properties update correctly when switching themes
- Commit: `feat: add theme system and UI polish`

**[T9] Configure Cloudflare Pages deployment**

- References: Cloudflare Pages docs (deploy static sites)
- Create `wrangler.toml` with Pages project config (or `.cloudflare/pages` config)
- Add `deploy` script to `package.json` using `wrangler pages project create` (one-time manual step) + `wrangler pages deploy` (repeated)
- Use `.cloudflare/pages` config format (recommended by Cloudflare Pages docs)
- Set build command: `vp build`, output directory: `dist`
- Add `deploy` and `lighthouse:report` scripts to `package.json`:
  - `deploy`: `wrangler pages deploy`
  - `lighthouse:report`: `lighthouse http://localhost:4173 --output=json --output-path=./lighthouse-report.json`
- Acceptance: `vp run deploy` succeeds and site is live on Cloudflare Pages domain
- Happy QA: Run deploy script, open live URL, verify both tools work in production
- Failure QA: Run deploy with broken build, verify `vp run deploy` exits non-zero or `wrangler` reports build failure (do not rely on Cloudflare UI, which may change)
- Commit: `chore: configure Cloudflare Pages deployment`

**[T10] Final build check and Lighthouse audit**

- References: Lighthouse CI, Chrome DevTools
- Run `vp build`, verify output size (hard target: < 500KB gzipped; if exceeded, treat as a blocker and optimize before deploy)
- Run Lighthouse via `vp run lighthouse:report`: target Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90
- Verify PDF generated from sample markdown is < 1MB for typical documents
- Acceptance: All Lighthouse categories meet thresholds, bundle under 500KB gzipped
- Happy QA: Build produces lean assets, site loads fast on throttled 4G simulation
- Failure QA: Intentionally add unused 1MB import, verify Lighthouse flags oversized assets in report
- Commit: `chore: final build optimization and Lighthouse audit`

## Final verification wave

Runs in parallel after all todos complete:

- **F1 Plan compliance audit**: Verify all todos implemented, no scope creep, every acceptance criteria met
- **F2 Code quality review**: `vp check` passes (Oxlint + Oxfmt + tsgo, no errors), Vue 3.6 Composition API patterns followed, no dead code
- **F3 Real-device manual QA**: Test both tools on actual mobile viewport (375px) and desktop, verify responsive behavior, test PDF download on iOS Safari and Chrome
- **F4 Scope fidelity**: Confirm no backend added, no auth added, no extra features beyond Base64 and Markdown→PDF

All four must APPROVE before declaring complete.

## Commit strategy

Atomic, single-purpose commits following Conventional Commits:

- `chore:` for scaffolding and config
- `feat:` for new tool features
- `fix:` for bug fixes
- `refactor:` for code restructuring
- `perf:` for performance improvements
- `style:` for UI-only changes (colors, spacing)

No commit without a passing build and passing agent-executed QA for that todo.

## Success criteria

1. `vp build` produces static assets in `dist/` with zero errors
2. Both tools function correctly in browser (dev server and production build)
3. Base64 tool correctly handles multi-round encode/decode for 1-20 rounds with Unicode
4. Markdown→PDF tool generates valid, viewable PDFs from standard Markdown
5. UI is responsive (mobile-first), accessible (WCAG AA), and artistically modern
6. `vp run deploy` successfully pushes to Cloudflare Pages with a working live URL
7. Lighthouse Performance, Accessibility, and Best Practices scores all ≥ 90
