<template>
  <div class="transaction_overview_box dmsans">
    <div
      class="px-[22px] py-[17px] border-b border-gray_0 text-[16px] font-bold"
    >
      Changes
    </div>
    <div
      v-if="balanceData.length || objectData.length"
      class="px-[22px] py-[20px] flex flex-col gap-[30px]"
    >
      <div v-for="(item, index) in balanceData" :key="index">
        <div class="mb-[15px] text-[16px] font-bold">Balance Change</div>
        <div class="flex flex-col gap-[21px]">
          <ReInfoList :columns="balanceColumns" :data="item" />
        </div>
      </div>

      <div v-for="(item, index) in objectData" :key="index">
        <div class="mb-[15px] text-[16px] font-bold">Object Change</div>
        <div class="flex flex-col gap-[21px]">
          <ReInfoList :columns="objectColumns" :data="item" />
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center my-10">
      <img
        class="w-[159px] h-[116px] mb-[15px]"
        src="@/assets/yz_img/none_icon.png"
      />
      <p class="no_data_title">No Data</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import ReInfoList from "@/components/ReInfoList/index.vue";
import { convertMist, yz_segmentation_text } from "@/utils/number.ts";
import Nodata from "@/assets/svg/nodata.svg";

const router = useRouter();

const props = defineProps<{
  data: any;
}>();

const balanceData = computed(() => {
  return (props.data?.balanceChanges || []).map(item => {
    return {
      ...item,
      amount: yz_segmentation_text(
        `${convertMist(item.amount, item.currency, false, item.decimals)}/${
          item.usdAmount
        } USD`
      )
    };
  });
});

const objectData = computed(() => {
  return props.data?.objectChanges || [];
});

const toAccount = address => {
  router.push({
    path: "/account",
    query: {
      address
    }
  });
};

const balanceColumns = [
  {
    label: "Change Account",
    prop: "addressOwner",
    type: "copy",
    highlight: true,
    onClick: v => {
      toAccount(v);
    }
  },
  {
    label: "Token Name",
    prop: "currency",
    type: "text"
  },
  {
    label: "Change",
    prop: "amount",
    type: "yz_text"
  }
];

const objectColumns = [
  {
    label: "Object ID",
    prop: "objectId",
    type: "copy"
  },
  {
    label: "Object Owner",
    prop: "currentOwner",
    type: "copy",
    highlight: true,
    onClick: v => {
      toAccount(v);
    }
  },
  {
    label: "Object Type",
    prop: "type",
    type: "copy"
  },
  {
    label: "Operation Type",
    prop: "status",
    type: "text"
  },
  {
    label: "Object version number",
    prop: "version",
    type: "text"
  }
];
</script>
<style lang="scss" scoped>
.transaction_overview_box {
  margin-bottom: 30px;
  background-color: #ffffff;
  box-shadow: 0px 4px 20px 0px #0000000a;
  border-radius: 8px;
}
.no_data_title {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #9a9fb5;
}
</style>
