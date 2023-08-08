<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import {
  getGoodsDetailDataRequest,
  getGoodsCommentRequest,
  getGoodsByShopRequest,
  insertShopcartDataRequest,
  favoriteRequest
} from "@/api";
import type { GetGoodsByShopRequestParameter } from "@/types";

// 初始化 ----------------------------------------------------------------------------
const goodsData = ref<any>({});
const commentData = ref<any>({});
const goodsBannerImg = computed(
  () => goodsData.value.goods_img?.find((item: any) => item.goods_img_type === "banner")?.goods_img_list
);

const goodsByShopData = ref<any>({});
const goodsDetailImg = computed(
  () => goodsData.value.goods_img?.find((item: any) => item.goods_img_type === "detail")?.goods_img_list
);
const goodsByShopQuery = ref<GetGoodsByShopRequestParameter>({
  shopId: "",
  pageSize: 20,
  page: 1
});

async function getGoodsByShopData(parameter: GetGoodsByShopRequestParameter) {
  try {
    const res = (await getGoodsByShopRequest(parameter)).data;

    if (goodsByShopData.value.data) {
      goodsByShopData.value.total = res.total;
      goodsByShopData.value.data = [...goodsByShopData.value.data, ...res.data];
    } else goodsByShopData.value = res;
  } catch (err: any) {}
}

async function init(spuId: string) {
  try {
    goodsData.value = (await getGoodsDetailDataRequest(spuId)).data;
    commentData.value = (
      await getGoodsCommentRequest({
        goodsSpuId: goodsData.value._id,
        pageSize: 2,
        page: 1
      })
    ).data;

    goodsByShopQuery.value.shopId = goodsData.value.shop._id;
    await getGoodsByShopData(goodsByShopQuery.value);

    if (goodsData.value.isFavorite) {
      goodsTabBarData.value.options[1].icon = "star-filled";
      goodsTabBarData.value.options[1].infoBackgroundColor = "red";
    }

    goodsData.value.shop.isFollow = goodsData.value.isFollow;
  } catch (err: any) {}
}

onLoad((query: any) => {
  init(query.spuId);
});

// 放大图片 ----------------------------------------------------------------
function previewImage(index: number, type: "banner" | "detail") {
  const urls =
    type === "banner"
      ? goodsBannerImg.value?.map((item: any) => item.url) || []
      : type === "detail"
      ? goodsDetailImg.value?.map((item: any) => item.url) || []
      : [];

  uni.previewImage({
    current: index,
    urls
  });
}

// tabbar ------------------------------------------------------------------------
const goodsTabBarData = ref<any>({
  options: [
    { icon: "shop", text: "店铺" },
    { icon: "star", text: "收藏", infoBackgroundColor: "#fff" },
    { icon: "cart", text: "购物车", info: 1 }
  ],
  buttonGroip: [
    { text: "加入购物车", backgroundColor: "red", color: "Efff" },
    { text: "立即购买", backgroundColor: "ffa200", color: "Efff" }
  ]
});

async function optionsClick(e: any) {
  if (e.content.text == "收藏") {
    try {
      await favoriteRequest(goodsData.value._id);
      if (goodsData.value.isFavorite) {
        goodsTabBarData.value.options[1].icon = "star";
        goodsTabBarData.value.options[1].infoBackgroundColor = "#fff";
      } else {
        goodsTabBarData.value.options[1].icon = "star-filled";
        goodsTabBarData.value.options[1].infoBackgroundColor = "red";
      }
    } catch (err: any) {}
  } else if (e.content.text == "购物车") {
    uni.switchTab({
      url: "/pages/Shopcart/Shopcart"
    });
  }
}

async function buttonClick(e: any) {
  if (e.content.text == "加入购物车") {
    const insertInfo = {
      goods_spu_id: goodsData.value._id,
      goods_sku_id: goodsData.value.goods_sku[0]._id,
      shop_id: goodsData.value.shop._id,
      quantity: 1
    };

    try {
      const res = (await insertShopcartDataRequest(insertInfo)).data;
      console.log(res);
    } catch (err: any) {}
  } else if (e.content.text == "立即购买" && goodsData.value._id) {
    uni.navigateTo({
      url: `/sub-pages-user/ConfirmOrder/ConfirmOrder?fromGoods=${goodsData.value.goods_sku[0]._id}&quantity=1`
    });
  }
}

// 查看更多评论 -----------------------------------------------------------------
function toGoodsComment() {
  uni.navigateTo({
    url: `/sub-pages-goods/GoodsComment/GoodsComment?spuId=${goodsData.value._id}`
  });
}

// 上拉加载更多商品 ---------------------------------------------------------------
const isPullUpLoading = ref(false);

async function pullUpLoad() {
  if (
    !isPullUpLoading.value &&
    goodsByShopQuery.value.page! < Math.ceil(commentData.value.total / goodsByShopQuery.value.pageSize!)
  ) {
    goodsByShopQuery.value.page!++;
    isPullUpLoading.value = true;
    await getGoodsByShopData(goodsByShopQuery.value);
    isPullUpLoading.value = false;
  }
}
</script>

<template>
  <view id="goods-detail" v-if="JSON.stringify(goodsData) !== '{}'">
    <scroll-view scroll-y style="height: calc(88vh - var(--window-bottom)); width: 100%" @scrolltolower="pullUpLoad">
      <view class="goods-swiper">
        <swiper
          v-if="goodsBannerImg?.length !== 0"
          autoplay
          circular
          :interval="4000"
          style="height: 750rpx; width: 100%"
        >
          <swiper-item
            class="image-box"
            v-for="(i, iIndex) in goodsBannerImg"
            :key="i._id"
            style="height: 750rpx; width: 100%"
          >
            <image :src="i.url" mode="widthFix" @click="previewImage(iIndex, 'banner')"></image>
          </swiper-item>
        </swiper>
      </view>

      <view class="goods-message">
        <view class="goods-price">￥{{ Number(goodsData.goods_first_sku_price)?.toFixed(2) || 0 }}</view>

        <view class="goods-title">{{ goodsData.goods_spu_name }}</view>

        <view class="goods-num">
          <view class="goods-num-item">销量: {{ goodsData.goods_sku_total_sales }}</view>
          <view class="goods-num-item">库存: {{ goodsData.goods_sku_total_stock }}</view>
          <view class="goods-num-item">收藏: {{ goodsData.goods_spu_total_favorite }}</view>
        </view>

        <view class="goods-desk">
          <view class="goods-desk-address">
            <view class="goods-desk-icon"><uni-icons type="map" size="30"></uni-icons></view>
            <view class="goods-desk-content">
              <view>{{ goodsData.shop.shop_address }} - 免运费</view>
              <view>未选择收货地址</view>
            </view>
            <view class="goods-desk-icon"><uni-icons type="right" size="30"></uni-icons></view>
          </view>

          <view class="goods-desk-sku">
            <view class="goods-desk-icon"><uni-icons type="gift" size="30"></uni-icons></view>
            <view class="goods-desk-content">
              <view>选择颜色分类</view>
            </view>
            <view class="goods-desk-icon"><uni-icons type="right" size="30"></uni-icons></view>
          </view>
        </view>
      </view>

      <view class="goods-comment" v-if="JSON.stringify(commentData) !== '{}'">
        <view class="floor goods-comment-title" @click="toGoodsComment">
          <view>{{ `评价(${commentData.total > 99 ? "99+" : commentData.template})` }}</view>
          <view><uni-icons type="right" size="30"></uni-icons></view>
        </view>
        <GoodsCommentBox class="goods-comment-item" v-for="i in commentData.data" :key="i._id" :commentData="i" />
      </view>

      <view class="shop-info">
        <ShopInfo :shopData="goodsData.shop" @follow="goodsData.shop.isFollow = !goodsData.shop.isFollow" />
      </view>

      <view class="goods-detail" v-if="goodsDetailImg?.length !== 0">
        <view class="floor">商品详情</view>
        <image
          v-for="(i, iIndex) in goodsDetailImg"
          :key="i._id"
          :src="i.url"
          @click="previewImage(iIndex, 'detail')"
        ></image>
      </view>

      <view class="goods-by-shop">
        <view class="floor">本店推荐</view>
        <GoodsCard :goods="[{ time: null, goods: goodsByShopData.data }]" :showShopInfo="true" />
      </view>

      <PullUpLoading :isLoading="isPullUpLoading" />
    </scroll-view>

    <view class="goods-tab-bar">
      <uni-goods-nav
        :fill="true"
        :options="goodsTabBarData.options"
        :buttonGroup="goodsTabBarData.buttonGroup"
        @click="optionsClick"
        @buttonClick="buttonClick"
      ></uni-goods-nav>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.floor {
  margin: 20rpx 0;
  font-size: 40rpx;
}
.goods-swiper {
  height: 750rpx;
  .image-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 750rpx;
  }

  image {
    width: 100%;
  }
}
.goods-message {
  padding: 20rpx;

  .goods-title {
    display: flex;
    margin-top: 20rpx;
    line-height: 1.2;
    font-size: 35rpx;
    font-weight: bold;
  }
  .goods-price {
    margin-top: 20rpx;
    color: red;
    font-size: 50rpx;
    font-weight: bold;
  }

  .goods-num {
    display: flex;
    margin-top: 20rpx;

    .goods-num-item {
      margin-right: 40rpx;
      font-size: 30rpx;
      color: gray;
    }
  }

  .goods-desk {
    margin-top: 40rpx;

    .goods-desk-address,
    .goods-desk-sku {
      display: flex;
      align-items: center;
      margin: 20rpx 0;

      .goods-desk-icon {
        width: 10%;
        text-align: center;
      }

      .goods-desk-content {
        padding-left: 20rpx;
        width: 80%;

        view {
          font-size: 35rpx;
        }

        > view {
          margin: 10rpx 0;
        }
      }
    }
  }
}

.goods-comment {
  margin: 0 20rpx;

  .goods-comment-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    > view {
      display: flex;
      justify-content: center;
    }

    > view:nth-child(2) {
      width: 10%;
      text-align: center;
    }
  }

  .goods-comment-item {
    margin-bottom: 50rpx;
  }
}

.shop-info {
  margin: 20rpx;
}

.goods-detail {
  margin: 20rpx;
  margin-top: 100rpx;

  image {
    display: block;
    width: 100%;
  }
}

.goods-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6vh;
}

.goods-by-shop {
  margin: 20rpx;
  margin-top: 100rpx;
}
</style>
