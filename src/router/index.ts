import { createRouter, createWebHistory } from "vue-router"
import HomeHero from "../layouts/HomeHero.vue"
import Base64Tool from "../features/base64/ui/Base64Tool.vue"
import MarkdownPdfTool from "../features/markdown-pdf/ui/MarkdownPdfTool.vue"
import TimestampTool from "../features/timestamp/ui/TimestampTool.vue"
import DisclaimerTool from "../features/disclaimer/ui/DisclaimerTool.vue"
import MagnetTool from "../features/magnet/ui/MagnetTool.vue"

const routes = [
  { path: "/", name: "home", component: HomeHero },
  { path: "/base64", name: "base64", component: Base64Tool },
  { path: "/markdown-pdf", name: "markdown-pdf", component: MarkdownPdfTool },
  { path: "/timestamp", name: "timestamp", component: TimestampTool },
  { path: "/disclaimer", name: "disclaimer", component: DisclaimerTool },
  { path: "/magnet", name: "magnet", component: MagnetTool },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
