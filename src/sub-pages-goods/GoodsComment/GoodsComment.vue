<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getGoodsCommentRequest } from "@/api";
import type { GetGoodsCommentRequestParameter } from "@/types";

const commentData = ref<any>({});
const commentDataQuery = ref<GetGoodsCommentRequestParameter>({
  goodsSpuId: "",
  pageSize: 10,
  page: 1
});

async function init(parameter: GetGoodsCommentRequestParameter) {
  try {
    const res = (await getGoodsCommentRequest(parameter)).data;
    if (commentData.value.data) {
      commentData.value.total = res.total;
      commentData.value.data = [...commentData.value.data, ...res.data];
    } else commentData.value = res;
  } catch (err: any) {}
}

onLoad((query: any) => {
  commentDataQuery.value.goodsSpuId = query.spuId;
  init(commentDataQuery.value);
});

const isPullUpLoading = ref(false);

async function pullUpLoad() {
  if (
    !isPullUpLoading.value &&
    commentDataQuery.value.page! <= Math.ceil(commentData.value.total / commentDataQuery.value.pageSize!)
  ) {
    commentDataQuery.value.page!++;
    isPullUpLoading.value = true;
    await init(commentDataQuery.value);
    isPullUpLoading.value = false;
  }
}
</script>

<template>
  <view class="goods-comment" v-if="JSON.stringify(commentData) !== '{}'">
    <scroll-view scroll-y style="height: calc(100vh - var(--window-bottom)); width: 100%" @scrolltolower="pullUpLoad">
      <GoodsCommentBox
        class="goods-comment-item"
        v-for="(i, iIndex) in commentData.data"
        :key="iIndex"
        :commentData="i"
      />
      <PullUpLoading :isLoading="isPullUpLoading" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.goods-comment {
  margin: 20rpx;

  .goods-comment-item {
    margin-bottom: 50rpx;
  }
}
</style>
