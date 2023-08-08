<script setup lang="ts">
withDefaults(defineProps<{ goodsListData: any[] }>(), {
  goodsListData: () => []
});

function toGoodsDetail(spuId: string) {
  uni.navigateTo({
    url: `/sub-pages-goods/GoodsDetail/GoodsDetail?spuId=${spuId}`
  });
}
</script>

<template>
  <view class="goods-list" v-if="goodsListData.length !== 0">
    <view class="goods-list-item" v-for="i in goodsListData" :key="i._id" @click="toGoodsDetail(i._id)">
      <view class="goods-list-item-img">
        <image :src="i.goods_spu_main_img" mode="widthFix"></image>
      </view>
      <view class="goods-list-item-msg">
        <view class="goods-name">{{ i.goods_spu_name }}</view>
        <view class="goods-price">￥{{ Number(i.goods_first_sku_price).toFixed(2) }}</view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.goods-list {
  .goods-list-item {
    display: flex;
    margin: 30rpx 0;
    height: 180rpx;
    .goods-list-item-img {
      display: flex;
      align-items: center;
      width: 30%;
      overflow: hidden;

      image {
        width: 100%;
      }
    }
    .goods-list-item-msg {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 20rpx;
      width: 70%;

      .goods-name {
        margin-top: -6rpx;
        line-height: 1.2;
        font-size: 30rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .goods-price {
        height: 40rpx;
        line-height: 40rpx;
        font-weight: bold;
        font-size: 40rpx;
        color: red;
      }
    }
  }
}
</style>
