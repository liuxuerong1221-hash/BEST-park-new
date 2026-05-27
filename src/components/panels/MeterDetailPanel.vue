<template>
  <section class="meter-detail">
    <header class="meter-detail__header">
      <div class="meter-detail__title">
        <span class="meter-detail__icon" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <ellipse cx="8.5" cy="8.5" rx="8" ry="8" stroke="#00AEFF" stroke-width="1"/>
            <ellipse cx="8.5" cy="8.5" rx="5.5" ry="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="meter-detail__title-text">电表</h3>
      </div>
      <button class="meter-detail__close" type="button" aria-label="关闭" @click="emit('close')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
        </svg>
      </button>
    </header>

    <div class="meter-detail__content">
      <div class="meter-detail__section">
        <p class="meter-detail__section-label">基础信息</p>
        <p class="meter-detail__text">名称：{{ device.name }}</p>
        <p class="meter-detail__text">设备位置：{{ device.location }}</p>
        <p class="meter-detail__text">设备IP：{{ device.ip }}</p>
      </div>

      <div class="meter-detail__divider"></div>

      <div class="meter-detail__section">
        <p class="meter-detail__section-label">运行数据</p>
        <p class="meter-detail__text">
          运行状态：<span :class="['meter-detail__status', `meter-detail__status--${device.status}`]">{{ statusLabel }}</span>
        </p>
        <p class="meter-detail__text">当前电表值：<span class="meter-detail__value">{{ device.currentValue }}kWh</span></p>
      </div>
    </div>

    <div class="meter-detail__footer">
      <PanelCloseButton @close="emit('close')" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PanelCloseButton from '@/components/common/PanelCloseButton.vue'

type MeterStatus = 'online' | 'offline'

interface MeterDevice {
  id: number
  name: string
  location: string
  ip: string
  status: MeterStatus
  currentValue: number
}

const props = defineProps<{
  device: MeterDevice
}>()

const emit = defineEmits<{
  close: []
}>()

const statusLabel = computed(() => (props.device.status === 'online' ? '正常' : '离线'))
</script>

<style lang="scss" scoped>
.meter-detail {
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

  &__footer {
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }

  &__btn {
    display: none;
  }
}
</style>
