<template>
  <div class="transaction_overview_box dmsans">
    <div
      class="px-[22px] py-[17px] border-b border-gray_0 text-[16px] font-bold"
    >
      Event Log
    </div>
    <div
      v-if="infoData.length"
      class="px-[22px] py-[20px] flex flex-col gap-[20px]"
    >
      <template v-for="(item, index) in infoData" :key="index">
        <div class="mb-[15px] text-[16px] font-bold">
          {{ item.transactionModule }}
        </div>
        <div class="flex flex-col gap-[21px]">
          <ReInfoList :columns="infoColumns" :data="item" />
        </div>
      </template>
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
import Nodata from "@/assets/svg/nodata.svg";

const router = useRouter();

const props = defineProps<{
  data: any;
}>();

const infoData = computed(() => {
  return props.data || [];
});

const infoColumns = [
  {
    label: "Signature",
    prop: "bcs",
    type: "copy"
  },
  {
    label: "Event ID",
    prop: "eventSeq",
    type: "text"
  },
  {
    label: "Digest",
    prop: "txDigest",
    type: "copy",
    highlight: true,
    onClick: v => {
      router.push({
        path: `/transactionBlocksDetail`,
        query: {
          digest: v
        }
      });
    }
  },
  {
    label: "Package ID",
    prop: "packageId",
    type: "copy",
    highlight: true,
    onClick: v => {
      router.push({
        path: "/packageDetail",
        query: {
          packageId: v
        }
      });
    }
  },
  {
    label: "Detail",
    prop: "parsedJson",
    type: "code",
    direction: "vertical"
  },
  {
    label: "Sender",
    prop: "sender",
    type: "copy",
    highlight: true,
    onClick: v => {
      router.push({
        path: "/account",
        query: {
          address: v
        }
      });
    }
  },
  {
    label: "Module",
    prop: "transactionModule",
    type: "text"
  },
  {
    label: "Type",
    prop: "type",
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
