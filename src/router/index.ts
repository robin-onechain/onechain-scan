// import "@/utils/sso";
import { getConfig } from "@/config";
// import NProgress from "@/utils/progress";
import { transformI18n } from "@/plugins/i18n";
import { usePermissionStoreHook } from "@/store/modules/permission";
import {
  Router,
  createRouter,
  RouteRecordRaw,
  RouteComponent
} from "vue-router";
import {
  ascending,
  getHistoryMode,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import { buildHierarchyTree } from "@/utils/tree";
import { isUrl } from "@pureadmin/utils";

import remainingRouter from "./modules/remaining";

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
  {
    eager: true
  }
);
/** 原始静态路由（未做任何处理） */
const routes = [];

Object.keys(modules).forEach(key => {
  routes.push(modules[key].default);
});

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(routes).concat(
  ...remainingRouter
);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach(route => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      router.options.routes = formatTwoStageRoutes(
        formatFlatteningRoutes(buildHierarchyTree(ascending(routes)))
      );
    }
  });
  usePermissionStoreHook().clearAllCachePage();
}

router.beforeEach((to: toRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    const newMatched = to.matched;
    handleAliveRoute(newMatched, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(newMatched);
    }
  }
  // NProgress.start();
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.some(item => {
      if (!item.meta.title) return "";
      const Title = getConfig().Title;
      if (Title)
        document.title = `${transformI18n(item.meta.title)} | ${Title}`;
      else document.title = transformI18n(item.meta.title);
    });
  }

  let yz_netUrl = (sessionStorage.getItem("netUrl") ?? "Mainnet").toLowerCase();
  let yz_path = to.path.toLowerCase();

  if (yz_path.indexOf("mainnet") !== -1) {
    if (yz_netUrl !== "mainnet") {
      sessionStorage.setItem("netUrl", "Mainnet" as string);
      yz_netUrl = "mainnet";
    }
  } else if (yz_path.indexOf("testnet") !== -1) {
    if (yz_netUrl !== "testnet") {
      sessionStorage.setItem("netUrl", "Testnet" as string);
      yz_netUrl = "testnet";
    }
  }

  let yz_url = `/${yz_netUrl}${to.fullPath}`;

  if (to.path === "/home") {
    next(yz_url);
  } else if (to.path === "/epoch") {
    next(yz_url);
  } else if (to.path === "/checkPoint") {
    next(yz_url);
  } else if (to.path === "/checkPointDetail") {
    next(yz_url);
  } else if (to.path === "/transactionBlocks") {
    next(yz_url);
  } else if (to.path === "/transactionBlocksDetail") {
    next(yz_url);
  } else if (to.path === "/account") {
    next(yz_url);
  } else if (to.path === "/coinDetail") {
    next(yz_url);
  } else if (to.path === "/packageDetail") {
    next(yz_url);
  } else {
    next();
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0); // 滚动到页面顶部
});

export default router;
