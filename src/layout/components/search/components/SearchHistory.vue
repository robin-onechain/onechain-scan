<script setup lang="ts">
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import Nodata from "@/assets/svg/nodata.svg";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
interface optionsItem {
  data: string;
}

interface Props {
  options: Array<optionsItem>;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits(["close"]);
const listData = ref(props.options);
function filterText(url) {
  return url.split("=")[1];
}
function handleTo(url) {
  router.push(url);
  emit("close");
  const searchHistory = localStorage.getItem("searchHistory")
    ? JSON.parse(localStorage.getItem("searchHistory"))
    : [];
  const index = searchHistory.findIndex(item => item.data === url);
  searchHistory.splice(index, 1);
  searchHistory.unshift({ data: url });
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
function clearHistory() {
  listData.value = [];
  localStorage.removeItem("searchHistory");
}
</script>

<template>
  <div class="result font-sofia">
    <div
      class="flex justify-between text-[14px] font-medium leading-8 pt-3 pb-2"
    >
      <span class="text-[#A0A0A0] weight_500">Recent searches</span>
      <span
        class="text-[#638CE9] cursor-pointer"
        @click="clearHistory"
        v-if="listData.length"
        >Clear</span
      >
    </div>
    <div v-if="listData.length" class="w-full max-h-[30vh] listwp">
      <div
        v-for="item in listData"
        :key="item.data"
        class="result-item yz_result_item text-[#fff] bg-[rgba(250, 250, 252, 0.502)] hover:bg-[#FAFAFC]"
      >
        <span class="result-item-title" @click="handleTo(item.data)">{{
          filterText(item.data)
        }}</span>
        <ReCopyBtn :text="filterText(item.data)" />
      </div>
    </div>
    <div v-else class="flex flex-col items-center my-10">
      <!-- <Nodata class="mx-auto mb-2" /> -->
      <img
        class="w-[159px] h-[116px] mb-[15px]"
        src="@/assets/yz_img/none_icon.png"
      />
      <span class="no_data_title">No History Data</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  padding-bottom: 12px;

  .listwp {
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    &::-webkit-scrollbar {
      display: none; /* Safari 和 Chrome */
    }
  }

  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 10px;
    border-radius: 4px;
    cursor: pointer;
    border: 0.1px solid #ccc;
    transition: all 0.3s;
    overflow-x: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    &::-webkit-scrollbar {
      display: none; /* Safari 和 Chrome */
    }

    &-title {
      display: flex;
      flex: 1;
      color: #4d4d4d;
      font-size: 14px;
      line-height: 40px;
      padding-left: 16px;
    }
  }
}
.no_data_title {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #9a9fb5;
}
.weight_500 {
  font-weight: 500 !important;
}
.yz_result_item {
  padding: 0 12px !important;
  border: 0 solid transparent !important;
  background: rgba(250, 250, 252, 0.502);
  box-sizing: border-box;
  .result-item-title {
    flex: 1;
    padding-left: 0 !important;
    padding-right: 6px !important;
    display: inline-block;
    white-space: nowrap;
    lines: 1;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
</style>
