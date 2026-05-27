<template>
  <div class="access-stats">
    <div
      v-for="item in stats"
      :key="item.label"
      class="access-stats__item"
    >
      <div class="access-stats__icon-wrap">
        <IconAccessStat
          :kind="item.kind"
          :tone="item.tone"
          :direction="item.direction"
        />
      </div>
      <div class="access-stats__info">
        <span class="access-stats__value">{{ item.value }}</span>
        <span class="access-stats__label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconAccessStat from '@/components/icons/IconAccessStat.vue'

interface StatItem {
  label: string
  value: string
  kind: 'person' | 'car'
  tone: 'enter' | 'leave'
  direction: 'in' | 'out'
}

const stats: StatItem[] = [
  { label: '今日进入人次', value: '233', kind: 'person', tone: 'enter', direction: 'in' },
  { label: '今日离开人次', value: '425', kind: 'person', tone: 'enter', direction: 'out' },
  { label: '今日进入车次', value: '425', kind: 'car',    tone: 'enter', direction: 'in' },
  { label: '今日离开车次', value: '234', kind: 'car',    tone: 'enter', direction: 'out' },
]
</script>

<style lang="scss" scoped>
.access-stats {
  width: 731px;
  height: 82px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;

  &__item {
    width: 174px;
    height: 82px;
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 17px 20px;
    position: relative;
    background: linear-gradient(117deg, rgba(8, 38, 74, 0.6) 0%, rgba(3, 21, 43, 0.6) 97%);
    border: 1px solid rgba(11, 182, 255, 0.3);
    border-radius: $radius-sm;
    backdrop-filter: blur(6px);
  }

  &__icon-wrap {
    width: 43.2px;
    height: 44px;
    flex-shrink: 0;
  }

  &__info {
    width: 78px;
    height: 47px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }

  &__value {
    font-family: $font-body;
    font-size: 18px;
    font-weight: bold;
    line-height: 20px;
    color: $color-primary;
  }

  &__label {
    font-size: 13px;
    color: $color-text-1;
    line-height: 20px;
    white-space: nowrap;
  }
}
</style>
