import { http } from "@/utils/http";

/** package详情 */
export const getPkgDetail = (data?: object) => {
  return http.request<any>("post", "/package/detail", {
    data
  });
};
