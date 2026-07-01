import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  lint: {
    include: ["src/**/*.{ts,vue}"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
