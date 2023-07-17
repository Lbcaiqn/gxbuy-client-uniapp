<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getCategoryDataRequest } from "@/api";

// 数据 ---------------------------------------------------------------------------
const categoryList = ref<any>([]);
const isActive = ref(0);
const scrollTop = ref(0);

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

// 请求 ---------------------------------------------------------------------------
onLoad(async () => {
  try {
    categoryList.value = (await getCategoryDataRequest()).data;
  } catch (err: any) {}
});

// 切换一级分类 ---------------------------------------------------------------------------
function activeChange(i: number) {
  if (isActive.value !== i) {
    isActive.value = i;
    scrollTop.value = scrollTop.value === 0 ? 0.01 : 0;
  }
}

// 搜索商品 ---------------------------------------------------------------------------
function toSearchResult(c3id: string) {
  uni.navigateTo({
    url: `/sub-pages-goods/SearchResult/SearchResult?c3id=${c3id}`
  });
}
</script>

<template>
  <view id="Classification">
    <view class="scroll-area" v-if="categoryList.length !== 0">
      <scroll-view class="scroll-left" scroll-y style="height: 100vh; width: 25%">
        <view
          class="scroll-left-item"
          :class="{ active: isActive === iIndex }"
          v-for="(i, iIndex) in categoryList"
          :key="i._id"
          @click="activeChange(iIndex)"
        >
          {{ i.cat_name }}
        </view>
      </scroll-view>

      <scroll-view class="scroll-right" scroll-y :scroll-top="scrollTop" style="height: 100vh; width: 75%">
        <view class="second-cat" v-for="i in categoryList[isActive]?.children" :key="i._id">
          <view class="title">{{ i.cat_name }}</view>
          <view class="third-cat">
            <view class="cat" v-for="j in i.children" :key="j._id" @click="toSearchResult(j._id)">
              <view class="cat-icon"><image :src="baseURL + j.cat_icon" mode="widthFix"></image></view>
              <view class="cat-name">{{ j.cat_name }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.scroll-area {
  display: flex;

  .scroll-left {
    .scroll-left-item {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 30rpx;
    }

    .active {
      position: relative;
      color: red;
      &::before {
        display: block;
        content: "";
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        position: absolute;
        width: 5%;
        height: 70%;
        background-color: red;
      }
    }
  }

  .scroll-right {
    .second-cat {
      margin: 35rpx 20rpx;
      margin-top: 0;
      .title {
        margin-bottom: 20rpx;
        font-size: 35rpx;
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
      }
      .third-cat {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-around;
        .cat {
          margin-bottom: 35rpx;
          width: 47%;
          .cat-icon {
            image {
              width: 100%;
            }
          }
          .cat-name {
            margin-top: 10rpx;
            font-size: 35rpx;
            height: 40rpx;
            line-height: 40rpx;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
