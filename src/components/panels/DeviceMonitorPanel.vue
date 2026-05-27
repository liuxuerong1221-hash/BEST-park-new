<template>
  <BasePanel class="device-monitor" :title="title">
    <template #actions>
      <span class="device-monitor__online">
        <span class="device-monitor__online-dot" />
        <span class="device-monitor__online-text">在线率 {{ onlineRate }}%</span>
      </span>
    </template>

    <div class="device-monitor__body">
      <!-- 左：图标 + 圆环 -->
      <div class="device-monitor__visual">
        <div class="device-monitor__ring">
          <svg class="device-monitor__ring-svg" viewBox="0 0 90 90">
            <circle class="device-monitor__ring-track" cx="45" cy="45" r="38" />
            <circle
              class="device-monitor__ring-fill"
              :class="`device-monitor__ring-fill--${tone}`"
              cx="45" cy="45" r="38"
              :stroke-dasharray="`${(onlineRate / 100) * circumference} ${circumference}`"
            />
          </svg>
          <div class="device-monitor__ring-center">
            <component :is="iconComponent" class="device-monitor__icon" :size="42" />
          </div>
        </div>
      </div>

      <!-- 中：统计数据 -->
      <div class="device-monitor__stats">
        <div class="device-monitor__stat device-monitor__stat--total">
          <span class="device-monitor__stat-label">设备总数</span>
          <div class="device-monitor__stat-value-row">
            <span class="device-monitor__stat-value">{{ total }}</span>
            <span class="device-monitor__stat-unit">台</span>
          </div>
        </div>
        <div class="device-monitor__stat device-monitor__stat--online">
          <span class="device-monitor__stat-label">在线</span>
          <div class="device-monitor__stat-value-row">
            <span class="device-monitor__stat-value device-monitor__stat-value--online">{{ online }}</span>
            <span class="device-monitor__stat-unit">台</span>
          </div>
        </div>
        <div class="device-monitor__stat device-monitor__stat--fault">
          <span class="device-monitor__stat-label">故障</span>
          <div class="device-monitor__stat-value-row">
            <span class="device-monitor__stat-value device-monitor__stat-value--fault">{{ fault }}</span>
            <span class="device-monitor__stat-unit">台</span>
          </div>
        </div>
      </div>
    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'

const props = defineProps<{
  title: string
  iconComponent: Component
  tone: 'cyan' | 'green' | 'yellow' | 'blue' | 'orange'
  total: number
  online: number
  fault: number
}>()

const circumference = 2 * Math.PI * 38

const onlineRate = computed(() =>
  props.total === 0 ? 0 : Math.round((props.online / props.total) * 100),
)
</script>

<style lang="scss" scoped>
.device-monitor {
  flex: 1;
  min-height: 0;
  gap: 10px;

  &__online {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(40, 220, 185, 0.12);
    border: 1px solid rgba(40, 220, 185, 0.4);
  }

  &__online-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: $color-success;
    box-shadow: 0 0 6px rgba(46, 208, 176, 0.6);
  }

  &__online-text {
    font-size: $font-size-xxs;
    color: $color-success;
    font-family: $font-number;
  }

  &__body {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 4px 0;
    flex-shrink: 0;
  }

  &__visual {
    flex-shrink: 0;
  }

  &__ring {
    position: relative;
    width: 90px;
    height: 90px;
  }

  &__ring-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  &__ring-track {
    fill: none;
    stroke: rgba(0, 174, 255, 0.18);
    stroke-width: 5;
  }

  &__ring-fill {
    fill: none;
    stroke-width: 5;
    stroke-linecap: round;
    transition: stroke-dasharray 0.5s ease;

    &--cyan   { stroke: #4DF2FF; filter: drop-shadow(0 0 4px rgba(77,242,255,0.6)); }
    &--green  { stroke: #2ED0B0; filter: drop-shadow(0 0 4px rgba(46,208,176,0.6)); }
    &--yellow { stroke: #FFE92B; filter: drop-shadow(0 0 4px rgba(255,233,43,0.6)); }
    &--blue   { stroke: #5AA8FF; filter: drop-shadow(0 0 4px rgba(90,168,255,0.6)); }
    &--orange { stroke: #FF9D4D; filter: drop-shadow(0 0 4px rgba(255,157,77,0.6)); }
  }

  &__ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: 42px;
    height: 42px;
    object-fit: contain;
  }

  &__stats {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-radius: $radius-sm;
    background: linear-gradient(90deg, rgba(0, 174, 255, 0.1) 0%, rgba(0, 174, 255, 0) 100%);
    border-left: 2px solid rgba(0, 174, 255, 0.5);

    &--online {
      background: linear-gradient(90deg, rgba(46, 208, 176, 0.14) 0%, rgba(46, 208, 176, 0) 100%);
      border-left-color: $color-success;
    }

    &--fault {
      background: linear-gradient(90deg, rgba(255, 72, 72, 0.14) 0%, rgba(255, 72, 72, 0) 100%);
      border-left-color: #FF4848;
    }
  }

  &__stat-label {
    font-size: $font-size-xxs;
    color: $color-text-2;
  }

  &__stat-value-row {
    display: inline-flex;
    align-items: baseline;
    gap: 3px;
  }

  &__stat-value {
    font-family: $font-number;
    font-size: $font-size-md;
    font-weight: bold;
    color: $color-primary-bright;
    line-height: 1;

    &--online { color: $color-success; }
    &--fault  { color: #FF4848; }
  }

  &__stat-unit {
    font-size: 10px;
    color: $color-text-2;
  }

}
</style>
