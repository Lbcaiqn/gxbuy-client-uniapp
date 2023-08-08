<script setup lang="ts">
import { ref } from "vue";

const historyList = ref<Array<string>>(["123"]);

function deleteHistory() {
  // history.clear();
  // historyData.value = [];
  // uni.setStorageSync("searchHistory", "");
}

function toSearchResult(keyword: string) {
  uni.navigateTo({
    url: `/sub-pages-goods/SearchResult/SearchResult?keyword=${keyword}`
  });
}

function confirm(e: any) {
  if (e.value !== "") toSearchResult(e.value);
}
</script>

<template>
  <view>
    <view class="search-box">
      <uni-search-bar
        style="width: 90%"
        @confirm="confirm"
        :radius="100"
        cancelButton="none"
        :focus="true"
      ></uni-search-bar>
    </view>

    <view>
      <scroll-view scroll-y style="height: calc(95vh - var(--window-bottom)); width: 100%">
        <view class="search-history">
          <view class="search-history-title">
            <view>搜索历史</view>
            <view @click="deleteHistory"><uni-icons type="trash" size="18"></uni-icons></view>
          </view>
          <view class="search-history-content">
            <view v-for="(i, iIndex) in historyList" :key="iIndex" @click="toSearchResult(i)">{{ i }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.search-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(5vh - var(--window-bottom));
  background-color: $uni-color-primary;
}

.search-history {
  padding: 20rpx;
  .search-history-title {
    display: flex;
    justify-content: space-between;
  }
  .search-history-content {
    display: flex;
    flex-wrap: wrap;

    > view {
      margin: 20rpx;
      padding: 15rpx 35rpx;
      text-align: center;
      font-size: 20rpx;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 20rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
