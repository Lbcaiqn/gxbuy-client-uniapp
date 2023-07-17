const baseURL = "http://localhost:3001/v1";
const timeout = 1000 * 10;

// uniapp 有 uni.addInterceptor 可以配置拦截器，但是没有必要，下面已经实现了拦截器功能
const instance = function (options: any): Promise<any> {
  // 这里可以写请求拦截器的功能
  options.url = baseURL + options.url;
  options.timeout = timeout;

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      // success 和 fail 可以写响应拦截器的功能
      success(res: any) {
        resolve(res.data);
      },
      faill(err: any) {
        reject(err);
      }
    });
  });
};

export default instance;
