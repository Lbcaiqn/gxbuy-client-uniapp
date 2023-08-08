<script setup lang="ts">
import { ref } from "vue";
import { userLoginRequest } from "@/api";
import { UserStore } from "@/store";

const userStore = UserStore();

const loginFormRef = ref<any>(null);

const loginInfo = ref({
  user_account: String(Math.floor(Math.random() * 50000 + 1)).padStart(8, "0"),
  user_password: "qwer1234",
  code: ""
});

const loginRules = ref({
  user_account: {
    rules: [
      {
        required: true,
        errorMessage: "请输入账号"
      }
    ]
  },
  user_password: {
    rules: [
      {
        required: true,
        errorMessage: "请输入密码"
      }
    ]
  },
  code: {
    rules: [
      {
        required: true,
        errorMessage: "请输入验证码"
      }
    ]
  }
});

const baseURL = ref(
  (import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL) +
    "/v1/user/code/"
);

const codeURL = ref<string>(baseURL.value + "?time=" + new Date());

async function login() {
  try {
    await loginFormRef.value.validate();
  } catch (err: any) {
    return;
  }

  try {
    const res = (await userLoginRequest(loginInfo.value)).data;

    userStore.gxbuy_uniapp_jwt = res.jwt;
    userStore.userInfo = res.user;
    console.log("登录成功");

    if (userStore.toPath) {
      if (new RegExp("^\/pages\/").test(userStore.toPath)) uni.switchTab({ url: userStore.toPath });
      else uni.navigateTo({ url: userStore.toPath });
    } else {
      uni.switchTab({ url: "/pages/Home/Home" });
    }
  } catch (err: any) {
    console.log("登录失败");
  }
}
</script>

<template>
  <view id="login">
    <view class="login-box">
      <uni-forms ref="loginFormRef" :modelValue="loginInfo" :rules="loginRules">
        <uni-forms-item label="账号" name="user_account">
          <uni-easyinput type="text" v-model="loginInfo.user_account" placeholder="请输入账号" />
        </uni-forms-item>
        <uni-forms-item label="密码" name="user_password">
          <uni-easyinput type="password" v-model="loginInfo.user_password" placeholder="请输入密码" />
        </uni-forms-item>
        <uni-forms-item label="验证码" name="code">
          <view class="code">
            <uni-easyinput type="text" v-model="loginInfo.code" />
            <view class="code-img"><image :src="codeURL" mode="widthFix"></image></view>
          </view>
        </uni-forms-item>
      </uni-forms>
      <button type="primary" @click="login">登录</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
#login {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100rpx;

  .login-box {
    width: 90%;
    .code {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70rpx;

      .code-img {
        width: 40%;
        height: 70rpx;
        border: 1rpx solid gray;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
