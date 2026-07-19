import { createRouter, createWebHistory } from "vue-router"
import HomeHero from "../layouts/HomeHero.vue"

const routes = [
  { path: "/", name: "home", component: HomeHero },
  { path: "/base64", name: "base64", component: () => import("../features/base64/ui/Base64Tool.vue") },
  
  { path: "/timestamp", name: "timestamp", component: () => import("../features/timestamp/ui/TimestampTool.vue") },
  { path: "/disclaimer", name: "disclaimer", component: () => import("../features/disclaimer/ui/DisclaimerTool.vue") },
  { path: "/magnet", name: "magnet", component: () => import("../features/magnet/ui/MagnetTool.vue") },
  { path: "/md5", name: "md5", component: () => import("../features/md5/ui/Md5Tool.vue") },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
