<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo.webp">
    <img src="public/logo.webp" width="128" height="128" alt="um-wtools">
  </picture>
  <h1 align="center">um-wtools</h1>
  <p align="center"><strong>免费的浏览器端工具集</strong> · 纯客户端 · 无需服务器</p>
</p>

<p align="center">
  <a href="./README_EN.md">English</a> · <strong>简体中文</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.6-4FC08D?logo=vue.js" alt="Vue 3.6">
  <img src="https://img.shields.io/badge/Vite%2B-0.2-646CFF?logo=vite" alt="Vite+">
  <img src="https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss" alt="Tailwind v4">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript">
  <img src="https://img.shields.io/badge/i18n-5%20%E8%AF%AD%E8%A8%80-358EF1" alt="i18n">
  <img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare" alt="Cloudflare Pages">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License">
  <a href="https://ko-fi.com/unforgetmemory"><img src="https://img.shields.io/badge/Ko--fi-Support-FF5E5B?logo=kofi&logoColor=white" alt="在 Ko-fi 上支持我们"></a>
</p>

---

## ✨ 功能一览

| 工具 | 描述 |
|------|------|
| **🔐 Base64 编解码** | 多轮编码/解码，支持自动检测加密层数（最多 20 轮），Unicode 安全 |
| **⏰ 时间戳转换** | 实时时钟与手动输入，支持 18 个时区查询，自动识别 Unix 秒/毫秒/ISO 8601 |
| **🧲 磁力链接工具** | 磁力链接解析、种子文件信息提取，P2P 元数据下载，Tracker 健康检查 |
| **🔢 MD5 哈希计算** | 输入文本即时计算 MD5 哈希，支持大小写切换，一键复制 |
| **📜 免责声明** | 完整的使用条款、隐私政策与服务说明，多语言覆盖 |

> 所有处理均在浏览器本地完成，**数据不会发送到任何服务器**。

---

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

```bash
# 首次部署
npx wrangler login
npx wrangler pages project create um-wtools
vp build && vp run deploy

# 后续更新
vp build && vp run deploy
```

也可连接 GitHub 仓库实现自动部署：Cloudflare Dashboard → Workers & Pages → Create → Connect to Git。

---

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| **Vue 3.6** | 前端框架（Composition API + `<script setup>`） |
| **Vite+** | 统一工具链（`vp dev`/`build`/`test`/`check`） |
| **TypeScript** | 类型安全 |
| **Tailwind CSS v4** | 原子化样式（`@theme` 设计令牌） |
| **vue-i18n** | 国际化（5 种语言） |
| **vue-router** | 客户端路由与代码分割 |
| **Cloudflare Pages** | 静态托管（全球 CDN，免费） |

---

## 📁 项目结构

```
um-wtools/
├── public/                      # 静态资源（logo, favicon, _headers）
├── src/
│   ├── features/                # 功能模块（DDD 分层架构）
│   │   ├── base64/              # Base64 编解码
│   │   ├── disclaimer/          # 免责声明
│   │   ├── magnet/              # 磁力链接工具
│   │   ├── md5/                 # MD5 哈希计算
│   │   └── timestamp/           # 时间戳转换
│   ├── toolkit/                 # 共享工具库
│   │   ├── composables/         # 组合式函数（useTheme, useClipboard 等）
│   │   ├── types/               # 类型定义
│   │   └── ui/                  # UI 组件（UButton, UCard, UTextarea 等）
│   ├── i18n/                    # 国际化（5 种语言）
│   ├── layouts/                 # 布局组件（Header, Footer, HomeHero）
│   ├── router/                  # 路由配置
│   ├── App.vue                  # 根组件
│   ├── main.ts                  # 入口
│   └── style.css                # 全局样式与主题变量
├── e2e/                         # Playwright 端到端测试
├── dist/                        # 构建输出
├── docs/                        # 架构决策与设计文档
│   ├── adr/                     # ADR（架构决策记录）
│   └── superpowers/             # 设计规格
├── vite.config.ts               # Vite+ 配置
├── tsconfig.json                # TypeScript 配置
└── wrangler.toml               # Cloudflare Pages 配置
```

---

## 🧪 测试

```bash
# 运行所有测试
vp test

# 带覆盖率报告
vp test --coverage

# 端到端测试
npx playwright test

# 代码质量检查
vp check
```

---

## 🌐 国际化

支持 5 种语言，浏览器自动检测：

| 语言 | 区域设置 |
|------|----------|
| **简体中文** | `zh-CN`（默认） |
| **English** | `en` |
| **繁體中文** | `zh-TW` |
| **日本語** | `ja` |
| **한국어** | `ko` |

在页面右上角点击语言切换按钮循环切换。

---

## 🧹 安全

- **零服务端依赖**：所有处理在浏览器本地完成，数据不会离开你的设备
- **XSS 防护**：所有 HTML 渲染经过净化处理
- **Content-Security-Policy**：限制脚本执行来源
- **依赖审计**：`pnpm audit` 零已知漏洞
- **开源透明**：完整的源代码可供审查

---

## ☕ 支持项目

如果你觉得这个项目有帮助，欢迎请我喝杯咖啡：

<p align="center">
  <a href="https://ko-fi.com/unforgetmemory" target="_blank" rel="noopener noreferrer">
    <img src="https://storage.ko-fi.com/cdn/kofi3.png" height="40" alt="在 Ko-fi 上支持我">
  </a>
</p>

---

## 📄 许可证

[MIT](LICENSE) © [UnforgetMemory](https://github.com/UnforgetMemory)