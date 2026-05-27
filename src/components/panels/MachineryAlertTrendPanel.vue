<template>
  <BasePanel class="mach-trend" title="近30天告警趋势">
    <div class="mach-trend__today">
      <span class="mach-trend__today-label">今日告警数：</span>
      <span class="mach-trend__today-value">{{ todayCount }}</span>
      <span class="mach-trend__today-unit">条</span>
    </div>
    <MachineryAlertTrendChart class="mach-trend__chart" />
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import MachineryAlertTrendChart from '@/components/charts/MachineryAlertTrendChart.vue'

const todayCount = 222
</script>

<style lang="scss" scoped>
.mach-trend {
  flex-shrink: 0;
  height: 280px;
  gap: 10px;

  &__today {
    flex-shrink: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, rgba(0,80,180,0.5) 0%, rgba(0,100,220,0.35) 50%, rgba(0,80,180,0.5) 100%);
    border: 1px solid rgba(0,174,255,0.35);
    border-radius: $radius-sm;
  }

  &__today-label {
    font-size: $font-size-sm;
    color: $color-text-2;
  }

  &__today-value {
    font-size: $font-size-md;
    font-weight: 700;
    color: $color-primary-bright;
    margin: 0 2px;
  }

  &__today-unit {
    font-size: $font-size-sm;
    color: $color-text-2;
  }

  &__chart {
    flex: 1;
    min-height: 0;
  }
}
</style>
