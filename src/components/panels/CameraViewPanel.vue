<template>
  <section class="camera-panel">
    <!-- 头部：标题 + 关闭按钮 -->
    <header class="camera-panel__header">
      <div class="camera-panel__title">
        <span class="camera-panel__dot">
          <svg viewBox="0 0 17 17" fill="none">
            <circle cx="8.5" cy="8.5" r="8" stroke="#00AEFF" stroke-width="1"/>
            <circle cx="8.5" cy="8.5" r="5.5" fill="#00AEFF"/>
          </svg>
        </span>
        <h3 class="camera-panel__title-text">摄像头画面</h3>
      </div>
      <button class="camera-panel__close" type="button" aria-label="关闭" @click="onClose">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z"
            fill="#FFFFFF"/>
        </svg>
      </button>
    </header>

    <!-- 摄像头画面 -->
    <div class="camera-panel__feed">
      <div class="camera-panel__feed-bg">
        <!-- 装饰光带 -->
        <span class="camera-panel__feed-scan" />
        <!-- 角标 -->
        <span class="camera-panel__feed-tag">LIVE</span>
      </div>
      <button class="camera-panel__expand" type="button" aria-label="放大" @click="openExpand">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M1.67 1.67 L6.67 1.67 M1.67 1.67 L1.67 6.67 M1.67 1.67 L7 7"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18.33 1.67 L13.33 1.67 M18.33 1.67 L18.33 6.67 M18.33 1.67 L13 7"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M1.67 18.33 L6.67 18.33 M1.67 18.33 L1.67 13.33 M1.67 18.33 L7 13"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M18.33 18.33 L13.33 18.33 M18.33 18.33 L18.33 13.33 M18.33 18.33 L13 13"
                stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- 会议室信息 -->
    <div class="camera-panel__info">
      <span class="camera-panel__info-label">会议室信息</span>
      <div class="camera-panel__info-row">
        <span class="camera-panel__room-name">{{ room.name }}</span>
        <span class="camera-panel__status" :class="`camera-panel__status--${room.status}`">
          {{ statusLabel }}
        </span>
      </div>
    </div>

    <!-- 数据卡片 -->
    <div class="camera-panel__stats">
      <div class="stat-cell">
        <div class="stat-cell__head">
          <svg class="stat-cell__icon" viewBox="0 0 18 18" fill="none">
            <circle cx="6.5" cy="5.5" r="2.4" stroke="#00AEFF" stroke-width="1.2"/>
            <circle cx="12" cy="6.5" r="1.8" stroke="#00AEFF" stroke-width="1.2"/>
            <path d="M2 14.5C2 12 4 10.5 6.5 10.5C9 10.5 11 12 11 14.5"
                  stroke="#00AEFF" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M11 14.5C11 13 12 11.8 13.6 11.8C15.2 11.8 16.2 13 16.2 14.5"
                  stroke="#00AEFF" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <span class="stat-cell__label">容纳人数</span>
        </div>
        <span class="stat-cell__value">{{ room.capacity }}</span>
      </div>

      <div class="stat-cell">
        <div class="stat-cell__head">
          <svg class="stat-cell__icon" viewBox="0 0 18 18" fill="none">
            <path d="M9 2C6.5 2 4.5 4 4.5 6.5C4.5 8 5 9.3 6 10.5C6.7 11.3 7.7 12.2 9 13.3C10.3 12.2 11.3 11.3 12 10.5C13 9.3 13.5 8 13.5 6.5C13.5 4 11.5 2 9 2Z"
                  stroke="#00AEFF" stroke-width="1.2"/>
            <circle cx="9" cy="6.5" r="1.5" stroke="#00AEFF" stroke-width="1.2"/>
            <ellipse cx="9" cy="15" rx="5" ry="1.2"
                     stroke="#00AEFF" stroke-width="1" stroke-dasharray="2 1.5"/>
          </svg>
          <span class="stat-cell__label">会议室地址</span>
        </div>
        <span class="stat-cell__value">{{ room.location }}</span>
      </div>
    </div>
  </section>

  <Teleport to="body">
    <div
      v-if="expanded"
      class="camera-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="`${room.name}摄像头画面`"
      tabindex="-1"
      @click.self="closeExpand"
      @keydown.esc="closeExpand"
    >
      <section class="camera-modal__panel">
        <header class="camera-modal__header">
          <div class="camera-modal__title">
            <span class="camera-modal__dot" />
            <span class="camera-modal__title-text">{{ room.name }}</span>
            <span class="camera-modal__status" :class="`camera-modal__status--${room.status}`">
              {{ statusLabel }}
            </span>
          </div>
          <button class="camera-modal__close" type="button" aria-label="关闭放大画面" @click="closeExpand">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M9.57 8L15.73 1.86C16.15 1.44 16.15 0.75 15.73 0.31C15.32 -0.10 14.62 -0.10 14.19 0.31L8.02 6.48L1.86 0.31C1.44 -0.10 0.75 -0.10 0.31 0.31C-0.10 0.72 -0.10 1.42 0.31 1.86L6.48 8.02L0.31 14.19C-0.10 14.60 -0.10 15.30 0.31 15.73C0.72 16.15 1.42 16.15 1.86 15.73L8.02 9.57L14.19 15.73C14.60 16.15 15.30 16.15 15.73 15.73C16.15 15.32 16.15 14.62 15.73 14.19L9.57 8Z" fill="#FFFFFF"/>
            </svg>
          </button>
        </header>

        <div class="camera-modal__feed">
          <div class="camera-modal__feed-bg">
            <span class="camera-modal__feed-scan" />
            <span class="camera-modal__feed-tag">LIVE</span>
          </div>
          <div class="camera-modal__meta">
            <span>{{ room.location }}</span>
            <span>容纳人数 {{ room.capacity }}</span>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type RoomStatus = 'in-use' | 'idle' | 'reserved'

interface RoomInfo {
  name: string
  capacity: number
  location: string
  status: RoomStatus
}

const props = withDefaults(defineProps<{
  room?: RoomInfo
}>(), {
  room: () => ({
    name: '一楼203会议室',
    capacity: 272,
    location: '1号楼2层',
    status: 'in-use',
  }),
})

const emit = defineEmits<{
  close: []
}>()

const STATUS_TEXT: Record<RoomStatus, string> = {
  'in-use': '使用中',
  'idle': '空闲中',
  'reserved': '已预约',
}
const room = computed(() => props.room)
const statusLabel = computed(() => STATUS_TEXT[room.value.status])
const expanded = ref(false)

function openExpand() {
  expanded.value = true
}

function closeExpand() {
  expanded.value = false
}

function onClose() {
  // 若放大弹层处于打开状态，先关闭它；否则关闭整个看板
  if (expanded.value) {
    expanded.value = false
    return
  }
  emit('close')
}
</script>

<style lang="scss" scoped>
.camera-panel {
  width: 100%;
  background: rgba(5, 25, 49, 0.64);
  border: 1px solid #0B2C52;
  border-radius: $radius-sm;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__dot {
    width: 17px;
    height: 17px;
    display: inline-flex;
  }
  &__dot svg { width: 100%; height: 100%; }

  &__title-text {
    margin: 0;
    font-family: 'PingFang SC', sans-serif;
    font-size: $font-size-sm;
    font-weight: bold;
    color: $color-text-1;
    line-height: 20px;
  }

  &__close {
    width: 26px;
    height: 26px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 5px;
    color: $color-text-1;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:hover { opacity: 0.75; }

    svg { width: 16px; height: 16px; }
  }

  // 摄像头画面区
  &__feed {
    position: relative;
    width: 100%;
    height: 226px;
    border-radius: $radius-sm;
    overflow: hidden;
  }

  &__feed-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, rgba(0, 174, 255, 0.18) 0%, rgba(2, 16, 36, 0) 70%),
      linear-gradient(135deg, #0E2647 0%, #061328 100%);

    &::before,
    &::after {
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
    left: 0;
    right: 0;
    top: 0;
    height: 60px;
    background: linear-gradient(180deg, rgba(0, 174, 255, 0) 0%, rgba(0, 174, 255, 0.28) 50%, rgba(0, 174, 255, 0) 100%);
    animation: feed-scan 4s linear infinite;
    pointer-events: none;
  }

  &__feed-tag {
    position: absolute;
    top: 10px;
    left: 12px;
    padding: 2px 8px;
    background: rgba(216, 47, 41, 0.85);
    color: $color-text-1;
    font-family: $font-number;
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
    border-radius: 2px;
    z-index: 1;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #FFFFFF;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
      animation: feed-blink 1.4s ease-in-out infinite;
    }
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

  // 信息区
  &__info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__info-label {
    font-size: $font-size-sm;
    color: $color-text-1;
    line-height: 20px;
  }

  &__info-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__room-name {
    font-family: 'PingFang SC', sans-serif;
    font-size: 26px;
    font-weight: bold;
    color: $color-text-1;
    line-height: 1.1;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 33px;
    padding: 4px 9px;
    font-size: 18px;
    font-weight: bold;
    border-radius: $radius-md;

    &--in-use {
      color: #FF1414;
      background: rgba(255, 72, 72, 0.2);
    }
    &--idle {
      color: $color-success;
      background: rgba(46, 208, 176, 0.2);
    }
    &--reserved {
      color: $color-primary-bright;
      background: rgba(77, 242, 255, 0.18);
    }
  }

  // 数据卡片
  &__stats {
    display: flex;
    gap: 20px;
    padding: 20px;
    background: linear-gradient(180deg, rgba(7, 33, 70, 0) 1%, #082A5D 99%);
    border: 1px solid rgba(68, 181, 242, 0.2);
    border-radius: $radius-sm;
  }
}

.stat-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  min-width: 0;

  &__head {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &__label {
    font-size: $font-size-xs;
    color: $color-text-1;
    line-height: 20px;
    white-space: nowrap;
  }

  &__value {
    font-family: 'PingFang SC', sans-serif;
    font-size: 18px;
    font-weight: bold;
    color: $color-text-1;
    line-height: 25px;
    white-space: nowrap;
  }
}

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

    &--in-use {
      color: #FF1414;
      background: rgba(255, 72, 72, 0.2);
    }

    &--idle {
      color: $color-success;
      background: rgba(46, 208, 176, 0.2);
    }

    &--reserved {
      color: $color-primary-bright;
      background: rgba(77, 242, 255, 0.18);
    }
  }

  &__close {
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 0;
    padding: 7px;
    background: transparent;
    cursor: pointer;

    &:hover { opacity: 0.75; }
    svg { width: 16px; height: 16px; }
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

    &::before,
    &::after {
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
    left: 0;
    right: 0;
    top: 0;
    height: 96px;
    background: linear-gradient(180deg, rgba(0, 174, 255, 0) 0%, rgba(0, 174, 255, 0.26) 50%, rgba(0, 174, 255, 0) 100%);
    animation: modal-feed-scan 4.6s linear infinite;
    pointer-events: none;
  }

  &__feed-tag {
    position: absolute;
    top: 18px;
    left: 20px;
    padding: 3px 10px;
    background: rgba(216, 47, 41, 0.85);
    color: $color-text-1;
    font-family: $font-number;
    font-size: $font-size-xxs;
    font-weight: bold;
    letter-spacing: 1px;
    border-radius: 2px;
    z-index: 1;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #FFFFFF;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
      animation: feed-blink 1.4s ease-in-out infinite;
    }
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

@keyframes feed-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(226px); opacity: 0; }
}

@keyframes feed-blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.3; }
}

@keyframes modal-feed-scan {
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { transform: translateY(680px); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .camera-panel__feed-scan,
  .camera-panel__feed-tag::before,
  .camera-modal__feed-scan,
  .camera-modal__feed-tag::before {
    animation: none;
  }
}
</style>
