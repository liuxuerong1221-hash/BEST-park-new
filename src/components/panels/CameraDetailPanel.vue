<template>
  <section class="camera-detail">
    <!-- 头部 -->
    <header class="camera-detail__header">
      <div class="camera-detail__title">
        <span class="camera-detail__dot">
          <svg viewBox="0 0 17 17" fill="none">
            <circle cx="8.5" cy="8.5" r="8" stroke="#00AEFF" stroke-width="1"/>
            <circle cx="8.5" cy="8.5" r="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="camera-detail__title-text">实时监控</h3>
      </div>
      <button class="camera-detail__close" type="button" aria-label="关闭" @click="emit('close')">
        <svg viewBox="0 0 14 14" fill="none">
          <path d="M1 1L13 13M13 1L1 13" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    </header>

    <!-- 监控画面 -->
    <div class="camera-detail__feed">
      <div class="camera-detail__feed-bg">
        <span class="camera-detail__feed-scan" />
      </div>
      <button class="camera-detail__expand" type="button" aria-label="放大" @click="openExpand">
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

    <!-- 球机专属：PTZ 控制 -->
    <div v-if="device.type === '球机'" class="camera-detail__ptz">
      <!-- 3×3 方向按钮网格 -->
      <div class="ptz-grid">
        <button
          v-for="d in ptzDirs" :key="d.key"
          class="ptz-btn"
          :class="{ 'ptz-btn--center': d.key === 'talk', 'ptz-btn--on': activePtzDir === d.key }"
          @mousedown="d.key !== 'talk' ? startPtz(d.key) : undefined"
          @mouseup="stopPtz" @mouseleave="stopPtz"
        >
          <span v-if="d.key === 'talk'">喊话</span>
          <svg v-else viewBox="0 0 24 24" fill="none" class="ptz-btn__icon">
            <g :transform="`rotate(${d.angle}, 12, 12)`">
              <path d="M6,15 L12,9 L18,15"
                    stroke="currentColor" stroke-width="2.2"
                    stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </button>
      </div>

      <!-- 焦点 / 焦距 / 光圈 控制按钮组 -->
      <div class="ptz-controls">
        <div v-for="c in ptzCtrls" :key="c.label" class="ptz-ctrl-row">
          <button class="ptz-ctrl-btn" :class="{'ptz-ctrl-btn--on': activePtzDir===c.nearKey}"
                  @mousedown="startPtz(c.nearKey)" @mouseup="stopPtz" @mouseleave="stopPtz">
            {{ c.nearLabel }}
          </button>
          <span class="ptz-ctrl-label">{{ c.label }}</span>
          <button class="ptz-ctrl-btn" :class="{'ptz-ctrl-btn--on': activePtzDir===c.farKey}"
                  @mousedown="startPtz(c.farKey)" @mouseup="stopPtz" @mouseleave="stopPtz">
            {{ c.farLabel }}
          </button>
        </div>
      </div>
    </div>

    <!-- 基础信息 -->
    <div class="camera-detail__info">
      <span class="camera-detail__info-label">基础信息</span>

      <div class="camera-detail__info-row">
        <span class="camera-detail__info-text">名称：{{ device.name }}</span>
        <span class="camera-detail__status" :class="`camera-detail__status--${device.status}`">
          {{ device.status === 'online' ? '在线' : '离线' }}
        </span>
      </div>

      <div class="camera-detail__info-row">
        <span class="camera-detail__info-text">设备位置：{{ device.location }}</span>
      </div>

      <div class="camera-detail__info-row">
        <span class="camera-detail__info-text">类型：{{ device.type }}</span>
        <span v-if="device.type === '球机'" class="camera-detail__info-text">IP：{{ device.ip }}</span>
      </div>
    </div>

    <!-- 关闭按钮 -->
    <div class="camera-detail__footer">
      <PanelCloseButton :width="160" @close="emit('close')" />
    </div>
  </section>

  <!-- 放大弹窗 -->
  <Teleport to="body">
    <div
      v-if="expanded"
      class="camera-modal"
      role="dialog"
      aria-modal="true"
      aria-label="监控画面"
      tabindex="-1"
      @click.self="closeExpand"
      @keydown.esc="closeExpand"
    >
      <section class="camera-modal__panel">
        <header class="camera-modal__header">
          <div class="camera-modal__title">
            <span class="camera-modal__dot" />
            <span class="camera-modal__title-text">{{ device.name }}</span>
            <span class="camera-modal__status" :class="`camera-modal__status--${device.status}`">
              {{ device.status === 'online' ? '在线' : '离线' }}
            </span>
          </div>
          <button class="camera-modal__close" type="button" aria-label="关闭" @click="closeExpand">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </header>
        <div class="camera-modal__feed">
          <div class="camera-modal__feed-bg">
            <span class="camera-modal__feed-scan" />
          </div>
          <div class="camera-modal__meta">
            <span>{{ device.location }}</span>
            <span>{{ device.type }}</span>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PanelCloseButton from '@/components/common/PanelCloseButton.vue'

type DeviceStatus = 'online' | 'offline'

interface DeviceInfo {
  name: string
  location: string
  ip: string
  type: string
  status: DeviceStatus
}

const props = withDefaults(defineProps<{
  device?: DeviceInfo
}>(), {
  device: () => ({
    name: '北大门摄像头',
    location: '北大门',
    ip: '192.168.1.100',
    type: '枪机',
    status: 'online',
  }),
})

const emit = defineEmits<{
  close: []
}>()

const device = computed(() => props.device)
const expanded = ref(false)

// PTZ 控制（球机专属）
const activePtzDir = ref<string | null>(null)

const ptzDirs = [
  { key: 'up-left',    angle: 315 },
  { key: 'up',         angle: 0   },
  { key: 'up-right',   angle: 45  },
  { key: 'left',       angle: 270 },
  { key: 'talk',       angle: 0   },
  { key: 'right',      angle: 90  },
  { key: 'down-left',  angle: 225 },
  { key: 'down',       angle: 180 },
  { key: 'down-right', angle: 135 },
]

const ptzCtrls = [
  { label: '焦点', nearKey: 'focus-near', nearLabel: '前移', farKey: 'focus-far',  farLabel: '后移' },
  { label: '焦距', nearKey: 'zoom-in',    nearLabel: '变大', farKey: 'zoom-out',   farLabel: '变小' },
  { label: '光圈', nearKey: 'iris-open',  nearLabel: '扩大', farKey: 'iris-close', farLabel: '缩小' },
]

function startPtz(dir: string) { activePtzDir.value = dir }
function stopPtz() { activePtzDir.value = null }

function openExpand() { expanded.value = true }
function closeExpand() { expanded.value = false }
</script>

<style lang="scss" scoped>
.camera-detail {
  width: 100%;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid #0B2C52;
  border-radius: 8px;
  padding: 16px $spacing-lg 10px;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  overflow: hidden;
  box-sizing: border-box;

  // 头部
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
    color: $color-text-1;
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

  // 视频区
  &__feed {
    position: relative;
    width: 100%;
    height: 200px;
    border-radius: $radius-sm;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__feed-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(0, 174, 255, 0.18) 0%, rgba(2, 16, 36, 0) 70%),
      linear-gradient(135deg, #0E2647 0%, #061328 100%);

    &::before, &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    &::before {
      background:
        repeating-linear-gradient(0deg, transparent 0 23px, rgba(0, 174, 255, 0.08) 23px 24px),
        repeating-linear-gradient(90deg, transparent 0 23px, rgba(0, 174, 255, 0.08) 23px 24px);
      mix-blend-mode: screen;
    }

    &::after {
      background: linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%);
    }
  }

  &__feed-scan {
    position: absolute;
    left: 0; right: 0; top: 0;
    height: 60px;
    background: linear-gradient(180deg, rgba(0, 174, 255, 0) 0%, rgba(0, 174, 255, 0.28) 50%, rgba(0, 174, 255, 0) 100%);
    animation: feed-scan 4s linear infinite;
    pointer-events: none;
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
    z-index: 1;

    &:hover { opacity: 0.75; }
    svg { width: 100%; height: 100%; }
  }

  // 球机 PTZ 区
  &__ptz {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  // 基础信息
  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__info-label {
    font-size: $font-size-sm;
    color: #00AEFF;
    line-height: 20px;
    font-weight: 500;
  }

  &__info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__info-text {
    font-size: $font-size-sm;
    font-weight: bold;
    color: $color-text-1;
    line-height: 22px;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 64px;
    height: 33px;
    padding: 4px 9px;
    font-size: 18px;
    font-weight: bold;
    border-radius: $radius-md;

    &--online {
      color: $color-success;
      background: rgba(12, 249, 44, 0.2);
    }

    &--offline {
      color: #FF1414;
      background: rgba(255, 72, 72, 0.2);
    }
  }

  // 底部关闭
  &__footer {
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 22px;
  }

  &__close-btn { display: none; }
}

// PTZ 3×3 方向网格
.ptz-grid {
  display: grid;
  grid-template-columns: repeat(3, 36px);
  grid-template-rows: repeat(3, 36px);
  gap: 5px;
  flex-shrink: 0;
}

.ptz-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(0, 174, 255, 0.35);
  background: rgba(6, 18, 48, 0.9);
  color: rgba(160, 220, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: background 0.12s, border-color 0.12s, box-shadow 0.12s;

  &:hover {
    background: rgba(0, 174, 255, 0.18);
    border-color: rgba(0, 174, 255, 0.65);
    box-shadow: 0 0 8px rgba(0, 174, 255, 0.25);
  }

  &--on {
    background: rgba(0, 174, 255, 0.28);
    border-color: $color-primary;
    box-shadow: 0 0 10px rgba(0, 174, 255, 0.5);
    color: #fff;
  }

  &--center {
    background: $color-primary;
    border-color: $color-primary;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 0 12px rgba(0, 174, 255, 0.5);

    &:hover {
      background: rgba(0, 174, 255, 0.85);
      border-color: #fff;
    }
  }

  &__icon {
    width: 15px;
    height: 15px;
  }
}

// 焦点/焦距/光圈 控制组
.ptz-controls {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ptz-ctrl-row {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 36px;
}

.ptz-ctrl-btn {
  flex: 1;
  height: 100%;
  border: 1px solid rgba(0, 174, 255, 0.4);
  background: rgba(0, 174, 255, 0.2);
  color: $color-text-1;
  font-size: $font-size-xxs;
  font-weight: 600;
  border-radius: $radius-sm;
  cursor: pointer;
  transition: background 0.12s, box-shadow 0.12s;
  white-space: nowrap;

  &:hover {
    background: rgba(0, 174, 255, 0.35);
    box-shadow: 0 0 6px rgba(0, 174, 255, 0.3);
  }

  &--on {
    background: rgba(0, 174, 255, 0.55);
    border-color: $color-primary;
    box-shadow: 0 0 10px rgba(0, 174, 255, 0.45);
  }
}

.ptz-ctrl-label {
  width: 26px;
  text-align: center;
  font-size: 10px;
  color: $color-text-2;
  flex-shrink: 0;
  font-weight: 500;
  letter-spacing: 0.02em;
}

@keyframes feed-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(200px); opacity: 0; }
}

// 放大弹窗
.camera-modal {
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

    &::before, &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    &::before {
      background:
        repeating-linear-gradient(0deg, transparent 0 31px, rgba(0, 174, 255, 0.08) 31px 32px),
        repeating-linear-gradient(90deg, transparent 0 31px, rgba(0, 174, 255, 0.08) 31px 32px);
      mix-blend-mode: screen;
    }

    &::after {
      background: linear-gradient(180deg, rgba(0,0,0,0.42) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.52) 100%);
    }
  }

  &__feed-scan {
    position: absolute;
    left: 0; right: 0; top: 0;
    height: 96px;
    background: linear-gradient(180deg, rgba(0, 174, 255, 0) 0%, rgba(0, 174, 255, 0.26) 50%, rgba(0, 174, 255, 0) 100%);
    animation: modal-feed-scan 4.6s linear infinite;
    pointer-events: none;
  }

  &__meta {
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 18px;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    color: $color-text-2;
    font-size: $font-size-xs;
  }
}

@keyframes modal-feed-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(680px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .camera-detail__feed-scan,
  .camera-modal__feed-scan {
    animation: none;
  }
}
</style>
