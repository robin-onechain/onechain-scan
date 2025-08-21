<template>
  <div class="account_obj_box">
    <div
      class="text-black mt-[20px] border-b border-gray_0 px-[12px] py-[20px] bg-white"
    >
      <div class="mb-[12px] text-[16px] font-bold">Transaction Block</div>
      <div class="flex items-center gap-[20px] text-[14px]">
        <ReTabList
          :tabs="tabs"
          :activeTab="activeTab"
          type_bg="1"
          @tab-change="handleTabChange"
        />
      </div>
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
        <div class="details_btn" @click="toTransactionBlocksDetail(row.digest)">
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
          <div class="b" v-if="yz_segmentation_text(convertMist(row.gas)).b">
            {{ `${yz_segmentation_text(convertMist(row.gas)).b}` }}
          </div>
        </div>
      </template>
    </ReTable>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReTable from "@/components/ReTable/index.vue";
import ReTabList from "@/components/ReTabList/index.vue";
import ReDisplayHash from "@/components/ReDisplayHash/index.vue";

import { convertMist, yz_segmentation_text } from "@/utils/number.ts";
import { calculateAge } from "@/utils/time.ts";

import { getBlockList } from "@/api/transactionBlock";

const route = useRoute();
const router = useRouter();

const activeTab = ref("1");

const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 20,
  hasNextPage: false
});
const tableLoading = ref(false);
const tableData = ref([]);
const nextCursor = ref(null);

const tabs = [
  {
    label: "Receive",
    value: "1"
  },
  {
    label: "Send",
    value: "2"
  }
];

const columns = [
  { prop: "kind", label: "Type", align: "center", width: 230 },
  { slot: "details", label: "", align: "center", width: 80 },
  {
    prop: "digest",
    label: "Digest",
    slot: "digest",
    align: "center",
    width: 220
  },
  { prop: "time", label: "Age", slot: "time", align: "center", width: 120 },
  {
    prop: "senderAddress",
    label: "Sender",
    slot: "senderAddress",
    align: "center",
    width: 200
  },
  {
    prop: "transactions",
    label: "Transactions",
    align: "center",
    width: 200
  },
  { prop: "gas", label: "Gas", slot: "gas", align: "center", width: 150 }
];

const getData = async (curPage, prevPage) => {
  const address = route.query.address as string;
  if (!address) return;

  tableLoading.value = true;

  const query = {
    index: prevPage,
    skipIndex: curPage,
    size: pagination.value.pageSize,
    cursor: nextCursor.value
  };
  if (activeTab.value === "1") {
    query.toAddress = address;
  } else {
    query.fromAddress = address;
  }
  const res = await getBlockList(query);
  const total = res.data?.totalNum || 0;
  // 区块最多显示50页，每页10条
  pagination.value.total = total > 500 ? 500 : total;
  pagination.value.hasNextPage = res.data?.hasNextPage || false;
  tableData.value = res.data?.rows || [];
  nextCursor.value = res.data?.nextCursor;

  tableLoading.value = false;
};

const resetPagination = () => {
  pagination.value.currentPage = 1;
  pagination.value.pageSize = 10;
  nextCursor.value = null;
};

const handleTabChange = (tab: string) => {
  activeTab.value = tab;
  resetPagination();
  getData(1, 0);
};

const handlePageSizeChange = (pageSize, prevPage) => {
  getData(pageSize, prevPage);
};

onMounted(() => {
  getData(1, 0);
});

const toTransactionBlocksDetail = (digest: string) => {
  router.push({ path: "/transactionBlocksDetail", query: { digest } });
};

const toAccount = (address: string) => {
  router.push({ path: "/account", query: { address } });
};
</script>

<style lang="scss" scoped>
.account_obj_box {
  background-color: #ffffff;
  box-shadow: 0px 4px 20px 0px #0000000a;
  border-radius: 8px;
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
</style>
