<template>
  <div class="transaction_overview_box dmsans">
    <div
      class="px-[22px] py-[17px] border-b border-gray_0 text-[16px] font-bold"
    >
      Call Record
    </div>
    <div v-if="props.data.length">
      <div
        class="px-[22px] py-[20px] flex flex-col"
        v-for="(item, index) in props.data"
        :key="index"
      >
        <div
          v-if="
            item.type === 'SplitCoins' ||
            item.type === 'MakeMoveVec' ||
            item.type === 'MergeCoins' ||
            item.type === 'TransferObjects' ||
            item.type === 'Upgrade'
          "
        >
          <div
            class="mb-[18px] font-bold text-[16px]"
            v-if="item.type === 'SplitCoins'"
          >
            Split Coins
          </div>
          <div
            class="mb-[18px] font-bold text-[16px]"
            v-if="item.type === 'MakeMoveVec'"
          >
            Make Move Vec
          </div>
          <div
            class="mb-[18px] font-bold text-[16px]"
            v-if="item.type === 'MergeCoins'"
          >
            Merge Coins
          </div>
          <div
            class="mb-[18px] font-bold text-[16px]"
            v-if="item.type === 'TransferObjects'"
          >
            Transfer Objects
          </div>
          <div
            class="mb-[18px] font-bold text-[16px]"
            v-if="item.type === 'Upgrade'"
          >
            Upgrade
          </div>
          <ReCodeBlock :value="item.command.field0" />
          <div class="mt-2">
            <ReCodeBlock :value="item.command.field1" />
          </div>
          <div class="mt-2" v-if="item.type === 'Upgrade'">
            <ReCodeBlock :value="item.command.field2" />
          </div>
        </div>
        <div v-if="item.type === 'Publish'">
          <div class="mb-[18px] font-bold text-[16px]">Publish</div>
          <ReCodeBlock :value="item.command.publish" />
        </div>
        <div v-if="item.type === 'MoveCall'">
          <div class="mt-[30px] mb-[15px] font-bold text-[16px]">Move Call</div>
          <div class="flex flex-col gap-[21px]">
            <ReInfoList :columns="infoColumns" :data="item.command" />
          </div>
        </div>
      </div>
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
import ReCodeBlock from "@/components/ReCodeBlock/index.vue";
import ReInfoList from "@/components/ReInfoList/index.vue";
import Nodata from "@/assets/svg/nodata.svg";

/*
返回内容参考
[
  {
    type=MakeMoveVec(数组创建)
    command : {
      field0:”字符串”,
      field1: 数组(直接当作json展示就可以)
    }
  },
  {
    type=MergeCoins(代币合并)
    command : {
      field0:对象(直接当作json展示),
      field1: 数组(直接当作json展示就可以)
    }
  },
  {
    type=MoveCall(函数调用)
    command : {
      “suiPackage”:”包地址”,
      “module”: “模块名称”，
      “function”: “函数名称”，
      “arguments”:参数列表(是一个数组 直接展示就可以了)，
      “typeArguments”: 参数类型列表(是一个数组 直接当作展示就可以了)，
    }
  },
  {
    type=Publish(合约发布)
    command : {
      “publish”:依赖包地址列表（数组 直接当作json展示就可以）,
    }
  },
  {
    type=SplitCoins(代币切割)
    command : {
      “field0”:对象(当作json展示就可以)，
      “field1”:数组(当作json展示就可以)
    }
  },
  {
    type=TransferObjects(对象所有权转移)
    command : {
      “field0”:数组(当作json展示就可以)，
      “field1”:对象(当作json展示就可以)
    }
  },
  {
    type=Upgrade(合约升级)
    command : {
      “field0”:数组(当作json展示就可以)，
      “field1”:”字符串”，
      “Field2”:对象(当作json展示就可以)
    }
  }
]

*/
const props = defineProps<{
  data: any;
}>();

const infoColumns = [
  {
    label: "Package",
    prop: "package",
    type: "copy"
  },
  {
    label: "Module",
    prop: "module",
    type: "text"
  },
  {
    label: "Function",
    prop: "function",
    type: "text"
  },
  {
    label: "Arguments",
    prop: "arguments",
    type: "code",
    direction: "vertical"
  },
  {
    label: "typeArguments",
    prop: "typeArguments",
    type: "code",
    direction: "vertical"
  }
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
pre {
  padding: 10px 24px;
}
</style>
