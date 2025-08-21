import { http } from "@/utils/http";

export type ApiResponse<T> = {
  success: boolean;
  msg: string;
  code: string;
  data: T;
};

export type StatisticsInfoData = {
  epoch: number;
  gasPrice: number;
  totalCheckpoints: number;
  totalTransactionBlocks: number;
};

export type SupplyInfoData = {
  circulatingSupply: number;
  marketAddress: string;
  marketCap: number;
  price: number;
  supply: number;
  totalStakedAmount: number;
  pricePercent: string;
  gasAvg: string;
};

export type StatisticsInfoResult = ApiResponse<StatisticsInfoData>;
export type SupplyInfoResult = ApiResponse<SupplyInfoData>;

/** 统计信息 */
export const getStatisticsInfo = (data?: object) => {
  return http.request<StatisticsInfoResult>("post", "/stat/base", {
    data
  });
};

/** 发行量和价格相关 */
export const getSupplyInfo = (data?: object) => {
  return http.request<SupplyInfoResult>("post", "/stat/supply", {
    data
  });
};
/** 搜索 */
export const searchList = (data?: object) => {
  return http.request<any>("post", "/search/", {
    data
  });
};
