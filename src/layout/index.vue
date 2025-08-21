<script setup lang="ts">
import "animate.css";
import { emitter } from "@/utils/mitt";
import { useAppStoreHook } from "@/store/modules/app";
import { deviceDetection } from "@pureadmin/utils";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

import Header from "./components/header.vue";
import Footer from "./components/footer.vue";
import appMain from "./components/appMain.vue";
import { Upload } from "@element-plus/icons-vue";
const { t } = useI18n();
const isMobile = deviceDetection();

function toggle(device: string, bool: boolean) {
  useAppStoreHook().toggleDevice(device);
  useAppStoreHook().toggleSideBar(bool, "resize");
}

// 判断是否可自动关闭菜单栏
let isAutoCloseSidebar = true;

// 监听容器
emitter.on("resize", ({ detail }) => {
  if (isMobile) return;
  const { width } = detail;
  /** width app-wrapper类容器宽度
   * 0 < width <= 760 隐藏侧边栏
   * 760 < width <= 990 折叠侧边栏
   * width > 990 展开侧边栏
   */
  if (width > 0 && width <= 760) {
    toggle("mobile", false);
    isAutoCloseSidebar = true;
  } else if (width > 760 && width <= 990) {
    if (isAutoCloseSidebar) {
      toggle("desktop", false);
      isAutoCloseSidebar = false;
    }
  } else if (width > 990) {
    toggle("desktop", true);
    isAutoCloseSidebar = true;
  }
});

onMounted(() => {
  if (isMobile) {
    toggle("mobile", false);
  }
});
</script>

<template>
  <div class="app-wrapper" v-resize>
    <div class="main-container">
      <Header class="header" />
      <el-scrollbar class="scrollbar">
        <el-backtop
          :title="t('layout.backTop')"
          target=".main-container .el-scrollbar__wrap"
        >
          <el-icon><Upload /></el-icon>
        </el-backtop>
        <div class="conentwp">
          <!-- 主体内容 -->
          <app-main />
          <Footer />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@mixin clearfix {
  &::after {
    content: "";
    display: table;
    clear: both;
  }
}

.app-wrapper,
.main-container {
  height: 100vh;
  width: 100%;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  height: 50px;
  width: 100%;
}

.scrollbar {
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;

  .conentwp {
    min-height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
}

.re-screen {
  margin-top: 12px;
}
</style>
