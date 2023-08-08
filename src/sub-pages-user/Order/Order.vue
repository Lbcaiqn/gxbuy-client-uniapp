<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getOrderDataRequest, cancelOrderRequest } from "@/api";
import type { GetOrderDataRequestParameter } from "@/types";

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

// 初始化数据----------------------------------------------------------------
const orderList = ref<any>({
  all: { title: "全部订单", data: {}, page: 1 },
  wait_paid: { title: "待支付", data: {}, page: 1 },
  wait_shipped: { title: "待发货", data: {}, page: 1 },
  wait_receive: { title: "待收货", data: {}, page: 1 },
  wait_comment: { title: "待评论", data: {}, page: 1 }
});

const pageSize = ref(10);

const currentFeature = ref<any>("");

async function getOrderList(parameter: GetOrderDataRequestParameter) {
  try {
    if (orderList.value[parameter.feature].data.data) {
      if (
        pageSize.value <=
        Math.ceil(orderList.value[parameter.feature].data.total / orderList.value[parameter.feature].page)
      ) {
        const res = (await getOrderDataRequest(parameter)).data;
        orderList.value[parameter.feature].data.data = [...orderList.value[parameter.feature].data.data, ...res.data];
        orderList.value[parameter.feature].data.total = res.total;
        orderList.value[parameter.feature].page++;
      }
    } else {
      orderList.value[parameter.feature].data = (await getOrderDataRequest(parameter)).data;
      orderList.value[parameter.feature].page++;
    }
  } catch (err: any) {}
}

onLoad((query: any) => {
  currentFeature.value = ["all", "wait_paid", "wait_shipped", "wait_receive", "wait_comment"].includes(query.type)
    ? query.type
    : "all";

  for (const feature in orderList.value) {
    getOrderList({
      feature: feature,
      pageSize: pageSize.value,
      page: orderList.value[feature].page
    });
  }
});

// 上拉加载更多 ------------------------------------------------------------------------
const isPullUpLoading = ref(false);

async function pullUpLoad() {
  if (isPullUpLoading.value === false) {
    isPullUpLoading.value = true;
    await getOrderList({
      feature: currentFeature.value,
      pageSize: pageSize.value,
      page: orderList.value[currentFeature.value].page
    });

    isPullUpLoading.value = false;
  }
}

// 某个订单总价格，以及订单状态----------------------------------------------
function orderTotalPrice(data: Array<{ price: string; quantity: number }>) {
  return data
    .reduce((acc: number, item: any) => {
      return (acc += Number(item.price) * item.quantity);
    }, 0)
    .toFixed(2);
}

function orderState(state: string) {
  let str = "";

  if (state === "finish") str = "交易完成";
  else if (state === "wait_paid") str = "待付款";
  else if (state === "wait_shipped") str = "待发货";
  else if (state === "wait_receive") str = "待收货";
  else if (state === "wait_comment") str = "待评价";
  else if (state === "cancel") str = "交易取消";
  else if (state === "invalid") str = "无效订单";

  return str;
}

// 待付款的订单处理----------------------------------------------------------------

// 支付
function pay(orderId: string, totalPrice: number) {
  console.log(orderId);
  uni.navigateTo({
    url: `/sub-pages-user/Pay/Pay?orderIds=${[orderId]}&price=${totalPrice}`
  });
}

// 取消订单
async function cancelOrder(orderId: string, orderIndex: number) {
  try {
    const res = (await cancelOrderRequest([orderId])).data;
    orderList.value.wait_paid.data.data.splice(orderIndex, 1);
  } catch (err: any) {}
}
</script>

<template>
  <view class="order">
    <view class="controller">
      <view class="controller-item" v-for="(i, iIndex) in orderList" :key="iIndex" @click="currentFeature = iIndex">
        <view class="title" :class="{ active: currentFeature === iIndex }">{{ i.title }}</view>
      </view>
    </view>

    <view>
      <scroll-view
        scroll-y
        style="height: calc(100vh - 200rpx - var(--window-bottom)); width: 100%"
        :scroll-top="0"
        @scrolltolower="pullUpLoad"
      >
        <view class="order-container">
          <view class="order-item" v-for="(i, iIndex) in orderList[currentFeature].data.data" :key="i._id">
            <view class="order-item-goods" v-for="j in i.order_item" :key="j._id">
              <view class="shop">
                <view class="shop-info">
                  <view class="img"><image :src="baseURL + i.order_item[0].shop_logo" mode="widthFix"></image></view>
                  <view class="name">{{ i.order_item[0].shop_name }}</view>
                </view>
                <view class="order-state">{{ orderState(i.order_state) }}</view>
              </view>

              <view class="content">
                <view class="img"><image :src="j.goods_sku_img" mode="widthFix"></image></view>
                <view class="info">
                  <view class="name">{{ j.goods_spu_name }}</view>
                  <view class="sku">
                    分类: {{ j.sku_sales_attrs.reduce((res: string, item: any) => (res += item.value + ""), "") }}
                  </view>
                  <view class="price">
                    <view>×{{ j.quantity }}</view>
                    <view>￥{{ Number(j.goods_sku_price).toFixed(2) }}</view>
                  </view>
                </view>
              </view>
            </view>

            <view class="operate">
              <view class="total">
                总结: ￥{{
                  orderTotalPrice(
                    i.order_item.map((item: any) => {
                      return {
                        price: item.goods_sku_price,
                        quantity: item.quantity
                      };
                    })
                  )
                }}
              </view>
              <view class="btn">
                <view class="primary" v-if="i.order_state === 'finish'">追加评价</view>
                <view v-if="i.order_state === 'wait_paid'" @click="cancelOrder(i._id, iIndex)">取消订单</view>
                <view
                  class="primary"
                  v-if="i.order_state === 'wait_paid'"
                  @click="
                    pay(
                      i._id,
                      i.order_item.reduce(
                        (acc: number, item: any) => (acc += Number(item.quantity) * Number(item.goods_sku_price)),
                        0
                      )
                    )
                  "
                >
                  去支付
                </view>
                <view class="primary" v-if="i.order_state === 'wait_comment'">去评论</view>
              </view>
            </view>
          </view>
        </view>

        <PullUpLoading :isLoading="isPullUpLoading" />
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.order {
  .controller {
    display: flex;
    justify-self: space-around;
    align-items: center;
    width: 100%;
    height: 80rpx;
    background-color: #fff;

    .controller-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20%;

      .title {
        padding: 5rpx;
        font-size: 30rpx;
      }

      .active {
        color: $uni-color-primary;
        border-bottom: 5rpx solid $uni-color-primary;
      }
    }
  }

  .order-container {
    margin: 20rpx;

    .order-item {
      margin-bottom: 50rpx;

      .order-item-goods {
        .shop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20rpx 0;

          .shop-info {
            display: flex;
            align-items: center;
            .img {
              width: 40rpx;
              height: 40rpx;

              image {
                width: 100%;
                height: 100%;
                border-radius: 20rpx;
              }
            }

            .name {
              margin-left: 20rpx;
              font-size: 30rpx;
            }
          }

          .order-state {
            margin-right: 20rpx;
            color: $uni-color-primary;
            font-size: 30rpx;
          }
        }
        .content {
          display: flex;
          height: 200rpx;

          .img {
            width: 200rpx;
            height: 200rpx;

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
            margin: 0 15rpx;

            .name {
              margin-top: -3rpx;
              line-height: 1.2;
              font-size: 30rpx;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .sku {
              font-size: 30rpx;
              color: gray;
            }

            .price {
              display: flex;
              justify-content: space-between;
              margin: 10rpx 0;

              > view:first-child {
                font-size: 30rpx;
                color: gray;
              }

              > view:nth-child(2) {
                font-weight: bold;
                font-size: 35rpx;
                color: red;
              }
            }
          }
        }
      }

      .operate {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100rpx;

        .btn {
          display: flex;
          justify-content: right;

          > view {
            margin: 30rpx 20rpx 30rpx 0;
            padding: 20rpx;
            font-size: 30rpx;
            border: 2rpx solid #000;
            border-radius: 15rpx;
          }

          .primary {
            color: #fff;
            background-color: $uni-color-primary;
            border: 2rpx solid $uni-color-primary;
          }
        }
      }
    }
  }
}
</style>
