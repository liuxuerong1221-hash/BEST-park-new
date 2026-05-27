<template>
  <BasePanel class="today-energy-stats" title="今日能耗概况">
    <div class="today-energy-stats__body">
      <div
        v-for="item in stats"
        :key="item.label"
        class="today-energy-stats__item"
        :class="`today-energy-stats__item--${item.tone}`"
      >
        <AnimatedIconFrame
          :src="item.icon"
          :tone="item.tone === 'elec' ? 'cyan' : 'yellow'"
          effect="orbit"
          :size="46"
          class="today-energy-stats__icon"
        />
        <div class="today-energy-stats__info">
          <span class="today-energy-stats__label">{{ item.label }} {{ item.unit }}</span>
          <span
            class="today-energy-stats__value"
            :class="item.tone === 'elec' ? 'today-energy-stats__value--elec' : 'today-energy-stats__value--water'"
          >{{ item.value }}</span>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import BasePanel from '@/components/common/BasePanel.vue'
import AnimatedIconFrame from '@/components/common/AnimatedIconFrame.vue'
import iconElec  from '../../../assets/icon-耗电量.svg'
import iconWater from '../../../assets/icon-耗水.svg'

interface StatItem {
  label: string
  value: string
  unit: string
  tone: 'elec' | 'water'
  icon: string
}

const stats: StatItem[] = [
  { label: '今日耗电量', value: '1,286', unit: '(kWh)', tone: 'elec',  icon: iconElec },
  { label: '今日耗水量', value: '128',   unit: '(t)',   tone: 'water', icon: iconWater },
]
</script>

<style lang="scss" scoped>
.today-energy-stats {
  flex-shrink: 0;
  gap: 10px;

  &__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    width: 100%;
    height: 82px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-radius: $radius-sm;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(11, 182, 255, 0.3);
    background: linear-gradient(117deg, rgba(8, 38, 74, 0.4) 0%, rgba(3, 21, 43, 0.4) 97%);

    &--water {
      border-color: rgba(229, 217, 109, 0.45);
      background: linear-gradient(117deg, rgba(40, 41, 36, 0.55) 0%, rgba(86, 83, 45, 0.55) 100%);
    }
  }

  &__icon {
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    line-height: 1;
    white-space: nowrap;
  }

  &__value {
    font-family: $font-number;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;

    &--elec  { color: $color-primary-bright; }
    &--water { color: $color-accent; }
  }
}
</style>
