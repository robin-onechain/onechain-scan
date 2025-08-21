<script setup lang="ts">
defineOptions({
  name: "account"
});

import { ref } from "vue";
import { useRoute } from "vue-router";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import TokenList from "./HoldingToken/index.vue";
import TradeBlock from "./TradeBlock/index.vue";
import Search from "@/layout/components/search/index.vue";
import { formatNumberWithCommas } from "@/utils/number";

const route = useRoute();

const totalBalance = ref();
const totalUsdBalance = ref();

const getBalanceCb = data => {
  totalBalance.value = data.balance
    ? `${formatNumberWithCommas(data.balance)} OCT`
    : "";
  totalUsdBalance.value = data.usdBalance
    ? `About ${formatNumberWithCommas(data.usdBalance)} USD`
    : "";
};
</script>

<template>
  <div class="flex justify-center yz_bj_box md:p-[24px] p-[12px]">
    <div class="w-full sm:w-[1200px]">
      <div class="md:mb-[25px] mb-[16px] flex md:flex-row flex-col title_box">
        <div
          class="flex flex-col md:items-start items-center font-bold text-[30px] text-[#000000] mb-[0px] spaec"
        >
          Account
        </div>
        <div class="md:w-[374px] w-[100%] md:h-[35px]">
          <Search />
        </div>
      </div>
      <div
        class="py-[15px] pl-[13px] pr-[13px] flex md:flex-row flex-col items-start justify-between account_obj_box dmsans"
      >
        <div
          class="flex flex-row items-center gap-[10px] md:mb-[0px]"
          :class="{ 'mb-[10px]': totalBalance ? true : false }"
        >
          <div class="text-blue_0 break-all">
            {{ route.query?.address || "" }}
          </div>
          <ReCopyBtn :text="route.query?.address || ''" />
        </div>
        <div v-if="totalBalance">
          <div class="mb-[14px] text-[20px] font-bold">
            {{ totalBalance }}
          </div>
          <div class="text-gray_1">{{ totalUsdBalance }}</div>
        </div>
      </div>
      <TokenList @get-balance-cb="getBalanceCb" />
      <TradeBlock />
    </div>
  </div>
</template>
<style scoped lang="scss">
.account_obj_box {
  background-color: #ffffff;
  box-shadow: 0px 4px 20px 0px #0000000a;
  border-radius: 8px;
}
.yz_bj_box {
  background: linear-gradient(
    179.54deg,
    #f2f7fe 6.02%,
    #fcfcfd 22.73%,
    #ffffff 29.35%
  );
}
.title_box {
  justify-content: space-between;
  align-items: center;
}
</style>
