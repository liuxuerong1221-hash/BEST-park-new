<template>
  <BasePanel class="energy-stats" title="能耗分析">
    <div class="energy-stats__body">

      <div class="energy-stats__card energy-stats__card--elec">
        <AnimatedIconFrame :src="iconElec" effect="orbit" tone="cyan" :size="52" />
        <MetricBlock label="本年度耗电量" value="178,167" unit="(kWh)" unit-placement="label" tone="bright" size="md" />
      </div>

      <div class="energy-stats__card energy-stats__card--water">
        <AnimatedIconFrame :src="iconWater" effect="orbit" tone="yellow" :size="52" />
        <MetricBlock label="本年度耗水量" value="178,167" unit="(t)" unit-placement="label" tone="accent" size="md" />
      </div>

    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import AnimatedIconFrame from '@/components/common/AnimatedIconFrame.vue'
import MetricBlock from '@/components/common/MetricBlock.vue'
import iconElec from '../../../assets/icon-耗电量.svg'
import iconWater from '../../../assets/icon-耗水.svg'
</script>

<style lang="scss" scoped>
.energy-stats {
  &__body {
    display: flex;
    gap: 11px;
    margin: auto 0;
    padding: $spacing-sm 0;
  }

  &__card {
    flex: 1;
    height: 87px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 15px 12px;
    border-radius: $radius-sm;
    border: 1px solid rgba(25, 153, 227, 0.45);
    position: relative;
    overflow: hidden;

    &--elec {
      background: linear-gradient(90deg, rgba(11, 39, 66, 0.8) 9%, rgba(10, 73, 114, 0.8) 100%);
    }

    &--water {
      background: linear-gradient(90deg, rgba(40, 41, 36, 0.8) 9%, rgba(86, 83, 45, 0.8) 100%);
      border-color: rgba(229, 217, 109, 0.45);
    }
  }
}
</style>
