<script setup lang="ts">
defineOptions({
  name: "packageDetail"
});

import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReCodeBlock from "@/components/ReCodeBlock/index.vue";
import ReTable from "@/components/ReTable/index.vue";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import ReInfoList from "@/components/ReInfoList/index.vue";
import ReDisplayHash from "@/components/ReDisplayHash/index.vue";
import Search from "@/layout/components/search/index.vue";
import { convertMist, yz_segmentation_text } from "@/utils/number";
import { calculateAge } from "@/utils/time";

import { getBlockList } from "@/api/transactionBlock";
import { getPkgDetail } from "@/api/package";

const route = useRoute();
const router = useRouter();

const infoData = ref({});
const pagination = ref({
  total: 0,
  currentPage: 1,
  pageSize: 20,
  hasNextPage: false
});
const tableLoading = ref(false);
const tableData = ref([]);
const nextCursor = ref(null);

const infoColumns = [
  {
    label: "Create Address",
    prop: "creator",
    type: "copy",
    highlight: true,
    onClick: v => {
      router.push({
        path: "/account",
        query: { address: v }
      });
    },
    labelClass: "md:w-[100px] w-[100%]",
    valueClass: "break-all"
  },
  {
    label: "Contract Version",
    prop: "version",
    type: "text",
    labelClass: "md:w-[100px] w-[100%]"
  },
  {
    label: "Update Time",
    prop: "time",
    type: "time",
    labelClass: "md:w-[100px] w-[100%]"
  },
  {
    label: "Latest transaction block",
    prop: "latestTransactionBlock",
    type: "copy",
    highlight: true,
    onClick: v => {
      router.push({
        path: "/transactionBlocksDetail",
        query: { digest: v }
      });
    },
    labelClass: "md:w-[100px] w-[100%]",
    valueClass: "break-all"
  },
  {
    label: "Storage Return",
    prop: "storageRebate",
    type: "text",
    labelClass: "md:w-[100px] w-[100%]"
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

const getPkgDetailData = async () => {
  const packageId = route.query.packageId as string;
  if (!packageId) return;

  const res = await getPkgDetail({ objectId: packageId });
  infoData.value = res.data;
};

const getData = async (curPage, prevPage) => {
  const packageId = route.query.packageId as string;
  if (!packageId) return;

  tableLoading.value = true;

  const query = {
    index: prevPage,
    skipIndex: curPage,
    size: pagination.value.pageSize,
    inputObject: packageId,
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
  getData(pageSize, prevPage);
};

onMounted(() => {
  getPkgDetailData();
  getData(1, 0);
});

const toTransactionBlocksDetail = digest => {
  router.push({ path: "/transactionBlocksDetail", query: { digest } });
};

const formattedInfoData = computed(() => {
  const disassembled = infoData.value?.content?.disassembled || {};
  const result = Object.entries(disassembled)
    .map(([key, value]) => `// ${key}\n${value}`)
    .join("\n");
  return result;
});
</script>

<template>
  <div class="flex justify-center yz_bj_box md:p-[24px] p-[12px]">
    <div class="w-full sm:w-[1200px]">
      <div class="md:mb-[25px] mb-[16px] flex md:flex-row flex-col title_box">
        <div
          class="flex flex-col md:items-start items-center font-bold text-[30px] text-[#000000] mb-[0px] spaec"
        >
          Package
        </div>
        <div class="md:w-[374px] w-[100%] md:h-[35px]">
          <Search />
        </div>
      </div>
      <div
        class="mb-[20px] flex flex-row items-center gap-[10px] yz_package_box yz_obj_box dmsans"
      >
        <div class="break-all">{{ route.query?.packageId || "" }}</div>
        <ReCopyBtn :text="route.query?.packageId || ''" />
      </div>

      <div
        class="p-[15px] bg-white border border-gray_0 flex flex-col gap-[25px] yz_obj_box_A dmsans"
      >
        <ReInfoList :columns="infoColumns" :data="infoData" />
      </div>

      <div class="yz_obj_box dmsans">
        <div
          class="text-black mt-[20px] border-b border-gray_0 px-[13px] py-[20px] bg-white"
        >
          <div class="text-[16px] font-bold">Transaction Block</div>
        </div>
        <ReTable
          :loading="tableLoading"
          :columns="columns"
          :data="tableData"
          :pagination="pagination"
          isSimplePagination
          @page-size-change="handlePageSizeChange"
          ><template #details="{ row }">
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
            <ReDisplayHash :text="row.senderAddress" />
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

      <div class="mt-[20px] px-[12px] py-[20px] yz_obj_box">
        <div class="mb-[15px] text-[16px] font-bold">Contracts</div>
        <ReCodeBlock :value="formattedInfoData" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.yz_obj_box_A {
  border-radius: 8px;
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
