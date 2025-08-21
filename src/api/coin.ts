import { http } from "@/utils/http";

/** coin详情 */
export const getCoinDetail = (data?: object) => {
  return http.request<any>("post", "/coin/detail", {
    data
  });
};
