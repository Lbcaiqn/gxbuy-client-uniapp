import { UserStore } from "@/store";

export default function () {
  // 点击 tabbar 底层也是触发 switchTab
  const routeMethod = ["navigateTo", "navigateBack", "redirectTo", "switchTab"];

  // 需要登录才能进入的页面
  const needJwt = [
    "/pages/Profile/Profile",
    "/pages/Shopcart/Shopcart",
    "/sub-pages-user/Order/Order",
    "/sub-pages-user/UserDetail/UserDetail",
    "/sub-pages-user/Setting/Setting"
  ];

  for (const rm of routeMethod) {
    uni.addInterceptor(rm, {
      // uni api 调用前触发，可以做全局前置守卫
      invoke(args: any) {
        const userStore = UserStore();
        const jwt = userStore.gxbuy_uniapp_jwt;

        // 如果没有jwt且需要jwt
        if (!jwt && needJwt.find((url: string) => new RegExp(url).test(args.url))) {
          // 保存此次跳转的路由，以在登录后跳转回来，不过uni自带的跳转只能把参数连接到url里，且url长度又有限制，只能存到本地存储了
          userStore.toPath = args.url;

          // 跳转登录页
          uni.navigateTo({ url: "/sub-pages-user/Login/Login" });
          return false;
        }
      },
      // uni api 调用成功后触发，可以做全局后置守卫
      success(args: any) {}
    });
  }
}
