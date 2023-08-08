<script setup lang="ts">
import { ref } from "vue";
import { followRequest, getShopInfoDataRequest } from "@/api";

const props = withDefaults(
  defineProps<{
    shopData: any;
  }>(),
  {
    shopData: () => {
      return {};
    }
  }
);

const emits = defineEmits(["follow"]);

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

async function follow() {
  try {
    await followRequest(props.shopData._id);
    emits("follow", { shopId: props.shopData._id });
  } catch (err: any) {}
}
</script>

<template>
  <view class="shop-info" v-if="JSON.stringify(shopData) !== '{}'">
    <view class="shop-info-img">
      <image :src="baseURL + shopData.shop_logo" mode="widthFix"></image>
    </view>
    <view class="shop-info-msg">
      <view class="shop-info-msg-name">
        <view>{{ shopData.shop_name }}</view>
        <button type="primary" @click="follow">
          <uni-icons v-show="!shopData.isFollow" type="plusempty" size="12" color="#fff"></uni-icons>
          {{ shopData.isFollow ? "已关注" : "关注" }}
        </button>
      </view>
      <view class="shop-info-msg-level">
        <view>商品描述: {{ shopData.describe_level }}</view>
        <view>商家服务: {{ shopData.service_level }}</view>
        <view>物流服务: {{ shopData.logistics_level }}</view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.shop-info {
  display: flex;
  height: 142rpx;
  .shop-info-img {
    width: 20%;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .shop-info-msg {
    display: flex;
    width: 80%;

    .shop-info-msg-name {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 60%;
      font-size: 35rpx;

      > view:first-child {
        font-weight: bold;
      }

      button {
        width: 50%;
        height: 50rpx;
        line-height: 50rpx;
        font-size: 25rpx;
        color: #fff;
        background-color: $uni-color-primary;
      }
    }

    .shop-info-msg-level {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 40%;

      > view {
        color: green;
        font-size: 30rpx;
      }
    }
  }
}
</style>
