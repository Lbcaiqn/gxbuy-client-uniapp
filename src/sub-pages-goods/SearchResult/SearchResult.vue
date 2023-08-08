<script setup lang="ts">
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getSearchRequest } from "@/api";

const goodsListData = ref<any>({});
const searchQuery = ref<any>({});

async function getSearchData(options: {
  keyword?: string;
  c1id?: number;
  c2id?: number;
  c3id?: number;
  pageSize?: number;
  page?: number;
}) {
  try {
    const res = (await getSearchRequest(options)).data;
    if (goodsListData.value.data) {
      goodsListData.value.total = res.total;
      goodsListData.value.data = [...goodsListData.value.data, ...res.data];
    } else {
      goodsListData.value = res;
    }
  } catch (err: any) {}
}

onLoad((query: any) => {
  searchQuery.value = { ...query, pageSize: 30, page: 1 };
  getSearchData(searchQuery.value);
});

const isPullUpLoading = ref(false);

async function pullUpLoad() {
  if (
    !isPullUpLoading.value &&
    searchQuery.value.page <= Math.ceil(goodsListData.value.total / searchQuery.value.pageSize)
  ) {
    searchQuery.value.page++;
    isPullUpLoading.value = true;
    await getSearchData(searchQuery.value);
    isPullUpLoading.value = false;
  }
}
</script>

<template>
  <view id="search-result">
    <MySearcher />
    <scroll-view scroll-y style="height: calc(95vh - var(--window-bottom)); width: 100%" @scrolltolower="pullUpLoad">
      <GoodsList class="goods-list" :goodsListData="goodsListData?.data || []" />
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.goods-list {
  padding: 0 10rpx;
}
</style>
