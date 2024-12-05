import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "node:url";
import colors from "picocolors";
import { LoggerWarnOptions } from "sass";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import { mars3dPlugin } from "vite-plugin-mars3d";
import svgLoader from "vite-svg-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    mars3dPlugin(),
    AutoImport({ resolvers: [ElementPlusResolver({ importStyle: "sass" })] }),
    Components({ resolvers: [ElementPlusResolver({ importStyle: "sass" })] }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        logger: {
          warn: (message: string, options: LoggerWarnOptions) => {
            if (options.deprecation) return;
            console.warn("?" + colors.yellow(`[scss]: ${message}`));
          },
        },
      },
    },
  },
  server: {
    port: 8000,
    host: true,
    proxy: {
      "/api": {
        target: "http://192.168.50.103:7878",
        changeOrigin: true,
        ws: true,
        // rewrite: (path) => path.replace(/^\/dev/, ""),
        secure: false, // 如果是https接口，需要配置这个参数
      },
    },
  },
});
