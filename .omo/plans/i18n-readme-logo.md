# Plan: i18n + README + Logo Integration

## Scope

### A. vue-i18n 国际化集成
- Install `vue-i18n` v11, Composition API mode (`legacy: false`)
- Locale files: `src/locales/zh-CN.ts` (primary), `src/locales/en.ts` (fallback)
- i18n instance → `src/i18n.ts`
- Update 5 components to use `$t()` / `t()` instead of hardcoded text
- Runtime error strings from composables → pass error codes, translate in component

### B. Logo 集成（新增）
- Add `.localref/` to `.gitignore`
- Clean up Zone.Identifier artifact
- Convert `LOGO.png` (1024×1024, 1.7MB) to web-friendly formats:
  - `public/logo.webp` - WebP 压缩版（用于网页展示）
  - `public/favicon-32x32.png` - 32×32 favicon
  - `public/logo.png` - 保留副本用于 README
- Update `<link rel="icon">` in `index.html`
- Show logo in `Header.vue`
- Add logo to README (Chinese + English)

### C. Cloudflare 缓存策略
- Add `_headers` rules for logo/favicon:
  - `/logo.*` → Cache-Control: public, max-age=31536000, immutable
  - `/favicon*` → Cache-Control: public, max-age=31536000, immutable

### D. README 文件（中文优先）
- `README.md` (Chinese, primary)
- `README_EN.md` (English)

### E. 不在范围
- 不自动提交或推送
- 不改动 CSS / 功能逻辑 / composable 核心

## i18n Text Keys (37 个)

Detailed mapping in separate inventory file (see `.omo/drafts/i18n-inventory.md`).

## 执行顺序

1. `.gitignore` + 清理 → Logo 转换 → 网页集成
2. vue-i18n 安装 + locale 文件 + 配置
3. 组件逐一替换: Header → Footer → Base64Tool → MarkdownPdfTool
4. README 编写（中文 → 英文）
5. `vp build` + `vp test` 验证

## 验收标准
- [ ] `vp build` passes, no type errors
- [ ] `vp test` passes (15 tests)
- [ ] Logo 在 Header 和 README 中正确显示
- [ ] Favicon 正确替换
- [ ] 语言切换后所有 UI 文本正确显示 zh-CN / en
- [ ] `.localref/` 被 gitignore 排除
- [ ] Cloudflare `_headers` 覆盖 logo/favicon 缓存
- [ ] README 中文优先显示
