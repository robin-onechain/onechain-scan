<script setup lang="ts">
defineOptions({
  name: "home"
});
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import ReTooltip from "@/components/ReTooltip/index.vue";
import ReTable from "@/components/ReTable/index.vue";
import ReDisplayHash from "@/components/ReDisplayHash/index.vue";
import { ReNormalCountTo } from "@/components/ReCountTo";
import Coin from "@/assets/svg/coin.svg?component";
import {
  formatNumberWithCommas,
  convertMist,
  yz_segmentation_text
} from "@/utils/number.ts";
import { calculateAge } from "@/utils/time.ts";
import Search from "@/layout/components/search/index.vue";
import { getStatisticsInfo, getSupplyInfo } from "@/api/home";
import { getBlockList } from "@/api/transactionBlock";
import { emitter } from "@/utils/mitt";
import moment from "moment";

const router = useRouter();
const route = useRoute();

const updateTimeMap = {
  // Devnet: 2 * 60 * 60 * 1000,
  Testnet: 24 * 60 * 60 * 1000,
  Mainnet: 24 * 60 * 60 * 1000
};

const statisticsInfo = ref({});
const supplyInfo = ref({});
const tableLoading = ref(false);
const tableData = ref([]);

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
  {
    prop: "gas",
    label: "Gas",
    slot: "gas",
    align: "center",
    width: 150
  }
];

const getStatisticsData = async () => {
  const res = await getStatisticsInfo();
  statisticsInfo.value = res.data;
};

const getSupplyData = async () => {
  const res = await getSupplyInfo();
  supplyInfo.value = res.data;
};

const getBlockData = async () => {
  tableLoading.value = true;
  const query = {
    size: 20
  };
  const res = await getBlockList(query);
  tableData.value = res.data?.rows || [];
  tableLoading.value = false;
};

// 监听容器
emitter.on("refresh", () => {
  getStatisticsData();
  getSupplyData();
  getBlockData();
});
onMounted(() => {
  getStatisticsData();
  getSupplyData();
  getBlockData();
});

const getUpdateInterval = () => {
  const { net } = route.query;
  const nowNet = net || sessionStorage.getItem("netUrl") || "Mainnet";
  return updateTimeMap[nowNet];
};

const nextUpdateTime = computed(() => {
  if (!statisticsInfo.value.epochStartTime) {
    return "";
  }
  const updateInterval = getUpdateInterval();
  const epochStartTime = Number(statisticsInfo.value.epochStartTime);
  const nextUpdateTimestamp = epochStartTime + updateInterval;
  const now = moment();
  const nextUpdate = moment(nextUpdateTimestamp);
  const duration = moment.duration(nextUpdate.diff(now));

  if (duration.asHours() >= 1) {
    return `${Math.floor(duration.asHours())}h`;
  } else if (duration.asMinutes() >= 1) {
    return `${Math.floor(duration.asMinutes())}m`;
  } else if (duration.asSeconds() >= 1) {
    return `${Math.floor(duration.asSeconds())}s`;
  } else {
    return "0s";
  }
});

// const updateTimeProgress = computed(() => {
//   if (!statisticsInfo.value.epochStartTime) {
//     return 0;
//   }
//   const updateInterval = getUpdateInterval();
//   const epochStartTime = Number(statisticsInfo.value.epochStartTime);
//   const nextUpdateTimestamp = epochStartTime + updateInterval;
//   const now = moment();
//   const nextUpdate = moment(nextUpdateTimestamp);
//   const duration = moment.duration(nextUpdate.diff(now));
//   return Math.floor(1 - duration.asMilliseconds() / updateInterval);
// });

const updateTimeProgress = computed(() => {
  if (!statisticsInfo.value.epochStartTime) {
    return 0;
  }
  const updateInterval = getUpdateInterval();
  const epochStartTime = Number(statisticsInfo.value.epochStartTime);
  const now = moment().valueOf();
  const elapsedTime = now - epochStartTime;
  const progress = Math.min(
    100,
    Math.max(0, Math.floor((elapsedTime / updateInterval) * 100))
  );
  return progress;
});

const toTransactionBlocks = () => {
  router.push({ path: "/transactionBlocks" });
};

const toTransactionDetail = digest => {
  router.push({ path: "/transactionBlocksDetail", query: { digest } });
};

const toAccount = address => {
  router.push({ path: "/account", query: { address } });
};
</script>

<template>
  <div>
    <div
      class="flex flex-col w-full md:h-[386px] h-[261px] bg-[url('@/assets/images/home_bg.png')] bg-cover bg-center md:mb-[-115px] mb-[-63px]"
    >
      <div
        class="flex flex-col h-full md:justify-start justify-center items-center md:pb-16 md:w-[1200px] w-[100%] mx-auto font-sofia font-bold text-[12px] md:py-[63px] pb-[63px]"
      >
        <p
          class="font-extrabold md:text-5xl text-3xl font-sofia yz_text_box spaec"
        >
          <span class="text-[#000000]">Welcome to </span>
          <span class="yz_text_color">OneChain</span>
          <span class="text-[#000000]"> Universe</span>
        </p>
        <div
          class="md:w-[50%] w-[calc(100%-24px)] md:h-[50px] h-[38px] md:mt-8 mt-3 md:text-sm text-xs"
        >
          <Search />
        </div>
      </div>
    </div>
    <div class="flex justify-center pl-[12px] pr-[12px] pb-[24px] dmsans">
      <div class="md:w-[1200px] w-[100%]">
        <div
          class="flex flex-wrap md:justify-between justify-start items-start bg-white border-[1px] border-gray_0 yz_bi_box"
        >
          <div
            class="flex items-center yz_bi_obj md:w-[398px] w-[50%] h-[115px]"
          >
            <img
              class="md:w-[48px] w-[20px] md:h-[48px] h-[20px] mr-[10px] md:mb-[0px] mb-[36px]"
              src="@/assets/yz_img/logo_icon.png"
            />
            <div>
              <ReTooltip
                label="OCT Price"
                tooltipContent="Real-time OCT prices"
              />
              <div class="text-base font-bold text-black">
                ${{ formatNumberWithCommas(supplyInfo?.price) }}
              </div>
              <div class="text-xs font-bold text-gray_2">
                {{ supplyInfo?.pricePercent }}
              </div>
            </div>
          </div>
          <div
            class="flex flex-col justify-center yz_bi_obj md:w-[398px] w-[50%] h-[115px]"
          >
            <ReTooltip
              label="Maximum Supply"
              tooltipContent="Total OCT minted"
            />
            <div class="text-base font-bold text-black">
              {{ formatNumberWithCommas(supplyInfo?.supply) }} OCT
            </div>
            <div class="text-xs text-gray_1">
              ${{ formatNumberWithCommas(supplyInfo?.supplyUsd) }}
            </div>
          </div>
          <div
            class="flex flex-col justify-center yz_bi_obj md:w-[398px] w-[50%] h-[115px]"
          >
            <ReTooltip
              label="Circulation"
              tooltipContent="The total amount of OCT that has been unlocked and circulated in the market"
            />
            <div class="text-base font-bold text-black">
              {{ formatNumberWithCommas(supplyInfo?.circulatingSupply) }} OCT
            </div>
          </div>
          <div
            class="flex flex-col justify-center yz_bi_obj md:w-[398px] w-[50%] h-[115px]"
          >
            <ReTooltip
              label="Market capitalization"
              tooltipContent="Market value of circulating supply"
            />
            <div class="text-base font-bold text-black">
              ${{ formatNumberWithCommas(supplyInfo?.marketCap) || 0 }}
            </div>
          </div>
          <div
            class="flex flex-col justify-center yz_bi_obj md:w-[398px] w-[50%] h-[115px]"
          >
            <ReTooltip
              label="Market Position"
              tooltipContent="The total value of OCT in all digital currencies on this chain"
            />
            <div class="text-base font-bold text-black">
              {{ supplyInfo?.marketAddress }}
            </div>
          </div>
          <div
            class="flex flex-col justify-center yz_bi_obj md:w-[398px] w-[50%] h-[115px]"
          >
            <ReTooltip
              label="Cumulative pledge amount"
              tooltipContent="Real-time cumulative stake amount"
            />
            <div class="text-base font-bold text-black">
              {{ formatNumberWithCommas(supplyInfo?.tTotalStakedAmount) }} OCT
            </div>
            <div class="text-xs font-bold text-gray_1">
              ${{ formatNumberWithCommas(supplyInfo?.tTotalStakedUsdAmount) }}
            </div>
          </div>
        </div>

        <div class="flex flex-wrap justify-between gap-[16px] mt-[20px]">
          <div
            class="flex-1 flex justify-between items-center bg-white border-gray_0 p-[20px] yz_num_box"
          >
            <div>
              <div class="text-gray_1 text-[14px] yz_label_box">Epoch</div>
              <div
                class="mt-[6px] mb-[6px] text-[#214FF6] text-[20px] font-bold"
              >
                <ReNormalCountTo
                  :duration="1000"
                  fontSize="20px"
                  startVal="0"
                  :endVal="statisticsInfo?.epoch"
                />
              </div>
              <div class="text-gray_1 text-[12px]">
                Next: About {{ nextUpdateTime }} later
              </div>
            </div>
            <el-progress
              class="custom-progress"
              type="circle"
              :percentage="updateTimeProgress"
              color="rgba(33, 79, 246, 0.8)"
              :stroke-width="14"
            />
          </div>
          <div class="flex-1 bg-white border-gray_0 p-[20px] yz_num_box">
            <div class="text-gray_1 text-[14px] mb-[6px] yz_label_box">
              Trading GAS
            </div>
            <div class="text-[20px] text-black font-bold">
              <ReNormalCountTo
                :duration="1000"
                fontSize="20px"
                startVal="0"
                :endVal="statisticsInfo?.gasPrice"
              />
            </div>
          </div>
          <div class="flex-1 bg-white border-gray_0 p-[20px] yz_num_box">
            <div class="text-gray_1 text-[14px] mb-[6px] yz_label_box">
              Total Tx Blocks
            </div>
            <div class="text-[20px] text-black font-bold">
              <ReNormalCountTo
                :duration="1000"
                fontSize="20px"
                startVal="0"
                :endVal="statisticsInfo?.totalTransactionBlocks"
              />
            </div>
          </div>
          <div class="flex-1 bg-white border-gray_0 p-[20px] yz_num_box">
            <div class="text-gray_1 text-[14px] mb-[6px] yz_label_box">
              Total Checkpoints
            </div>
            <div class="text-[20px] text-black font-bold">
              <ReNormalCountTo
                :duration="1000"
                fontSize="20px"
                startVal="0"
                :endVal="statisticsInfo?.totalCheckpoints"
              />
            </div>
          </div>
        </div>

        <div class="latest_transaction_block_box">
          <div
            class="flex justify-between items-center text-black mt-[20px] border-gray_0 px-[13px] py-[20px]"
          >
            <div class="text-[20px] font-bold">Latest transaction block</div>
            <el-button
              style="color: #214ff6"
              class="text-[14px] font-normal"
              type="text"
              @click="toTransactionBlocks"
              >View all</el-button
            >
          </div>
          <ReTable :loading="tableLoading" :columns="columns" :data="tableData">
            <template #details="{ row }">
              <div class="details_btn" @click="toTransactionDetail(row.digest)">
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
                :onClick="() => toTransactionDetail(row.digest)"
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
  </div>
</template>
<style scoped lang="scss">
:deep(.custom-progress .el-progress-circle) {
  width: 78px !important;
  height: 78px !important;
}

:deep(.custom-progress .el-progress__text) {
  font-size: 18px !important;
  font-weight: 800 !important;
  color: #000;
}
.yz_text_box {
  font-weight: 500 !important;
  text-align: center;

  .yz_text_color {
    background: linear-gradient(
      90.69deg,
      #214ff6 40.37%,
      #ae79ff 58.15%,
      #214ff6 70.21%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.yz_bi_box {
  background: rgba(255, 255, 255, 0.588);
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.031);
  backdrop-filter: blur(40px);
  border-radius: 10px;
  border: 1px solid #ffffff;
  .yz_bi_obj {
    padding-left: 20px;
    box-sizing: border-box;
    position: relative;
    &::after {
      content: "";
      width: 1px;
      height: 42px;
      background: #dfdede;
      position: absolute;
      top: calc(50% - 21px);
      right: 0;
    }
    &:nth-child(2n) {
      &::after {
        width: 0px;
        height: 0px;
      }
    }
    @media (min-width: 768px) {
      &:nth-child(3n) {
        &::after {
          width: 0px;
          height: 0px;
        }
      }
    }
    @media (min-width: 768px) {
      &:nth-child(1) {
        padding-left: 68px;
      }
      &:nth-child(4) {
        padding-left: 68px;
      }
      &:nth-child(2) {
        padding-left: 130px;
      }
      &:nth-child(5) {
        padding-left: 130px;
      }
      &:nth-child(3) {
        padding-left: 130px;
      }
      &:nth-child(6) {
        padding-left: 130px;
      }
    }
  }
}
.yz_num_box {
  border-radius: 8px;
  box-shadow: 0px 4px 18px 0px rgba(0, 0, 0, 0.059);
}
.latest_transaction_block_box {
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.051);
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
.yz_label_box {
  color: #7e808a !important;
}
</style>
