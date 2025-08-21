<script setup lang="ts">
defineOptions({
  name: "epoch"
});

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReTable from "@/components/ReTable/index.vue";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import ReDisplayHash from "@/components/ReDisplayHash/index.vue";
import Search from "@/layout/components/search/index.vue";
import { calculateAge } from "@/utils/time.ts";
import {
  formatNumberWithCommas,
  convertMist,
  yz_segmentation_text
} from "@/utils/number.ts";

import { getCheckpointDetail } from "@/api/checkpoint";
import { getBlockList } from "@/api/transactionBlock";

const route = useRoute();
const router = useRouter();

const checkpointData = ref({});
const tableLoading = ref(false);
const tableData = ref([]);
const nextCursor = ref(null);
const pagination = ref({
  total: 100,
  currentPage: 1,
  pageSize: 20,
  hasNextPage: false
});

const columns = [
  { prop: "kind", label: "Type", width: 230, align: "center" },
  { slot: "details", label: "", align: "center", width: 80 },
  {
    prop: "digest",
    label: "Digest",
    slot: "digest",
    width: 220,
    align: "center"
  },
  { prop: "time", label: "Age", slot: "time", width: 120, align: "center" },
  {
    prop: "senderAddress",
    label: "Sender",
    slot: "senderAddress",
    width: 200,
    align: "center"
  },
  {
    prop: "transactions",
    label: "Transactions",
    width: 200,
    align: "center"
  },
  { prop: "gas", label: "Gas", slot: "gas", align: "center", width: 150 }
];

const getCheckpointData = async () => {
  const digest = route.query.digest as string;
  if (!digest) return;

  const query = {
    checkpointId: digest
  };
  const res = await getCheckpointDetail(query);
  checkpointData.value = res.data || {};
};

const getBlockData = async (curPage, prevPage) => {
  const digest = route.query.digest as string;
  if (!digest) return;

  tableLoading.value = true;

  const query = {
    checkpoint: checkpointData.value?.sequenceNumber,
    index: prevPage,
    skipIndex: curPage,
    size: pagination.value.pageSize,
    cursor: nextCursor.value
  };
  const res = await getBlockList(query);
  const total = res.data?.totalNum || 0;
  // 区块最多显示50页，每页10条
  pagination.value.total = total > 500 ? 500 : total;
  pagination.value.hasNextPage = res.data?.hasNextPage || false;
  tableData.value = res.data?.rows || [];
  nextCursor.value = res.data?.nextCursor;

  tableLoading.value = false;
};

const handlePageSizeChange = (pageSize, prevPage) => {
  getBlockData(pageSize, prevPage);
};

onMounted(async () => {
  await getCheckpointData();
  getBlockData(1, 0);
});

const toTransactionBlocksDetail = (digest: string) => {
  router.push({ path: "/transactionBlocksDetail", query: { digest } });
};

const toAccount = (address: string) => {
  router.push({ path: "/account", query: { address } });
};
</script>

<template>
  <div class="flex justify-center yz_bj_box md:p-[24px] p-[12px]">
    <div class="md:w-[1200px] w-[100%]">
      <div class="md:mb-[25px] mb-[16px] flex md:flex-row flex-col title_box">
        <div
          class="flex flex-col md:items-start items-center font-bold text-[30px] text-[#000000] mb-[0px] spaec"
        >
          Checkpoint
        </div>
        <div class="md:w-[374px] w-[100%] md:h-[35px]">
          <Search />
        </div>
      </div>
      <div
        class="mb-[20px] flex flex-row items-center gap-[10px] yz_package_box yz_obj_box dmsans"
      >
        <div class="break-all">{{ route.query?.digest || "" }}</div>
        <ReCopyBtn :text="route.query?.digest || ''" />
      </div>
      <div class="mb-[12px] flex flex-wrap justify-between gap-[12px]">
        <div
          class="flex-grow bg-white border-gray_0 py-[16px] px-[16px] basis-[calc(16.666%-16px)] yz_between_box"
        >
          <div class="text-gray_1 text-[14px] mb-[6px]">Sequence Number</div>
          <div class="text-[20px] text-black font-bold break-words">
            {{ formatNumberWithCommas(checkpointData?.sequenceNumber) }}
          </div>
        </div>
        <div
          class="flex-grow bg-white border-gray_0 py-[16px] px-[16px] basis-[calc(16.666%-16px)] yz_between_box"
        >
          <div class="text-gray_1 text-[14px] mb-[6px]">Epoch</div>
          <div class="text-[20px] text-black font-bold break-words">
            {{ formatNumberWithCommas(checkpointData?.epoch) }}
          </div>
        </div>
        <div
          class="flex-grow bg-white border-gray_0 py-[16px] px-[16px] basis-[calc(16.666%-16px)] yz_between_box"
        >
          <div class="text-gray_1 text-[14px] mb-[6px]">Tx Blocks</div>
          <div class="text-[20px] text-black font-bold break-words">
            {{ formatNumberWithCommas(checkpointData?.blocks) }}
          </div>
        </div>
        <div
          class="flex-grow bg-white border-gray_0 py-[16px] px-[16px] basis-[calc(16.666%-16px)] yz_between_box"
        >
          <div class="text-gray_1 text-[14px] mb-[6px]">Calculate costs</div>
          <div class="text-[20px] text-black font-bold break-words">
            {{
              formatNumberWithCommas(
                convertMist(checkpointData?.computationCost, "OCT", false)
              )
            }}
          </div>
        </div>
        <div
          class="flex-grow bg-white border-gray_0 py-[16px] px-[16px] basis-[calc(16.666%-16px)] yz_between_box"
        >
          <div class="text-gray_1 text-[14px] mb-[6px]">Storage costs</div>
          <div class="text-[20px] text-black font-bold break-words">
            {{
              formatNumberWithCommas(
                convertMist(checkpointData?.storageCost, "OCT", false)
              )
            }}
          </div>
        </div>
        <div
          class="flex-grow bg-white border-gray_0 py-[16px] px-[16px] basis-[calc(16.666%-16px)] yz_between_box"
        >
          <div class="text-gray_1 text-[14px] mb-[6px]">Storage Return</div>
          <div class="text-[20px] text-black font-bold break-words">
            {{
              formatNumberWithCommas(
                convertMist(checkpointData?.storageRebate, "OCT", false)
              )
            }}
          </div>
        </div>
      </div>

      <div
        class="mb-[12px] flex-grow bg-white border-gray_0 py-[16px] px-[16px] yz_between_box"
      >
        <div class="text-gray_1 text-[12px] mb-[12px]">Signature</div>
        <div
          class="text-[20px] break-all text-black font-bold flex items-center gap-[13px]"
        >
          <div class="text-[16px] font-normal">
            {{ checkpointData?.validatorSignature || "" }}
          </div>
          <ReCopyBtn :text="checkpointData?.validatorSignature || ''" />
        </div>
      </div>

      <div class="latest_transaction_block_box">
        <div class="px-[13px] py-[20px] text-black border-gray_0">
          <div class="text-[16px] font-bold">Transaction block</div>
        </div>

        <ReTable
          :loading="tableLoading"
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          isSimplePagination
          @page-size-change="handlePageSizeChange"
        >
          <template #details="{ row }">
            <div
              class="details_btn"
              @click="toTransactionBlocksDetail(row.digest)"
            >
              Details
            </div>
          </template>
          <template #time="{ row }">
            <div class="flex items-center justify-center">
              <span class="truncate max-w-full">
                {{ calculateAge(row.time) }}
              </span>
            </div>
          </template>
          <template #digest="{ row }">
            <ReDisplayHash
              :text="row.digest"
              :onClick="() => toTransactionBlocksDetail(row.digest)"
            />
          </template>
          <template #senderAddress="{ row }">
            <ReDisplayHash
              :text="row.senderAddress"
              :onClick="() => toAccount(row.senderAddress)"
            />
          </template>
          <template #gas="{ row }">
            <div class="yz_gas_box">
              <div class="a">
                {{ yz_segmentation_text(convertMist(row.gas)).a }}
              </div>
              <div
                class="b"
                v-if="yz_segmentation_text(convertMist(row.gas)).b"
              >
                {{ `${yz_segmentation_text(convertMist(row.gas)).b}` }}
              </div>
            </div>
          </template>
        </ReTable>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.yz_bj_box {
  background: linear-gradient(
    179.54deg,
    #f2f7fe 6.02%,
    #fcfcfd 22.73%,
    #ffffff 29.35%
  );
}
.yz_between_box {
  border-radius: 8px;
  box-shadow: 0px 4px 22px 0px rgba(0, 0, 0, 0.031);
  box-sizing: border-box;
}
.latest_transaction_block_box {
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.051);
}
.title_box {
  justify-content: space-between;
  align-items: center;
}
.details_btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 26px;
  font-weight: 500;
  font-size: 12px;
  color: #606062;
  margin: 0 auto;
  border-radius: 4px;
  background: #f0f1f5;
  border: 1px solid #e8e8e8;
  cursor: pointer;
}
.yz_gas_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  .a {
    color: #000000;
  }
  .b {
    color: #7f7f7f;
  }
}
.yz_obj_box {
  background-color: #ffffff;
  box-shadow: 0px 4px 20px 0px #0000000a;
  border-radius: 8px;
}
.yz_package_box {
  width: 100%;
  height: 65px;
  padding: 0 16px;
  box-sizing: border-box;
}
</style>
