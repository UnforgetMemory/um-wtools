# MD5 Calculation Tool — Design Spec

## Overview

Add an MD5 hash calculation tool to um-wtools. Users input text, get its MD5 hash instantly. Pure client-side, no server upload.

## Architecture

Follows the existing feature-based DDD pattern used by all tools (`src/features/{name}/`):

```
src/features/md5/
├── domain/
│   └── md5.ts              # Pure function: md5(text: string) => string
├── application/
│   └── useMd5.ts           # Vue composable: input/output refs + compute/copy
├── ui/
│   └── Md5Tool.vue         # SFC: textarea input + button + result display
└── __tests__/
    └── md5.test.ts          # Domain logic tests
```

## Domain Layer

- `md5(text: string): string` — pure function, no Vue imports
- Pure JS implementation (Web Crypto API doesn't support MD5)
- Standard hex-encoded MD5 output

## Application Layer

- `useMd5()` composable wrapping `md5()`
- Exposes: `input` (ref), `output` (computed), `copyOutput()` method
- Lean pattern (like `useBase64`): no extra state, just bridge domain↔UI

## UI Layer

- Textarea for input, button to trigger compute (auto-compute on input change)
- Result display in a read-only field with copy button
- Reuses `UCard`, `UTextarea`, `UButton` from shared toolkit
- Layout matches existing tools: `space-y-6` wrapper, privacy note at bottom

## Registration (6 touch points)

| File | Change |
|---|---|
| `src/toolkit/types/index.ts` | Add `"md5"` to `ToolTab` union |
| `src/router/index.ts` | Add route `{ path: "/md5", name: "md5", component: Md5Tool }` |
| `src/layouts/HomeHero.vue` | Add card `{ id: "md5", title: "MD5", descKey: "md5Desc" }` |
| `src/i18n/locales/en.ts` | Add `md5` and `home.md5Desc` keys |
| `src/i18n/locales/zh-CN.ts` | Same with Chinese translations |

## i18n Keys

```ts
md5: {
  input: "Input",
  output: "MD5 Hash",
  placeholder: "Enter text to calculate MD5...",
  copy: "Copy",
  copied: "Copied!",
  privacy: "All processing is done locally in your browser. No data is sent to any server.",
  error: { empty: "Input is empty" },
}
```

## Constraints

- No external dependencies (pure JS MD5)
- No file upload support (text input only)
- Auto-compute on input change (debounced)
- Copy button with feedback state