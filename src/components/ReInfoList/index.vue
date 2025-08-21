<template>
  <template v-for="(column, colIndex) in columns" :key="colIndex">
    <div
      v-if="column.isShow === undefined || column.isShow(data)"
      :key="colIndex"
      :class="[
        'flex gap-[16px] text-[14px]',
        column.direction === 'vertical'
          ? 'md:flex-col md:items-start'
          : 'md:flex-row md:items-center'
      ]"
      class="md:flex-row flex-col md:items-center items-start"
    >
      <div
        :class="[column.labelClass || labelClass, 'text-gray_1 flex-shrink-0']"
      >
        {{ column.label }}
      </div>
      <div
        v-if="column.type === 'text'"
        :class="[
          column.valueClass || valueClass,
          column.highlight ? 'text-blue_0' : ''
        ]"
        class="font-bold"
      >
        {{ getValue(data, column.prop) }}
      </div>
      <div
        v-else-if="column.type === 'copy'"
        class="flex items-center gap-[5px] font-bold"
      >
        <div
          :class="[
            column.valueClass || valueClass,
            column.highlight ? 'text-blue_0' : ''
          ]"
          class="max-w-[540px] break-words"
          @click="
            column.highlight && column.onClick
              ? column.onClick(data?.[column.prop])
              : null
          "
          :style="{
            cursor: column.highlight && column.onClick ? 'pointer' : 'default'
          }"
        >
          {{ getValue(data, column.prop) }}
        </div>
        <ReCopyBtn :text="getValue(data, column.prop)" />
      </div>
      <div
        v-else-if="column.type === 'status'"
        class="font-bold flex items-center gap-[5px]"
      >
        <div
          v-if="data?.[column.prop] === 'success'"
          class="bg-green_0 text-gray_2 py-[5px] px-[10px]"
        >
          Transaction Success
        </div>
        <div
          v-else-if="data?.[column.prop] === 'failure'"
          class="bg-red_1 text-red_0 py-[5px] px-[10px]"
        >
          Transaction Failure
        </div>
        <div
          v-else-if="data?.[column.prop] === 'abort'"
          class="bg-green_2 text-green_1 py-[5px] px-[10px]"
        >
          Termination of transaction
        </div>
      </div>
      <div v-else-if="column.type === 'code'" class="w-full overflow-auto">
        <ReCodeBlock :value="data?.[column.prop]" />
      </div>
      <div v-else-if="column.type === 'time'" class="font-bold">
        <!-- {{ formatTime(data?.[column.prop], column.isUtc) }} -->
        {{ formatLocalTime(Number(data?.[column.prop])) }}
      </div>
      <div v-else-if="column.type === 'slot'">
        <slot :name="column.prop" :slotData="data?.[column.prop]" />
      </div>
      <div v-else-if="column.type === 'yz_title'" class="yz_title_box">
        {{ getValue(data, column.prop) }}
      </div>
      <div v-else-if="column.type === 'yz_text'" class="yz_gas_box">
        <div class="a">
          {{ getValue(data, column.prop).a }}
        </div>
        <div class="b" v-if="getValue(data, column.prop).b">
          {{ `(${getValue(data, column.prop).b})` }}
        </div>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import moment from "moment";
import ReCopyBtn from "@/components/ReCopyBtn/index.vue";
import ReCodeBlock from "@/components/ReCodeBlock/index.vue";

interface Column {
  label: string;
  prop: string;
  type: "text" | "copy" | "status" | "code" | "time" | "slot";
  highlight?: boolean;
  onClick?: (value: any) => void;
  direction?: "horizontal" | "vertical";
  labelClass?: string;
  valueClass?: string;
  isShow?: (data: Record<string, any>) => boolean;
  isUtc?: boolean;
}

const props = defineProps<{
  columns: Column[];
  data: Record<string, any>;
  labelClass?: string;
  valueClass?: string;
}>();

const labelClass = props.labelClass ?? "md:w-[300px] w-[100%]";
const valueClass = props.valueClass ?? "break-all ";

const getValue = (data: Record<string, any>, prop: string) => {
  return data?.[prop] !== null && data?.[prop] !== undefined ? data[prop] : "";
};

// const formatTime = (value: any, isUtc = false) => {
//   if (!value || isNaN(Number(value))) {
//     return "";
//   }
//   return isUtc
//     ? moment(Number(value)).utc().format("DD.MM.YYYY [UTC] HH:mm")
//     : moment(Number(value)).format("YYYY-MM-DD HH:mm:ss");
// };

/**
 * 将UTC时间戳格式化为本地时间（简化时区显示）
 * @param {number} timestamp UTC时间戳（毫秒）
 * @returns {string} 如："2025-04-10 18:38:28 (GMT+8)"
 */
function formatLocalTime(timestamp) {
  // 1. 创建moment对象（自动识别为UTC时间）
  const utcTime = moment.utc(timestamp);

  // 2. 转换为本地时区
  const localTime = utcTime.local();

  // 3. 获取时区偏移小时数（去掉分钟部分）
  const offsetHours = localTime.utcOffset() / 60;
  const gmtOffset = `GMT${offsetHours >= 0 ? "+" : ""}${offsetHours}`;

  // 4. 组合成目标格式
  return `${localTime.format("YYYY-MM-DD HH:mm:ss")} (${gmtOffset})`;
}
</script>

<style lang="scss" scoped>
.yz_gas_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  .a {
    color: #000000;
    font-weight: 700;
  }
  .b {
    color: #7f7f7f;
    font-weight: 400;
  }
}
.yz_title_box {
  height: 17px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
  padding: 0 10px;
  border-radius: 1000px;
  background: linear-gradient(
    90deg,
    rgba(44, 82, 247, 0.6) 0%,
    rgba(155, 115, 254, 0.6) 49.52%,
    rgba(66, 89, 248, 0.6) 100%
  );
}
</style>
