<template>
  <div class="transaction_overview_box dmsans">
    <div
      class="px-[22px] py-[17px] border-b border-gray_0 text-[16px] font-bold"
    >
      Inputs
    </div>
    <div
      v-if="infoData.length"
      class="px-[22px] py-[20px] flex flex-col gap-[21px]"
    >
      <template v-for="(item, index) in infoData" :key="index">
        <div class="py-[21px] px-[24px] yz_input_box">
          <div class="mb-[15px]">Input {{ index }}</div>
          <div class="flex flex-col gap-[21px]">
            <ReInfoList :columns="generateInfoColumns(item)" :data="item" />
          </div>
        </div>
      </template>
    </div>
    <div v-else class="flex flex-col items-center my-10">
      <img
        class="w-[159px] h-[116px] mb-[15px]"
        src="@/assets/yz_img/none_icon.png"
      />
      <span class="no_data_title">No Data</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import ReInfoList from "@/components/ReInfoList/index.vue";
import Nodata from "@/assets/svg/nodata.svg";

const router = useRouter();

const props = defineProps<{
  data: any;
}>();

const infoData = computed(() => {
  return props.data || [];
});

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const generateInfoColumns = (item: Record<string, any>) => {
  return Object.keys(item).map(key => {
    const type = "text";
    const column: Record<string, any> = {
      label: capitalizeFirstLetter(key),
      prop: key,
      type: type
    };
    if (key === "value") {
      column.type = "code";
    } else if (key === "address" || key === "objectId") {
      column.type = "copy";
      if (key === "objectId") {
        column.highlight = true;
        column.onClick = (v: string) => {
          router.push({
            path: "/packageDetail",
            query: { packageId: v }
          });
        };
      }
    }
    return column;
  });
};
</script>
<style lang="scss" scoped>
.transaction_overview_box {
  margin-bottom: 30px;
  background-color: #ffffff;
  box-shadow: 0px 4px 20px 0px #0000000a;
  border-radius: 8px;
}
.no_data_title {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #9a9fb5;
}
.yz_input_box {
  border-radius: 6px;
  background: #f8fafd;
}
</style>
