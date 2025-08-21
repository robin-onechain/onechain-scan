import { http } from "@/utils/http";

type Currency = {
  code?: string;
  name?: string;
  currencyCode?: string;
  alias?: string;
};

export type CurrencyResult = {
  success: boolean;
  msg: string;
  code: string;
  data: Currency[];
};

/** 查询所有币种 */
export const getCurrency = async (data?: object) => {
  return await http.request<CurrencyResult>("get", "/currency/get", {
    data
  });
};

/** 查询所有存款币种 */
export const getCurrencyDeposit = async (data?: object) => {
  return await http.request<CurrencyResult>("get", "/currency/get/deposit", {
    data
  });
};

/** 查询所有取款币种 */
export const getCurrencyWithdraw = async (data?: object) => {
  return await http.request<CurrencyResult>("get", "/currency/get/withdraw", {
    data
  });
};
