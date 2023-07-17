import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: false
  },
  plugins: [uni()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
    extensions: [".ts", ".json", ".vue", ".less"] // 指定可省略的扩展名
  },
  server: {
    proxy: {
      //...
    }
  }
});
