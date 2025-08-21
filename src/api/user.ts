import { http } from "@/utils/http";

export type UserResult = {
  success: boolean;
  msg: string;
  code: string;
  data: null | {
    /** 用户名 */
    account: string;
    /** 	可操作柜台编号 */
    counterNos: Array<string>;
    /** `谷歌验证码设置标志 1:已设置 0:未设置` */
    googleFlag: number;
    /** `用户编号 */
    userNo: number;
    /** `用户类型 1:管理员 2:财务 3:柜员 */
    userType: string;
    /** app token信息 */
    token: string;
    /** `token header头 */
    tokenName: string;
  };
};
export type GoogleCodeResult = {
  success: boolean;
  msg: string;
  code: string;
  data: null | {
    /** google验证二维码字符串,根据这个数据生成需要的被google验证扫描的二维码 */
    otpURL: string;
    /** 密钥 */
    googleSecret: string;
  };
};

export type normalResult = {
  success: boolean;
  msg: string;
  code: string;
  data: null;
};

/** 检查是否绑定google */
export const checkAccount = (data?: object) => {
  return http.request<UserResult>("post", "/entrance/check", {
    data
  });
};

/** 登入 */
export const loginIn = (data?: object) => {
  return http.request<UserResult>("post", "/entrance/login", {
    data
  });
};

/** 登出 */
export const loginOut = () => {
  return http.request<UserResult>("post", "/entrance/logout");
};

/** 获取谷歌验证信息 */
export const getGoogleSecret = (data?: object) => {
  return http.request<GoogleCodeResult>(
    "post",
    "/user/secret/getGoogleSecret",
    {
      data
    }
  );
};
/** 绑定谷歌验证码 */
export const bindGoogle = (data?: object) => {
  return http.request<normalResult>("post", "/user/secret/bindGoogle", {
    data
  });
};

/** 登入柜台 */
export const loginCounter = (data?: object) => {
  return http.request<normalResult>("post", "/counter/login", {
    data
  });
};

/** 修改密码 */
export const changePassword = (data?: object) => {
  return http.request<normalResult>("post", "/user/secret/changePassword", {
    data
  });
};
