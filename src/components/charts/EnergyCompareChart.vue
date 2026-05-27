<template>
  <BasePanel class="energy-compare-chart" title="水电能耗数据对比">
    <template #actions>
      <SegmentedTabs
        v-model="rangeKey"
        :options="rangeOptions"
        aria-label="水电对比类型"
        :item-width="46"
      />
    </template>

    <div class="energy-compare-chart__sections">
      <!-- 用水月度对比 -->
      <div class="energy-compare-chart__section">
        <div class="energy-compare-chart__tag energy-compare-chart__tag--water">
          <span>用水</span>
          <span>{{ periodLabel }}</span>
          <span>对比</span>
        </div>
        <div class="energy-compare-chart__content">
          <div class="energy-compare-chart__ratios">
            <span class="energy-compare-chart__ratio">
              同期同比:
              <em class="energy-compare-chart__ratio-val" :class="getTrendClass(waterData.yoy)">
                <svg class="energy-compare-chart__arrow" viewBox="0 0 12 12" :class="getTrendArrowClass(waterData.yoy)">
                  <path d="M6 3 L9 7 L3 7 Z" />
                </svg>
                {{ Math.abs(waterData.yoy) }}%
              </em>
            </span>
            <span class="energy-compare-chart__ratio">
              同期环比:
              <em class="energy-compare-chart__ratio-val" :class="getTrendClass(waterData.mom)">
                <svg class="energy-compare-chart__arrow" viewBox="0 0 12 12" :class="getTrendArrowClass(waterData.mom)">
                  <path d="M6 3 L9 7 L3 7 Z" />
                </svg>
                {{ Math.abs(waterData.mom) }}%
              </em>
            </span>
          </div>
          <div class="energy-compare-chart__bars">
            <div class="energy-compare-chart__bar-row">
              <span class="energy-compare-chart__bar-label">{{ prevLabel }}使用</span>
              <div class="energy-compare-chart__bar-track">
                <div
                  class="energy-compare-chart__bar-fill energy-compare-chart__bar-fill--prev"
                  :style="{ width: waterPrevPercent + '%' }"
                />
              </div>
            </div>
            <div class="energy-compare-chart__bar-row">
              <span class="energy-compare-chart__bar-label">{{ currLabel }}使用</span>
              <div class="energy-compare-chart__bar-track">
                <div
                  class="energy-compare-chart__bar-fill energy-compare-chart__bar-fill--curr"
                  :style="{ width: waterCurrPercent + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用电月度对比 -->
      <div class="energy-compare-chart__section">
        <div class="energy-compare-chart__tag energy-compare-chart__tag--elec">
          <span>用电</span>
          <span>{{ periodLabel }}</span>
          <span>对比</span>
        </div>
        <div class="energy-compare-chart__content">
          <div class="energy-compare-chart__ratios">
            <span class="energy-compare-chart__ratio">
              同期同比:
              <em class="energy-compare-chart__ratio-val" :class="getTrendClass(elecData.yoy)">
                <svg class="energy-compare-chart__arrow" viewBox="0 0 12 12" :class="getTrendArrowClass(elecData.yoy)">
                  <path d="M6 3 L9 7 L3 7 Z" />
                </svg>
                {{ Math.abs(elecData.yoy) }}%
              </em>
            </span>
            <span class="energy-compare-chart__ratio">
              同期环比:
              <em class="energy-compare-chart__ratio-val" :class="getTrendClass(elecData.mom)">
                <svg class="energy-compare-chart__arrow" viewBox="0 0 12 12" :class="getTrendArrowClass(elecData.mom)">
                  <path d="M6 3 L9 7 L3 7 Z" />
                </svg>
                {{ Math.abs(elecData.mom) }}%
              </em>
            </span>
          </div>
          <div class="energy-compare-chart__bars">
            <div class="energy-compare-chart__bar-row">
              <span class="energy-compare-chart__bar-label">{{ prevLabel }}使用</span>
              <div class="energy-compare-chart__bar-track">
                <div
                  class="energy-compare-chart__bar-fill energy-compare-chart__bar-fill--prev"
                  :style="{ width: elecPrevPercent + '%' }"
                />
              </div>
            </div>
            <div class="energy-compare-chart__bar-row">
              <span class="energy-compare-chart__bar-label">{{ currLabel }}使用</span>
              <div class="energy-compare-chart__bar-track">
                <div
                  class="energy-compare-chart__bar-fill energy-compare-chart__bar-fill--curr"
                  :style="{ width: elecCurrPercent + '%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import SegmentedTabs from '@/components/common/SegmentedTabs.vue'

type RangeKey = 'month' | 'year'

const rangeOptions = [
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year' },
]
const rangeKey = ref<RangeKey>('month')

const periodLabel = computed(() => rangeKey.value === 'month' ? '月度' : '年度')
const prevLabel = computed(() => rangeKey.value === 'month' ? '上月' : '去年')
const currLabel = computed(() => rangeKey.value === 'month' ? '本月' : '本年')

let timer: ReturnType<typeof setInterval> | null = null

function startAutoSwitch() {
  timer = setInterval(() => {
    rangeKey.value = rangeKey.value === 'month' ? 'year' : 'month'
  }, 30000)
}

onMounted(() => startAutoSwitch())

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

interface CompareData {
  yoy: number
  mom: number
  prev: number
  curr: number
}

const dataMap: Record<RangeKey, { water: CompareData; elec: CompareData }> = {
  month: {
    water: { yoy: 11.9, mom: -8.5, prev: 2189.98, curr: 15690.98 },
    elec:  { yoy: -5.2, mom: 11, prev: 2189.98, curr: 15690.98 },
  },
  year: {
    water: { yoy: 8.5, mom: 6.2, prev: 26800.5, curr: 29120.3 },
    elec:  { yoy: 12.3, mom: -3.8, prev: 185600, curr: 208400 },
  },
}

const waterData = computed(() => dataMap[rangeKey.value].water)
const elecData = computed(() => dataMap[rangeKey.value].elec)

const waterPrevPercent = computed(() => {
  const max = Math.max(waterData.value.prev, waterData.value.curr)
  return max > 0 ? (waterData.value.prev / max) * 100 : 0
})
const waterCurrPercent = computed(() => {
  const max = Math.max(waterData.value.prev, waterData.value.curr)
  return max > 0 ? (waterData.value.curr / max) * 100 : 0
})
const elecPrevPercent = computed(() => {
  const max = Math.max(elecData.value.prev, elecData.value.curr)
  return max > 0 ? (elecData.value.prev / max) * 100 : 0
})
const elecCurrPercent = computed(() => {
  const max = Math.max(elecData.value.prev, elecData.value.curr)
  return max > 0 ? (elecData.value.curr / max) * 100 : 0
})

function getTrendClass(value: number) {
  if (value > 0) return 'energy-compare-chart__ratio-val--up'
  if (value < 0) return 'energy-compare-chart__ratio-val--down'
  return ''
}

function getTrendArrowClass(value: number) {
  if (value > 0) return 'energy-compare-chart__arrow--up'
  if (value < 0) return 'energy-compare-chart__arrow--down'
  return ''
}
</script>

<style lang="scss" scoped>
.energy-compare-chart {
  flex: 1;
  min-height: 0;

  &__sections {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    justify-content: center;
  }

  &__section {
    display: flex;
    align-items: stretch;
    gap: 14px;
  }

  &__tag {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 10px 8px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: 500;
    color: #fff;
    letter-spacing: 2px;
    line-height: 1.4;

    &--water {
      background: linear-gradient(180deg, #1a6fc4, #0e4a8a);
      border: 1px solid rgba(77, 180, 255, 0.5);
    }

    &--elec {
      background: linear-gradient(180deg, #1a8a7a, #0e5c52);
      border: 1px solid rgba(77, 220, 200, 0.5);
    }
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  &__ratios {
    display: flex;
    gap: 24px;
    align-items: baseline;
  }

  &__ratio {
    font-size: $font-size-xxs;
    color: $color-text-2;
  }

  &__ratio-val {
    font-style: normal;
    font-size: $font-size-md;
    font-weight: 600;
    color: $color-text-1;
    font-family: $font-number;
    display: inline-flex;
    align-items: center;
    gap: 4px;

    &--up {
      color: #ff4d4f;
    }

    &--down {
      color: #52c41a;
    }
  }

  &__arrow {
    width: 12px;
    height: 12px;
    fill: currentColor;

    &--up {
      transform: rotate(0deg);
    }

    &--down {
      transform: rotate(180deg);
    }
  }

  &__bars {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__bar-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__bar-label {
    font-size: $font-size-xxs;
    color: $color-text-2;
    white-space: nowrap;
    width: 52px;
    flex-shrink: 0;
  }

  &__bar-track {
    flex: 1;
    height: 16px;
    background: rgba(0, 174, 255, 0.06);
    border-radius: 2px;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.4s ease;

    &--prev {
      background: linear-gradient(90deg, #1a5fa0, #00aeff);
    }

    &--curr {
      background: linear-gradient(90deg, #0e7a6a, #4df2e8);
    }
  }
}
</style>
