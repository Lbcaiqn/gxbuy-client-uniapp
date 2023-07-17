<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getBannerDataRequest, getRecommendDataRequest, getGoodsByFeatureRequest } from "@/api";
import MySearcher from "@/components/common/MySearcher.vue";
import GoodsCard from "@/components/content/GoodsCard.vue";
import PullUpLoading from "@/components/common/PullUpLoading.vue";
import type { GetGoodsByFeatureRequestParameter } from "@/types";

// 数据 ---------------------------------------------------------------------------
const bannerList = ref<any>([]);
const recommendList = ref<any>([]);
const featureGoodsList = reactive<any>({
  feature: {
    hot: [],
    new: [],
    pop: []
  },
  pages: {
    hot: 1,
    new: 1,
    pop: 1
  }
});

const current = ref<"hot" | "new" | "pop">("hot");
const controllerRef = ref<any>(null);
const controllerRefOffsetTop = ref(0);
const scrollTop = ref(0);

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

// 请求 ---------------------------------------------------------------------------
async function getGoodsByFeature(parameter: GetGoodsByFeatureRequestParameter) {
  try {
    featureGoodsList.feature[parameter.feature] = [
      ...featureGoodsList.feature[parameter.feature],
      ...(await getGoodsByFeatureRequest(parameter)).data
    ];
  } catch (err: any) {}
}

onLoad(async () => {
  try {
    bannerList.value = (await getBannerDataRequest()).data;
    recommendList.value = (await getRecommendDataRequest()).data;
    await getGoodsByFeature({ feature: "hot", pageSize: 30, page: 1 });
    await getGoodsByFeature({ feature: "new", pageSize: 30, page: 1 });
    await getGoodsByFeature({ feature: "pop", pageSize: 30, page: 1 });
    await nextTick();
    controllerRefOffsetTop.value = controllerRef.value.$el.offsetTop;
  } catch (err: any) {}
});

// 切换商品 ---------------------------------------------------------------------------
function changeControll(type: "hot" | "new" | "pop") {
  current.value = type;

  if (controllerRef.value.$el.offsetTop >= controllerRefOffsetTop.value) {
    scrollTop.value =
      scrollTop.value === controllerRefOffsetTop.value
        ? controllerRefOffsetTop.value + 0.01
        : controllerRefOffsetTop.value;
  }
}

// 上拉加载更多 ---------------------------------------------------------------------------
const isPullUpLoading = ref(false);

async function pullUpLoad() {
  if (isPullUpLoading.value === false && featureGoodsList.pages[current.value] < 5) {
    isPullUpLoading.value = true;
    getGoodsByFeature({ feature: current.value, pageSize: 30, page: ++featureGoodsList.pages[current.value] });
    isPullUpLoading.value = false;
  }
}
</script>

<template>
  <view id="home">
    <MySearcher />
    <scroll-view scroll-y style="height: 95vh; width: 100%" :scroll-top="scrollTop" @scrolltolower="pullUpLoad">
      <view>
        <swiper class="swiper" v-if="bannerList.length !== 0" autoplay circular interval="4000">
          <swiper-item class="swiper-item" v-for="i in bannerList" :key="i._id">
            <navigator :url="'/packageA/GoodsDetail/GoodsDetail?goods_id=' + i.goods_id" :open-type="i.open_type">
              <image :src="baseURL + i.img" mode="widthFix"></image>
            </navigator>
          </swiper-item>
        </swiper>
      </view>

      <view class="recommend-area" v-if="recommendList.length !== 0">
        <view class="recommend-area-item" v-for="i in recommendList" :key="i._id">
          <view class="recommend-area-item-title">{{ i.name }}</view>

          <view class="recommend-area-item-content">
            <view class="left">
              <navigator :url="`/sub-pages-goods/SearchResult/SearchResult?keyword=${i.keyword}`" open-type="navigate">
                <image :src="baseURL + i.img" mode="widthFix"></image>
              </navigator>
            </view>

            <view class="right">
              <view class="right-item" v-for="j in i.children" :key="j._id">
                <navigator
                  :url="`/sub-pages-goods/SearchResult/SearchResult?keyword=${i.keyword}`"
                  open-type="navigate"
                >
                  <image :src="baseURL + j.img" mode="aspectFile"></image>
                </navigator>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="feature-goods">
        <view class="controller" ref="controllerRef">
          <view :class="{ active: current == 'hot' }" @click="changeControll('hot')">热门</view>
          <view :class="{ active: current == 'new' }" @click="changeControll('new')">新品</view>
          <view :class="{ active: current == 'pop' }" @click="changeControll('pop')">流行</view>
        </view>
        <view class="goods-list">
          <GoodsCard :goods="[{ time: null, goods: featureGoodsList.feature[current] }]" :showShopInfo="true" />
        </view>
      </view>

      <PullUpLoading :isLoading="isPullUpLoading" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.swiper {
  width: 100%;
  height: 340rpx;

  .swiper-item {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
    }
  }
}

.recommend-area {
  padding: 0 10rpx;
  .recommend-area-item {
    margin: 20rpx 0;

    .recommend-area-item-title {
      margin-bottom: 10rpx;
      height: 45rpx;
      font-size: 35rpx;
      border-bottom: 1rpx solid $uni-color-primary;
    }

    .recommend-area-item-content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 380rpx;

      .left {
        overflow: hidden;
        width: 32%;
        height: 380rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        width: 68%;
        height: 380rpx;
        display: flex;
        justify-content: space-around;
        align-content: space-around;
        flex-wrap: wrap;

        .right-item {
          overflow: hidden;
          width: 50%;
          height: 190rpx;

          image {
            width: 100%;
            height: 190rpx;
          }
        }
      }
    }
  }
}

.feature-goods {
  margin-top: 20rpx;
  padding: 0 10rpx;

  .controller {
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 9998;
    height: 80rpx;
    background-color: #fff;
    border-bottom: 2px solid $uni-color-primary;

    > view {
      margin: 0 50rpx;
      width: 120rpx;
      height: 50rpx;
      line-height: 50rpx;
      text-align: center;
      font-size: 35rpx;
      cursor: pointer;
    }

    .active {
      font-weight: bold;
      color: $uni-color-primary;
      border-bottom: 2px solid $uni-color-primary;
    }
  }
}
</style>
