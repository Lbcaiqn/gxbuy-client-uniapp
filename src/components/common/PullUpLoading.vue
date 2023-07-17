<script setup lang="ts">
withDefaults(
  defineProps<{
    isLoading: boolean;
  }>(),
  {
    isLoading: false
  }
);
</script>

<template>
  <view class="pull-up-loading" v-show="isLoading">正在加载...</view>
</template>

<style lang="scss" scoped>
.pull-up-loading {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
}
</style>
