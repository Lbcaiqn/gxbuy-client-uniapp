<script setup lang="ts">
import { UserStore } from "../../store/index.js";
const userStore = UserStore();

async function selectAddress() {
  const add = await uni.chooseAddress();
  console.log(add);
}
</script>

<template>
  <view class="user-address">
    <view class="select-address">
      <button type="primary" @click="selectAddress">选择收获地址 +</button>
    </view>

    <!-- <view class="address-message" v-else @click="selectAddress">
      <view>
        <view>{{ addressStore?.address?.userName }}</view>
        <view>
          {{ addressStore?.address?.telNumber }}
          <uni-icons type="right" :size="22"></uni-icons>
        </view>
      </view>
      <view>
        <view>{{ addressStore?.fullAddress }}</view>
      </view>
    </view> -->
  </view>
</template>

<style scoped lang="scss">
.user-address {
  border-bottom: 20rpx solid $uni-color-primary;

  .select-address {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20rpx;
    height: 120rpx;
  }

  .address-message {
    margin: 50rpx;
    font-size: 35rpx;

    > view:first-child {
      display: flex;
      justify-content: space-between;
      margin-bottom: 50rpx;
    }
  }
}
</style>
