import { cdn } from "./cdn";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import { viteBuildInfo } from "./info";
import svgLoader from "vite-svg-loader";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { configCompressPlugin } from "./compress";
import { prismjsPlugin } from "vite-plugin-prismjs";
// import ElementPlus from "unplugin-element-plus/vite";
import { visualizer } from "rollup-plugin-visualizer";
import removeConsole from "vite-plugin-remove-console";
import themePreprocessorPlugin from "@pureadmin/theme";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { genScssMultipleScopeVars } from "../src/layout/theme";
import { prismjsPlugin } from "vite-plugin-prismjs";
// 以下三项为配置Element-plus按需自动引入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export function getPluginsList(
  command: string,
  VITE_CDN: boolean,
  VITE_COMPRESSION: ViteCompression
) {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue(),
    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve("locales/**")]
    }),
    // jsx、tsx语法支持
    vueJsx(),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    viteBuildInfo(),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        extract: true
      }
    }),
    // 以下两项为配置Element-plus按需自动引入
    AutoImport({
      resolvers: [
        // element-plus主题色配置相关--下面这句importStyle一定要写，不要写个空对象在这儿，否则就会不生效
        ElementPlusResolver({
          // 自动引入修改主题色添加这一行，使用预处理样式，不添加将会导致使用ElMessage，ElNotification等组件时默认的主题色会覆盖自定义的主题色
          importStyle: "sass"
        })
      ]
    }),
    Components({
      resolvers: [
        // element-plus主题色配置相关--下面这句importStyle一定要写，不要写个空对象在这儿，否则就会不生效
        ElementPlusResolver({
          // 自动引入修改主题色添加这一行，使用预处理样式
          importStyle: "sass"
        })
      ]
    }),
    // svg组件化支持
    svgLoader(),
    // ElementPlus({
    //   useSource: true
    // }),
    // 打包分析
    lifecycle === "report"
      ? visualizer({ open: true, brotliSize: true, filename: "report.html" })
      : null,
    prismjsPlugin({
      languages: [
        "solidity",
        "javascript",
        "typescript",
        "json",
        "html",
        "css"
      ],
      plugins: ["line-numbers", "copy-to-clipboard"],
      theme: "default",
      css: true
    })
  ];
}
