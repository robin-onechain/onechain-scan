<template>
  <div class="flex items-center gap-[5px] text-xs text-gray_1 yz_label_box">
    <span>{{ label }}</span>
    <el-tooltip :content="tooltipContent" placement="right">
      <TipIcon />
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { VNode } from "vue";
import TipIcon from "@/assets/svg/tip_icon.svg?component";

defineProps<{
  label: string | VNode;
  tooltipContent: string | VNode;
}>();
</script>

<style scoped>
.yz_label_box {
  color: #7e808a;
}
</style>
