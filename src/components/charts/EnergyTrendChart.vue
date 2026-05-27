<template>
  <BasePanel class="energy-trend-chart" :title="title">
    <template #actions>
      <SegmentedTabs
        v-model="rangeKey"
        :options="rangeOptions"
        :aria-label="`${title}时间范围`"
        :item-width="50"
      />
    </template>
    <v-chart class="energy-trend-chart__chart" :option="option" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import BasePanel from '@/components/common/BasePanel.vue'
import SegmentedTabs from '@/components/common/SegmentedTabs.vue'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent])

type RangeKey = 'month' | 'year'

const props = defineProps<{
  title: string
  type: 'elec' | 'water'
}>()

const rangeOptions = [
  { label: '本月', value: 'month' },
  { label: '本年', value: 'year'  },
]
const rangeKey = ref<RangeKey>('month')

const ROTATE_INTERVAL = 30_000
let rotateTimer: ReturnType<typeof setInterval> | null = null

const startRotate = () => {
  stopRotate()
  rotateTimer = setInterval(() => {
    rangeKey.value = rangeKey.value === 'month' ? 'year' : 'month'
  }, ROTATE_INTERVAL)
}

const stopRotate = () => {
  if (rotateTimer) {
    clearInterval(rotateTimer)
    rotateTimer = null
  }
}

onMounted(startRotate)
onBeforeUnmount(stopRotate)

watch(rangeKey, () => {
  if (rotateTimer) startRotate()
})

const COLORS = {
  elec: {
    unit: 'kWh',
    line: '#4DF2FF',
    border: '#FFFFFF',
    fillFrom: 'rgba(77,242,255,0.45)',
    fillTo:   'rgba(77,242,255,0)',
  },
  water: {
    unit: 't',
    line: '#FFE92B',
    border: '#FFFFFF',
    fillFrom: 'rgba(255,233,43,0.42)',
    fillTo:   'rgba(255,233,43,0)',
  },
} as const

const MONTH_CATEGORIES = ['1日','5日','10日','15日','20日','25日','30日']
const YEAR_CATEGORIES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']

const dataMap: Record<'elec' | 'water', Record<RangeKey, { categories: string[]; data: number[] }>> = {
  elec: {
    month: { categories: MONTH_CATEGORIES, data: [820, 760, 910, 880, 1020, 690, 720] },
    year:  { categories: YEAR_CATEGORIES, data: [5800, 6100, 5400, 6300, 7200, 8100, 9200, 9600, 8400, 7100, 6200, 5900] },
  },
  water: {
    month: { categories: MONTH_CATEGORIES, data: [120, 140, 110, 170, 150, 90, 100] },
    year:  { categories: YEAR_CATEGORIES, data: [820, 760, 910, 880, 1020, 1180, 1260, 1320, 1100, 960, 880, 820] },
  },
}

const option = computed(() => {
  const cfg = COLORS[props.type]
  const d = dataMap[props.type][rangeKey.value]

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10,29,53,0.7)',
      borderWidth: 0,
      extraCssText: 'backdrop-filter: blur(8px);',
      textStyle: { color: '#D1EDFF', fontSize: 12 },
      formatter: (params: any[]) => {
        const p = params[0]
        return `${p.axisValue}<br/>${props.type === 'elec' ? '用电' : '用水'}: ${p.value}${cfg.unit}`
      },
    },
    grid: { left: 8, right: 14, top: 30, bottom: 6, containLabel: true },
    xAxis: {
      type: 'category',
      data: d.categories,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(0,174,255,0.3)' } },
      axisTick: { show: false },
      axisLabel: { color: '#D1EDFF', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: cfg.unit,
      nameLocation: 'end',
      nameGap: 10,
      nameTextStyle: { color: '#D1EDFF', fontSize: 11, align: 'left', padding: [0, 0, 0, -32] },
      axisLabel: { color: '#D1EDFF', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(0,174,255,0.15)', type: 'dashed' } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [{
      type: 'line',
      smooth: true,
      data: d.data,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: cfg.line, width: 2 },
      itemStyle: { color: cfg.line, borderColor: cfg.border, borderWidth: 1.5 },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: cfg.fillFrom },
            { offset: 1, color: cfg.fillTo },
          ],
        },
      },
    }],
  }
})
</script>

<style lang="scss" scoped>
.energy-trend-chart {
  flex: 1;
  min-height: 0;
  gap: $spacing-xs;

  &__chart {
    flex: 1;
    min-height: 140px;
  }
}
</style>
