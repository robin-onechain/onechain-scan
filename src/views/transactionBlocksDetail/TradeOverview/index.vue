<template>
  <div class="transaction_overview_box dmsans">
    <div
      class="px-[22px] py-[17px] border-b border-gray_0 text-[16px] font-bold"
    >
      Overview
    </div>
    <div class="px-[22px] py-[20px] flex flex-col gap-[21px]">
      <ReInfoList :columns="infoColumns" :data="infoData">
        <template #gasPaymentObjectIds="{ slotData }">
          <div
            class="flex break-all items-center gap-[5px]"
            v-for="(item, index) in slotData"
            :key="index"
          >
            <span
              class="break-words max-w-[540px] text-blue_0 font-bold cursor-pointer"
              @click="ToAccount(item)"
            >
              {{ item }}
            </span>
            <ReCopyBtn :text="item" />
          </div>
        </template>
        <template #recipients="{ slotData }">
          <div
            class="flex break-all items-center gap-[5px]"
            v-for="(item, index) in slotData"
            :key="index"
          >
            <span
              class="break-words max-w-[540px] text-blue_0 font-bold cursor-pointer"
              @click="ToAccount(item)"
            >
              {{ item }}
            </span>
            <ReCopyBtn :text="item" />
          </div>
        </template>
      </ReInfoList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import ReInfoList from "@/components/ReInfoList/index.vue";
import { convertMist, yz_segmentation_text } from "@/utils/number.ts";

const props = defineProps<{
  data: any;
}>();

const router = useRouter();

const infoData = computed(() => ({
  ...props.data,
  totalGasFeeStr: yz_segmentation_text(convertMist(props.data?.totalGasFee)),
  priceStr: yz_segmentation_text(convertMist(props.data?.price)),
  computationFeeStr: yz_segmentation_text(
    convertMist(props.data?.paymentObject?.computationFee)
  ),
  storageFeeStr: yz_segmentation_text(
    convertMist(props.data?.paymentObject?.storageFee)
  ),
  storageRebateStr: yz_segmentation_text(
    convertMist(props.data?.paymentObject?.storageRebate)
  ),
  gasBudgetStr: yz_segmentation_text(convertMist(props.data?.gasBudget))
}));

const ToAccount = (digest: string) => {
  router.push({ path: "/account", query: { address: digest } });
};

const handleDigestClick = (digest: string) => {
  router.push({ path: "/checkPointDetail", query: { digest } });
};

const infoColumns = [
  {
    label: "Transaction Type",
    prop: "kind",
    type: "yz_title"
  },
  {
    label: "Digest（hash）",
    prop: "digest",
    type: "copy"
  },
  {
    label: "Status",
    prop: "status",
    type: "status"
  },
  {
    label: "Checkpoint Number",
    prop: "checkpointId",
    type: "copy",
    highlight: true,
    onClick: v => {
      handleDigestClick(v);
    }
  },
  {
    label: "Timestamps",
    prop: "timestamps",
    type: "time"
  },
  {
    label: "Receiver",
    prop: "recipients",
    type: "slot"
  },
  {
    label: "Sender",
    prop: "sender",
    type: "copy",
    highlight: true,
    onClick: v => {
      ToAccount(v);
    }
  },
  {
    label: "Total Gas Fee",
    prop: "totalGasFeeStr",
    type: "yz_text"
  },
  {
    label: "Gas Fee",
    prop: "priceStr",
    type: "yz_text"
  },
  {
    label: "Calculate Fees",
    prop: "computationFeeStr",
    type: "yz_text"
  },
  {
    label: "Storage Fees",
    prop: "storageFeeStr",
    type: "yz_text"
  },
  {
    label: "Storage return fee",
    prop: "storageRebateStr",
    type: "yz_text"
  },
  {
    label: "Gas Budget",
    prop: "gasBudgetStr",
    type: "yz_text"
  },
  {
    label: "Gas Payment Object",
    prop: "gasPaymentObjectIds",
    type: "slot"
  },
  {
    label: "Gas Payer",
    prop: "gasObjectOwner",
    type: "copy",
    highlight: true,
    onClick: v => {
      ToAccount(v);
    }
  }
];
</script>

<style lang="scss" scoped>
.transaction_overview_box {
  margin-bottom: 30px;
  background-color: #ffffff;
  background-image: url("@/assets/yz_img/transaction_overview_bj.png");
  background-size: 100%;
  box-shadow: 0px 4px 20px 0px #0000000a;
  border-radius: 8px;
}
</style>
