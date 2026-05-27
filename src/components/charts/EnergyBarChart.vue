<template>
  <BasePanel class="energy-chart" title="本年度能耗分析">
    <template #actions>
      <SegmentedTabs
        v-model="selectedType"
        :options="typeOptions"
        aria-label="能耗类型切换"
        :item-width="46"
      />
    </template>
    <v-chart class="energy-chart__chart" :option="option" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import BasePanel from '@/components/common/BasePanel.vue'
import SegmentedTabs from '@/components/common/SegmentedTabs.vue'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

type EnergyType = 'elec' | 'water'

const allMonths = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const currentMonth = new Date().getMonth() + 1
const months = allMonths.slice(0, currentMonth)
const selectedType = ref<EnergyType>('elec')
const typeOptions = [
  { label: '用电', value: 'elec' },
  { label: '用水', value: 'water' },
]
let switchTimer: ReturnType<typeof window.setInterval> | undefined

const chartData: Record<EnergyType, {
  name: string
  unit: string
  max: number
  interval: number
  data: number[]
  colorFrom: string
  colorTo: string
}> = {
  elec: {
    name: '用电',
    unit: 'kWh',
    max: 800,
    interval: 200,
    data: [320, 250, 410, 280, 500, 590, 590, 425, 480, 360, 220, 305],
    colorFrom: '#00AEFF',
    colorTo: 'rgba(0,174,255,0.08)',
  },
  water: {
    name: '用水',
    unit: 't',
    max: 400,
    interval: 100,
    data: [180, 120, 200, 160, 300, 320, 310, 210, 270, 190, 140, 170],
    colorFrom: '#2ED0B0',
    colorTo: 'rgba(46,208,176,0.08)',
  },
}

const currentChart = computed(() => chartData[selectedType.value])
const currentSeriesData = computed(() => currentChart.value.data.slice(0, currentMonth))

onMounted(() => {
  switchTimer = window.setInterval(() => {
    selectedType.value = selectedType.value === 'elec' ? 'water' : 'elec'
  }, 5000)
})

onUnmounted(() => {
  if (switchTimer) window.clearInterval(switchTimer)
})

const option = computed(() => {
  const chart = currentChart.value

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,29,53,0.5)',
      borderWidth: 0,
      extraCssText: 'backdrop-filter: blur(8px);',
      textStyle: { color: '#D1EDFF', fontSize: 12 },
      formatter: (params: any[]) => {
        const item = params[0]
        return `${item.axisValue}<br/>${chart.name}: ${item.value}${chart.unit}`
      },
    },
    grid: { left: 40, right: 8, top: 24, bottom: 22, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: { lineStyle: { color: 'rgba(0,174,255,0.3)' } },
      axisTick: { show: false },
      axisLabel: { color: '#D1EDFF', fontSize: 11, interval: 0 },
      boundaryGap: true,
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: chart.max,
      interval: chart.interval,
      name: chart.unit,
      nameLocation: 'end',
      nameGap: 10,
      nameTextStyle: { color: '#D1EDFF', fontSize: 11, align: 'left', padding: [0, 0, 0, -32] },
      axisLabel: { color: '#D1EDFF', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0,174,255,0.15)', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: chart.name,
        type: 'bar',
        barWidth: 8,
        data: currentSeriesData.value,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: chart.colorFrom }, { offset: 1, color: chart.colorTo }],
          },
          borderRadius: [2, 2, 0, 0],
        },
      },
    ],
  }
})
</script>

<style lang="scss" scoped>
.energy-chart {
  flex: 1;
  min-height: 0;
  gap: $spacing-xs;

  &__chart {
    flex: 1;
    min-height: 160px;
  }
}
</style>
