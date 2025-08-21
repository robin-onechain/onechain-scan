/* eslint-disable */
<template>
  <div class="ReTablewp dmsans">
    <el-table v-loading="loading" :data="data" class="custom-table">
      <el-table-column
        v-for="(column, index) in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="
          index === 0
            ? 'left'
            : index === columns.length - 1
            ? 'right'
            : 'center'
        "
        :minWidth="200"
      >
        <template v-if="column.slot" #default="{ row }">
          <slot :name="column.slot" :row="row" />
        </template>
      </el-table-column>
      <template #empty>
        <div class="py-[140px] flex flex-col items-center">
          <!-- <TableNoData /> -->
          <img
            class="w-[159px] h-[116px] mb-[15px]"
            src="@/assets/yz_img/none_icon.png"
          />
          <p class="no_data_title">No Data</p>
        </div>
      </template>
    </el-table>
    <template v-if="pagination">
      <el-pagination
        v-if="!isSimplePagination"
        class="custom-pagination mt-[30px] md:justify-end justify-start"
        background
        layout="prev, pager, next, slot"
        :total="pagination.total"
        hide-on-single-page
        :current-page="pagination.currentPage"
        @current-change="handleCurrentChange"
      >
        <span class="ml-[8px]">
          <span>Jump to</span>
          <el-input
            class="mx-[12px]"
            :style="{ width: `${jumperVal.length + 1}em`, minWidth: '32px' }"
            v-model="jumperVal"
            @keyup.enter="handleJumperChange"
          />
          <span>Page</span>
        </span>
      </el-pagination>

      <div v-else class="simple-pagination">
        <el-button
          :disabled="pagination.currentPage === 1"
          :icon="DArrowLeft"
          size="small"
          @click="handleFirstPage"
        />
        <el-button
          :disabled="pagination.currentPage === 1"
          :icon="ArrowLeft"
          size="small"
          @click="handlePrevPage"
        />
        <el-button
          :disabled="!pagination.hasNextPage"
          :icon="ArrowRight"
          size="small"
          @click="handleNextPage"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ArrowLeft, ArrowRight, DArrowLeft } from "@element-plus/icons-vue";

import TableNoData from "@/assets/svg/table_no_data.svg?component";

const jumperVal = ref("");

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array as () => Array<{
      prop: string;
      label: string;
      width?: number;
      align?: string;
      slot?: string;
    }>,
    required: true
  },
  data: {
    type: Array as () => any[],
    required: true
  },
  pagination: {
    type: Object as () => {
      total: number;
      currentPage: number;
      pageSize?: number;
      hasNextPage?: boolean;
    } | null,
    default: null
  },
  isSimplePagination: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["page-size-change"]);

const updatePage = (newPage: number) => {
  if (props.pagination) {
    const prevPage = props.pagination.currentPage;
    props.pagination.currentPage = newPage;
    emit("page-size-change", newPage, prevPage);
  }
};

const handleCurrentChange = (page: number) => {
  updatePage(page);
};

const handleJumperChange = () => {
  const page = parseInt(jumperVal.value, 10);
  if (
    !isNaN(page) &&
    page > 0 &&
    props.pagination &&
    page <= Math.ceil(props.pagination.total / 10)
  ) {
    updatePage(page);
  }
};

const handleFirstPage = () => {
  updatePage(1);
};

const handlePrevPage = () => {
  updatePage(props.pagination.currentPage - 1);
};

const handleNextPage = () => {
  updatePage(props.pagination.currentPage + 1);
};
</script>

<style lang="scss" scoped>
.ReTablewp {
  border-radius: 8px;
  background: #ffffff;
  :deep(.custom-table) {
    border-left: none;
    border-right: none;
    border-radius: 8px;
    background: #ffffff;
    .cell {
      font-weight: 400;
      font-size: 14px;
      color: #000;
    }
  }

  :deep(.custom-table .el-table__header-wrapper th),
  :deep(.custom-table .el-table__body-wrapper td) {
    border-left: none !important;
    border-right: none !important;
  }

  :deep(.custom-pagination) {
    display: flex;
    flex-wrap: wrap;
    margin: 0;
    padding: 30px 14px;
    border-top: none;

    .is-active {
      color: #000 !important;
      background: #f0f1f5 !important;
    }
    .number {
      border-radius: 6px;
      border-width: 1px;
      border: 1px solid #f0f1f5;
      background: transparent;
    }

    .el-pager {
      margin: 10px 0;
      .more {
        background: transparent;
      }
    }
    .btn-prev {
      background: transparent;
      .el-icon {
        font-size: 18px;
      }
    }
    .btn-next {
      background: transparent;
      .el-icon {
        font-size: 18px;
      }
    }

    .el-input__wrapper {
      border-radius: 6px;
      border-width: 1px;
      border: 1px solid #f0f1f5;
      background: transparent;
      box-shadow: 0 0 0 0 transparent;
      box-sizing: border-box;
    }
  }
}

.simple-pagination {
  padding: 30px 37px;
  // border: 1px solid #e9ecef;
  border-top: none;
  // background: white;
  text-align: center;
}
.no_data_title {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #9a9fb5;
}
</style>
