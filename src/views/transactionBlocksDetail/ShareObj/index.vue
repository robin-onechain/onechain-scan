<template>
  <div class="transaction_overview_box dmsans">
    <div
      class="px-[22px] py-[17px] border-b border-gray_0 text-[16px] font-bold"
    >
      Shared Objects
    </div>
    <div v-if="tableData.length" class="py-[20px]">
      <ReTable :columns="columns" :data="tableData">
        <template #shareObjectId="{ row }">
          <div class="flex items-center justify-center">
            <span class="truncate max-w-full">
              {{ row.shareObjectId }}
            </span>
            <ReCopyBtn :text="row.shareObjectId" />
          </div>
        </template>
        <template #type="{ row }">
          <div class="flex items-center justify-center">
            <span class="truncate max-w-full">
              {{ row.type }}
            </span>
            <ReCopyBtn :text="row.type" />
          </div>
        </template>
        <template #digest="{ row }">
          <div class="flex items-center justify-center">
            <span class="truncate max-w-full">
              {{ row.digest }}
            </span>
            <ReCopyBtn :text="row.digest" />
          </div>
        </template>
      </ReTable>
    </div>
    <div v-else class="flex flex-col items-center my-10">
      <img
        class="w-[159px] h-[116px] mb-[15px]"
        src="@/assets/yz_img/none_icon.png"
      />
      <p class="no_data_title">No Data</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import ReTable from "@/components/ReTable/index.vue";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import Nodata from "@/assets/svg/nodata.svg";

const props = defineProps<{
  data: any;
}>();

const tableData = computed(() => {
  return props.data || [];
});

const columns = [
  {
    prop: "shareObjectId",
    label: "Share Object",
    slot: "shareObjectId",
    align: "center"
  },
  { prop: "type", label: "Type", slot: "type", align: "center" },
  { prop: "digest", label: "Digest", slot: "digest", align: "center" },
  { prop: "version", label: "Version", align: "center" }
];
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
</style>
