<template>
  <BasePanel class="alert-handling" title="告警处理统计">
    <template #actions>
      <SegmentedTabs v-model="activeTab" :options="tabs" :item-width="54" />
    </template>

    <div class="alert-handling__body">
      <!-- 左：已处理 -->
      <div class="alert-handling__card alert-handling__card--done">
        <div class="alert-handling__card-head">
          <img :src="shieldDone" class="alert-handling__card-icon" alt="" />
          <span class="alert-handling__card-label">已处理</span>
        </div>
        <div class="alert-handling__card-value">
          <span class="alert-handling__card-num">60</span>
          <span class="alert-handling__card-unit">条</span>
        </div>
        <div class="alert-handling__card-divider" />
        <div class="alert-handling__card-footer">
          <span class="alert-handling__card-percent alert-handling__card-percent--done">60%</span>
          <span class="alert-handling__card-desc">占总告警</span>
        </div>
        <div class="alert-handling__card-bar">
          <div class="alert-handling__card-bar-track" />
          <div class="alert-handling__card-bar-fill alert-handling__card-bar-fill--done" style="width: 60%" />
        </div>
      </div>

      <!-- 中：盾牌图标 -->
      <div class="alert-handling__ring">
        <!-- 浮动粒子 -->
        <div class="alert-handling__ring-particles" aria-hidden="true">
          <span v-for="n in 8" :key="n" />
        </div>
        <img class="alert-handling__ring-img" src="@/assets/images/icon-shield-3d.png" alt="" />
      </div>

      <!-- 右：未处理 -->
      <div class="alert-handling__card alert-handling__card--pending">
        <div class="alert-handling__card-head">
          <img :src="shieldPending" class="alert-handling__card-icon" alt="" />
          <span class="alert-handling__card-label">未处理</span>
        </div>
        <div class="alert-handling__card-value">
          <span class="alert-handling__card-num alert-handling__card-num--pending">40</span>
          <span class="alert-handling__card-unit">条</span>
        </div>
        <div class="alert-handling__card-divider" />
        <div class="alert-handling__card-footer">
          <span class="alert-handling__card-percent alert-handling__card-percent--pending">40%</span>
          <span class="alert-handling__card-desc">占总告警</span>
        </div>
        <div class="alert-handling__card-bar">
          <div class="alert-handling__card-bar-track" />
          <div class="alert-handling__card-bar-fill alert-handling__card-bar-fill--pending" style="width: 40%" />
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import SegmentedTabs from '@/components/common/SegmentedTabs.vue'
import shieldDone from '@/assets/images/icon/icon-shield-done.svg?url'
import shieldPending from '@/assets/images/icon/icon-shield-pending.svg?url'

const tabs = [
  { value: 'week', label: '近一周' },
  { value: 'month', label: '近一个月' },
]
const activeTab = ref('week')
</script>

<style lang="scss" scoped>
.alert-handling {
  flex: 0 0 auto;
  gap: $spacing-sm;

  &__body {
    display: grid;
    grid-template-columns: 1fr 140px 1fr;
    gap: 0;
    align-items: center;
    min-height: 160px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 12px;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    align-self: stretch;

    &--done {
      background-image: url('@/assets/images/left-左.png');
      background-size: 100% 100%;
      border-top: 1px solid rgba(40, 220, 185, 0.3);
      border-bottom: 1px solid rgba(40, 220, 185, 0.3);
      border-right: 1px solid rgba(40, 220, 185, 0.3);
    }

    &--pending {
      background-image: url('@/assets/images/left-右.png');
      background-size: 100% 100%;
      border-top: 1px solid rgba(255, 200, 20, 0.28);
      border-bottom: 1px solid rgba(255, 200, 20, 0.28);
      border-left: 1px solid rgba(255, 200, 20, 0.28);
    }
  }

  &__card-head {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__card-icon {
    width: 18px;
    height: 18px;
  }

  &__card-label {
    font-size: $font-size-xs;
    color: $color-text-1;
  }

  &__card-value {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  &__card-num {
    font-family: $font-number;
    font-size: 36px;
    font-weight: bold;
    color: #28DCB9;
    line-height: 1;

    &--pending { color: #FFC814; }
  }

  &__card-unit {
    font-size: $font-size-sm;
    color: $color-text-1;
  }

  &__card-divider {
    width: 100%;
    height: 0;
    border: none;
    border-top: 1px dashed rgba(255, 255, 255, 0.18);
    margin: 2px 0;
  }

  &__card-footer {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__card-percent {
    font-size: $font-size-sm;
    font-weight: bold;

    &--done    { color: #28DCB9; }
    &--pending { color: #FFC814; }
  }

  &__card-desc {
    font-size: $font-size-xxs;
    color: $color-text-1;
    opacity: 0.6;
    white-space: nowrap;
  }

  &__card-bar {
    position: relative;
    height: 8px;
  }

  &__card-bar-track {
    position: absolute;
    inset: 0;
    border-radius: 227px;
    background: rgba(40, 220, 185, 0.15);
    border: 0.5px solid rgba(40, 220, 185, 0.25);
  }

  &__card--pending &__card-bar-track {
    background: rgba(255, 200, 20, 0.1);
    border-color: rgba(255, 200, 20, 0.25);
  }

  &__card-bar-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-radius: 227px;

    &--done    { background: #28DCB9; }
    &--pending { background: linear-gradient(90deg, #FF8614 0%, #FFC814 100%); }
  }

  // 中间盾牌区域
  &__ring {
    position: relative;
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
  }

  &__ring-img {
    width: 110px;
    height: 110px;
    object-fit: contain;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 4px 16px rgba(0, 180, 255, 0.6));
  }

  // 浮动粒子
  &__ring-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 3;

    span {
      position: absolute;
      border-radius: 50%;
      background: rgba(0, 212, 255, 0.9);
      box-shadow: 0 0 5px rgba(0, 212, 255, 0.7);
      animation: ring-particle-float 3s ease-in-out infinite;

      &:nth-child(1) { width: 3px; height: 3px; top: 18%; left:  6%; animation-delay: 0.0s; animation-duration: 2.8s; }
      &:nth-child(2) { width: 2px; height: 2px; top:  6%; left: 58%; animation-delay: 0.5s; animation-duration: 3.3s; }
      &:nth-child(3) { width: 3px; height: 3px; top: 36%; left: 90%; animation-delay: 1.1s; animation-duration: 2.6s; }
      &:nth-child(4) { width: 2px; height: 2px; top: 66%; left: 84%; animation-delay: 1.6s; animation-duration: 3.5s; }
      &:nth-child(5) { width: 2px; height: 2px; top: 74%; left: 10%; animation-delay: 0.8s; animation-duration: 2.9s; }
      &:nth-child(6) { width: 3px; height: 3px; top: 50%; left:  0%; animation-delay: 1.4s; animation-duration: 3.1s; }
      &:nth-child(7) { width: 2px; height: 2px; top: 12%; left: 30%; animation-delay: 0.3s; animation-duration: 2.7s; }
      &:nth-child(8) { width: 2px; height: 2px; top: 30%; left: 96%; animation-delay: 1.9s; animation-duration: 3.4s; }
    }
  }

}

// ── 新增 Keyframes ──────────────────────────────────────
@keyframes ring-particle-float {
  0%, 100% { transform: translateY(0);    opacity: 0.7; }
  50%       { transform: translateY(-9px); opacity: 1;   }
}
</style>
