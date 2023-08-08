<script setup lang="ts">
import { UserStore } from "@/store";

const userStore = UserStore();

async function logout() {
  userStore.gxbuy_uniapp_jwt = "";
  userStore.userInfo = {};
  userStore.toPath = "";
  uni.switchTab({ url: "/pages/Home/Home" });
}
</script>

<template>
  <view>
    <view class="setting">
      <view class="setting-item" @click="logout">退出登录</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.setting {
  margin: 20rpx;

  .setting-item {
    font-size: 35rpx;
  }
}
</style>
