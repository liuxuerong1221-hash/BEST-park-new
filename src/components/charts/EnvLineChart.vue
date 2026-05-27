<template>
  <BasePanel class="env-chart" title="环境质量变化趋势分析">
    <template #actions>
      <div class="filter-select" @click="toggleFilter">
        <span class="filter-select__text">{{ currentMetric.label }}</span>
        <svg class="filter-select__caret" :class="{ 'filter-select__caret--open': filterOpen }"
             viewBox="0 0 12 12" fill="none">
          <path d="M2 4.5L6 8.5L10 4.5" stroke="#4DF2FF" stroke-width="1.4"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <ul v-if="filterOpen" class="filter-select__menu" @click.stop>
          <li v-for="item in metricOptions" :key="item.value"
              class="filter-select__option"
              :class="{ 'filter-select__option--active': selectedMetric === item.value }"
              @click="selectMetric(item.value)">
            {{ item.label }}
          </li>
        </ul>
      </div>
    </template>
    <v-chart class="env-chart__chart" :option="option" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import BasePanel from '@/components/common/BasePanel.vue'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

type MetricKey = 'co2' | 'co' | 'temp' | 'humidity' | 'pm25'

const hours = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00']
const metricOptions: Array<{ label: string; value: MetricKey }> = [
  { label: 'CO2', value: 'co2' },
  { label: 'CO', value: 'co' },
  { label: '温度', value: 'temp' },
  { label: '湿度', value: 'humidity' },
  { label: 'PM2.5', value: 'pm25' },
]

const metricConfig: Record<MetricKey, {
  label: string
  unit: string
  max: number
  interval: number
  data: number[]
}> = {
  co2: {
    label: 'CO2',
    unit: 'ppm',
    max: 800,
    interval: 200,
    data: [320, 450, 620, 580, 710, 660, 540],
  },
  co: {
    label: 'CO',
    unit: 'ppm',
    max: 80,
    interval: 20,
    data: [22, 35, 42, 38, 56, 48, 31],
  },
  temp: {
    label: '温度',
    unit: '℃',
    max: 40,
    interval: 10,
    data: [24, 25, 26, 28, 29, 27, 26],
  },
  humidity: {
    label: '湿度',
    unit: '%',
    max: 100,
    interval: 20,
    data: [45, 50, 58, 62, 67, 60, 54],
  },
  pm25: {
    label: 'PM2.5',
    unit: 'μg/m³',
    max: 200,
    interval: 50,
    data: [38, 45, 62, 73, 81, 69, 55],
  },
}

const selectedMetric = ref<MetricKey>('co2')
const currentMetric = computed(() => metricConfig[selectedMetric.value])

const filterOpen = ref(false)
function toggleFilter() { filterOpen.value = !filterOpen.value }
function selectMetric(v: MetricKey) {
  selectedMetric.value = v
  filterOpen.value = false
}

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10,29,53,0.5)',
    borderWidth: 0,
    borderRadius: 4,
    extraCssText: 'backdrop-filter: blur(8px);',
    textStyle: { color: '#D1EDFF', fontSize: 12 },
    formatter: (params: any[]) => {
      const p = params[0]
      return `${p.axisValue}<br/>${currentMetric.value.label}: ${p.value}${currentMetric.value.unit}`
    },
  },
  grid: { left: 36, right: 8, top: 24, bottom: 22, containLabel: false },
  xAxis: {
    type: 'category',
    data: hours,
    axisLine: { lineStyle: { color: 'rgba(0,174,255,0.3)' } },
    axisTick: { show: false },
    axisLabel: { color: '#D1EDFF', fontSize: 11 },
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: currentMetric.value.max,
    interval: currentMetric.value.interval,
    name: currentMetric.value.unit,
    nameLocation: 'end',
    nameRotate: 0,
    nameGap: 10,
    nameTextStyle: { color: '#D1EDFF', fontSize: 11, align: 'left', verticalAlign: 'bottom', padding: [0, 0, 0, -36] },
    axisLabel: { color: '#D1EDFF', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(0,174,255,0.15)', type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [{
    name: currentMetric.value.label,
    type: 'line',
    smooth: true,
    data: currentMetric.value.data,
    symbol: 'circle',
    symbolSize: 7,
    lineStyle: { color: '#4DF2FF', width: 2 },
    itemStyle: { color: '#4DF2FF', borderColor: '#fff', borderWidth: 1.5 },
    areaStyle: {
      color: {
        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(77,242,255,0.35)' },
          { offset: 1, color: 'rgba(77,242,255,0)' },
        ],
      },
    },
  }],
}))
</script>

<style lang="scss" scoped>
.env-chart {
  flex: 1;
  min-height: 0;
  gap: $spacing-xs;

  &__chart {
    flex: 1;
    min-height: 140px;
  }
}

.filter-select {
  position: relative;
  width: 111px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  background: rgba(0, 174, 255, 0.06);
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  cursor: pointer;
  user-select: none;

  &__text {
    font-size: $font-size-xs;
    color: $color-text-2;
    white-space: nowrap;
  }

  &__caret {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    transition: transform 0.18s ease;

    &--open { transform: rotate(180deg); }
  }

  &__menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    margin: 0;
    padding: 4px 0;
    list-style: none;
    background: rgba(10, 29, 53, 0.95);
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    z-index: 10;
    box-shadow: $shadow-panel;
  }

  &__option {
    padding: 6px 10px;
    font-size: $font-size-xs;
    color: $color-text-2;
    cursor: pointer;

    &:hover {
      background: rgba(0, 174, 255, 0.18);
      color: $color-text-1;
    }

    &--active {
      color: $color-primary-bright;
    }
  }
}
</style>
