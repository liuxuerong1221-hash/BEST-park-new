<template>
  <BasePanel class="alert-chart" title="告警趋势">
    <template #actions>
      <SegmentedTabs v-model="activeTab" :options="tabs" :item-width="54" />
    </template>
    <v-chart class="alert-chart__chart" :option="option" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import BasePanel from '@/components/common/BasePanel.vue'
import SegmentedTabs from '@/components/common/SegmentedTabs.vue'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

const tabs = [
  { value: 'month', label: '近30天' },
  { value: 'year',  label: '近一年' },
] as const
type Tab = typeof tabs[number]['value']
const activeTab = ref<Tab>('month')

const xMonth = ['6.17', '6.18', '6.19', '6.20', '6.21', '6.22', '6.23']
const dMonth  = [210, 255, 450, 415, 165, 230, 163]
const xYear   = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
const dYear   = [320, 480, 560, 390, 620, 510, 680, 590, 720, 460, 340, 280]

const option = computed(() => {
  const isMonth = activeTab.value === 'month'
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4,15,36,0.92)',
      borderColor: 'rgba(40,220,185,0.2)',
      borderWidth: 1,
      extraCssText: 'border-radius:6px;padding:10px 14px;backdrop-filter:blur(8px)',
      textStyle: { color: '#D1EDFF', fontSize: 12 },
      axisPointer: {
        type: 'line',
        lineStyle: { color: 'rgba(40,220,185,0.4)', width: 1 },
      },
      formatter: (params: any[]) => {
        const p = params[0]
        let label = p.axisValue
        if (isMonth) {
          const [m, d] = p.axisValue.split('.')
          label = `${m}月${d}日`
        }
        return `<div style="color:#28DCB9;font-weight:600;font-size:13px;margin-bottom:6px">${label}</div>` +
               `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#28DCB9;margin-right:5px;vertical-align:middle"></span>` +
               `告警数：<b>${p.value}条</b>`
      },
    },
    grid: { left: 36, right: 8, top: 24, bottom: 22, containLabel: false },
    xAxis: {
      type: 'category',
      data: isMonth ? xMonth : xYear,
      axisLine: { lineStyle: { color: 'rgba(0,174,255,0.3)' } },
      axisTick: { show: false },
      axisLabel: { color: '#D1EDFF', fontSize: 11 },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      name: '条',
      nameLocation: 'end',
      nameRotate: 0,
      nameGap: 10,
      nameTextStyle: {
        color: '#D1EDFF',
        fontSize: 11,
        align: 'left',
        verticalAlign: 'bottom',
        padding: [0, 0, 0, -36],
      },
      min: 0,
      max: isMonth ? 600 : 800,
      interval: isMonth ? 100 : 200,
      axisLabel: { color: '#D1EDFF', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0,174,255,0.15)', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [{
      name: '告警数',
      type: 'line',
      smooth: true,
      data: isMonth ? dMonth : dYear,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { color: '#28DCB9', width: 2 },
      itemStyle: { color: '#28DCB9', borderColor: '#fff', borderWidth: 1.5 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(40,220,185,0.35)' },
            { offset: 1, color: 'rgba(40,220,185,0)'    },
          ],
        },
      },
    }],
  }
})
</script>

<style lang="scss" scoped>
.alert-chart {
  flex: 1;
  min-height: 0;
  gap: $spacing-xs;

  &__chart {
    flex: 1;
    min-height: 140px;
  }
}
</style>
