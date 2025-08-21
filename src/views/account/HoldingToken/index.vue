<template>
  <div class="account_obj_box">
    <div
      class="text-black mt-[20px] px-[12px] py-[20px] border-b border-gray_0"
    >
      <div class="text-[16px] font-bold">Holding Tokens</div>
    </div>

    <div class="overflow-x-auto">
      <div class="w-[1200px] sm:w-full">
        <el-row class="p-[12px] text-[14px]">
          <el-col :span="5">Name</el-col>
          <el-col :span="5">TYPE</el-col>
          <el-col :span="8">Balance</el-col>
          <el-col :span="3">Object Count</el-col>
          <el-col :span="3" align="right">Operate</el-col>
        </el-row>
        <template v-if="tableData.length">
          <el-row
            v-for="item in tableData"
            :key="item.name"
            :class="[
              'p-[12px] text-[14px]',
              item.isShow ? 'bg-green_3' : 'bg-white'
            ]"
          >
            <el-col :span="5">{{ item.name }}</el-col>
            <el-col :span="5">
              <ReDisplayHash
                align="start"
                :text="item.type"
                :onClick="() => toCoinDetail(item.type)"
              />
            </el-col>
            <el-col :span="8">{{ item.balance }}</el-col>
            <el-col :span="3">{{ item.objectCount }}</el-col>
            <el-col :span="3" align="right">
              <el-button
                type="text"
                class="optBtn"
                @click="item.isShow = !item.isShow"
              >
                <span class="mr-[10px]">{{
                  item.isShow ? "Collapse" : "Expand"
                }}</span>
                <ArrowUp class="w-16px" v-if="item.isShow" />
                <ArrowDown class="w-16px" v-if="!item.isShow" />
              </el-button>
            </el-col>
            <el-col :span="24" v-if="item.isShow">
              <el-row class="py-[12px]">
                <el-col :span="8" align="center">Balance</el-col>
                <el-col :span="6" align="center">Object ID</el-col>
                <el-col :span="4" align="center">Version</el-col>
                <el-col :span="6" align="center">Recent Transactions</el-col>
              </el-row>
              <el-row
                v-for="child in item.children"
                :key="child.previousTransaction"
                class="py-[12px]"
              >
                <el-col :span="8" align="center">{{ child.balance }}</el-col>
                <el-col :span="6" align="center">
                  <ReDisplayHash :text="child.objectId" />
                </el-col>
                <el-col :span="4" align="center">{{ child.version }}</el-col>
                <el-col :span="6" align="center">
                  <div class="flex items-center gap-[6px]">
                    <span
                      class="truncate max-w-full text-blue_0 cursor-pointer"
                      @click="
                        toTransactionBlocksDetail(child.previousTransaction)
                      "
                      >{{ child.previousTransaction }}</span
                    >
                    <ReCopyBtn :text="child.previousTransaction" />
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24" align="center">
                  <el-button
                    type="text"
                    class="p-[0]! h-auto!"
                    @click="loadMore(item)"
                    v-if="item.cursor"
                  >
                    Load More
                  </el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        <div v-else class="py-[140px] flex flex-col items-center">
          <!-- <TableNoData /> -->
          <img
            class="w-[159px] h-[116px] mb-[15px]"
            src="@/assets/yz_img/none_icon.png"
          />
          <p class="no_data_title">No Data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import ReDisplayHash from "@/components/ReDisplayHash/index.vue";

import ArrowUp from "@/assets/svg/arrow_up.svg?component";
import ArrowDown from "@/assets/svg/arrow_down.svg?component";
import TableNoData from "@/assets/svg/table_no_data.svg?component";

import { getAccountCurrencyList, getCurrencyObj } from "@/api/address";

interface Item {
  name: string;
  type: string;
  balance: string;
  objectCount: number;
  isShow: boolean;
  cursor: string;
  children: {
    balance: string;
    objectId: string;
    version: string;
    previousTransaction: string;
  }[];
}

const route = useRoute();
const router = useRouter();

const tableLoading = ref(false);
const tableData = ref([]);

const emit = defineEmits(["get-balance-cb"]);

const getData = async () => {
  const address = route.query?.address as string;
  if (!address) return;

  tableLoading.value = true;

  const query = {
    objectId: address
  };
  const res = await getAccountCurrencyList(query);
  const resData = res.data || [];

  const totalBalances = {
    balance: "",
    usdBalance: ""
  };
  const hcToken = resData.find(v => v.name.toLowerCase() === "hc");
  if (hcToken && hcToken.balance) {
    const balanceMatch = hcToken.balance.match(/^([\d.]+) OCT/);
    const usdBalanceMatch = hcToken.balance.match(/\(([\d.]+) USD\)$/);

    totalBalances.balance = balanceMatch ? balanceMatch[1] : "";
    totalBalances.usdBalance = usdBalanceMatch ? usdBalanceMatch[1] : "";
  }
  emit("get-balance-cb", totalBalances);

  const promises = resData.map(async (item: Item) => {
    const childrenRes = await getCurrencyObj({
      objectId: query.objectId,
      coinType: item.type
    });
    item.children = childrenRes.data?.rows || [];
    if (childrenRes.data?.hasNextPage) {
      item.cursor = childrenRes.data?.nextCursor;
    }
    return item;
  });
  tableData.value = await Promise.all(promises);

  tableLoading.value = false;
};

const loadMore = async (item: Item) => {
  tableLoading.value = true;

  const query = {
    objectId: route.query?.address as string,
    coinType: item.type,
    cursor: item.cursor
  };
  const res = await getCurrencyObj(query);
  const rows = res.data?.rows || [];
  item.children.push(...rows);
  if (res.data?.hasNextPage) {
    item.cursor = res.data?.nextCursor;
  } else {
    item.cursor = "";
  }

  tableLoading.value = false;
};

onMounted(() => {
  getData();
});

const toCoinDetail = (type: string) => {
  router.push({ path: "/coinDetail", query: { type } });
};

const toTransactionBlocksDetail = (digest: string) => {
  router.push({ path: "/transactionBlocksDetail", query: { digest } });
};
</script>

<style lang="scss" scoped>
.el-col {
  padding-right: 16px;

  &[align="right"] {
    padding-right: 0;
  }
}

.optBtn {
  padding: 0;
  height: auto;
}
.no_data_title {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #9a9fb5;
}

.account_obj_box {
  background-color: #ffffff;
  box-shadow: 0px 4px 20px 0px #0000000a;
  border-radius: 8px;
}
.el-col {
  white-space: pre-wrap;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>
