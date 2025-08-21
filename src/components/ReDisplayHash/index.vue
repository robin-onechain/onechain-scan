<template>
  <div class="dmsans" :class="['flex items-center gap-[4px]', justifyClass]">
    <span
      class="yz_text_box"
      :class="[
        'break-words max-w-full',
        onClick ? 'cursor-pointer text-blue_0' : ''
      ]"
      @click="handleClick"
    >
      {{ formattedText }}
    </span>
    <ReCopyBtn v-if="showCopyButton" :text="text" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  showCopyButton: {
    type: Boolean,
    default: true
  },
  onClick: {
    type: Function,
    default: null
  },
  align: {
    type: String,
    default: "center"
  }
});

const handleClick = () => {
  if (props.onClick) {
    props.onClick();
  }
};

const formattedText = computed(() => {
  if (!props.text) {
    return "";
  }
  if (props.text.length <= 16) {
    return props.text;
  }
  return `${props.text.slice(0, 8)}.....${props.text.slice(-8)}`;
});

const justifyClass = computed(() => {
  switch (props.align) {
    case "start":
      return "justify-start";
    case "end":
      return "justify-end";
    case "center":
    default:
      return "justify-center";
  }
});
</script>

<style scoped>
.yz_text_box {
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
</style>
