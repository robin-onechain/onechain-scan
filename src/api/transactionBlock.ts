import { http } from "@/utils/http";

/** 区块列表 */
export const getBlockList = (data?: object) => {
  return http.request<any>("post", "/transaction/block/list", {
    data
  });
};

/** 区块详情 */
export const getBlockInfo = (data?: object) => {
  return http.request<any>("post", "/transaction/block/detail", {
    data
  });
};
