<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo.webp">
    <img src="public/logo.webp" width="128" height="128" alt="um-wtools">
  </picture>
  <h1 align="center">um-wtools</h1>
  <p align="center">免费的浏览器端工具集 · 纯客户端 · 无需服务器</p>
</p>

<p align="center">
  <a href="./README_EN.md">English</a> · <strong>简体中文</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.6-4FC08D?logo=vue.js" alt="Vue 3.6">
  <img src="https://img.shields.io/badge/Vite%2B-0.2-646CFF?logo=vite" alt="Vite+">
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss" alt="Tailwind v4">
  <img src="https://img.shields.io/badge/i18n-zh%20%7C%20en-358EF1" alt="i18n">
  <img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare" alt="Cloudflare Pages">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License">
</p>

---

## ✨ 功能

| 工具 | 描述 |
|------|------|
| **Base64 编解码** | 支持多轮编码/解码，自动检测加密层数（最多 20 轮），Unicode 安全 |
| **Markdown → PDF** | Markdown 实时预览，一键输出 PDF（使用浏览器原生打印功能） |

所有处理均在浏览器本地完成，**数据不会发送到任何服务器**。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
vp install

# 启动开发服务器
vp dev

# 运行测试
vp test

# 构建生产版本
vp build
```

### 部署到 Cloudflare Pages

首次部署：

```bash
# 登录 Cloudflare
npx wrangler login

# 创建项目（仅首次）
npx wrangler pages project create um-wtools

# 部署
vp build && vp run deploy
```

后续更新只需：

```bash
vp build && vp run deploy
```

也可连接 GitHub 仓库实现自动部署：Cloudflare Dashboard → Workers & Pages → Create → Connect to Git。

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| **Vue 3.6** | 前端框架（Composition API + `<script setup>`） |
| **Vite+** | 统一工具链（`vp dev`/`build`/`test`/`check`） |
| **TypeScript** | 类型安全 |
| **Tailwind CSS v4** | 原子化样式（`@theme` 设计令牌） |
| **vue-i18n** | 国际化（简体中文 / English） |
| **marked + DOMPurify** | Markdown 渲染与 HTML 净化 |
| **Cloudflare Pages** | 静态托管（全球 CDN，免费） |

## 📁 项目结构

```
um-wtools/
├── public/               # 静态资源（logo, favicon, _headers）
├── src/
│   ├── components/       # 共享组件（Header, Footer）
│   ├── composables/      # 组合式函数（useTheme）
│   ├── locales/          # 国际化语言包（zh-CN, en）
│   ├── tools/
│   │   ├── base64/       # Base64 工具（composable + 组件）
│   │   └── pdf/          # PDF 工具（composable + 组件）
│   ├── i18n.ts           # vue-i18n 配置
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口
├── dist/                 # 构建输出
├── vite.config.ts        # Vite+ 配置
└── tsconfig.json         # TypeScript 配置
```

## 🧪 测试

```bash
# 运行所有测试
vp test

# 带覆盖率报告
vp test --coverage

# 代码质量检查
vp check
```

## 🌐 国际化

- **简体中文**（`zh-CN`）— 默认
- **English**（`en`）

在页面右上角点击语言切换按钮切换。

## 🧹 安全

- 所有 HTML 输出经过 DOMPurify 净化，防止 XSS
- Content-Security-Policy 头部限制脚本执行来源
- 所有处理在浏览器本地完成，无数据外传
- 依赖定期审计

## 📄 许可证

MIT