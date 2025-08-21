import { storageSession } from "@pureadmin/utils";
import Cookies from "js-cookie";

export interface DataInfo {
  /** app token信息 */
  token: string;
  /** `token header头 */
  tokenName: string;
}

export const sessionKey = "user-info";
export const TokenKey = "authorized-token";

/** 获取`session` */
export function getSession() {
  return storageSession().getItem<DataInfo>("user-info");
}
/** 获取`token` */
export function getToken() {
  return storageSession().getItem<DataInfo>("authorized-token");
}
/**
 * 将token放在key值为`authorized-token`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo) {
  function setTokenKey(token: string) {
    storageSession().setItem(TokenKey, token);
    Cookies.set("St-Token", token);
  }

  if (data.token) {
    const { token } = data;
    setTokenKey(token);
  } else {
    const token = storageSession().getItem<DataInfo>(sessionKey)?.token ?? "";
    setTokenKey(token);
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  sessionStorage.clear();
  Cookies.remove("St-Token");
}
