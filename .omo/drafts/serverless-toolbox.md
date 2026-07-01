# serverless-toolbox - Draft

## Intent

CLEAR

## Review Required

false

## Status

awaiting-approval

## Metis Review (Vue 3.6 update)

- Status: complete
- Issues found: 15 (5 critical, 8 medium, 2 low)
- Issues resolved in plan:
  1. Added `vueuse` dependency for `watchDebounced` (critical)
  2. Fixed "No human intervention" contradiction in verification strategy (critical)
  3. T10 bundle-size target: changed from aspirational to hard blocker (critical)
  4. T8 failure QA: removed invalid JS-disabled test for Vue SPA (critical)
  5. T8 Lighthouse check: deferred contrast audit to T10 (critical)
  6. T1.5 renumbering: kept as T1.5 with note (medium)
  7. T10 scope creep: removed "optimize if needed" (medium)
  8. Added `lighthouse` and `wrangler` to dev dependencies (medium)
  9. mdpdf-core browser compatibility: documented (medium)
  10. mdpdf-core API: added discovery step in T6 references (medium)
  11. Cloudflare Pages config: standardized on `.cloudflare/pages` (medium)
  12. T1 acceptance: made specific (medium)
  13. Lighthouse thresholds: harmonized to ≥ 90 (low)
  14. T9 failure QA: exit code assertion instead of Cloudflare UI (low)
  15. `@types/node`: clarified as Vite config types only (low)
- Remaining open: None. All issues resolved.

## Momus Review (High-precision)

- Status: complete
- Outcome: REJECTED on first pass — 3 blocking issues found and fixed
- Issues fixed:
  1. **Systemic Vite+ toolchain mismatch**: Replaced all 18 `npm run` references with their `vp` equivalents across Verification strategy, all todos, and Success criteria.
  2. **T3 Happy QA tested non-existent tools**: Rewrote to verify tab switching shows placeholder content (Base64/Markdown tools not built until Waves 2/3).
  3. **T10 Lighthouse no executable script**: Added `lighthouse:report` script to package.json in T9; T10 now references `vp run lighthouse:report`.
- Review result: PASS after fixes applied.

## Topology Lock

1. **Base64 multi-round tool**: Vue 3.6 composable + SFC for iterative Base64 encode/decode with auto-detection
2. **Markdown-to-PDF tool**: Vue 3.6 composable + SFC for markdown parsing + mdpdf-core PDF generation with preview
3. **Shared UI shell**: Vue 3.6 root component with tab routing, Header/Footer SFCs, responsive layout, theme system
4. **Deployment config**: Cloudflare Pages static hosting with `.cloudflare/pages` config and `wrangler` deploy

## Decisions

- **Hosting**: Cloudflare Pages (static). One-time manual project creation required; all subsequent deploys automated.
- **Framework**: Vite+ (`vp`) + Vue 3.6 + TypeScript. Composition API with `<script setup>`, Vue composables for tool logic.
- **Toolchain**: Vite+ unified CLI (`vp dev`, `vp build`, `vp test`, `vp check`) replaces separate Vite/Vitest/Oxlint/Oxfmt scripts.
- **Styling**: Tailwind CSS v4 (via Vite plugin) with custom `@theme` tokens for artistic/modern feel.
- **Base64**: Pure TS Vue composable (`useBase64.ts`), no library. TextEncoder/TextDecoder + btoa/atob, Unicode-safe, max 20 rounds.
- **PDF engine**: `mdpdf-core` (pure JS, pdf-lib backend, vector-based, browser-native via npm browser entrypoint). Alternative considered: html2pdf.js (raster-based).
- **Utilities**: VueUse for `watchDebounced` and other composition utilities.
- **Testing**: Vitest + Vue Test Utils + @testing-library/vue.
- **Deploy tooling**: `wrangler` CLI for Cloudflare Pages; `lighthouse` for final audit.
- **WASM**: Not used. Native browser APIs + Vue 3.6 + TS sufficient for these tools.
- **Deployment**: Cloudflare Pages with Git integration. Build: `npm run build`, output: `dist/`. Free tier sufficient.

## Open Questions (for approval gate)

- None. All decisions are made based on best-practice defaults for a serverless toolbox.

## User Override

- **Vue 3.6**: User explicitly requested Vue 3.6 instead of vanilla TypeScript. Plan updated to use Vue 3.6 Composition API with `<script setup>`, Vue composables, and Vue SFCs.

## Approval Gate

- Status: awaiting-approval
- Pending action: execute plan `.omo/plans/serverless-toolbox.md`
- Approach: Build a Vite+ (`vp`) + Vue 3.6 + TS + Tailwind static site with two client-side tools (Base64, Markdown→PDF), deploy to Cloudflare Pages.
- **Metis review**: complete — 15 issues found, all resolved in updated plan.
- **Momus review**: complete — first pass rejected with 3 blocking issues, all fixed. Second pass: PASS.
