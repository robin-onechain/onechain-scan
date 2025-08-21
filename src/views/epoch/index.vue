<script setup lang="ts">
defineOptions({
  name: "epoch"
});

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import ReTable from "@/components/ReTable/index.vue";
import Search from "@/layout/components/search/index.vue";
import { getEpochList } from "@/api/epoch";

const router = useRouter();

const loading = ref(false);
const tableData = ref([]);

const columns = [
  { prop: "epochId", label: "Epoch", align: "center" },
  {
    prop: "checkpointCount",
    label: "Checkpoints",
    slot: "checkpointCount",
    align: "center"
  },
  { prop: "startTime", label: "Start Time", align: "center" }
];

const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 20
});

const getData = async () => {
  loading.value = true;
  const query = {
    pageIndex: pagination.value.currentPage,
    pageSize: pagination.value.pageSize
  };
  const res = await getEpochList(query);
  const total = res.data?.totalNum || 0;
  // 区块最多显示50页，每页10条
  pagination.value.total = total > 500 ? 500 : total;
  tableData.value = res.data?.rows || [];
  tableData.value.forEach(item => {
    item.startTime = moment
      .utc(item.startTime)
      .local()
      .format("YYYY-MM-DD HH:mm:ss");
  });
  loading.value = false;
};

onMounted(() => {
  getData();
});

const toCheckpoints = row => {
  const { startCheckpoint, endCheckpoint } = row;
  router.push({
    path: "/checkPoint",
    query: {
      startCheckpoint,
      endCheckpoint
    }
  });
};
</script>

<template>
  <div class="flex justify-center yz_bj_box md:p-[24px] p-[12px]">
    <div class="md:w-[1200px] w-[100%]">
      <div class="md:mb-[25px] mb-[16px] flex md:flex-row flex-col title_box">
        <div
          class="flex flex-col md:items-start items-center font-bold text-[30px] text-[#000000] mb-[0px] spaec"
        >
          Epoch
        </div>
        <div class="md:w-[374px] w-[100%] md:h-[35px]">
          <Search />
        </div>
      </div>

      <ReTable
        class="latest_transaction_block_box"
        :loading="loading"
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        @page-size-change="getData"
      >
        <template #checkpointCount="{ row }">
          <span
            class="underline text-blue_0 cursor-pointer dmsans"
            @click="toCheckpoints(row)"
            >{{ row.checkpointCount }}</span
          >
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
.latest_transaction_block_box {
  border-radius: 8px;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.051);
}
</style>
