<template>
  <v-chart :option="option" autoresize />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, GridComponent, LegendComponent, TooltipComponent])

const dates = ['6.17', '6.18', '6.19', '6.20', '6.21', '6.22', '6.23']

const option = computed(() => ({
  backgroundColor: 'transparent',
  legend: {
    top: 4,
    right: 0,
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
    textStyle: { color: '#8FAAC3', fontSize: 12 },
    data: ['紧急', '重要', '一般', '提示'],
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(5,25,49,0.95)',
    borderColor: 'rgba(0,174,255,0.3)',
    borderWidth: 1,
    textStyle: { color: '#C8D8E8', fontSize: 12 },
    formatter(params: any[]) {
      let html = `<div style="font-weight:600;margin-bottom:4px">${params[0].axisValue}</div>`
      const total = params.reduce((s: number, p: any) => s + (p.value ?? 0), 0)
      html += `<div style="margin-bottom:4px">告警数：${total}</div>`
      params.forEach((p: any) => { html += `<div>${p.marker}${p.seriesName}：${p.value}</div>` })
      return html
    },
  },
  grid: { top: 36, bottom: 0, left: 0, right: 8, containLabel: true },
  xAxis: {
    type: 'category',
    data: dates,
    boundaryGap: false,
    axisLine: { lineStyle: { color: 'rgba(0,174,255,0.2)' } },
    axisTick: { show: false },
    axisLabel: { color: '#8FAAC3', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    name: '条',
    nameTextStyle: { color: '#8FAAC3', fontSize: 11, align: 'left', padding: [0, 0, 0, -28] },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: 'rgba(0,174,255,0.1)', type: 'dashed' } },
    axisLabel: { color: '#8FAAC3', fontSize: 11 },
  },
  series: [
    {
      name: '紧急', type: 'line', smooth: true, symbol: 'none',
      data: [50, 110, 150, 210, 160, 90, 40],
      lineStyle: { color: '#FF4444', width: 2 },
      itemStyle: { color: '#FF4444' },
    },
    {
      name: '重要', type: 'line', smooth: true, symbol: 'none',
      data: [100, 230, 180, 300, 200, 160, 80],
      lineStyle: { color: '#FF8C00', width: 2 },
      itemStyle: { color: '#FF8C00' },
    },
    {
      name: '一般', type: 'line', smooth: true, symbol: 'none',
      data: [30, 20, 60, 10, 80, 50, 30],
      lineStyle: { color: '#0099FF', width: 2 },
      itemStyle: { color: '#0099FF' },
    },
    {
      name: '提示', type: 'line', smooth: true, symbol: 'none',
      data: [60, 90, 50, 80, 60, 20, 50],
      lineStyle: { color: '#22C55E', width: 2 },
      itemStyle: { color: '#22C55E' },
    },
  ],
}))
</script>
