<template>
  <div class="scrollable-menu">
    <div class="menu-container">
      <div
        v-for="tab in tabs"
        :key="tab.value"
        class="min-w-[84px] py-[8px] text-center cursor-pointer px-[10px] tabs_obj"
        :class="
          type_bg
            ? {
                'text-[#214FF6CC] bg-[#EEF2FF]': activeTab === tab.value,
                'text-black bg-[#FAFAFC]': activeTab !== tab.value
              }
            : {
                'text-[#214FF6CC] bg-[#EEF2FF]': activeTab === tab.value,
                'text-black bg-[#FFFFFF]': activeTab !== tab.value
              }
        "
        @click="handleTabChange(tab.value)"
      >
        {{ tab.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  tabs: { label: string; value: string }[];
  activeTab: string;
  type_bg: string;
}>();

const emits = defineEmits(["tab-change"]);

const handleTabChange = (tab: string) => {
  emits("tab-change", tab);
};
</script>

<style scoped>
.scrollable-menu {
  overflow-x: auto; /* 允许横向滚动 */
  white-space: nowrap; /* 防止换行 */
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 和 Edge */
}

.menu-container {
  display: inline-flex; /* 使用 inline-flex 以便于横向排列 */
}
.tabs_obj {
  margin-right: 20px;
  border-radius: 6px;
  transition: background-color 0.3s;
}
</style>
