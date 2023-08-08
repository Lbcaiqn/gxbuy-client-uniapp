<script setup lang="ts">
import { staticBaseURL } from "@/api/config";
import { followRequest } from "@/api";

const props = withDefaults(
  defineProps<{
    shopList: Array<any>;
  }>(),
  {
    shopList: () => []
  }
);

const emits = defineEmits(["cancelFollow"]);

async function cancelFollow(shopId: string, index: number) {
  try {
    await followRequest(shopId);
    // emits("cancelFollow", { index });
    props.shopList[index].cancelFollow = true;
  } catch (err: any) {}
}
</script>

<template>
  <view>
    <view class="shop-list-item" v-for="(i, iIndex) in shopList" :key="i._id">
      <view class="info">
        <view class="img"><image :src="staticBaseURL + i.shop_logo" mode="widthFix"></image></view>
        <view class="name">{{ i.shop_name }}</view>
      </view>
      <view class="follow" @click="cancelFollow(i._id, iIndex)">
        <uni-icons v-show="i.cancelFollow" type="plusempty" size="21" color="#fff"></uni-icons>
        {{ i.cancelFollow ? "关注" : "已关注" }}
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.shop-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30rpx 0;

  .info {
    display: flex;
    align-items: center;

    .img {
      width: 60rpx;
      height: 60rpx;

      image {
        width: 100%;
        height: 100%;
        border-radius: 30rpx;
      }
    }

    .name {
      margin-left: 20rpx;
      font-size: 35rpx;
    }
  }

  .follow {
    padding: 20rpx 0;
    width: 170rpx;
    text-align: center;
    font-size: 35rpx;
    color: #fff;
    background-color: $uni-color-primary;
    border: 2rpx solid $uni-color-primary;
    border-radius: 30rpx;
  }
}
</style>
