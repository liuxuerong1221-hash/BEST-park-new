<template>
  <div class="panel-title">
    <span class="panel-title__text">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style lang="scss" scoped>
.panel-title {
  // 面板 padding-top/left 已去掉，title 直接贴边；横向负 margin 抵消左右 padding
  // 顶部 10px，左右距面板边框 8px（padding 16px - margin 8px = 8px gap）
  margin: 2px (-$spacing-sm) $spacing-xs;
  width: calc(100% + #{$spacing-sm * 2});
  height: 32px;
  display: flex;
  align-items: center;
  background: linear-gradient(89deg, #09284D 2%, rgba(5, 25, 49, 0) 98%);
  border-left: 3px solid $color-primary;
  box-sizing: border-box;

  &__text {
    padding-left: 10px;
    font-family: '苹方-简', 'PingFang SC', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    line-height: normal;
    letter-spacing: normal;
    white-space: nowrap;
    background: linear-gradient(180deg, #FFFFFF 57%, #66BCFF 86%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}
</style>
