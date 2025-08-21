<script setup lang="ts">
defineOptions({
  name: "epoch"
});

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ReTable from "@/components/ReTable/index.vue";
import ReDisplayHash from "@/components/ReDisplayHash/index.vue";
import Search from "@/layout/components/search/index.vue";
import {
  formatNumberWithCommas,
  convertMist,
  yz_segmentation_text
} from "@/utils/number.ts";
import { calculateAge } from "@/utils/time.ts";

import { getBlockList } from "@/api/transactionBlock";

const router = useRouter();

const loading = ref(false);
const tableData = ref([]);
const totalNum = ref(0);
const nextCursor = ref(null);

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

const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 20
});

const getData = async (curPage, prevPage) => {
  loading.value = true;

  const query = {
    index: prevPage,
    skipIndex: curPage,
    size: pagination.value.pageSize,
    cursor: nextCursor.value
  };
  const res = await getBlockList(query);
  const total = res.data?.totalNum || 0;
  // 区块最多显示50页，每页10条
  pagination.value.total = total > 500 ? 500 : total;
  tableData.value = res.data?.rows || [];
  nextCursor.value = res.data?.nextCursor;
  totalNum.value = res.data?.totalNum || 0;

  loading.value = false;
};

const handlePageSizeChange = (pageSize, prevPage) => {
  getData(pageSize, prevPage);
};

const handleDigestClick = (digest: string) => {
  router.push({ path: "/transactionBlocksDetail", query: { digest } });
};

onMounted(() => {
  getData(1, 0);
});
</script>

<template>
  <div class="flex justify-center yz_bj_box md:p-[24px] p-[12px]">
    <div class="md:w-[1200px] w-[100%]">
      <div class="md:mb-[25px] mb-[16px] flex md:flex-row flex-col title_box">
        <div
          class="flex flex-col md:items-start items-center font-bold text-[30px] text-[#000000] mb-[0px] spaec"
        >
          Transaction Blocks
          <div class="text-[14px] font-normal text-[#626364] text-center">
            Total {{ formatNumberWithCommas(totalNum) }} data, support query
            1000 data
          </div>
        </div>
        <div class="md:w-[374px] w-[100%] md:h-[35px]">
          <Search />
        </div>
      </div>
      <ReTable
        :loading="loading"
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        @page-size-change="handlePageSizeChange"
      >
        <template #details="{ row }">
          <div
            class="details_btn dmsans"
            @click="handleDigestClick(row.digest)"
          >
            Details
          </div>
        </template>
        <template #time="{ row }">
          <div class="flex items-center justify-center dmsans">
            <span class="truncate max-w-full">
              {{ calculateAge(row.time) }}
            </span>
          </div>
        </template>
        <template #digest="{ row }">
          <ReDisplayHash
            :text="row.digest"
            :onClick="() => handleDigestClick(row.digest)"
          />
        </template>
        <template #senderAddress="{ row }">
          <ReDisplayHash :text="row.senderAddress" />
        </template>
        <template #gas="{ row }">
          <div class="yz_gas_box dmsans">
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
</style>
