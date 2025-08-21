import { http } from "@/utils/http";

/** 账户代币列表 */
export const getAccountCurrencyList = (data?: object) => {
  return http.request<any>("post", "/address/tokens", {
    data
  });
};

/** 代币详情 */
export const getCurrencyObj = (data?: object) => {
  return http.request<any>("post", "/address/token/relateObject", {
    data
  });
};
