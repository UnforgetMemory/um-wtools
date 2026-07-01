import type { DefineLocaleMessage } from "vue-i18n"

const zhCN: DefineLocaleMessage = {
  home: {
    subtitle: "免费的浏览器端工具集。所有处理在本地完成，数据不会发送到任何服务器。",
    base64Desc: "多轮 Base64 编码/解码，支持自动检测加密层数，Unicode 安全。",
    pdfDesc: "Markdown 实时预览，一键输出 PDF，使用浏览器原生打印功能。",
    open: "打开工具",
  },
  nav: { base64: "Base64", markdownPdf: "Markdown → PDF" },
  theme: { title: "主题: {mode}" },
  footer: { text: "um-wtools — 免费的客户端工具集。基于 Vue 与 Cloudflare Pages。" },
  base64: {
    encode: "编码", decode: "解码", auto: "自动", rounds: "轮数:",
    inputLabel: { encode: "明文", decode: "Base64 输入", auto: "输入（自动检测）" },
    placeholder: { encode: "输入要编码的文本...", decode: "输入 Base64 解码...", auto: "输入 Base64 自动检测...", output: "结果将显示在这里..." },
    output: "输出", copy: "复制", copied: "已复制！",
    privacy: "所有处理均在本地浏览器中完成。数据不会发送到任何服务器。",
    detected: "检测到 {rounds} 轮 Base64 编码",
    error: { empty: "输入为空", invalid: "输入包含非 Base64 字符", encodeFailed: "编码失败: {msg}", decodeFailed: "解码失败: {msg}", notBase64: "输入不是有效的 Base64 或无法解码" },
  },
  pdf: {
    page: "页面:", a4: "A4", letter: "Letter", portrait: "纵向", landscape: "横向",
    download: "下载 PDF", editor: "Markdown 编辑器", placeholder: "在此输入或粘贴 Markdown...", preview: "预览",
    privacy: "Markdown 在本地渲染。PDF 使用浏览器原生打印功能。",
    printHint: "打印对话框中点击「更多设置」→ 取消「页眉和页脚」→ 保存 PDF。",
    error: { failed: "PDF 生成失败: {msg}" },
  },
}

export default zhCN