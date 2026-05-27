<template>
  <section class="ups-detail">
    <header class="ups-detail__header">
      <div class="ups-detail__title">
        <span class="ups-detail__dot">
          <svg viewBox="0 0 17 17" fill="none">
            <circle cx="8.5" cy="8.5" r="8" stroke="#00AEFF" stroke-width="1"/>
            <circle cx="8.5" cy="8.5" r="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="ups-detail__title-text">UPS设备</h3>
      </div>
      <button class="ups-detail__close" type="button" aria-label="关闭" @click="$emit('close')">
        <svg viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    </header>

    <!-- 基础信息 -->
    <div class="ups-detail__section">
      <span class="ups-detail__section-label">基础信息</span>
      <div class="ups-detail__row">
        <span class="ups-detail__field">设备位置：<em>{{ device.location }}</em></span>
        <span class="ups-detail__field">设备IP：<em>{{ device.ip }}</em></span>
      </div>
    </div>

    <div class="ups-detail__divider" />

    <!-- 运行数据 -->
    <div class="ups-detail__section">
      <span class="ups-detail__section-label">运行数据</span>
      <div class="ups-detail__row">
        <span class="ups-detail__field">功率：<em>{{ device.power }}Kw</em></span>
        <span class="ups-detail__field">
          运行状态：
          <em :class="alert ? 'ups-detail__status--alert' : `ups-detail__status--${device.status}`">
            {{ alert ? '告警' : (device.status === 'normal' ? '正常' : '故障') }}
          </em>
        </span>
      </div>
      <div class="ups-detail__row">
        <span class="ups-detail__field">供电方式：<em>{{ device.powerMode }}</em></span>
      </div>
      <!-- 电池电量 -->
      <div class="ups-detail__bar-row">
        <span class="ups-detail__bar-label">电池电量：</span>
        <div class="ups-detail__battery-track">
          <div class="ups-detail__battery-fill" :style="{ width: device.batteryLevel + '%' }" />
        </div>
        <span class="ups-detail__bar-value">{{ device.batteryLevel }}%</span>
      </div>
      <!-- 电池温度 -->
      <div class="ups-detail__bar-row">
        <span class="ups-detail__bar-label">电池温度：</span>
        <div class="ups-detail__temp-track">
          <span class="ups-detail__temp-dot" :style="{ left: `calc(${tempPercent}% - 7px)` }" />
        </div>
        <span class="ups-detail__bar-value">{{ device.batteryTemp }}°C</span>
      </div>
    </div>

    <div class="ups-detail__divider" />

    <!-- 电压图表 -->
    <div class="ups-detail__section ups-detail__section--chart">
      <span class="ups-detail__section-label">电压</span>
      <v-chart class="ups-detail__chart" :option="voltageOption" autoresize />
    </div>

    <!-- 底部关闭 -->
    <div class="ups-detail__footer">
      <button class="ups-detail__footer-btn" type="button" @click="$emit('close')">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
        </svg>
        <span>关闭</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

export interface UpsDevice {
  name: string
  location: string
  ip: string
  status: 'normal' | 'fault'
  power: number
  powerMode: string
  batteryLevel: number
  batteryTemp: number
  voltageInputA: number
  voltageOutputA: number
  voltageInputB: number
  voltageOutputB: number
  voltageInputC: number
  voltageOutputC: number
}

const props = defineProps<{ device: UpsDevice; alert?: boolean }>()
defineEmits<{ close: [] }>()

const tempPercent = computed(() => {
  const min = 20, max = 45
  return Math.min(100, Math.max(0, (props.device.batteryTemp - min) / (max - min) * 100))
})

const voltageOption = computed(() => ({
  backgroundColor: 'transparent',
  legend: {
    top: 4,
    right: 0,
    icon: 'rect',
    itemWidth: 14,
    itemHeight: 8,
    itemGap: 12,
    textStyle: { color: '#8FAAC3', fontSize: 11 },
    data: [
      { name: '输入', itemStyle: { color: '#00AEFF' } },
      { name: '输出', itemStyle: { color: '#2ED0B0' } },
    ],
  },
  grid: { top: 36, right: 8, bottom: 28, left: 44 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(5, 25, 49, 0.9)',
    borderColor: 'rgba(0, 174, 255, 0.3)',
    textStyle: { color: '#E8F4FF', fontSize: 12 },
    formatter: (params: any[]) =>
      params.map((p: any) => `${p.seriesName}：${p.value}V`).join('<br/>'),
  },
  xAxis: {
    type: 'category',
    data: ['A相', 'B相', 'C相'],
    axisLine: { lineStyle: { color: 'rgba(0,174,255,0.2)' } },
    axisTick: { show: false },
    axisLabel: { color: '#8FAAC3', fontSize: 11 },
  },
  yAxis: {
    type: 'value',
    min: 180,
    max: 235,
    interval: 10,
    name: '(V)',
    nameTextStyle: { color: '#8FAAC3', fontSize: 11, align: 'left', padding: [0, 0, 0, -30] },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#8FAAC3', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(0,174,255,0.12)' } },
  },
  series: [
    {
      name: '输入',
      type: 'bar',
      barWidth: 14,
      barGap: '30%',
      data: [props.device.voltageInputA, props.device.voltageInputB, props.device.voltageInputC],
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#00AEFF' }, { offset: 1, color: 'rgba(0,174,255,0.08)' }] },
      },
    },
    {
      name: '输出',
      type: 'bar',
      barWidth: 14,
      data: [props.device.voltageOutputA, props.device.voltageOutputB, props.device.voltageOutputC],
      itemStyle: {
        borderRadius: [2, 2, 0, 0],
        color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#2ED0B0' }, { offset: 1, color: 'rgba(46,208,176,0.08)' }] },
      },
    },
  ],
}))
</script>

<style lang="scss" scoped>
.ups-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid #0B2C52;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 14px;
    border-bottom: 1px solid rgba(0, 174, 255, 0.12);
    flex-shrink: 0;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__dot {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    svg { display: block; width: 100%; height: 100%; }
  }

  &__title-text {
    font-size: $font-size-md;
    font-weight: 600;
    color: $color-text-1;
    margin: 0;
  }

  &__close {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.18s;
    flex-shrink: 0;
    svg { width: 14px; height: 14px; display: block; }
    &:hover { opacity: 1; }
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px 20px;

    &--chart {
      flex: 1;
      min-height: 0;
    }
  }

  &__section-label {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $color-primary;
    line-height: 1;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__field {
    flex: 1;
    font-size: $font-size-sm;
    color: $color-text-2;
    line-height: 1.6;
    em { font-style: normal; }
    em:not([class]) { color: $color-text-1; }
  }

  &__status--normal,
  &__status--fault,
  &__status--alert {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 56px;
    height: 26px;
    padding: 2px 10px;
    font-size: $font-size-sm;
    font-weight: bold;
    font-style: normal;
    border-radius: $radius-md;
  }
  &__status--normal { color: #0CF92C; background: rgba(12, 249, 44, 0.2); }
  &__status--fault  { color: #FF1414; background: rgba(255, 72, 72, 0.2); }
  &__status--alert  { color: #FF4848; background: rgba(255, 72, 72, 0.2); }

  &__divider {
    height: 1px;
    background: rgba(0, 174, 255, 0.12);
    margin: 0 20px;
    flex-shrink: 0;
  }

  // 进度条行
  &__bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__bar-label {
    font-size: $font-size-sm;
    color: $color-text-2;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__bar-value {
    font-size: $font-size-sm;
    color: $color-text-1;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 44px;
    text-align: right;
  }

  // 电池电量条
  &__battery-track {
    flex: 1;
    height: 14px;
    border: 1px solid rgba(0, 174, 255, 0.25);
    border-radius: 2px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.25);
  }

  &__battery-fill {
    height: 100%;
    background: linear-gradient(90deg,
      #FF3D00 0%,
      #FF8C00 22%,
      #FFD600 42%,
      #7BE000 58%,
      #00D4AA 78%,
      #00AEFF 100%
    );
    position: relative;
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        90deg,
        transparent 0,
        transparent 4px,
        rgba(5, 25, 49, 0.35) 4px,
        rgba(5, 25, 49, 0.35) 5px
      );
    }
  }

  // 电池温度条
  &__temp-track {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(90deg, #7BE000, #FFD600, #FF8C00, #FF2200);
    position: relative;
  }

  &__temp-dot {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: radial-gradient(circle, #FF8800 40%, #FF2200 100%);
    border: 2px solid #fff;
    box-shadow: 0 0 8px rgba(255, 100, 0, 0.7);
  }

  // 电压图表
  &__chart {
    width: 100%;
    height: 180px;
  }

  &__footer {
    padding: 16px 20px 20px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  }

  &__footer-btn {
    width: 160px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: 1px solid rgba(0, 174, 255, 0.5);
    background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
    border-radius: $radius-sm;
    color: $color-text-1;
    font-size: $font-size-sm;
    font-weight: 600;
    font-family: $font-body;
    cursor: pointer;
    transition: background 0.2s ease;
    svg { width: 14px; height: 14px; flex-shrink: 0; }
    &:hover {
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.7) -19%, rgba(14, 33, 56, 0.2) 100%);
    }
  }
}
</style>
