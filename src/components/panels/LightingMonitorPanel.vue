<template>
  <BasePanel class="lighting-monitor" title="照明监测">
    <div class="lighting-monitor__body">
      <!-- 左侧：圆环 + 开启率 -->
      <div class="lighting-monitor__ring-area">
        <div class="lighting-monitor__ring-wrapper">
          <div class="lighting-monitor__ring-bg" />
          <div class="lighting-monitor__ring-inner">
            <!-- 装饰性刻度环 -->
            <img class="lighting-monitor__ring-decor" src="@/assets/images/lighting-ring-track.svg" alt="" />
            <!-- 水波图 (G2 Liquid 风格) -->
            <svg class="lighting-monitor__liquid" viewBox="0 0 100 100">
              <defs>
                <clipPath id="liquid-clip">
                  <circle cx="50" cy="50" r="38" />
                </clipPath>
                <linearGradient id="liquid-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6bdfff" stop-opacity="0.6" />
                  <stop offset="100%" stop-color="#0a5e8a" stop-opacity="0.9" />
                </linearGradient>
              </defs>
              <circle class="lighting-monitor__liquid-bg" cx="50" cy="50" r="38" />
              <g clip-path="url(#liquid-clip)">
                <rect
                  class="lighting-monitor__liquid-fill"
                  :y="88 - openRate * 0.76"
                  x="0" width="100" height="76"
                  fill="url(#liquid-grad)"
                />
                <path
                  class="lighting-monitor__liquid-wave lighting-monitor__liquid-wave--1"
                  :d="wavePath1"
                />
                <path
                  class="lighting-monitor__liquid-wave lighting-monitor__liquid-wave--2"
                  :d="wavePath2"
                />
              </g>
            </svg>
            <div class="lighting-monitor__ring-text">
              <div class="lighting-monitor__ring-value-row">
                <span class="lighting-monitor__ring-value">{{ openRate }}</span>
                <span class="lighting-monitor__ring-percent">%</span>
              </div>
              <span class="lighting-monitor__ring-label">开启率</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：回路数据 -->
      <div class="lighting-monitor__stats">
        <div class="lighting-monitor__stat-item">
          <img class="lighting-monitor__stat-icon" src="@/assets/images/lighting-icon-open.svg" alt="" />
          <div class="lighting-monitor__stat-info">
            <span class="lighting-monitor__stat-label">开启回路数量</span>
            <div class="lighting-monitor__stat-value-row">
              <span class="lighting-monitor__stat-value">{{ openCount }}</span>
              <span class="lighting-monitor__stat-unit">个</span>
            </div>
          </div>
        </div>
        <div class="lighting-monitor__divider" />
        <div class="lighting-monitor__stat-item">
          <img class="lighting-monitor__stat-icon" src="@/assets/images/lighting-icon-close.svg" alt="" />
          <div class="lighting-monitor__stat-info">
            <span class="lighting-monitor__stat-label">关闭回路数量</span>
            <div class="lighting-monitor__stat-value-row">
              <span class="lighting-monitor__stat-value">{{ closeCount }}</span>
              <span class="lighting-monitor__stat-unit">个</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'

const props = withDefaults(defineProps<{
  openCount?: number
  closeCount?: number
}>(), {
  openCount: 832,
  closeCount: 208,
})

const openRate = computed(() => {
  const total = props.openCount + props.closeCount
  return total === 0 ? 0 : Math.round((props.openCount / total) * 100)
})

const waveY = computed(() => 88 - openRate.value * 0.76)

function buildWavePath(amplitude: number, phase: number): string {
  const y = waveY.value
  let d = `M -20 ${y}`
  for (let x = -20; x <= 120; x += 5) {
    const waveYOffset = Math.sin((x + phase) * Math.PI / 40) * amplitude
    d += ` L ${x} ${y + waveYOffset}`
  }
  d += ' L 120 100 L -20 100 Z'
  return d
}

const wavePath1 = computed(() => buildWavePath(3, 0))
const wavePath2 = computed(() => buildWavePath(2.5, 20))
</script>

<style lang="scss" scoped>
.lighting-monitor {
  flex: none;
  padding: 10px 16px;
  gap: 8px;

  &__body {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-height: 0;
  }

  &__ring-area {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__ring-wrapper {
    position: relative;
    width: 128px;
    height: 128px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__ring-bg {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(68, 181, 242, 0.2);
    background: linear-gradient(180deg, rgba(2, 28, 66, 0) 0%, rgba(1, 28, 76, 1) 100%);
  }

  &__ring-inner {
    position: relative;
    width: 100px;
    height: 100px;
  }

  &__ring-decor {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  &__liquid {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  &__liquid-bg {
    fill: rgba(0, 34, 40, 0.4);
  }

  &__liquid-fill {
    transition: y 0.8s ease;
  }

  &__liquid-wave {
    transition: d 0.8s ease;

    &--1 {
      fill: rgba(107, 223, 255, 0.4);
      animation: liquid-drift 4s linear infinite;
    }

    &--2 {
      fill: rgba(107, 223, 255, 0.2);
      animation: liquid-drift 6s linear infinite reverse;
    }
  }

  @keyframes liquid-drift {
    from { transform: translateX(0); }
    to { transform: translateX(-40px); }
  }

  &__ring-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  &__ring-value-row {
    display: flex;
    align-items: baseline;
    gap: 1px;
  }

  &__ring-value {
    font-family: DINPro, $font-number;
    font-size: 26px;
    font-weight: 500;
    color: #ffffff;
    line-height: 1;
  }

  &__ring-percent {
    font-family: DINPro, $font-number;
    font-size: 12px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
  }

  &__ring-label {
    font-size: 12px;
    color: #d1edff;
    line-height: 1;
  }

  &__stats {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;
  }

  &__stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__stat-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  &__stat-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__stat-label {
    font-size: 14px;
    color: #ffffff;
    font-family: PingFang SC, $font-body;
    line-height: 20px;
  }

  &__stat-value {
    font-family: DINAlternate, $font-number;
    font-size: 20px;
    line-height: 20px;
    background-image: linear-gradient(180deg, #ffffff 0%, #6bdfff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__stat-value-row {
    display: inline-flex;
    align-items: baseline;
    gap: 4px;
  }

  &__stat-unit {
    font-size: 12px;
    color: $color-text-2;
  }

  &__divider {
    width: 100%;
    height: 1px;
    background: rgba(68, 181, 242, 0.2);
  }
}
</style>
