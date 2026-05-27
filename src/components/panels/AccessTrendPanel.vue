<template>
  <BasePanel class="access-trend" :title="title">
    <template #actions>
      <SegmentedTabs
        :model-value="activeRange"
        :options="ranges"
        :item-width="54"
        aria-label="时间范围"
        @update:model-value="setRange"
      />
    </template>

    <div class="access-trend__legend">
      <span class="access-trend__legend-item">
        <span class="access-trend__legend-dot" :style="{ background: enterColor }" />
        <span>进入</span>
      </span>
      <span class="access-trend__legend-item">
        <span class="access-trend__legend-dot" :style="{ background: leaveColor }" />
        <span>离开</span>
      </span>
    </div>

    <v-chart class="access-trend__chart" :option="option" autoresize />
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import BasePanel from '@/components/common/BasePanel.vue'
import SegmentedTabs from '@/components/common/SegmentedTabs.vue'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent])

type Tone = 'blue' | 'green'
type Range = 'today' | 'week'

const props = withDefaults(defineProps<{
  title: string
  unit: string
  tone?: Tone
}>(), {
  tone: 'blue',
})

const ranges: Array<{ label: string; value: Range }> = [
  { label: '今天', value: 'today' },
  { label: '近7天', value: 'week' },
]

const activeRange = ref<Range>('today')
const hours = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`)
const formatDateLabel = (date: Date) => `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
const currentHour = new Date().getHours()
const visibleHourIndexes = Array.from(
  { length: 6 },
  (_, index) => (currentHour - 5 + index + 24) % 24,
)
const visibleHours = visibleHourIndexes.map(index => hours[index])
const recentDateLabels = Array.from({ length: 7 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() - (6 - index))
  return formatDateLabel(date)
})

function setRange(value: string) {
  activeRange.value = value as Range
}

const palette = computed(() => {
  if (props.tone === 'green') {
    return {
      enter: '#36D85D',
      enterEnd: 'rgba(54, 216, 93, 0.08)',
      leave: '#F9B933',
      leaveEnd: 'rgba(249, 185, 51, 0.08)',
    }
  }

  return {
    enter: '#37B7FF',
    enterEnd: 'rgba(55, 183, 255, 0.08)',
    leave: '#EFFF2B',
    leaveEnd: 'rgba(239, 255, 43, 0.08)',
  }
})

const enterColor = computed(() => palette.value.enter)
const leaveColor = computed(() => palette.value.leave)

const todayData = computed(() => (
  props.tone === 'green'
    ? {
        enter: [82, 64, 58, 70, 96, 138, 284, 428, 468, 410, 376, 352, 336, 362, 388, 405, 452, 468, 431, 360, 286, 218, 154, 108],
        leave: [28, 22, 20, 24, 35, 58, 96, 132, 148, 142, 136, 128, 126, 134, 140, 143, 150, 148, 132, 104, 82, 66, 48, 36],
      }
    : {
        enter: [76, 52, 48, 60, 88, 126, 248, 392, 436, 386, 354, 320, 306, 334, 362, 386, 418, 436, 396, 328, 252, 188, 132, 92],
        leave: [22, 18, 16, 20, 30, 44, 72, 104, 112, 108, 102, 98, 94, 100, 106, 110, 116, 112, 98, 78, 60, 48, 34, 26],
      }
))

const weekData = computed(() => {
  if (props.tone === 'green') {
    return {
      enter: [386, 428, 405, 456, 438, 482, 468],
      leave: [112, 128, 120, 136, 132, 146, 148],
    }
  }

  return {
    enter: [352, 396, 382, 424, 408, 448, 436],
    leave: [86, 96, 92, 104, 100, 110, 112],
  }
})

const xAxisData = computed(() => (
  activeRange.value === 'today' ? visibleHours : recentDateLabels
))

const visibleData = computed(() => ({
  enter: activeRange.value === 'today'
    ? visibleHourIndexes.map(index => todayData.value.enter[index])
    : weekData.value.enter,
  leave: activeRange.value === 'today'
    ? visibleHourIndexes.map(index => todayData.value.leave[index])
    : weekData.value.leave,
}))

const option = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    backgroundColor: 'rgba(10,29,53,0.5)',
    borderWidth: 0,
    extraCssText: 'backdrop-filter: blur(8px);',
    textStyle: { color: '#D1EDFF', fontSize: 12 },
    formatter: (params: Array<{ axisValue: string; marker: string; seriesName: string; value: number }>) => {
      const items = params.filter(item => item.value > 0)
      if (!items.length) return ''

      const start = items[0].axisValue
      const nextHour = `${String((Number(start.slice(0, 2)) + 1) % 24).padStart(2, '0')}:00`
      const title = activeRange.value === 'today' ? `·${start}~${nextHour}` : `·${start}`
      return [
        `<span style="color:#4DF2FF">${title}</span>`,
        ...items.map(item => `${item.seriesName}：${item.value}`),
      ].join('<br/>')
    },
  },
  grid: { left: 40, right: 8, top: 12, bottom: 24, containLabel: false },
  xAxis: {
    type: 'category',
    data: xAxisData.value,
    axisLine: { lineStyle: { color: 'rgba(0,174,255,0.3)' } },
    axisTick: { show: false },
    axisLabel: {
      color: '#D1EDFF',
      fontSize: 11,
      interval: 0,
      formatter: (value: string) => value,
    },
    boundaryGap: true,
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 600,
    interval: 100,
    name: props.unit,
    nameTextStyle: { color: '#D1EDFF', fontSize: 11, padding: [0, 0, 0, -24] },
    axisLabel: { color: '#D1EDFF', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(0,174,255,0.15)', type: 'dashed' } },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      name: '进入',
      type: 'bar',
      barWidth: 8,
      barGap: '30%',
      data: visibleData.value.enter,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: palette.value.enter },
            { offset: 1, color: palette.value.enterEnd },
          ],
        },
        borderRadius: [2, 2, 0, 0],
      },
    },
    {
      name: '离开',
      type: 'bar',
      barWidth: 8,
      data: visibleData.value.leave,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: palette.value.leave },
            { offset: 1, color: palette.value.leaveEnd },
          ],
        },
        borderRadius: [2, 2, 0, 0],
      },
    },
  ],
}))
</script>

<style lang="scss" scoped>
.access-trend {
  flex: 0 0 auto;
  height: 295px;
  gap: 4px;

  &__legend {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 16px;
    height: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  &__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: $color-text-1;
    font-size: $font-size-xxs;
    line-height: 1;
    white-space: nowrap;
  }

  &__legend-dot {
    width: 10px;
    height: 6px;
    border-radius: 1px;
    box-shadow: 0 0 8px currentColor;
  }

  &__chart {
    flex: 1;
    min-height: 0;
  }
}
</style>
