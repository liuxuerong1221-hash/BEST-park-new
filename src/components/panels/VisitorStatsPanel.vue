<template>
  <BasePanel class="visitor-stats" title="访客统计">
    <div class="visitor-stats__cards">
      <div class="visitor-stats__card">
        <div class="visitor-stats__icon-wrap">
          <img class="visitor-stats__card-icon" :src="iconVisitor" alt="" />
          <span class="visitor-stats__particle" v-for="n in 6" :key="'p1-'+n" />
        </div>
        <div class="visitor-stats__card-info">
          <span class="visitor-stats__card-value">128</span>
          <span class="visitor-stats__card-label">今日预约访客</span>
        </div>
      </div>

      <div class="visitor-stats__card">
        <div class="visitor-stats__icon-wrap">
          <img class="visitor-stats__card-icon" :src="iconArrival" alt="" />
          <span class="visitor-stats__particle" v-for="n in 6" :key="'p2-'+n" />
        </div>
        <div class="visitor-stats__card-info">
          <span class="visitor-stats__card-value">86</span>
          <span class="visitor-stats__card-label">今日到访访客</span>
        </div>
      </div>
    </div>

    <div class="visitor-stats__subtitle">
      <span class="visitor-stats__subtitle-text">访客到访统计</span>
      <div class="visitor-stats__legend">
        <span class="visitor-stats__legend-item">
          <span class="visitor-stats__legend-dot visitor-stats__legend-dot--booked" />
          <span class="visitor-stats__legend-text">预约人数</span>
        </span>
        <span class="visitor-stats__legend-item">
          <span class="visitor-stats__legend-dot visitor-stats__legend-dot--arrived" />
          <span class="visitor-stats__legend-text">到访人数</span>
        </span>
      </div>
    </div>

    <div class="visitor-stats__chart-wrap">
      <VisitorBarChart />
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import VisitorBarChart from '@/components/charts/VisitorBarChart.vue'
import iconVisitor from '@/assets/images/icon/icon-访客.svg'
import iconArrival from '@/assets/images/icon/容器 1017.svg'
</script>

<style lang="scss" scoped>
.visitor-stats {
  flex: 0 0 auto;
  height: 352px;
  gap: $spacing-xs;

  &__cards {
    display: flex;
    gap: 10px;
    margin-top: $spacing-xs;
    flex-shrink: 0;
  }

  &__card {
    flex: 1;
    height: 76px;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: 0 14px;
    background: linear-gradient(96deg, rgba(8, 38, 74, 0.6) 0%, rgba(0, 36, 78, 0.18) 100%);
    border: 1px solid rgba(0, 174, 255, 0.35);
    border-radius: $radius-sm;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 4px;
      width: 4px;
      height: 4px;
      background: $color-primary-bright;
      border-radius: 50%;
      box-shadow: 0 0 6px $color-primary-bright;
    }
  }

  &__icon-wrap {
    position: relative;
    width: 45px;
    height: 47px;
    flex-shrink: 0;
    overflow: visible;
  }

  &__card-icon {
    width: 45px;
    height: 47px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
    position: relative;
    z-index: 1;
  }

  &__particle {
    position: absolute;
    bottom: 8px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: $color-primary-bright;
    box-shadow: 0 0 4px rgba(77, 242, 255, 0.85);
    opacity: 0;
    pointer-events: none;
    z-index: 0;
    animation: visitor-particle-float 2.6s ease-in infinite;

    &:nth-child(2) { left: 6px;  animation-delay: 0s;    animation-duration: 2.4s; }
    &:nth-child(3) { left: 14px; animation-delay: 0.4s;  animation-duration: 3s;   }
    &:nth-child(4) { left: 22px; animation-delay: 0.8s;  animation-duration: 2.2s; }
    &:nth-child(5) { left: 30px; animation-delay: 1.2s;  animation-duration: 2.8s; }
    &:nth-child(6) { left: 38px; animation-delay: 1.6s;  animation-duration: 2.6s; }
    &:nth-child(7) { left: 10px; animation-delay: 2.0s;  animation-duration: 2.4s; width: 2px; height: 2px; }
  }

  &__card-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__card-value {
    font-family: $font-number;
    font-size: 26px;
    font-weight: bold;
    color: $color-primary-bright;
    line-height: 1;
    text-shadow: 0 0 10px rgba(77, 242, 255, 0.6);
  }

  &__card-label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    line-height: 1;
    white-space: nowrap;
  }

  &__subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    flex-shrink: 0;
  }

  &__subtitle-text {
    font-size: $font-size-sm;
    color: $color-text-1;
    font-weight: 500;
    position: relative;
    padding-left: 10px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 12px;
      background: $color-primary;
    }
  }

  &__legend {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &__legend-dot {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;

    &--booked  { background: linear-gradient(180deg, #00AEFF 0%, rgba(0, 174, 255, 0.08) 100%); }
    &--arrived { background: linear-gradient(180deg, #2ED0B0 0%, rgba(46, 208, 176, 0.08) 100%); }
  }

  &__legend-text {
    font-size: $font-size-xxs;
    color: $color-text-2;
    line-height: 1;
    white-space: nowrap;
  }

  &__chart-wrap {
    flex: 1;
    min-height: 0;
    margin-top: 4px;
  }
}

@keyframes visitor-particle-float {
  0% {
    transform: translateY(0) scale(0.6);
    opacity: 0;
  }
  15% {
    opacity: 1;
    transform: translateY(-6px) scale(1);
  }
  60% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-42px) scale(0.4);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .visitor-stats__particle {
    animation: none;
    opacity: 0;
  }
}
</style>
