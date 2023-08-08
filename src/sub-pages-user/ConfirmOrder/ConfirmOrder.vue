<script setup lang="ts">
import { ref, computed } from "vue";
import {
  getUserAddressRequest,
  getConfirmOrderDataRequest,
  createOrderByIdRequest,
  createOrderByShopcartRequest
} from "@/api";
import { staticBaseURL } from "@/api/config";
import { onLoad } from "@dcloudio/uni-app";

// 初始化数据--------------------------------------------------------------------
const userAddress = ref<any>([]);

const goodsList = ref<any>([]);

const orderQuery = ref<any>({});

async function init(query: any) {
  try {
    userAddress.value = (await getUserAddressRequest()).data;
  } catch (err: any) {}

  const options = query.fromGoods
    ? { from: "goods", goodsSkuId: query.fromGoods }
    : query.fromShopcart
    ? { from: "shopcart" }
    : null;

  if (!options) return;

  try {
    goodsList.value = (await getConfirmOrderDataRequest(options)).data;
  } catch (err: any) {}

  if (query.fromGoods) goodsList.value[0].goods[0].quantity = query.quantity;
}

onLoad((query: any) => {
  query.fromShopcart = JSON.parse(query.fromShopcart);

  orderQuery.value = query;
  init(query);
});

// 总价格------------------------------------------------------------------------------
const totalPrice = computed(() => {
  return (
    goodsList.value.reduce((sum: Number, item: any) => {
      return (sum +=
        item.goods.reduce((subSum: number, subItem: any) => {
          return (subSum += Number(subItem.goods_sku.goods_sku_price) * subItem.quantity);
        }, 0) || 0);
    }, 0) || 0
  ).toFixed(2);
});

// 支付------------------------------------------------------------------------------
const isPaying = ref<boolean>(false);

async function pay() {
  isPaying.value = true;

  if (orderQuery.value.fromGoods) {
    try {
      const orderId = (
        await createOrderByIdRequest({
          goodsSkuId: orderQuery.value.fromGoods as string,
          quantity: Number(orderQuery.value.quantity),
          shopId: goodsList.value[0].shop._id
        })
      ).data;

      uni.redirectTo({
        url: `/sub-pages-user/Pay/Pay?orderIds=${orderId}&price=${totalPrice.value}`
      });
    } catch (err: any) {
      isPaying.value = false;
    }
  } else if (orderQuery.value.fromShopcart) {
    try {
      if (typeof orderQuery.value.fromShopcart === "string")
        orderQuery.value.fromShopcart = [orderQuery.value.fromShopcart];

      const orderIds = (await createOrderByShopcartRequest(orderQuery.value.fromShopcart as Array<string>)).data;

      uni.redirectTo({
        url: `/sub-pages-user/Pay/Pay?orderIds=${orderIds}&price=${totalPrice.value}`
      });
    } catch (err: any) {
      console.log(err);
      isPaying.value = false;
    }
  }

  isPaying.value = false;
}
</script>

<template>
  <view class="confirm-order" v-if="goodsList.length !== 0">
    <view class="user-address">
      <view>
        <view>{{ userAddress[0].name }}</view>
        <view>{{ userAddress[0].phone }}</view>
      </view>
      <view>{{ userAddress[0].area + userAddress[0].detail }}</view>
    </view>

    <view class="goods-list-container">
      <view class="shop-item" v-for="(i, iIndex) in goodsList" :key="iIndex">
        <view class="shop-info">
          <view class="img"><image :src="staticBaseURL + i.shop.shop_logo" mode="widthFix"></image></view>
          <view class="name">{{ i.shop.shop_name }}</view>
        </view>

        <view class="goods-item" v-for="g in i.goods" :key="g._id">
          <view class="img"><image :src="g.goods_sku.goods_sku_img" mode="widthFix"></image></view>
          <view class="info">
            <view class="name">{{ g.goods_spu.goods_spu_name }}</view>
            <view class="sku">默认</view>
            <view class="price">
              <view>×{{ g.quantity }}</view>
              <view>￥{{ Number(g.goods_sku_price).toFixed(2) }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="sum">
      <view>
        <view>合计:</view>
        <view class="total-price">{{ totalPrice }}</view>
      </view>
    </view>

    <button type="primary" style="margin-top: 100rpx; color: #fff" @click="pay">去支付</button>
  </view>
</template>

<style lang="scss" scoped>
.confirm-order {
  margin: 20rpx;

  .user-address {
    margin-bottom: 50rpx;
    font-size: 35rpx;
    border-bottom: 10rpx solid $uni-color-primary;

    > view {
      margin: 20rpx 0;
    }

    > view:first-child {
      display: flex;

      > view:first-child {
        margin-right: 30rpx;
      }
    }
  }

  .goods-list-container {
    .shop-item {
      .shop-info {
        display: flex;
        align-items: center;

        .img {
          width: 50rpx;
          height: 50rpx;

          image {
            width: 100%;
            height: 100%;
            border-radius: 25rpx;
          }
        }

        .name {
          margin-left: 20rpx;
          font-size: 35rpx;
        }
      }
    }

    .goods-item {
      display: flex;
      margin: 20rpx 0;

      .img {
        width: 250rpx;
        height: 250rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 20rpx;

        .name {
          margin-top: -3rpx;
          line-height: 1.5;
          font-size: 35rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .sku {
          color: gray;
          font-size: 30rpx;
        }

        .price {
          display: flex;
          justify-content: space-between;
          align-items: center;

          > view:nth-child(2) {
            color: red;
            font-size: 40rpx;
            font-weight: bold;
          }
        }
      }
    }
  }

  .sum {
    margin-top: 50rpx;

    > view {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30rpx 0;
      font-size: 40rpx;

      .total-price {
        color: red;
        font-weight: bold;
      }
    }
  }
}
</style>
