import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");
const home = () => import("@/views/home/index.vue");
const epoch = () => import("@/views/epoch/index.vue");
const checkPoint = () => import("@/views/checkPoint/index.vue");
const checkPointDetail = () => import("@/views/checkPointDetail/index.vue");
const transactionBlocks = () => import("@/views/transactionBlocks/index.vue");
const transactionBlocksDetail = () =>
  import("@/views/transactionBlocksDetail/index.vue");
const account = () => import("@/views/account/index.vue");
const coinDetail = () => import("@/views/coinDetail/index.vue");
const packageDetail = () => import("@/views/packageDetail/index.vue");

export default [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: "/mainnet",
    redirect: "/mainnet/home"
  },
  {
    path: "/testnet",
    redirect: "/testnet/home"
  },
  {
    path: "/mainnet/",
    redirect: "/mainnet/home"
  },
  {
    path: "/testnet/",
    redirect: "/testnet/home"
  },
  {
    path: "/home",
    name: "home",
    component: home,
    meta: {
      title: "Home"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/home",
    name: "mainnetHome",
    component: home,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/testnet/home",
    name: "testnetHome",
    component: home,
    meta: {
      title: "Home"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/epoch",
    name: "mainnetEpoch",
    component: epoch,
    meta: {
      title: "Epoch"
    }
  },
  {
    path: "/testnet/epoch",
    name: "testnetEpoch",
    component: epoch,
    meta: {
      title: "Epoch"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/checkPoint",
    name: "mainnetCheckPoint",
    component: checkPoint,
    meta: {
      title: "Checkpoints"
    }
  },
  {
    path: "/testnet/checkPoint",
    name: "testnetCheckPoint",
    component: checkPoint,
    meta: {
      title: "Checkpoints"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/checkPointDetail",
    name: "mainnetCheckPointDetail",
    component: checkPointDetail,
    meta: {
      title: "Checkpoint Detail"
    }
  },
  {
    path: "/testnet/checkPointDetail",
    name: "testnetCheckPointDetail",
    component: checkPointDetail,
    meta: {
      title: "Checkpoint Detail"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/transactionBlocks",
    name: "mainnetTransactionBlocks",
    component: transactionBlocks,
    meta: {
      title: "Transaction Blocks"
    }
  },
  {
    path: "/testnet/transactionBlocks",
    name: "testnetTransactionBlocks",
    component: transactionBlocks,
    meta: {
      title: "Transaction Blocks"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/transactionBlocksDetail",
    name: "mainnetTransactionBlocksDetail",
    component: transactionBlocksDetail,
    meta: {
      title: "Transaction Blocks Detail"
    }
  },
  {
    path: "/testnet/transactionBlocksDetail",
    name: "testnetTransactionBlocksDetail",
    component: transactionBlocksDetail,
    meta: {
      title: "Transaction Blocks Detail"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/account",
    name: "mainnetAccount",
    component: account,
    meta: {
      title: "Account"
    }
  },
  {
    path: "/testnet/account",
    name: "testnetAccount",
    component: account,
    meta: {
      title: "Account"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/coinDetail",
    name: "mainnetCoinDetail",
    component: coinDetail,
    meta: {
      title: "Coin Detail"
    }
  },
  {
    path: "/testnet/coinDetail",
    name: "testnetCoinDetail",
    component: coinDetail,
    meta: {
      title: "Coin Detail"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/mainnet/packageDetail",
    name: "mainnetPackageDetail",
    component: packageDetail,
    meta: {
      title: "Package Detail"
    }
  },
  {
    path: "/testnet/packageDetail",
    name: "testnetPackageDetail",
    component: packageDetail,
    meta: {
      title: "Package Detail"
    }
  },
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  {
    path: "/redirect",
    component: Layout,
    meta: {
      icon: "homeFilled",
      title: $t("menus.hshome"),
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] as Array<RouteConfigsTable>;
