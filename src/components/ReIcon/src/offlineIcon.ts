import { addIcon } from "@iconify/vue/dist/offline";

/**
 * 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
 */

// 本地菜单图标，后端在路由的icon中返回对应的图标字符串并且前端在此处使用addIcon添加即可渲染菜单图标
import HomeFilled from "@iconify-icons/ep/home-filled";
import InformationLine from "@iconify-icons/ri/information-line";
import Lollipop from "@iconify-icons/ep/lollipop";
import Avatar from "@iconify-icons/ep/avatar";
import store3Fill from "@iconify-icons/ri/store-3-fill";
import exchangeDollarLine from "@iconify-icons/ri/exchange-dollar-line";
import barChartGroupedFill from "@iconify-icons/ri/bar-chart-grouped-fill";
import timerIcon from "@iconify-icons/ep/timer";
import ticketsIcon from "@iconify-icons/ep/tickets";
import takeawayBox from "@iconify-icons/ep/takeaway-box";
import coinsLine from "@iconify-icons/ri/coins-line";
import currencyFill from "@iconify-icons/ri/currency-fill";
import fundsBoxLine from "@iconify-icons/ri/funds-box-line";
import setting from "@iconify-icons/ri/settings-4-line";
import safeFill from "@iconify-icons/ri/safe-fill";

addIcon("homeFilled", HomeFilled);
addIcon("informationLine", InformationLine);
addIcon("lollipop", Lollipop);
addIcon("Avatar", Avatar);
addIcon("setting", setting);
addIcon("store3Fill", store3Fill);
addIcon("exchangeDollarLine", exchangeDollarLine);
addIcon("barChartGroupedFill", barChartGroupedFill);
addIcon("timerIcon", timerIcon);
addIcon("ticketsIcon", ticketsIcon);
addIcon("takeawayBox", takeawayBox);
addIcon("coinsLine", coinsLine);
addIcon("currencyFill", currencyFill);
addIcon("fundsBoxLine", fundsBoxLine);
addIcon("safeFill", safeFill);
