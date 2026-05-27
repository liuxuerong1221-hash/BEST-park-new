<template>
  <section class="dscreen-detail">
    <!-- 头部 -->
    <header class="dscreen-detail__header">
      <div class="dscreen-detail__title">
        <span class="dscreen-detail__dot">
          <svg viewBox="0 0 17 17" fill="none">
            <circle cx="8.5" cy="8.5" r="8" stroke="#00AEFF" stroke-width="1"/>
            <circle cx="8.5" cy="8.5" r="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="dscreen-detail__title-text">信息发布屏</h3>
      </div>
      <button class="dscreen-detail__close" type="button" aria-label="关闭" @click="emit('close')">
        <svg viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    </header>

    <!-- 当前播放内容（摄像头风格） -->
    <div class="dscreen-detail__feed">
      <p class="dscreen-detail__feed-title">{{ device.currentContent }}</p>
      <div class="dscreen-detail__feed-bg">
        <img class="dscreen-detail__feed-img" :src="device.contentImage" :alt="device.currentContent" />
      </div>
      <button class="dscreen-detail__expand" type="button" aria-label="放大" @click="openExpand">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M1.67 1.67L6.67 1.67M1.67 1.67L1.67 6.67M1.67 1.67L7 7"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18.33 1.67L13.33 1.67M18.33 1.67L18.33 6.67M18.33 1.67L13 7"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M1.67 18.33L6.67 18.33M1.67 18.33L1.67 13.33M1.67 18.33L7 13"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18.33 18.33L13.33 18.33M18.33 18.33L18.33 13.33M18.33 18.33L13 13"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- 基础信息 -->
    <div class="dscreen-detail__content">
      <div class="dscreen-detail__section">
        <p class="dscreen-detail__section-label">基础信息</p>
        <p class="dscreen-detail__text">名称：{{ device.name }}</p>
        <p class="dscreen-detail__text">设备位置：{{ device.location }}</p>
        <p class="dscreen-detail__text">设备IP：{{ device.ip }}</p>
        <p class="dscreen-detail__text">
          运行状态：<span :class="['dscreen-detail__status', `dscreen-detail__status--${device.status}`]">{{ device.status === 'online' ? '在线' : '离线' }}</span>
        </p>
      </div>

      <div class="dscreen-detail__divider"></div>

      <!-- 远程操控 -->
      <div class="dscreen-detail__section">
        <p class="dscreen-detail__section-label">远程操控</p>
        <div class="dscreen-detail__controls">
          <button
            class="dscreen-detail__ctrl-btn"
            type="button"
            :disabled="controlState === 'online'"
            @click="handleControl('open')"
          >远程开启</button>
          <button
            class="dscreen-detail__ctrl-btn"
            type="button"
            :disabled="controlState === 'offline'"
            @click="handleControl('close')"
          >远程关闭</button>
        </div>
      </div>
    </div>

    <!-- 底部关闭 -->
    <div class="dscreen-detail__footer">
      <PanelCloseButton :width="160" @close="emit('close')" />
    </div>
  </section>

  <!-- 图片预览弹窗 -->
  <Teleport to="body">
    <div
      v-if="expanded"
      class="dscreen-modal"
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
      tabindex="-1"
      @click.self="closeExpand"
      @keydown.esc="closeExpand"
    >
      <section class="dscreen-modal__panel">
        <header class="dscreen-modal__header">
          <div class="dscreen-modal__title">
            <span class="dscreen-modal__dot" />
            <span class="dscreen-modal__title-text">{{ device.name }}</span>
            <span class="dscreen-modal__status" :class="`dscreen-modal__status--${device.status}`">
              {{ device.status === 'online' ? '在线' : '离线' }}
            </span>
          </div>
          <button class="dscreen-modal__close" type="button" aria-label="关闭预览" @click="closeExpand">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </header>
        <div class="dscreen-modal__feed">
          <div class="dscreen-modal__feed-bg">
            <img class="dscreen-modal__image" :src="device.contentImage" :alt="device.currentContent" />
          </div>
          <div class="dscreen-modal__meta">
            <span>{{ device.location }}</span>
            <span>当前播放：{{ device.currentContent }}</span>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import PanelCloseButton from '@/components/common/PanelCloseButton.vue'

type DeviceStatus = 'online' | 'offline'

interface DisplayScreenDevice {
  id: number
  name: string
  building: string
  floor: string
  location: string
  ip: string
  status: DeviceStatus
  currentContent: string
  contentImage: string
}

const props = defineProps<{
  device: DisplayScreenDevice
}>()

const emit = defineEmits<{
  close: []
}>()

const expanded = ref(false)
const controlState = ref<DeviceStatus>(props.device.status)

watch(() => props.device, (d) => {
  controlState.value = d.status
})

function openExpand() { expanded.value = true }
function closeExpand() { expanded.value = false }

async function handleControl(action: 'open' | 'close') {
  const label = action === 'open' ? '开启' : '关闭'
  try {
    await ElMessageBox.confirm(
      `确定要${label}「${props.device.name}」吗？`,
      '远程操控确认',
      {
        type: 'warning',
        confirmButtonText: `确定${label}`,
        cancelButtonText: '取消',
        customClass: 'screen-confirm-box',
      },
    )
    controlState.value = action === 'open' ? 'online' : 'offline'
    ElMessage.success(`${props.device.name}已${label}`)
  } catch {
    // cancelled
  }
}
</script>

<style lang="scss" scoped>
.dscreen-detail {
  width: 100%;
  height: 100%;
  min-height: 0;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid #0B2C52;
  border-radius: 4px;
  padding: 16px $spacing-lg 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__dot {
    width: 17px;
    height: 17px;
    display: inline-flex;
    flex-shrink: 0;
    svg { width: 100%; height: 100%; }
  }

  &__title-text {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 20px;
  }

  &__close {
    width: 28px;
    height: 28px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 7px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    &:hover { opacity: 0.75; }
    svg { width: 14px; height: 14px; display: block; }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__section-label {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: 400;
    color: #00AEFF;
    line-height: 20px;
  }

  &__text {
    margin: 0;
    font-size: $font-size-sm;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 22px;
  }

  &__status {
    font-weight: bold;
    &--online { color: #0CF92C; }
    &--offline { color: #FF1414; }
  }

  &__divider {
    height: 1px;
    background: #0B2C52;
    width: 100%;
    flex-shrink: 0;
  }

  &__feed {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: $radius-sm;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__feed-title {
    position: absolute;
    top: 10px;
    left: 12px;
    z-index: 2;
    margin: 0;
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
  }

  &__feed-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(0, 174, 255, 0.18) 0%, rgba(2, 16, 36, 0) 70%),
      linear-gradient(135deg, #0E2647 0%, #061328 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        repeating-linear-gradient(0deg, transparent 0 23px, rgba(0, 174, 255, 0.08) 23px 24px),
        repeating-linear-gradient(90deg, transparent 0 23px, rgba(0, 174, 255, 0.08) 23px 24px);
      mix-blend-mode: screen;
    }
  }

  &__feed-img {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__expand {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
    z-index: 2;

    &:hover { opacity: 0.75; }
    svg { width: 100%; height: 100%; }
  }

  &__controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__ctrl-btn {
    min-width: 100px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 174, 255, 0.5);
    background: linear-gradient(0deg, rgba(1, 158, 244, 0.5) -19%, rgba(14, 33, 56, 0) 100%);
    color: #FFFFFF;
    font-weight: 700;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(0deg, rgba(1, 158, 244, 0.7) -19%, rgba(14, 33, 56, 0) 100%);
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover:not(:disabled)::before { opacity: 1; }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(14, 33, 56, 0.5);
    }
  }

  &__footer {
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    flex-shrink: 0;
  }

  &__btn { display: none; }
}

// 图片预览弹窗
.dscreen-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: rgba(0, 8, 18, 0.72);
  backdrop-filter: blur(6px);

  &__panel {
    width: min(1120px, calc(100vw - 96px));
    height: min(680px, calc(100vh - 96px));
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid rgba(77, 242, 255, 0.35);
    border-radius: $radius-md;
    background: rgba(5, 25, 49, 0.92);
    box-shadow: 0 0 32px rgba(0, 174, 255, 0.24), inset 0 0 24px rgba(0, 174, 255, 0.08);
  }

  &__header {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 $spacing-lg;
    border-bottom: 1px solid rgba(0, 174, 255, 0.24);
    flex-shrink: 0;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    min-width: 0;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $color-primary;
    box-shadow: 0 0 10px rgba(0, 174, 255, 0.75);
    flex-shrink: 0;
  }

  &__title-text {
    font-size: $font-size-sm;
    font-weight: bold;
    color: $color-text-1;
    white-space: nowrap;
  }

  &__status {
    height: 24px;
    display: inline-flex;
    align-items: center;
    padding: 0 8px;
    border-radius: $radius-sm;
    font-size: $font-size-xxs;
    font-weight: bold;

    &--online { color: $color-success; background: rgba(12, 249, 44, 0.2); }
    &--offline { color: #FF1414; background: rgba(255, 72, 72, 0.2); }
  }

  &__close {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 8px;
    background: transparent;
    cursor: pointer;
    &:hover { opacity: 0.75; }
    svg { width: 14px; height: 14px; }
  }

  &__feed {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &__feed-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(0, 174, 255, 0.2) 0%, rgba(2, 16, 36, 0) 72%),
      linear-gradient(135deg, #0E2647 0%, #061328 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        repeating-linear-gradient(0deg, transparent 0 31px, rgba(0, 174, 255, 0.08) 31px 32px),
        repeating-linear-gradient(90deg, transparent 0 31px, rgba(0, 174, 255, 0.08) 31px 32px);
      mix-blend-mode: screen;
    }
  }

  &__image {
    position: relative;
    z-index: 1;
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: $radius-sm;
  }

  &__meta {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 18px;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    color: $color-text-2;
    font-size: $font-size-xs;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dscreen-detail__ctrl-btn {
    transition: none;
  }
}
</style>
