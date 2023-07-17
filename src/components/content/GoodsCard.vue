<script setup lang="ts">
import { ref } from "vue";

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

withDefaults(
  defineProps<{
    goods: {
      time: string | null;
      goods: any;
    }[];
    showShopInfo?: boolean;
    byTime?: boolean;
  }>(),
  {
    goods: () => {
      return [
        {
          time: null,
          goods: () => []
        }
      ];
    },
    showShopInfo: false,
    byTime: false
  }
);
</script>

<template>
  <view id="goods-card" v-if="goods.length !== 0">
    <view class="goods" v-for="(t, tIndex) in goods">
      <view class="goods-time" v-if="byTime">{{ t.time }}</view>
      <view class="goods-big-box">
        <view class="goods-item" v-for="(i, iIndex) in t.goods" :key="iIndex">
          <view class="goods-item-box">
            <view class="goods-item-img">
              <image :src="i.goods_spu_main_img" mode="widthFix"></image>
            </view>
            <view class="goods-item-content">
              <view class="goods-name">{{ i.goods_spu_name }}</view>
              <view class="goods-price">
                <view>￥{{ i.goods_first_sku_price }}</view>
                <view>{{ i.shop.shop_address }}</view>
              </view>
              <view class="goods-num">
                <view>销量 {{ i.goods_sku_total_sales }}</view>
                <view>收藏 {{ i.goods_spu_total_favorite }}</view>
              </view>
              <view class="goods-shop" v-if="showShopInfo">
                <view>
                  <image :src="baseURL + i.shop.shop_logo" mode="widthFix"></image>
                </view>
                <view>{{ i.shop.shop_name }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
#goods-card {
  .goods {
    .goods-time {
      height: 80rpx;
      line-height: 95rpx;
      font-size: 35rpx;
      border-bottom: 2rpx solid $uni-color-primary;
    }

    .goods-big-box {
      display: flex;
      justify-content: left;
      align-items: center;
      flex-wrap: wrap;

      .goods-item {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 50%;

        .goods-item-box {
          display: flex;
          justify-content: top;
          align-items: center;
          flex-direction: column;
          margin: 8rpx 0;
          width: 95%;
          cursor: pointer;
          border: 2rpx solid $uni-color-primary;
          border-radius: 20rpx;

          .goods-item-img {
            overflow: hidden;
            width: 100%;
            height: 345rpx;

            image {
              width: 100%;
              height: 100rpx;
              border-radius: 20rpx;
            }
          }

          .goods-item-content {
            margin-top: 12rpx;
            width: 92%;

            .goods-name {
              height: 65rpx;
              line-height: 1.3;
              font-size: 25rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .goods-price {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 10rpx;

              > view {
                font-size: 25rpx;
              }

              > view:first-child {
                font-weight: bold;
                font-size: 30rpx;
                color: red;
              }
            }

            .goods-num {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 15rpx 0;
              font-size: 25rpx;
              color: gray;
            }

            .goods-shop {
              display: flex;
              justify-content: left;
              align-items: center;
              margin: 20rpx 0;

              > view {
                height: 40rpx;
                line-height: 40rpx;
                font-size: 25rpx;
              }

              > view:first-child {
                margin-right: 20rpx;
                width: 40rpx;

                image {
                  width: 100%;
                  height: 30rpx;
                  border-radius: 15rpx;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
