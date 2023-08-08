<script setup lang="ts">
import { ref } from "vue";
import { getPayStateRequest, completePayRequest } from "@/api";
import { onLoad } from "@dcloudio/uni-app";

const isPayed = ref(false);
const isFinish = ref(false);
const isPaying = ref(false);
const orderIds = ref<Array<string>>([]);
const price = ref("");

async function init(orderIds: Array<string>) {
  console.log(orderIds);
  try {
    isPayed.value = (await getPayStateRequest(orderIds)).data;
  } catch (err: any) {
    console.log(err);
  }
}

onLoad((query: any) => {
  price.value = query.price;

  if (typeof query.orderIds === "string") orderIds.value = [query.orderIds];
  else orderIds.value = query.orderIds;

  init(orderIds.value);
});

async function pay() {
  isPaying.value = true;
  try {
    const res = (await completePayRequest(orderIds.value)).data;

    isFinish.value = true;
  } catch (err: any) {}
  isPaying.value = false;

  uni.navigateTo({
    url: "/sub-pages-user/Order/Order"
  });
}
</script>

<template>
  <view class="phone-pay" v-if="!isPayed">
    <view v-if="!isFinish">
      <view class="pay-text">这只是模拟支付，并不会真的扣钱</view>
      <view class="pay-text" style="font-weight: bold">￥{{ Number(price)?.toFixed(2) }}</view>
      <button type="primary" style="width: 700rpx" :loading="isPaying" @click="pay">
        {{ !isPaying ? "支付" : "请稍等" }}
      </button>
    </view>

    <view v-else>
      <view class="pay-text" style="font-weight: bold">支付成功！</view>
    </view>
  </view>

  <view class="phone-pay" v-else style="font-weight: bold">该订单已支付，请勿重复支付</view>
</template>

<style lang="scss" scoped>
.phone-pay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  font-size: 35rpx;

  > view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .pay-text {
    margin-bottom: 5vw;
    width: 90vw;
    text-align: center;
    font-size: 6vw;
  }
}
</style>
