import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig
} from "axios";
import qs from "qs";
import { UserStore } from "@/store";

// 适配器 ------------------------------------------------------------------------
const getResponse = (res: any, config: any) => {
  const { statusCode, errMsg } = res;

  return {
    ...res,
    status: statusCode,
    statusText: errMsg,
    config,
    request: null
  };
};

function uniAdapter(config: AxiosRequestConfig | any): AxiosPromise {
  if (!uni) throw new Error("please use this in uni-app project!");

  return new Promise((resolve, reject) => {
    const { baseURL, url, headers, method, data, params } = config;
    const uniConfig = {
      ...config,
      url: baseURL + url,
      header: headers
    };

    if (data || params) {
      try {
        uniConfig.data = JSON.parse(data || params);
      } catch (e) {
        uniConfig.data = data || params;
      }
    }

    // 通过 qs.stringify 序列化解决 uni.request 参数问题
    if (method === "get") {
      uniConfig.url = `${uniConfig.url}?${qs.stringify(uniConfig.data)}`;
      delete uniConfig.data;
    }

    uni.request({
      ...uniConfig,
      success(res: any) {
        const response = getResponse(res, config);
        if (response.status < 200 || response.status >= 300) {
          reject(response);
        } else resolve(response);
      },
      fail(res: any) {
        const response = getResponse(res, config);
        reject(response);
      }
    });
  });
}

// 二次封装 axios -------------------------------------------------------------------------
const baseURL =
  (import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL) +
  "/v1";

const cancelTokenSource = axios.CancelToken.source();

const instance: AxiosInstance = axios.create({
  // 使用适配器，以适配小程序
  adapter: uniAdapter,
  // 注意，使用了适配器后，一定要配置 baseURL 和 timeout，否则无法使用
  baseURL,
  timeout: 1000 * 10
});

// 请求拦截器
instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  uni.showLoading({
    title: "加载中..."
  });
  const userStore = UserStore();
  const jwt = userStore.gxbuy_uniapp_jwt;

  // 后端需要jwt鉴权的接口，url都会有'/jwt/'，所以遇到有 '/jwt/' 的借口就加上请求头
  if (/\/jwt\//.test(config.url as string)) {
    // 如果未登录，就取消此次请求，并跳转登录页
    if (!jwt) {
      cancelTokenSource.cancel();
      uni.hideLoading();

      userStore.toPath = location.hash.substring(1);
      uni.navigateTo({ url: "/sub-pages-user/Login/Login" });

      // 拦截器必须returen，所以这里return一个异常，请求时catch就好
      return Promise.reject(new Error("未登录"));
    } else {
      config.headers!.authorization = jwt;
    }
  } else if (
    jwt &&
    (/\/goods\/search/.test(config.url as string) ||
      /\/goods\/detail/.test(config.url as string) ||
      /\/shop\/getShopInfo/.test(config.url as string))
  ) {
    config.headers!.authorization = jwt;
  }

  return config;
});

// 响应拦截器
instance.interceptors.response.use(
  (res: AxiosResponse | any) => {
    uni.hideLoading();
    return res.data;
  },
  (err: AxiosError) => {
    uni.hideLoading();
    // 如果jwt验证失败或者jwt过期，后端一般是返回403
    if (err.status === 403) {
      const userStore = UserStore();
      cancelTokenSource.cancel();

      userStore.gxbuy_uniapp_jwt = "";
      userStore.userInfo = {};
      userStore.toPath = location.hash.substring(1);

      uni.navigateTo({ url: "/sub-pages-user/Login/Login" });
      return Promise.reject(new Error("请重新登录"));
    }

    return Promise.reject(err);
  }
);

export const staticBaseURL =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL;

export default instance;
