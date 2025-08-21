import { http } from "@/utils/http";

/** epoch列表 */
export const getEpochList = (data?: object) => {
  return http.request<any>("post", "/epoch/list", {
    data
  });
};
