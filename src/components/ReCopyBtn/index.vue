<template>
  <div
    :class="[
      'copy-btn',
      customClass,
      'w-[16px] h-[16px] flex-shrink-0 cursor-pointer text-gray_1 hover:text-blue_0'
    ]"
    @click="copyToClipboard($event)"
  >
    <img
      v-if="copy_icon === 'copy_icon_A'"
      class="w-[16px] h-[16px]"
      src="@/assets/yz_img/copy_icon_A.png"
    />
    <img v-else class="w-[16px] h-[16px]" src="@/assets/yz_img/copy_icon.png" />
  </div>
</template>
<script lang="ts" setup>
import Clipboard from "clipboard";
import { message } from "@/utils/message";
import Copy from "@/assets/svg/copy.svg?component";

const props = defineProps({
  customClass: {
    type: String,
    default: ""
  },
  text: {
    type: String,
    required: true
  },
  copy_icon: {
    type: String,
    default: ""
  }
});

const copyToClipboard = (event: any) => {
  if (!props.text) {
    return;
  }
  const clipboard = new Clipboard(".copy-btn", {
    text: () => props.text
  });
  clipboard.on("success", () => {
    message("Copy Success", { type: "success" });
    event.stopPropagation(); // 手动停止事件传播
    clipboard.destroy();
  });

  clipboard.on("error", () => {
    message("Copy Failure", { type: "error" });
    event.stopPropagation(); // 手动停止事件传播
    clipboard.destroy();
  });
};
</script>
<style lang="scss" scoped></style>
