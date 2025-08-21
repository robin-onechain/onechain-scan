<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, h } from "vue";
import Gas from "@/assets/svg/gas.svg?component";
import Logo from "@/assets/svg/logo.svg?component";
import SunIcon from "@/assets/svg/sunicon.svg?component";
import { CaretBottom } from "@element-plus/icons-vue";
import { getSupplyInfo } from "@/api/home";
import Search from "./search/index.vue";
import { SearchModal } from "./search/components";
import { emitter } from "@/utils/mitt";
import { notification } from "@/utils/message";
import { useRouter, useRoute } from "vue-router";
import Coin from "@/assets/svg/coin.svg?url";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import { useNav } from "@/layout/hooks/useNav";
import { useBoolean } from "../hooks/useBoolean";

const { bool: show, toggle } = useBoolean();
const { device } = useNav();
const router = useRouter();
const route = useRoute();
const timer = ref(null);
const netdata = ref(null);
const netdataA = ref(null);
const yz_menu_show = ref(false);
const menu_index = ref(0);
const supplyInfo = ref({
  price: 0, //价格
  pricePercent: "0%", //价格百分比(目前不确定固定值)
  gasAvg: "0"
});

const push_url = (url: string) => {
  yz_menu_show.value = false;
  router.replace(url);
};

const handleNetdata = (command: string) => {
  yz_menu_show.value = false;
  netdata.value = command;
  netdataA.value = netdata.value.toLowerCase();
  sessionStorage.setItem("netUrl", command);
  if (route.path === "/home") {
    getData();
    emitter.emit("refresh");
  } else {
    router.replace("/");
  }
  notification(
    "Switching successful",
    h("p", { style: "line-height: 1; font-size: 14px" }, [
      h("span", null, "Current Data Source: "),
      h("b", { style: "color: blue" }, command)
    ]),
    { type: "success" }
  );
};
const getData = () => {
  getSupplyInfo().then(res => {
    supplyInfo.value = res.data;
  });
};

function handleSearch() {
  toggle();
}

onMounted(() => {
  const { net } = route.query;
  if (net) {
    netdata.value = net;
    sessionStorage.setItem("netUrl", net as string);
  } else {
    netdata.value = sessionStorage.getItem("netUrl") ?? "Mainnet";
  }
  netdataA.value = netdata.value.toLowerCase();
  // const netUrl = net
  //   ? net
  //   : sessionStorage.getItem("netUrl")
  //   ? sessionStorage.getItem("netUrl")
  //   : "Mainnet";
  getData();
  timer.value = setInterval(() => {
    getData();
  }, 60000);
});
onBeforeUnmount(() => {
  clearTimeout(timer.value);
});
</script>

<template>
  <div v-if="device === 'mobile'" class="yz_header_box">
    <img class="w-[121px] h-[30px]" src="@/assets/yz_img/logo_icon_A.png" />
    <div class="yz_header_right_box">
      <template v-if="!yz_menu_show">
        <img
          class="w-[18px] h-[18px]"
          src="@/assets/yz_img/search_icon_B.png"
          @click="handleSearch" />
        <img
          class="w-[18px] h-[18px] ml-[22px]"
          src="@/assets/yz_img/more_icon.png"
          @click="yz_menu_show = true"
      /></template>
      <img
        v-if="yz_menu_show"
        class="w-[14px] h-[14px]"
        src="@/assets/yz_img/del_icon.png"
        @click="yz_menu_show = false"
      />
    </div>

    <SearchModal v-model:value="show" />
  </div>
  <div v-else class="navbar shadow-sm shadow-[rgba(0, 21, 41, 0.08)] spaec">
    <div
      class="bg-gradient-to-r from-[#E3C5FF] via-[#B5EEFE] to-[#E3C5FF] text-[16px] font-semibold font-sofia h-[50px] text-[#000000]"
    >
      <div
        class="h-full flex items-center justify-between md:max-w-[1200px] w-11/12 mx-auto"
      >
        <div class="flex items-center">
          <div
            @click="$router.push('/')"
            class="cursor-pointer md:block hidden"
          >
            <!-- <Logo /> -->
            <img
              class="w-[124.5px] h-[32px]"
              src="@/assets/yz_img/logo_icon_A.png"
            />
          </div>
          <ul class="flex items-center md:ml-20 ml-6 navul">
            <li
              class="cursor-pointer"
              :class="{
                activeA: $route.path === `/${netdataA}/home`
              }"
              @click="$router.push('/')"
            >
              Home
            </li>
            <li class="md:ml-10 ml-5 flex items-center">
              <el-dropdown
                id="header-translation"
                trigger="click"
                placement="bottom-start"
              >
                <div class="flex">
                  <span
                    class="text-[#000000] text-[16px]"
                    :class="{
                      activeA: $route.path !== `/${netdataA}/home`
                    }"
                    >{{
                      $route.meta.title === "Home" ? "Epoch" : $route.meta.title
                    }}</span
                  >
                  <el-icon color="#000000" size="14"><CaretBottom /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu class="translation translationA">
                    <el-dropdown-item @click="$router.push('/epoch')">
                      <img
                        class="w-[17px] h-[17px] mr-[10px]"
                        src="@/assets/yz_img/epoch_icon.png"
                      />
                      <span class="spaec">Epoch</span>
                    </el-dropdown-item>
                    <el-dropdown-item @click="$router.push('/checkPoint')">
                      <img
                        class="w-[17px] h-[17px] mr-[10px]"
                        src="@/assets/yz_img/checkpoint_icon.png"
                      />
                      <span class="spaec">Checkpoints</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="$router.push('/transactionBlocks')"
                    >
                      <img
                        class="w-[17px] h-[17px] mr-[10px]"
                        src="@/assets/yz_img/transactionBlocks_icon.png"
                      />
                      <span class="spaec">Transaction Blocks</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </li>
          </ul>
        </div>
        <div class="flex items-center">
          <div class="md:w-[320px] h-[36px] text-xs md:block hidden">
            <!-- <Search /> -->
            <div
              class="flex h-[36px] md:max-w-[1200px] w-11/12 mx-auto font-sofia font-bold text-[12px]"
            >
              <div class="flex items-center whitespace-nowrap">
                <img :src="Coin" class="w-[18px] h-[18px]" />
                <span class="ml-2">OCT Price:</span>
                <span class="text-[#214FF6] ml-2">${{ supplyInfo.price }}</span>
                <span class="ml-2">(</span>
                <span
                  :class="[
                    supplyInfo.pricePercent.includes('-')
                      ? 'text-[#214FF6]'
                      : 'text-[#2FA766]'
                  ]"
                  >{{
                    supplyInfo.pricePercent.includes("-")
                      ? supplyInfo.pricePercent
                      : "+" + supplyInfo.pricePercent
                  }}</span
                >
                <span>)</span>
              </div>
              <div class="flex items-center ml-10">
                <Gas />
                <span class="ml-2">Av.Gas </span>
                <span class="text-[#2FA766] ml-2">{{ supplyInfo.gasAvg }}</span>
              </div>
            </div>
          </div>
          <!-- <SunIcon class="ml-4 mr-2" /> -->
          <img
            class="w-[24px] h-[24px] md:ml-[25px] mr-[8px]"
            src="@/assets/yz_img/environment_icon.png"
          />
          <el-dropdown
            id="header-translation"
            trigger="click"
            placement="bottom-end"
            @command="handleNetdata"
          >
            <div class="flex">
              <span class="text-[#000000] mr-1 text-[16px]">{{ netdata }}</span>
              <el-icon color="#000000" size="14"><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="translation translationB">
                <el-dropdown-item command="Mainnet">
                  <span class="spaec">Mainnet</span>
                </el-dropdown-item>
                <el-dropdown-item command="Testnet">
                  <span class="spaec">Testnet</span>
                </el-dropdown-item>
                <!-- <el-dropdown-item command="Devnet"> Devnet </el-dropdown-item> -->
                <view class="eendpoint_box">
                  <view class="eendpoint_obj">
                    <view class="eendpoint_title">Mainnet RPC Endpoint</view>
                    <view class="eendpoint_obj_text">
                      <view class="obj_text"
                        >https://rpc-mainnet.onelabs.cc:443</view
                      >
                      <ReCopyBtn
                        text="https://rpc-mainnet.onelabs.cc:443"
                        copy_icon="copy_icon_A"
                      />
                    </view>
                  </view>
                  <view class="eendpoint_obj">
                    <view class="eendpoint_title">Testnet RPC Endpointt</view>
                    <view class="eendpoint_obj_text">
                      <view class="obj_text"
                        >https://rpc-testnet.onelabs.cc:443</view
                      >
                      <ReCopyBtn
                        text="https://rpc-testnet.onelabs.cc:443"
                        copy_icon="copy_icon_A"
                      />
                    </view>
                  </view>
                </view>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
  <div v-if="yz_menu_show" class="yz_menu_box spaec">
    <div class="devnet_box">
      <img
        class="w-[15px] h-[15px] mr-[6px]"
        src="@/assets/yz_img/environment_icon_A.png"
      />
      {{ netdata }}
    </div>
    <div
      class="menu_obj_title"
      :class="{ menu_obj_title_yes: $route.path === `/${netdataA}/home` }"
      @click="push_url('/')"
    >
      Home
    </div>
    <div class="menu_obj_title" @click="menu_index = 1">
      Blockchain
      <img class="w-[12px] h-[12px]" src="@/assets/yz_img/drop_down_icon.png" />
    </div>
    <div class="menu_obj_box" v-if="menu_index === 1">
      <div
        class="obj_text_box"
        :class="{ obj_text_box_yes: $route.meta.title === 'Epoch' }"
        @click="push_url('/epoch')"
      >
        <img
          class="w-[17px] h-[17px] mr-[10px]"
          src="@/assets/yz_img/epoch_icon.png"
        />
        Epoch
      </div>
      <div
        class="obj_text_box"
        :class="{ obj_text_box_yes: $route.meta.title === 'Checkpoints' }"
        @click="push_url('/checkPoint')"
      >
        <img
          class="w-[17px] h-[17px] mr-[10px]"
          src="@/assets/yz_img/checkpoint_icon.png"
        />
        Checkpoints
      </div>
      <div
        class="obj_text_box"
        :class="{
          obj_text_box_yes: $route.meta.title === 'Transaction Blocks'
        }"
        @click="push_url('/transactionBlocks')"
      >
        <img
          class="w-[17px] h-[17px] mr-[10px]"
          src="@/assets/yz_img/transactionBlocks_icon.png"
        />
        Transaction Blocks
      </div>
    </div>
    <div class="menu_obj_title" @click="menu_index = 2">
      Network
      <img class="w-[12px] h-[12px]" src="@/assets/yz_img/drop_down_icon.png" />
    </div>
    <div class="menu_obj_box" v-if="menu_index === 2">
      <div
        class="obj_text_box"
        :class="{ obj_text_box_yes: netdata === 'Mainnet' }"
        @click="handleNetdata('Mainnet')"
      >
        Mainnet
      </div>
      <div
        class="obj_text_box"
        :class="{ obj_text_box_yes: netdata === 'Testnet' }"
        @click="handleNetdata('Testnet')"
      >
        Testnet
      </div>
    </div>
    <view class="eendpoint_box" v-if="menu_index === 2">
      <view class="eendpoint_obj">
        <view class="eendpoint_title">Mainnet RPC Endpoint</view>
        <view class="eendpoint_obj_text">
          <view class="obj_text">https://rpc-mainnet.onelabs.cc:443</view>
          <ReCopyBtn
            text="https://rpc-mainnet.onelabs.cc:443"
            copy_icon="copy_icon_A"
          />
        </view>
      </view>
      <view class="eendpoint_obj">
        <view class="eendpoint_title">Testnet RPC Endpointt</view>
        <view class="eendpoint_obj_text">
          <view class="obj_text">https://rpc-testnet.onelabs.cc:443</view>
          <ReCopyBtn
            text="https://rpc-testnet.onelabs.cc:443"
            copy_icon="copy_icon_A"
          />
        </view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  overflow: hidden;

  .navul {
    li {
      height: 40px;
      line-height: 40px;
      position: relative;

      // &.active::after {
      //   content: "";
      //   position: absolute;
      //   bottom: 0;
      //   left: 5%;
      //   width: 90%;
      //   height: 2px;
      //   background-color: #fff;
      // }
    }
  }
  .activeA {
    color: #214ff6 !important;
  }
}

.translation {
  :deep(.el-dropdown-menu__item) {
    // padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>

<style lang="scss">
.el-popper {
  border-radius: 8px !important;
}
.el-popper__arrow {
  &:before {
    content: "";
    border: 0px solid transparent !important;
    background: transparent !important;
  }
}
.translationA {
  width: 184px !important;
}
.translationB {
  width: 204px !important;
}
.el-dropdown-menu__item {
  height: 35px !important;
  color: #000000 !important;
  padding: 0 0 0 12px !important;
  margin: 6px !important;
}
.eendpoint_box {
  display: flex;
  flex-direction: column;
  padding-bottom: 12px;
  border-top: 1px solid #f2f2f2;
  .eendpoint_obj {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    height: 60px;
    padding-left: 12px;
    box-sizing: border-box;

    .eendpoint_title {
      font-weight: 500;
      font-size: 10px;
      color: #000000;
      line-height: 13px;
      margin-bottom: 4px;
    }
    .eendpoint_obj_text {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 180px;
      height: 31px;
      padding: 0 10px;
      border-radius: 10px;
      background: #f2f2f5;
      border: 1px solid #e5e5e5;
      box-sizing: border-box;
      .obj_text {
        font-weight: 500;
        font-size: 9px;
        line-height: 11px;
        color: #7e808a;
      }
    }
  }
}

.yz_header_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 50px;
  padding: 0 20px;
  background: #ffffff;
  border: 0.5px solid #f2f2f2;
  box-sizing: border-box;
  .yz_header_right_box {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.yz_menu_box {
  width: 100vw;
  height: calc(100vh - 50px);
  padding: 20px 18px 0 18px;
  background: #ffffff;
  position: fixed;
  top: 50px;
  left: 0;
  z-index: 999 !important;
  box-sizing: border-box;
  .devnet_box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 39px;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #000000;
    border-radius: 8px;
    background: #fafafc;
  }
  .menu_obj_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 55px;
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    color: #000000;
    border-bottom: 0.5px solid #f2f2f2;
  }
  .menu_obj_title_yes {
    color: #214ff6cc !important;
  }
  .menu_obj_box {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top: 4px;
    .obj_text_box_yes {
      color: #214ff6cc !important;
      background: #f9f9ff !important;
    }
    .obj_text_box {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 35px;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      color: #000000;
      padding: 0 12px;
      margin-top: 10px;
      border-radius: 6px;
      box-sizing: border-box;
      &:hover {
        color: #214ff6cc !important;
        background: #f9f9ff !important;
      }
    }
  }
  .eendpoint_box {
    margin-top: 10px;
  }
  .eendpoint_obj {
    padding-left: 0 !important;
  }
  .eendpoint_obj_text {
    width: 100% !important;
  }
}
</style>
