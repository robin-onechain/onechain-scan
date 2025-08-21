<script setup lang="ts">
defineOptions({
  name: "epoch"
});

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReTable from "@/components/ReTable/index.vue";
import ReDisplayHash from "@/components/ReDisplayHash/index.vue";
import Search from "@/layout/components/search/index.vue";
import { calculateAge } from "@/utils/time.ts";
import { formatNumberWithCommas } from "@/utils/number.ts";

import { getCheckpointList } from "@/api/checkpoint";

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const tableData = ref([]);
const totalNum = ref(0);
const nextCursor = ref(null);

const columns = [
  {
    prop: "sequenceNumber",
    label: "Sequence Number",
    width: 200,
    align: "center"
  },
  {
    prop: "digest",
    label: "Digest",
    slot: "digest",
    width: 400,
    align: "center"
  },
  { prop: "epoch", label: "Epoch", width: 200, align: "center" },
  {
    prop: "timestampMs",
    label: "Age",
    slot: "timestampMs",
    width: 200,
    align: "center"
  },
  {
    prop: "blocks",
    label: "Tx Blocks",
    width: 200,
    align: "center"
  }
];

const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 20
});

const getData = async (curPage, prevPage, isInit) => {
  loading.value = true;

  const query = {
    index: prevPage,
    skipIndex: curPage,
    size: pagination.value.pageSize
  };
  query.cursor = nextCursor.value;
  const endCursor = route.query?.endCheckpoint;
  if (isInit && endCursor) {
    query.cursor = endCursor;
  }
  const res = await getCheckpointList(query);
  const total = res.data?.totalNum || 0;
  // checkpoint最多显示1000页，每页10条
  pagination.value.total = total > 10 * 1000 ? 10 * 1000 : total;
  totalNum.value = total;
  tableData.value = res.data?.rows || [];
  nextCursor.value = res.data?.nextCursor;

  loading.value = false;
};

const handlePageSizeChange = (pageSize, prevPage) => {
  getData(pageSize, prevPage, false);
};

const handleDigestClick = (digest: string) => {
  router.push({ path: "/checkPointDetail", query: { digest } });
};

onMounted(() => {
  getData(1, 0, true);
});
</script>

<template>
  <div class="flex justify-center yz_bj_box md:p-[24px] p-[12px]">
    <div class="md:w-[1200px] w-[100%]">
      <div class="md:mb-[25px] mb-[16px] flex md:flex-row flex-col title_box">
        <div
          class="flex flex-col md:items-start items-center font-bold text-[30px] text-[#000000] mb-[0px] spaec"
        >
          Checkpoints
          <div class="text-[14px] font-normal text-[#626364] text-center">
            Total {{ formatNumberWithCommas(totalNum) }} records, support
            querying 10,000 records
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
        <template #timestampMs="{ row }">
          <div class="flex items-center justify-center dmsans">
            <span class="truncate max-w-full">
              {{ calculateAge(row.timestampMs) }}
            </span>
          </div>
        </template>
        <template #digest="{ row }">
          <ReDisplayHash
            :text="row.digest"
            :onClick="() => handleDigestClick(row.digest)"
          />
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
</style>
