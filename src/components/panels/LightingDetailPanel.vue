<template>
  <section class="lighting-detail">
    <header class="lighting-detail__header">
      <div class="lighting-detail__title">
        <span class="lighting-detail__icon" aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <ellipse cx="8.5" cy="8.5" rx="8" ry="8" stroke="#00AEFF" stroke-width="1"/>
            <ellipse cx="8.5" cy="8.5" rx="5.5" ry="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="lighting-detail__title-text">照明回路</h3>
      </div>
      <button class="lighting-detail__close" type="button" aria-label="关闭" @click="emit('close')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
        </svg>
      </button>
    </header>

    <div class="lighting-detail__content">
      <div class="lighting-detail__section">
        <p class="lighting-detail__section-label">基础信息</p>
        <p class="lighting-detail__text">名称：{{ device.name }}</p>
        <p class="lighting-detail__text">设备位置：{{ device.location }}</p>
        <p class="lighting-detail__text">设备IP：{{ device.ip }}</p>
      </div>

      <div class="lighting-detail__divider"></div>

      <div class="lighting-detail__section">
        <p class="lighting-detail__section-label">运行数据</p>
        <p class="lighting-detail__text">
          运行状态：<span :class="['lighting-detail__status', `lighting-detail__status--${runtimeTone}`]">{{ runtimeLabel }}</span>
        </p>
        <p class="lighting-detail__text">当前功率：<span class="lighting-detail__value">{{ device.currentValue }}W</span></p>
      </div>

      <div class="lighting-detail__divider"></div>

      <div class="lighting-detail__section">
        <p class="lighting-detail__section-label">远程操控</p>
        <div class="lighting-detail__controls">
          <button
            class="lighting-detail__control-btn"
            type="button"
            :disabled="openDisabled"
            @click="setPower('on')"
          >
            远程开启
          </button>
          <button
            class="lighting-detail__control-btn"
            type="button"
            :disabled="closeDisabled"
            @click="setPower('off')"
          >
            远程关闭
          </button>
        </div>
      </div>
    </div>

    <div class="lighting-detail__footer">
      <PanelCloseButton @close="emit('close')" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PanelCloseButton from '@/components/common/PanelCloseButton.vue'

type LightingStatus = 'online' | 'offline'
type PowerState = 'on' | 'off'

interface LightingDevice {
  id: number
  name: string
  location: string
  ip: string
  status: LightingStatus
  powerState: PowerState
  currentValue: number
}

const props = defineProps<{
  device: LightingDevice
}>()

const emit = defineEmits<{
  close: []
  control: [{ id: number; action: PowerState }]
}>()

const runtimeLabel = computed(() => {
  if (props.device.status === 'offline') return '离线'
  return props.device.powerState === 'on' ? '运行中' : '已关闭'
})

const runtimeTone = computed<'online' | 'offline' | 'idle'>(() => {
  if (props.device.status === 'offline') return 'offline'
  return props.device.powerState === 'on' ? 'online' : 'idle'
})

const openDisabled = computed(() => props.device.status === 'offline' || props.device.powerState === 'on')
const closeDisabled = computed(() => props.device.status === 'offline' || props.device.powerState === 'off')

function setPower(action: PowerState) {
  if (props.device.status === 'offline') return
  if (props.device.powerState === action) return

  const actionLabel = action === 'on' ? '开启' : '关闭'

  ElMessageBox.confirm(
    `确定要远程${actionLabel}「${props.device.name}」吗？`,
    `远程${actionLabel}确认`,
    {
      confirmButtonText: `确定${actionLabel}`,
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'screen-confirm-box',
    },
  )
    .then(() => {
      emit('control', { id: props.device.id, action })
      ElMessage({
        type: 'success',
        message: `${props.device.name}已${actionLabel}`,
        customClass: 'screen-message',
      })
    })
    .catch(() => {
      // 用户取消，保持原状态
    })
}
</script>

<style lang="scss" scoped>
.lighting-detail {
  width: 100%;
  height: 100%;
  min-height: 0;
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
    &--idle {
      color: #8FA3B8;
    }
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding-top: 4px;
  }

  &__control-btn {
    min-width: 100px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    border: 1px solid rgba(0, 174, 255, 0.5);
    background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 600;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.7) -19%, rgba(14, 33, 56, 0.2) 100%);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      border-color: rgba(0, 174, 255, 0.2);
      background: rgba(8, 39, 76, 0.3);
      color: rgba(255, 255, 255, 0.4);
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
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding-top: 10px;
  }

  &__btn { display: none; }
}
</style>
