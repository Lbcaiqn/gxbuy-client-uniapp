<script setup lang="ts">
import { ref } from "vue";
import { getUserRecordRequest } from "@/api";
import type { GetUserRecordRequestParameter } from "@/types";
import { onLoad } from "@dcloudio/uni-app";

// 初始化数据--------------------------------------------------------------
const data = ref<any>({});
const dataQuery = ref<GetUserRecordRequestParameter>({
  feature: "",
  pageSize: 10,
  page: 1
});

async function getUserRecord(parameter: GetUserRecordRequestParameter) {
  try {
    if (data.value.data) {
      if (dataQuery.value.pageSize! <= Math.ceil(data.value.total / dataQuery.value.page!)) {
        const res = (await getUserRecordRequest(parameter)).data;
        data.value.data = [...data.value.data, ...res.data];
        data.value.total = res.total;
        dataQuery.value.page!++;
      }
    } else {
      data.value = (await getUserRecordRequest(parameter)).data;
      dataQuery.value.page!++;
    }
  } catch (err: any) {}
}

onLoad((query: any) => {
  dataQuery.value.feature = query.type;
  getUserRecord(dataQuery.value);
});

// 上拉加载更多 ------------------------------------------------------------------
const isPullUpLoading = ref(false);

async function pullUpLoad() {
  if (isPullUpLoading.value === false) {
    isPullUpLoading.value = true;
    await getUserRecord(dataQuery.value);
    isPullUpLoading.value = false;
  }
}
</script>

<template>
  <view v-if="JSON.stringify(data) !== '{}'">
    <scroll-view
      scroll-y
      style="height: calc(100vh - var(--window-bottom) - var(--window-top)); width: 100%"
      :scroll-top="0"
      @scrolltolower="pullUpLoad"
    >
      <view class="user-record">
        <GoodsList
          v-if="dataQuery.feature === 'favorite'"
          :goodsListData="data.data.map((item: any) => item.goods_spu)"
        />

        <ShopList v-else-if="dataQuery.feature === 'follow'" :shopList="data.data.map((item: any) => item.shop)" />

        <view v-else-if="dataQuery.feature === 'buyed_shop'">
          <view style="margin: 50rpx 0" v-for="i in data.data.map((item: any) => item.shop)">
            <ShopInfo :shopData="i" @follow="i.isFollow = !i.isFollow" />
          </view>
        </view>

        <GoodsCard
          v-else-if="dataQuery.feature === 'browse_history'"
          :goods="data.data"
          :showShopInfo="true"
          :byTime="true"
          :showDelete="true"
        />
      </view>

      <PullUpLoading :isLoading="isPullUpLoading" />
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.user-record {
  margin: 20rpx;
}
</style>
