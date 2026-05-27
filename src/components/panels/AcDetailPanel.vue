<template>
  <section class="ac-detail">
    <!-- 头部 -->
    <header class="ac-detail__header">
      <div class="ac-detail__title">
        <span class="ac-detail__dot">
          <svg viewBox="0 0 17 17" fill="none">
            <circle cx="8.5" cy="8.5" r="8" stroke="#00AEFF" stroke-width="1"/>
            <circle cx="8.5" cy="8.5" r="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="ac-detail__title-text">空调</h3>
      </div>
      <button class="ac-detail__close" type="button" aria-label="关闭" @click="$emit('close')">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z"
            fill="#FFFFFF"/>
        </svg>
      </button>
    </header>

    <!-- 基础信息 -->
    <div class="ac-detail__section">
      <span class="ac-detail__section-label">基础信息</span>
      <div class="ac-detail__row">
        <span class="ac-detail__field">名称：<em>{{ device.name }}</em></span>
        <span class="ac-detail__field">设备IP：<em>{{ device.ip }}</em></span>
      </div>
      <div class="ac-detail__row">
        <span class="ac-detail__field">设备位置：<em>{{ device.location }}</em></span>
      </div>
    </div>

    <div class="ac-detail__divider" />

    <!-- 运行数据 -->
    <div class="ac-detail__section">
      <span class="ac-detail__section-label">运行数据</span>
      <div class="ac-detail__row">
        <span class="ac-detail__field">
          运行状态：
          <em :class="alert ? 'ac-detail__status--alert' : `ac-detail__status--${device.status}`">
            {{ alert ? '告警' : (device.status === 'normal' ? '正常' : '故障') }}
          </em>
        </span>
      </div>
      <div class="ac-detail__row">
        <span class="ac-detail__field">送风温度：<em>{{ device.supplyTemp }}℃</em></span>
        <span class="ac-detail__field">回风温度：<em>{{ device.returnTemp }}℃</em></span>
      </div>
      <div class="ac-detail__row">
        <span class="ac-detail__field">送风湿度：<em>{{ device.supplyHumidity }}%</em></span>
        <span class="ac-detail__field">回风湿度：<em>{{ device.returnHumidity }}%</em></span>
      </div>
    </div>

    <!-- 底部关闭 -->
    <div class="ac-detail__footer">
      <button class="ac-detail__footer-btn" type="button" @click="$emit('close')">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
        </svg>
        <span>关闭</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface AcDevice {
  name: string
  ip: string
  location: string
  status: 'normal' | 'fault'
  supplyTemp: number
  returnTemp: number
  supplyHumidity: number
  returnHumidity: number
}

defineProps<{ device: AcDevice; alert?: boolean }>()
defineEmits<{ close: [] }>()
</script>

<style lang="scss" scoped>
.ac-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
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

    em {
      font-style: normal;
    }

    em:not([class]) {
      color: $color-text-1;
    }
  }

  &__status--normal,
  &__status--fault,
  &__status--alert {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 64px;
    height: 28px;
    padding: 2px 10px;
    font-size: $font-size-sm;
    font-weight: bold;
    font-style: normal;
    border-radius: $radius-md;
  }

  &__status--normal {
    color: #0CF92C;
    background: rgba(12, 249, 44, 0.2);
  }

  &__status--fault {
    color: #FF1414;
    background: rgba(255, 72, 72, 0.2);
  }

  &__status--alert {
    color: #FF4848;
    background: rgba(255, 72, 72, 0.2);
  }

  &__divider {
    height: 1px;
    background: rgba(0, 174, 255, 0.12);
    margin: 0 20px;
  }

  &__footer {
    padding: 20px;
    display: flex;
    justify-content: center;
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

    svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }

    &:hover {
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.7) -19%, rgba(14, 33, 56, 0.2) 100%);
    }
  }
}
</style>
