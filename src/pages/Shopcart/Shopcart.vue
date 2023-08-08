<script setup lang="ts">
import { ref, computed } from "vue";
import {
  getShopcartDataRequest,
  updateSingleStateRequest,
  updateAllSelectedRequest,
  deleteSingleRequest,
  deleteAllRequest
} from "@/api";
import { throttle } from "@/tools/lodash";
import { onLoad } from "@dcloudio/uni-app";

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

const shopcartData = ref<any>({});

// 初始化数据----------------------------------------------------------------------
async function init() {
  try {
    shopcartData.value = (await getShopcartDataRequest()).data;
    console.log(shopcartData.value);
  } catch (err: any) {}
}

onLoad(() => {
  init();
});

// 统计总价,判断是否全选-------------------------------------------------------------
const totalPrice = computed(() => {
  let total = 0;

  for (let index in shopcartData.value.data) {
    total += shopcartData.value.data[index].goods
      .filter((g: any) => g.selected)
      .reduce((acc: number, g: any) => acc + g.quantity * g.goods_sku.goods_sku_price, 0);
  }

  return total;
});

const allIsSelected = computed(() => {
  let selectedOrCancel = true;
  for (let index in shopcartData.value.data) {
    if (shopcartData.value.data[index].goods.find((i: any) => !i.selected)) {
      selectedOrCancel = false;
      break;
    }
  }
  return selectedOrCancel;
});

function shopIsSelected(shopIndex: number) {
  return !shopcartData.value.data[shopIndex].goods.find((i: any) => !i.selected);
}

// 修改数量和选中状态------------------------------------------------------------------------
// 修改数量
const countUpdate = throttle(async (count: number, goods_sku_id: string, shopIndex: number, goodsIndex: number) => {
  try {
    updateSingleStateRequest({ command: "quantity", goods_sku_id, quantity: count });
    shopcartData.value.data[shopIndex].goods[goodsIndex].quantity = count;
  } catch (err: any) {}
}, 100);

// 修改单个商品选中状态
const selectedUpdate = throttle(async (goods_sku_id: string, shopIndex: number, goodsIndex: number) => {
  try {
    updateSingleStateRequest({ command: "selected", goods_sku_id });

    shopcartData.value.data[shopIndex].goods[goodsIndex].selected =
      !shopcartData.value.data[shopIndex].goods[goodsIndex].selected;
  } catch (err: any) {}
}, 100);

// 修改单个商家的所有商品选中状态
const selectedShopUpdate = throttle(async (shop_id: string, shopIndex: number) => {
  const selectedOrCancel = !shopIsSelected(shopIndex);

  try {
    updateAllSelectedRequest({ command: "shop", selectedOrCancel: selectedOrCancel, shop_id });
    for (const i of shopcartData.value.data[shopIndex].goods) i.selected = selectedOrCancel;
  } catch (err: any) {}
}, 100);

// 全选
const selectedAllUpdate = throttle(async () => {
  const selectedOrCancel = !allIsSelected.value;

  try {
    updateAllSelectedRequest({ command: "all", selectedOrCancel: selectedOrCancel });

    for (let index in shopcartData.value.data) {
      for (let g of shopcartData.value.data[index].goods) g.selected = selectedOrCancel;
    }
  } catch (err: any) {}
}, 100);

// 删除数据---------------------------------------------------------------------
// 删除单个
async function deleteSingle(shopIndex: number, goodsIndex: number) {
  const goods_sku_id = shopcartData.value.data[shopIndex].goods[goodsIndex].goods_sku._id;

  try {
    await deleteSingleRequest(goods_sku_id);

    shopcartData.value.data[shopIndex].goods.splice(goodsIndex, 1);
    if (shopcartData.value.data[shopIndex].goods.length === 0) shopcartData.value.data.splice(shopIndex, 1);
  } catch (err: any) {}
}

// 清空购物车
async function deleteAll() {
  try {
    await deleteAllRequest();
    shopcartData.value = {};
  } catch (err: any) {}
}

// 结算
function buy() {
  const isSelectedGoods = shopcartData.value.data.reduce((ids: string[], shop: any) => {
    return [...ids, ...shop.goods.filter((scItem: any) => scItem.selected).map((scItem: any) => scItem._id)];
  }, []);

  if (isSelectedGoods.length === 0) return;

  // router.push({
  //   path: "/confirmOrder",
  //   query: {
  //     fromShopcart: isSelectedGoods
  //   }
  // });
}

const deleteOptions = ref([
  {
    text: "删除",
    style: {
      backgroundColor: "red"
    }
  }
]);

function toGoodsDetail(spuId: string) {
  uni.navigateTo({
    url: `/sub-pages-goods/GoodsDetail/GoodsDetail?spuId=${spuId}`
  });
}

// 结算 -------------------------------------------------------------------------
function buying() {
  const isSelectedGoods = shopcartData.value.data.reduce((ids: string[], shop: any) => {
    return [...ids, ...shop.goods.filter((scItem: any) => scItem.selected).map((scItem: any) => scItem._id)];
  }, []);

  if (isSelectedGoods.length === 0) return;

  uni.navigateTo({
    url: `/sub-pages-user/ConfirmOrder/ConfirmOrder?fromShopcart=${JSON.stringify(isSelectedGoods)}`
  });
}
</script>

<template>
  <view>
    <view class="shopcart" v-if="shopcartData?.data?.length !== 0">
      <view class="shopcart-list">
        <view class="shopcart-list-item" v-for="(s, sIndex) in shopcartData.data" :key="sIndex">
          <view class="shop-info">
            <view class="selected" @click="selectedShopUpdate(s.shop._id, sIndex)">
              <view class="selected-radio" :class="{ 'selected-radio-active': shopIsSelected(sIndex) }">
                {{ shopIsSelected(sIndex) ? "√" : "" }}
              </view>
            </view>
            <view class="shop-info-img"><image :src="baseURL + s.shop.shop_logo" mode="widthFix"></image></view>
            <view class="shop-info-name">{{ s.shop.shop_name }}</view>
          </view>
          <uni-swipe-action>
            <uni-swipe-action-item
              v-for="(g, gIndex) in s.goods"
              :key="g._id"
              :right-options="deleteOptions"
              @click="deleteSingle(sIndex, gIndex)"
            >
              <view class="goods-list">
                <view class="selected" @click="selectedUpdate(g.goods_sku._id, sIndex, gIndex)">
                  <view class="selected-radio" :class="{ 'selected-radio-active': g.selected }">
                    {{ g.selected ? "√" : "" }}
                  </view>
                </view>
                <view class="content">
                  <view class="content-img" @click="toGoodsDetail(g.goods_spu._id)">
                    <image v :src="g.goods_sku.goods_sku_img" mode="widthFix"></image>
                  </view>
                  <view class="content-msg">
                    <view class="name" @click="toGoodsDetail(g.goods_spu._id)">{{ g.goods_spu.goods_spu_name }}</view>
                    <view class="price-and-sum">
                      <view class="price">￥ {{ Number(g.goods_sku.goods_sku_price).toFixed(2) }}</view>
                      <view class="sum">
                        <uni-number-box
                          @change="countUpdate($event, g.goods_sku._id, sIndex, gIndex)"
                          :min="1"
                          :value="g.quantity"
                        ></uni-number-box>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </uni-swipe-action-item>
          </uni-swipe-action>
        </view>
      </view>

      <view class="buy">
        <view class="buy-box">
          <view class="selected" @click="selectedAllUpdate">
            <view class="selected-radio" :class="{ 'selected-radio-active': allIsSelected }">
              {{ allIsSelected ? "√" : "" }}
            </view>
          </view>
          <view class="radio-text">全选</view>
          <view class="price">总计：￥{{ totalPrice.toFixed(2) }}</view>
          <view class="to-buy" @click="buying">支付</view>
        </view>
      </view>
    </view>

    <view class="null-shopcart" v-else>
      <view class="null-shopcart-image">
        <view><image src="@/static/none/none_shopcart.png" mode="widthFix"></image></view>
      </view>
      <view class="null-shopcart-text">购物车还没有商品，快去选购吧！</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.shopcart-list {
  margin: 20rpx;
  margin-bottom: 96rpx;

  .shopcart-list-item {
    margin: 20rpx 0 50rpx 0;

    .selected {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50rpx;

      .selected-radio {
        width: 50rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        color: #fff;
        border: 1rpx solid $uni-color-primary;
      }

      .selected-radio-active {
        background-color: $uni-color-primary;
      }
    }

    .shop-info {
      display: flex;
      align-items: center;
      height: 80rpx;

      .shop-info-img {
        margin-left: 30rpx;
        width: 50rpx;
        height: 50rpx;

        image {
          width: 100%;
          height: 100%;
          border-radius: 25rpx;
        }
      }

      .shop-info-name {
        margin-left: 20rpx;
        font-size: 35rpx;
      }
    }

    .goods-list {
      display: flex;
      margin-bottom: 30rpx;
      height: 200rpx;
      .content {
        display: flex;
        align-items: center;
        margin-left: 30rpx;

        .content-img {
          width: 200rpx;
          height: 200rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .content-msg {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          padding: 0 15rpx;
          width: 440rpx;
          height: 200rpx;
          box-sizing: border-box;

          .name {
            line-height: 1.2;
            font-size: 30rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .price-and-sum {
            display: flex;
            justify-content: space-between;
            align-items: center;

            width: 410rpx;

            .price {
              font-size: 40rpx;
              font-weight: bold;
              color: red;
            }
          }
        }
      }
    }
  }
}

.buy {
  position: fixed;
  // bottom: 96rpx;
  bottom: var(--window-bottom);
  left: 0;
  right: 0;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  font-size: 35rpx;
  border-top: 1px solid $uni-color-primary;
  background-color: #fff;

  .buy-box {
    display: flex;
    align-items: center;
    margin: 0 20rpx;

    .selected {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50rpx;

      .selected-radio {
        width: 50rpx;
        height: 50rpx;
        line-height: 50rpx;
        text-align: center;
        color: #fff;
        border: 1rpx solid $uni-color-primary;
      }

      .selected-radio-active {
        background-color: $uni-color-primary;
      }
    }

    .radio-text {
      margin-left: 20rpx;
    }
    .price {
      flex: 1;
      font-weight: bold;
      color: red;
    }
    .to-buy {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 120rpx;
      height: 70rpx;
      color: #fff;
      background-color: $uni-color-primary;
      border-radius: 10rpx;
      border: 1rpx solid $uni-color-primary;
    }
  }
}
@media (prefers-color-scheme: dark) {
  .buy {
    background: #000;
    .radio-text {
      color: #fff;
    }
  }
}

.null-shopcart {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  font-size: 5vw;
  text-align: center;
  image {
    width: 100%;
  }
  .null-shopcart-image {
    display: flex;
    justify-content: center;
    align-items: center;
    > view {
      width: 50%;
    }
  }
  .null-shopcart-text {
    margin-top: 5vw;
  }
}
</style>
