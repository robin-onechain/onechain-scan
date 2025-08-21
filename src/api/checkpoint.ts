import { http } from "@/utils/http";

/** checkpoint列表 */
export const getCheckpointList = (data?: object) => {
  return http.request<any>("post", "/checkpoint/list", {
    data
  });
};

/** checkpoint详情 */
export const getCheckpointDetail = (data?: object) => {
  return http.request<any>("post", "/checkpoint/detail", {
    data
  });
};
