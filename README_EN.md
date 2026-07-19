<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo.webp">
    <img src="public/logo.webp" width="128" height="128" alt="um-wtools">
  </picture>
  <h1 align="center">um-wtools</h1>
  <p align="center">Free client-side toolbox · Zero server required</p>
</p>

<p align="center">
  <strong>English</strong> · <a href="./README.md">简体中文</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.6-4FC08D?logo=vue.js" alt="Vue 3.6">
  <img src="https://img.shields.io/badge/Vite%2B-0.2-646CFF?logo=vite" alt="Vite+">
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss" alt="Tailwind v4">
  <img src="https://img.shields.io/badge/i18n-zh%20%7C%20en-358EF1" alt="i18n">
  <img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare" alt="Cloudflare Pages">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License">
  <a href="https://ko-fi.com/unforgetmemory"><img src="https://img.shields.io/badge/Ko--fi-Support-FF5E5B?logo=kofi&logoColor=white" alt="Ko-fi"></a>
</p>

---

## ✨ Features

| Tool | Description |
|------|-------------|
| **Base64 Tool** | Multi-round encode/decode with auto-detection (max 20 rounds). Unicode safe. |
| **Markdown → PDF** | Live Markdown preview, one-click PDF output via native browser print. |

All processing runs locally in your browser. **No data is sent to any server.**

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
vp install

# Start dev server
vp dev

# Run tests
vp test

# Build for production
vp build
```

### Deploy to Cloudflare Pages

First deployment:

```bash
# Login to Cloudflare
npx wrangler login

# Create project (first time only)
npx wrangler pages project create um-wtools

# Deploy
vp build && vp run deploy
```

Subsequent updates:

```bash
vp build && vp run deploy
```

Or connect to GitHub for auto-deploy: Cloudflare Dashboard → Workers & Pages → Create → Connect to Git.

## 🏗️ Tech Stack

| Tech | Purpose |
|------|---------|
| **Vue 3.6** | Frontend framework (Composition API + `<script setup>`) |
| **Vite+** | Unified toolchain (`vp dev`/`build`/`test`/`check`) |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Utility-first styling (`@theme` design tokens) |
| **vue-i18n** | Internationalization (简体中文 / English) |
| **marked + DOMPurify** | Markdown rendering & HTML sanitization |
| **Cloudflare Pages** | Static hosting (global CDN, free tier) |

## 📁 Project Structure

```
um-wtools/
├── public/               # Static assets (logo, favicon, _headers)
├── src/
│   ├── components/       # Shared components (Header, Footer)
│   ├── composables/      # Composables (useTheme)
│   ├── locales/          # i18n locale bundles (zh-CN, en)
│   ├── tools/
│   │   ├── base64/       # Base64 tool (composable + component)
│   │   └── pdf/          # PDF tool (composable + component)
│   ├── i18n.ts           # vue-i18n configuration
│   ├── App.vue           # Root component
│   └── main.ts           # Entry point
├── dist/                 # Build output
├── vite.config.ts        # Vite+ configuration
└── tsconfig.json         # TypeScript configuration
```

## 🧪 Testing

```bash
# Run all tests
vp test

# With coverage report
vp test --coverage

# Code quality check
vp check
```

## 🌐 Internationalization

- **简体中文** (`zh-CN`) — default
- **English** (`en`)

Toggle language via the button in the page header.

## 🧹 Security

- All HTML output sanitized by DOMPurify (XSS prevention)
- Content-Security-Policy header restricts script sources
- All processing client-side; no data leaves the browser
- Dependencies audited regularly

## 📄 License

MIT