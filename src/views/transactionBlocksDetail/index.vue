<script setup lang="ts">
defineOptions({
  name: "epoch"
});

import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import ReTabList from "@/components/ReTabList/index.vue";
import TradeOverview from "./TradeOverview/index.vue";
import Entry from "./Entry/index.vue";
import CallRecord from "./CallRecord/index.vue";
import ChangeInfo from "./ChangeInfo/index.vue";
import ShareObj from "./ShareObj/index.vue";
import EventRecord from "./EventRecord/index.vue";
import Search from "@/layout/components/search/index.vue";
import { getBlockInfo } from "@/api/transactionBlock";
import { fa } from "element-plus/es/locale";

const route = useRoute();

const activeTab = ref("");
const blockData = ref({});

const hasData = data => {
  if (Array.isArray(data)) {
    return data.length > 0;
  }
  if (typeof data === "object" && data !== null) {
    return Object.keys(data).length > 0;
  }
  return false;
};

const tabs = computed(() => {
  const availableTabs = [];
  const { detailDesc, inputs, transactions, change, shareObjects, events } =
    blockData.value;

  if (hasData(detailDesc)) {
    availableTabs.push({ label: "Overview", value: "1" });
  }
  if (hasData(inputs)) {
    availableTabs.push({ label: "Inputs", value: "2" });
  }
  if (hasData(transactions)) {
    availableTabs.push({ label: "Call Record", value: "3" });
  }
  if (change) {
    const { balanceChanges, objectChanges } = change;
    if (hasData(balanceChanges) || hasData(objectChanges)) {
      availableTabs.push({ label: "Changes", value: "4" });
    }
  }
  if (hasData(shareObjects)) {
    availableTabs.push({ label: "Shared Objects", value: "5" });
  }
  if (hasData(events)) {
    availableTabs.push({ label: "Event Log", value: "6" });
  }

  return availableTabs;
});

watch(tabs, newTabs => {
  if (newTabs.length > 0 && !activeTab.value) {
    activeTab.value = newTabs[0].value;
  }
});

const handleTabChange = (key: string) => {
  activeTab.value = key;
  const section = document.getElementById(`section${activeTab.value}`);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const getData = async (digest: string) => {
  const query = {
    digest
  };
  const res = await getBlockInfo(query);
  blockData.value = res.data || {};
};

const get_show = (type: string) => {
  return JSON.stringify(tabs.value).indexOf(type) !== -1 ? true : false;
};

onMounted(() => {
  const digest = route.query?.digest;
  if (digest) {
    getData(digest);
  }
});
</script>

<template>
  <div class="flex justify-center yz_bj_box md:p-[24px] p-[12px]">
    <div class="md:w-[1200px] w-[100%]">
      <div class="md:mb-[25px] mb-[16px] flex md:flex-row flex-col title_box">
        <div
          class="flex flex-col md:items-start items-center font-bold text-[30px] text-[#000000] mb-[0px] spaec"
        >
          Transaction Block
        </div>
        <div class="md:w-[374px] w-[100%] md:h-[35px]">
          <Search />
        </div>
      </div>
      <div class="mb-[19px] flex gap-[20px] flex-wrap dmsans">
        <ReTabList
          :tabs="tabs"
          :activeTab="activeTab"
          @tab-change="handleTabChange"
        />
      </div>
      <!-- v-if="activeTab === '1'" -->
      <TradeOverview
        id="section1"
        :data="blockData?.detailDesc"
        v-if="get_show('1')"
      />
      <!-- v-if="activeTab === '2'" -->
      <Entry id="section2" :data="blockData?.inputs" v-if="get_show('2')" />
      <!-- v-if="activeTab === '3'" -->
      <CallRecord
        id="section3"
        :data="blockData?.transactions"
        v-if="get_show('3')"
      />
      <!-- v-if="activeTab === '4'" -->
      <ChangeInfo
        id="section4"
        :data="blockData?.change"
        v-if="get_show('4')"
      />
      <!-- v-if="activeTab === '5'" -->
      <ShareObj
        id="section5"
        :data="blockData?.shareObjects"
        v-if="get_show('5')"
      />
      <!-- v-if="activeTab === '6'" -->
      <EventRecord
        id="section6"
        :data="blockData?.events"
        v-if="get_show('6')"
      />
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
