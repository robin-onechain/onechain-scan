<script setup lang="ts">
import { SearchModal } from "./components";
import { useBoolean } from "../../hooks/useBoolean";
import Search from "@/assets/svg/search.svg?component";
import { useNav } from "@/layout/hooks/useNav";
import { ref } from "vue";

const { device } = useNav();
const { bool: show, toggle } = useBoolean();
const netdataA = ref(
  (sessionStorage.getItem("netUrl") ?? "Mainnet").toLowerCase()
);
interface Props {
  /** 弹窗显隐 */
  show: boolean;
}

function handleSearch() {
  toggle();
}
</script>

<template>
  <template v-if="device === 'mobile'">
    <div
      v-if="$route.path === `/${netdataA}/home`"
      class="yz_search_box search cursor-pointer shadow-sm shadow-[rgba(0, 21, 41, 0.08)] flex items-center w-full h-full dmsans"
      @click="handleSearch"
    >
      <div
        class="yz_search_box_A search bg-[#fff] cursor-pointer shadow-sm shadow-[rgba(0, 21, 41, 0.08)] flex items-center w-full h-full"
      >
        <div class="flex-1 pl-[6px] yz_text_box text-[#A0A0A0]">
          Search by Address / Hash / Token
        </div>
        <img class="h-[100%]" src="@/assets/yz_img/search_icon_A.png" />
        <!-- <el-input
      placeholder="Search by Address/Hash/Token"
      class="flex-1 custom-input"
    /> -->
        <!-- <div class="btn">
      <Search />
    </div> -->
      </div>
    </div>
  </template>
  <div
    v-else
    class="yz_search_box search cursor-pointer shadow-sm shadow-[rgba(0, 21, 41, 0.08)] flex items-center w-full h-full dmsans"
    @click="handleSearch"
  >
    <div
      class="yz_search_box_A search bg-[#fff] cursor-pointer shadow-sm shadow-[rgba(0, 21, 41, 0.08)] flex items-center w-full h-full"
    >
      <div class="flex-1 pl-[6px] yz_text_box text-[#A0A0A0]">
        Search by Address / Hash / Token
      </div>
      <img class="h-[100%]" src="@/assets/yz_img/search_icon_A.png" />
      <!-- <el-input
      placeholder="Search by Address/Hash/Token"
      class="flex-1 custom-input"
    /> -->
      <!-- <div class="btn">
      <Search />
    </div> -->
    </div>
  </div>
  <SearchModal v-model:value="show" />
</template>
<style scoped lang="scss">
.search {
  // :deep(.el-input__wrapper) {
  //   box-shadow: none;
  // }
  // :deep(.el-input__inner::placeholder) {
  //   color: var(--el-color-primary);
  //   font-family: Sofia Sans Condensed;
  //   font-size: 13px;
  //   font-weight: 500;
  //   text-align: left;
  //   text-underline-position: from-font;
  //   text-decoration-skip-ink: none;
  // }
  .btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0 16px;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 30%;
      height: 40%;
      width: 1px;
      background-color: var(--el-color-primary);
    }
  }
}
.yz_search_box {
  padding: 1px;
  border-radius: 1000px;
  border: 0px solid transparent;
  background-clip: padding-box;
  background-image: linear-gradient(
    90deg,
    #feebef 0%,
    #d9daff 49.52%,
    #b8ebfe 100%
  ); /* 设置渐变颜色 */
  box-sizing: border-box;
  .yz_search_box_A {
    padding: 6px;
    border-radius: 1000px;
  }
}
.yz_text_box {
  font-weight: 500 !important;
}
</style>
