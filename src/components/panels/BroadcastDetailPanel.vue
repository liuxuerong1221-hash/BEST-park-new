<template>
  <section class="broadcast-detail">
    <header class="broadcast-detail__header">
      <div class="broadcast-detail__title">
        <span class="broadcast-detail__icon" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <ellipse cx="8.5" cy="8.5" rx="8" ry="8" stroke="#00AEFF" stroke-width="1"/>
            <ellipse cx="8.5" cy="8.5" rx="5.5" ry="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="broadcast-detail__title-text">广播</h3>
      </div>
      <button class="broadcast-detail__close" type="button" aria-label="关闭" @click="emit('close')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
        </svg>
      </button>
    </header>

    <div class="broadcast-detail__content">
      <div class="broadcast-detail__section">
        <p class="broadcast-detail__section-label">基础信息</p>
        <p class="broadcast-detail__text">名称：{{ device.name }}</p>
        <p class="broadcast-detail__text">设备位置：{{ device.location }}</p>
        <p class="broadcast-detail__text">设备IP：{{ device.ip }}</p>
      </div>

      <div class="broadcast-detail__divider"></div>

      <div class="broadcast-detail__section">
        <p class="broadcast-detail__section-label">运行数据</p>
        <p class="broadcast-detail__text">
          运行状态：<span :class="['broadcast-detail__status', `broadcast-detail__status--${device.status}`]">{{ statusLabel }}</span>
        </p>
        <p class="broadcast-detail__text">当前广播内容：<span class="broadcast-detail__value">《早间新闻》</span></p>
      </div>

      <div class="broadcast-detail__divider"></div>

      <div class="broadcast-detail__section">
        <p class="broadcast-detail__section-label">远程操控</p>
        <div class="broadcast-detail__control">
          <span class="broadcast-detail__control-label">音量调节</span>
          <div class="broadcast-detail__slider-wrap">
            <button
              class="broadcast-detail__vol-btn"
              type="button"
              aria-label="减小音量"
              :disabled="volume <= 0"
              @click="adjustVolume(-5)"
            >−</button>
            <div class="broadcast-detail__slider">
              <div class="broadcast-detail__slider-track">
                <div class="broadcast-detail__slider-fill" :style="{ width: `${volume}%` }" />
              </div>
              <input
                v-model.number="volume"
                class="broadcast-detail__slider-input"
                type="range"
                min="0"
                max="100"
                step="1"
                aria-label="音量"
              />
            </div>
            <button
              class="broadcast-detail__vol-btn"
              type="button"
              aria-label="增大音量"
              :disabled="volume >= 100"
              @click="adjustVolume(5)"
            >+</button>
            <span class="broadcast-detail__vol-value">{{ volume }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="broadcast-detail__footer">
      <PanelCloseButton @close="emit('close')" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PanelCloseButton from '@/components/common/PanelCloseButton.vue'

type BroadcastStatus = 'online' | 'offline'
interface BroadcastDevice {
  id: number
  name: string
  location: string
  ip: string
  status: BroadcastStatus
  currentValue: number
}

const props = defineProps<{
  device: BroadcastDevice
}>()

const emit = defineEmits<{
  close: []
}>()

const statusLabel = computed(() => (props.device.status === 'online' ? '正常' : '离线'))

const volume = ref(Math.round((props.device.currentValue / 80) * 100))

function adjustVolume(delta: number) {
  volume.value = Math.max(0, Math.min(100, volume.value + delta))
}
</script>

<style lang="scss" scoped>
.broadcast-detail {
  width: 100%;
  height: auto;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid #0B2C52;
  border-radius: 4px;
  padding: 10px 9px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__icon {
    width: 17px;
    height: 17px;
    display: inline-flex;
    flex-shrink: 0;
  }
  &__title-text {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 20px;
  }

  &__close {
    width: 26px;
    height: 26px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover { opacity: 0.75; }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__section-label {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: 400;
    color: #00AEFF;
    line-height: 20px;
  }

  &__text {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 22px;
  }
  &__status {
    font-weight: bold;

    &--online {
      color: #0CF92C;
    }
    &--offline {
      color: #FF1414;
    }
  }

  &__value {
    color: #FFFFFF;
  }

  &__divider {
    height: 1px;
    background: #0B2C52;
    width: 100%;
  }

  &__control {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__control-label {
    font-family: 'PingFang SC', sans-serif;
    font-size: 14px;
    color: $color-text-2;
  }

  &__slider-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__vol-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid rgba(0, 174, 255, 0.5);
    background: rgba(0, 174, 255, 0.08);
    color: #4DF2FF;
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.18s ease, opacity 0.18s ease;

    &:hover:not(:disabled) {
      background: rgba(0, 174, 255, 0.22);
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__slider {
    flex: 1;
    position: relative;
    height: 28px;
    display: flex;
    align-items: center;
  }

  &__slider-track {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 6px;
    border-radius: 3px;
    background: rgba(0, 174, 255, 0.15);
    overflow: hidden;
    pointer-events: none;
  }

  &__slider-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, #0C84FF, #1DEAFF);
    transition: width 0.1s ease;
  }

  &__slider-input {
    width: 100%;
    height: 28px;
    margin: 0;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    cursor: pointer;
    position: relative;
    z-index: 1;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #4DF2FF;
      box-shadow: 0 0 6px rgba(77, 242, 255, 0.6);
      border: 2px solid #FFFFFF;
      cursor: pointer;
      margin-top: -4px;
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #4DF2FF;
      box-shadow: 0 0 6px rgba(77, 242, 255, 0.6);
      border: 2px solid #FFFFFF;
      cursor: pointer;
      box-sizing: border-box;
    }

    &::-webkit-slider-runnable-track {
      height: 6px;
      background: transparent;
    }

    &::-moz-range-track {
      height: 6px;
      background: transparent;
    }
  }

  &__vol-value {
    min-width: 38px;
    font-family: $font-number;
    font-size: 14px;
    color: #4DF2FF;
    text-align: right;
    flex-shrink: 0;
  }

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }

  &__btn { display: none; }
}
</style>
