<script setup lang="ts">
import { computed } from "vue";
import enterOutlined from "@/assets/svg/enter_outlined.svg?component";
import Nodata from "@/assets/svg/nodata.svg";
interface optionsItem {
  data: string;
  type?: string;
}

interface Props {
  value: string;
  options: Array<optionsItem>;
}

interface Emits {
  (e: "update:value", val: string): void;
  (e: "enter"): void;
}

const props = withDefaults(defineProps<Props>(), {});
const emit = defineEmits<Emits>();

const active = computed({
  get() {
    return props.value;
  },
  set(val: string) {
    emit("update:value", val);
  }
});

/** 鼠标移入 */
async function handleMouse(item) {
  // ADDRESS(地址),
  // PACKAGE(包),
  // DIGEST(交易区块hash),
  // COIN(代币),
  // OBJECT（对象）
  switch (item.type) {
    case "ADDRESS":
      active.value = "/account?address=" + item.data;
      break;
    case "PACKAGE":
      active.value = "/packageDetail?packageId=" + item.data;
      break;
    case "DIGEST":
      active.value = "/transactionBlocksDetail?digest=" + item.data;
      break;
    case "COIN":
      active.value = "/coinDetail?type=" + item.data;
      break;
    // case "OBJECT（对象）":
    //   active.value = "/Epoch?data=" + item.data;
    //   break;
    default:
      break;
  }
}

function handleTo() {
  emit("enter");
}
</script>

<template>
  <div class="result">
    <div v-if="options.length">
      <template v-for="item in options" :key="item.data">
        <div
          class="result-item text-[#fff] bg-primary1"
          @click="handleTo"
          @mouseenter="handleMouse(item)"
        >
          <span class="result-item-title">{{ item.data }}</span>
          <enterOutlined />
        </div>
      </template>
    </div>
    <div v-else class="flex flex-col items-center my-10">
      <Nodata class="mx-auto mb-2" />
      <span class="text-[#9A9FB5] text-[13px]">No Search Result Data </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result {
  padding-bottom: 12px;

  &-item {
    display: flex;
    align-items: center;
    height: 40px;
    margin-top: 10px;
    padding: 16px;
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
      margin-left: 5px;
    }
  }
}
</style>
