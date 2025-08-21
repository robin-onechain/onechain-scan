<template>
  <div class="search-footer">
    <span class="search-footer-item">
      <enterOutlined class="icon" />
      <span>confirm</span>
    </span>
    <span class="search-footer-item">
      <IconifyIconOffline :icon="ArrowUpLine" class="icon" />
      <IconifyIconOffline :icon="ArrowDownLine" class="icon" />
      <span>switch</span>
    </span>
    <span class="search-footer-item">
      <mdiKeyboardEsc class="icon" />
      <span>close</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import ArrowUpLine from "@iconify-icons/ri/arrow-up-line";
import ArrowDownLine from "@iconify-icons/ri/arrow-down-line";
import mdiKeyboardEsc from "@/assets/svg/keyboard_esc.svg?component";
import enterOutlined from "@/assets/svg/enter_outlined.svg?component";
</script>

<style lang="scss" scoped>
.search-footer {
  display: flex;

  .search-footer-item {
    display: flex;
    align-items: center;
    margin-right: 20px;
    font-size: 14px;
    line-height: 18px;
    color: #99a0ad;

    span {
      margin-left: 5px;
    }
  }

  .icon {
    border-radius: 3px;
    padding: 2px;
    margin-right: 3px;
    font-size: 20px;
    box-shadow: inset 0 -2px #eee, inset 0 0 0px 1px #fff, 0 0px 1px #99a0ad;
  }
}
</style>
