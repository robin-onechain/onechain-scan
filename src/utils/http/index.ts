import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CustomParamsSerializer
} from "axios";
import {
  PureHttpError,
  RequestMethods,
  PureHttpResponse,
  PureHttpRequestConfig
} from "./types.d";
import { stringify } from "qs";
// import NProgress from "../progress";
import { getToken } from "@/utils/auth";
import { message } from "@/utils/message";
import router from "@/router";

// const offset = new Date().getTimezoneOffset();
// const timeZone = `UTC${offset > 0 ? "-" : "+"}${Math.abs(offset) / 60}`;

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const urlObj = {
  // Devnet: "https://hchain-scan-api.tpknp.com",
  Testnet: "https://test-hchain-scan-api.tpknp.com",
  // Mainnet: "https://scan.onelabs.cc"
  Mainnet: "https://onescan.cc"
};
const storageUrl = sessionStorage.getItem("netUrl") ?? "Mainnet";
const defaultUrl = urlObj[storageUrl];
const defaultConfig: AxiosRequestConfig = {
  baseURL: defaultUrl + import.meta.env.VITE_BASEURL,
  // 请求超时时间
  timeout: 30000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
    // "TIME-ZONE": timeZone
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新token */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig) => {
        const storageUrl1 = sessionStorage.getItem("netUrl") ?? "Mainnet";
        const questUrl = urlObj[storageUrl1];
        config.baseURL = questUrl + import.meta.env.VITE_BASEURL;
        //添加excel文件流请求类型
        if (config.url.includes("exportExcel")) {
          config.responseType = "blob";
        }
        //添加token请求头
        if (getToken()) {
          config.headers["St-Token"] = getToken();
        }
        //添加实例id请求头，生产环境应删除
        config.headers["InstanceId"] = "1696479276836917249";
        config.headers["lang"] = "zh-CN";
        // config.headers["InstanceId"] = "1677606526461595650";
        // 开启进度条动画
        // NProgress.start();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        // NProgress.done();
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        //如果接口返回数据的类型不是数据流，并且data的code不为000000，统一处理失败提示信息
        if (response.data.code !== "000000" && !response.config.responseType) {
          message(response.data.msg, { type: "error" });
        }
        return response.data;
      },
      (error: PureHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        // NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        if ($error.response.status === 403) {
          router.push("/error/403");
        } else {
          message(error.message, { type: "error" });
        }
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PureHttpRequestConfig
  ): Promise<P> {
    return this.request<P>("get", url, params, config);
  }
}

export const http = new PureHttp();
