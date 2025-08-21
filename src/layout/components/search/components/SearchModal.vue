<script setup lang="ts">
import { useRouter } from "vue-router";
import SearchResult from "./SearchResult.vue";
import SearchHistory from "./SearchHistory.vue";
import SearchFooter from "./SearchFooter.vue";
import { useNav } from "@/layout/hooks/useNav";
import { ref, computed, shallowRef, watch } from "vue";
import { useDebounceFn, onKeyStroke } from "@vueuse/core";
import Search from "@iconify-icons/ep/search";
import { searchList } from "@/api/home";

interface Props {
  /** 弹窗显隐 */
  value: boolean;
}

interface Emits {
  (e: "update:value", val: boolean): void;
}

const { device } = useNav();
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {});
const router = useRouter();

const keyword = ref("");
const activePath = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const resultOptions = shallowRef([]);
const handleSearch = useDebounceFn(search, 300);

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit("update:value", val);
  }
});

const historyList = ref([]);

//每次打开搜索弹窗时，更新searchHistory的数据
watch(
  () => show.value,
  val => {
    if (val) {
      const searchHistory = localStorage.getItem("searchHistory");
      const list = searchHistory ? JSON.parse(searchHistory) : [];
      historyList.value = list;
    }
  }
);

/** 查询 */
function search() {
  searchList({ objectId: keyword.value }).then(res => {
    if (res.data.type === "UNKNOWN") {
      resultOptions.value = [];
    } else {
      resultOptions.value = [res.data];
    }
    setDefaultActivePath(res.data);
  });
}

/** 设置默认activePath的值，便于直接回车进行跳转 */
function setDefaultActivePath(item) {
  // ADDRESS(地址),
  // PACKAGE(包),
  // DIGEST(交易区块hash),
  // COIN(代币),
  // OBJECT（对象）
  switch (item.type) {
    case "ADDRESS":
      activePath.value = "/account?address=" + item.data;
      break;
    case "PACKAGE":
      activePath.value = "/packageDetail?packageId=" + item.data;
      break;
    case "DIGEST":
      activePath.value = "/transactionBlocksDetail?digest=" + item.data;
      break;
    case "COIN":
      activePath.value = "/coinDetail?type=" + item.data;
      break;
    // case "OBJECT（对象）":
    //   active.value = "/Epoch?data=" + item.data;
    //   break;
    default:
      break;
  }
}

function handleClose() {
  show.value = false;
  /** 延时处理防止用户看到某些操作 */
  setTimeout(() => {
    resultOptions.value = [];
    keyword.value = "";
  }, 200);
}
/** key up */
// function handleUp() {
//   const { length } = resultOptions.value;
//   if (length === 0) return;
//   const index = resultOptions.value.findIndex(
//     item => item.path === activePath.value
//   );
//   if (index === 0) {
//     activePath.value = resultOptions.value[length - 1].path;
//   } else {
//     activePath.value = resultOptions.value[index - 1].path;
//   }
// }

/** key down */
// function handleDown() {
//   const { length } = resultOptions.value;
//   if (length === 0) return;
//   const index = resultOptions.value.findIndex(
//     item => item.path === activePath.value
//   );
//   if (index + 1 === length) {
//     activePath.value = resultOptions.value[0].path;
//   } else {
//     activePath.value = resultOptions.value[index + 1].path;
//   }
// }

/** key enter */
function handleEnter() {
  const { length } = resultOptions.value;
  if (length === 0 || activePath.value === "") return;
  router.push(activePath.value);
  handleClose();
  const searchHistory = localStorage.getItem("searchHistory")
    ? JSON.parse(localStorage.getItem("searchHistory"))
    : [];
  const containsString = searchHistory.some(
    item => item.data === activePath.value
  );
  if (!containsString) {
    searchHistory.unshift({ data: activePath.value });
  } else {
    const index = searchHistory.findIndex(
      item => item.data === activePath.value
    );
    searchHistory.splice(index, 1);
    searchHistory.unshift({ data: activePath.value });
  }
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
onKeyStroke("Enter", handleEnter);
// onKeyStroke("ArrowUp", handleUp);
// onKeyStroke("ArrowDown", handleDown);
</script>

<template>
  <el-dialog
    title="Search"
    :top="device === 'mobile' ? '0px' : '36px'"
    v-model="show"
    :width="device === 'mobile' ? '100vw' : '580px'"
    :before-close="handleClose"
    :destroy-on-close="true"
    @opened="inputRef.focus()"
    @closed="inputRef.blur()"
    append-to-body
  >
    <el-input
      ref="inputRef"
      v-model="keyword"
      clearable
      placeholder="Search by Address / Hash / Token"
      @input="handleSearch"
    >
      <template #prefix>
        <span class="el-input__icon">
          <IconifyIconOffline :icon="Search" />
        </span>
      </template>
    </el-input>
    <div class="search-result-container">
      <SearchResult
        v-if="keyword"
        v-model:value="activePath"
        :options="resultOptions"
        @click="handleEnter"
      />
      <SearchHistory
        v-if="!keyword"
        :options="historyList"
        @close="show = false"
      />
    </div>
    <template #footer>
      <SearchFooter />
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.el-input {
  height: 45px !important;
}
:deep(.el-input__wrapper) {
  border-radius: 6px !important;
}
:deep(.is-focus) {
  box-shadow: 0 0 0 1px rgba(33, 79, 246, 0.6) inset !important;
}
</style>

<style>
.el-dialog__header {
  padding-bottom: 16px !important;
}

.el-dialog {
  border-radius: 10px !important;
}

.el-dialog__body {
  padding-top: 0 !important;
}
.el-dialog {
  height: 100vh;
  margin-bottom: 0 !important;
}
.el-dialog__body {
  height: calc(100vh - 156px);
}
@media (min-width: 768px) {
  .el-dialog {
    height: 400px;
  }
  .el-dialog__body {
    height: 300px;
  }
}
</style>
