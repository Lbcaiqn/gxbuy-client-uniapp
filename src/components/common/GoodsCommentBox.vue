<script setup lang="ts">
import { ref } from "vue";

const baseURL = ref(
  import.meta.env.MODE === "development" ? import.meta.env.VITE_DEV_BASEURL : import.meta.env.VITE_PROD_BASEURL
);

const props = withDefaults(
  defineProps<{
    commentData: any;
  }>(),
  {
    commentData: () => {
      return {};
    }
  }
);

function previewImage(index: number) {
  uni.previewImage({
    current: index,
    urls: props.commentData?.goods_comment[0]?.img_url
  });
}
</script>

<template>
  <view v-if="JSON.stringify(commentData) !== '{}'">
    <view class="user-info">
      <view class="user-info-img">
        <image :src="baseURL + commentData.user?.user_icon" mode="widthFix"></image>
      </view>
      <view class="user-info-name">{{ commentData.user?.user_name }}</view>
    </view>

    <view class="comment-content">
      <view class="comment-content-sku">
        分类: {{ commentData.sku_sales_attrs?.reduce((acc: string, item: any) => (acc += item.value + ""), " ") }}
      </view>
      <view class="comment-content-text">{{ commentData?.goods_comment[0]?.comment }}</view>
      <view class="comment-content-img">
        <view
          class="comment-content-img-item"
          v-for="(i, iIndex) in commentData?.goods_comment[0]?.img_url || []"
          :key="iIndex"
        >
          <image :src="i" mode="widthFix" @click="previewImage(iIndex)"></image>
        </view>
      </view>
      <view class="comment-content-time">{{ commentData.update_time }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.user-info {
  display: flex;
  height: 60rpx;

  .user-info-img {
    display: flex;
    justify-self: center;
    align-items: center;

    image {
      width: 50rpx;
      height: 50rpx;
      border-radius: 25rpx;
    }
  }

  .user-info-name {
    margin-left: 20rpx;
    line-height: 60rpx;
    font-size: 35rpx;
  }
}

.comment-content {
  .comment-content-sku,
  .comment-content-time {
    margin-top: 10rpx;
    font-size: 30rpx;
    color: gray;
  }
  .comment-content-text {
    margin: 10rpx 0;
    line-height: 1.2;
    font-size: 30rpx;
  }

  .comment-content-img {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20rpx;

    .comment-content-img-item {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      width: 25%;
      height: 177rpx;
      border: 1rpx solid $uni-color-primary;

      image {
        width: 100%;
      }
    }
  }
}
</style>
