<script setup lang="ts">
import { ref } from "vue";
import { UserStore } from "@/store";
import { getUserInfoRequest } from "@/api";

const userStore = UserStore();

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

const deskInfo = ref({
  buys: [
    {
      name: "待付款",
      numType: "order_total_wait_paid",
      toURL: "/sub-pages-user/Order/Order?type=wait_paid"
    },
    {
      name: "待发货",
      numType: "order_total_wait_shipped",
      toURL: "/sub-pages-user/Order/Order?type=wait_shipped"
    },
    {
      name: "待收获",
      numType: "order_total_wait_receive",
      toURL: "/sub-pages-user/Order/Order?type=wait_receive"
    },
    {
      name: "待评论",
      numType: "order_total_wait_comment",
      toURL: "/sub-pages-user/Order/Order?type=wait_comment"
    }
  ],
  card: [
    {
      name: "购物车",
      icon: "cart",
      toURL: "/pages/Shopcart/Shopcart"
    },

    {
      name: "我的收藏",
      icon: "star",
      toURL: "/sub-pages-user/UserDetail/UserDetail?type=favorite"
    },
    {
      name: "关注店铺",
      icon: "eye",
      toURL: "/sub-pages-user/UserDetail/UserDetail?type=follow"
    },
    {
      name: "买过的店",
      icon: "shop",
      toURL: "/sub-pages-user/UserDetail/UserDetail?type=buyed_shop"
    },
    {
      name: "浏览记录",
      icon: "info",
      toURL: "/sub-pages-user/UserDetail/UserDetail?type=browse_history"
    },
    {
      name: "设置",
      icon: "gear",
      toURL: "/sub-pages-user/Setting/Setting"
    }
  ]
});

async function init() {
  try {
    userStore.userInfo = (await getUserInfoRequest()).data;
  } catch (err: any) {
    console.log(err);
  }
}

init();

function toPage(url: string) {
  console.log(url);
  if (new RegExp("^\/pages\/").test(url)) uni.switchTab({ url });
  else uni.navigateTo({ url });
}
</script>

<template>
  <view v-if="JSON.stringify(userStore.userInfo) !== '{}'">
    <view class="user-info">
      <view class="user-img"><image :src="baseURL + userStore.userInfo.user_icon" mode="widthFix"></image></view>
      <view class="user-name">{{ userStore.userInfo.user_name }}</view>
    </view>

    <view class="user-desk">
      <view class="to-order" @click="toPage('/sub-pages-user/Order/Order?type=wait_shipped')">
        <view>我的订单</view>
        <uni-icons type="right" size="25"></uni-icons>
      </view>

      <view class="buys">
        <view class="buys-item" v-for="(i, iIndex) in deskInfo.buys" :key="iIndex" @click="toPage(i.toURL)">
          <view>{{ userStore.userInfo[i.numType] }}</view>
          <view>{{ i.name }}</view>
        </view>
      </view>
      <view class="card">
        <view class="card-item" v-for="(i, iIndex) in deskInfo.card" :key="iIndex" @click="toPage(i.toURL)">
          <view>
            <uni-icons :type="i.icon" size="40"></uni-icons>
          </view>
          <view>{{ i.name }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  background-color: $uni-color-primary;

  .user-img {
    width: 250rpx;
    height: 250rpx;
    border-radius: 125rpx;

    image {
      width: 100%;
      height: 100%;
      border-radius: 125rpx;
    }
  }

  .user-name {
    height: 80rpx;
    line-height: 80rpx;
    color: #fff;
    font-size: 35rpx;
  }
}

.user-desk {
  margin: 20rpx;

  .to-order {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 100rpx;
    padding: 0 30rpx;
    font-size: 35rpx;
  }

  .buys {
    display: flex;
    margin-top: 30rpx;

    .buys-item {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 25%;
      height: 100rpx;
      font-size: 35rpx;
    }
  }

  .card {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 50rpx;

    .card-item {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin: 30rpx 0;
      width: 30%;
      height: 150rpx;
      font-size: 35rpx;
    }
  }
}
</style>
