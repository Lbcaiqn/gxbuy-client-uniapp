<script setup lang="ts">
function toSearcher() {
  uni.navigateTo({
    url: "/sub-pages-goods/Search/Search"
  });
}
</script>

<template>
  <view class="my-searcher" @click="toSearcher">
    <view class="my-search-box">
      <view><uni-icons type="search" size="22"></uni-icons></view>
      <view>搜索</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.my-searcher {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(5vh - var(--window-bottom));
  background-color: $uni-color-primary;
  .my-search-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: calc(3vh - var(--window-bottom));
    font-size: 30rpx;
    color: #000;
    background-color: #fff;
    border-radius: 75rpx;

    > view:first-child {
      margin-right: 7rpx;
    }
  }
}
</style>
