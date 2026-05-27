<template>
  <v-chart class="visitor-chart" :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

const months = ['1月', '2月', '6月', '7月', '9月', '11月', '12月']

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10,29,53,0.5)',
    borderWidth: 0,
    extraCssText: 'backdrop-filter: blur(8px);',
    textStyle: { color: '#D1EDFF', fontSize: 12 },
  },
  grid: { left: 36, right: 8, top: 16, bottom: 24, containLabel: false },
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
    max: 500,
    interval: 100,
    name: 'kwh',
    nameTextStyle: { color: '#D1EDFF', fontSize: 11, padding: [0, 0, 0, -22] },
    axisLabel: { color: '#D1EDFF', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(0,174,255,0.15)', type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      name: '预约人数',
      type: 'bar',
      barWidth: 8,
      barGap: '30%',
      data: [340, 240, 350, 400, 400, 350, 245],
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#00AEFF' }, { offset: 1, color: 'rgba(0,174,255,0.08)' }],
        },
        borderRadius: [2, 2, 0, 0],
      },
    },
    {
      name: '到访人数',
      type: 'bar',
      barWidth: 8,
      data: [165, 145, 260, 240, 100, 220, 120],
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#2ED0B0' }, { offset: 1, color: 'rgba(46,208,176,0.08)' }],
        },
        borderRadius: [2, 2, 0, 0],
      },
    },
  ],
}))
</script>

<style lang="scss" scoped>
.visitor-chart {
  width: 100%;
  height: 100%;
  min-height: 160px;
}
</style>
