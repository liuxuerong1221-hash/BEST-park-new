<template>
  <div class="security-cabinet">
    <div class="security-cabinet__bg" />
    <img class="security-cabinet__frame security-cabinet__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="security-cabinet__frame security-cabinet__frame--right" src="@/assets/images/left-右.png" alt="" />

    <AppHeader class="security-cabinet__header" />

    <h2 class="security-cabinet__name">{{ cabinetName }}</h2>

    <main class="security-cabinet__body">
      <!-- 左侧数据面板 -->
      <aside class="security-cabinet__left">
        <MachineryMonitorPanel />
        <MachineryAlertTrendPanel />
        <MachineryAlertRecordPanel />
      </aside>

      <!-- 返回按钮 -->
      <button class="security-cabinet__back" type="button" @click="goBack">
        <span class="security-cabinet__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="cab-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2,37,79,0.6)" stroke="url(#cab-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="security-cabinet__back-text">返回</span>
      </button>

      <!-- 中间：打点 + 弹窗 -->
      <section class="security-cabinet__center">
        <div
          v-for="pin in pins"
          :key="pin.id"
          class="security-cabinet__pin-wrap"
          :style="{ left: pin.x + '%', top: pin.y + '%' }"
          @click="togglePin(pin.id)"
        >
          <img
            class="security-cabinet__marker"
            :class="{ 'security-cabinet__marker--active': activePin === pin.id }"
            src="@/assets/images/机柜里面打点.svg"
            alt=""
          />
          <Transition name="popup">
            <div v-if="activePin === pin.id" class="security-cabinet__popup" @click.stop>
              <button class="security-cabinet__popup-close" @click.stop="activePin = null">
                <svg viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
              <div class="security-cabinet__popup-row">
                <span class="security-cabinet__popup-label">设备名称：</span>
                <span class="security-cabinet__popup-value">{{ pin.name }}</span>
              </div>
              <div class="security-cabinet__popup-row">
                <span class="security-cabinet__popup-label">设备IP：</span>
                <span class="security-cabinet__popup-value">{{ pin.ip }}</span>
              </div>
              <div class="security-cabinet__popup-row">
                <span class="security-cabinet__popup-label">设备类型：</span>
                <span class="security-cabinet__popup-value">{{ pin.type }}</span>
              </div>
              <div class="security-cabinet__popup-divider" />
              <div class="security-cabinet__popup-row">
                <span class="security-cabinet__popup-label">U位范围：</span>
                <span class="security-cabinet__popup-value">{{ pin.uRange }}</span>
              </div>
              <div class="security-cabinet__popup-row">
                <span class="security-cabinet__popup-label">占据U数：</span>
                <span class="security-cabinet__popup-value">{{ pin.uCount }}</span>
              </div>
              <div class="security-cabinet__popup-divider" />
              <div class="security-cabinet__popup-row">
                <span class="security-cabinet__popup-label">备注：</span>
                <span class="security-cabinet__popup-value">{{ pin.remark }}</span>
              </div>
            </div>
          </Transition>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppHeader               from '@/components/common/AppHeader.vue'
import MachineryMonitorPanel     from '@/components/panels/MachineryMonitorPanel.vue'
import MachineryAlertTrendPanel  from '@/components/panels/MachineryAlertTrendPanel.vue'
import MachineryAlertRecordPanel from '@/components/panels/MachineryAlertRecordPanel.vue'

const router = useRouter()
const route  = useRoute()

const cabinetName = computed(() => (route.query.name as string) || '机柜')
const activePin   = ref<number | null>(null)

const pins = [
  { id: 1, x: 38, y: 40, name: '服务器001', ip: '10.1.1.198', type: '服务器', uRange: '14U-15U', uCount: '2U', remark: '系统专用' },
  { id: 2, x: 58, y: 55, name: '交换机001', ip: '10.1.1.101', type: '交换机', uRange: '8U-9U',   uCount: '1U', remark: '网络核心' },
]

function togglePin(id: number) {
  activePin.value = activePin.value === id ? null : id
}

function goBack() {
  router.push({ name: 'security-machinery' })
}
</script>

<style lang="scss" scoped>
.security-cabinet {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/bg-机柜.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }

  &__frame {
    position: absolute;
    top: 8px;
    bottom: 8px;
    height: calc(100% - 16px);
    width: auto;
    pointer-events: none;
    z-index: 30;

    &--left  { left: 0; }
    &--right { right: 0; }
  }

  &__header {
    position: relative;
    z-index: 10;
    height: $header-h;
  }

  &__body {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: $panel-left-w 1fr;
    height: calc($screen-height - $header-h);
    padding: 0 40px;
    gap: 8px;
  }

  &__left {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    padding: 24px 0 24px;
  }

  &__center {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // 打点容器
  &__pin-wrap {
    position: absolute;
    transform: translate(-50%, -100%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 5;
  }

  &__marker {
    width: 40px;
    height: 52.5px;
    display: block;
    filter: drop-shadow(0 0 8px rgba(0, 174, 255, 0.6));
    animation: pin-float 3s ease-in-out infinite;
    transition: filter 0.18s ease, transform 0.18s ease;

    &:hover {
      filter: drop-shadow(0 0 16px rgba(77, 242, 255, 0.9));
      transform: scale(1.15);
    }

    &--active {
      filter: drop-shadow(0 0 16px rgba(77, 242, 255, 0.9));
    }
  }

  // 弹窗
  &__popup {
    position: absolute;
    bottom: calc(100% + 12px);
    left: 50%;
    transform: translateX(-50%);
    width: 240px;
    background: rgba(5, 25, 49, 0.92);
    border: 1px solid rgba(0, 174, 255, 0.4);
    border-radius: 8px;
    box-shadow: 0 0 24px rgba(0, 174, 255, 0.2);
    padding: 16px;
    z-index: 20;
    backdrop-filter: blur(8px);
  }

  &__popup-close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.18s;
    svg { width: 12px; height: 12px; display: block; }
    &:hover { opacity: 1; }
  }

  &__popup-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    padding: 5px 0;
  }

  &__popup-label {
    font-size: $font-size-xs;
    color: $color-text-2;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__popup-value {
    font-size: $font-size-xs;
    color: $color-text-1;
    font-weight: 500;
  }

  &__popup-divider {
    height: 1px;
    background: rgba(0, 174, 255, 0.15);
    margin: 4px 0;
  }

  &__name {
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    z-index: 15;
    font-size: 48px;
    font-weight: 700;
    color: $color-text-1;
    letter-spacing: 0.12em;
    text-shadow: 0 0 24px rgba(0, 174, 255, 0.6), 0 2px 8px rgba(0, 0, 0, 0.8);
    pointer-events: none;
    white-space: nowrap;
  }

  &__back {
    position: absolute;
    left: calc(40px + #{$panel-left-w} + 24px);
    top: 24px;
    z-index: 12;
    width: 105px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 16px 0 0;
    border: 0;
    border-radius: 20px;
    background: rgba(10, 15, 21, 0.5);
    color: $color-text-1;
    cursor: pointer;
    outline: none;
    transition: transform 0.18s ease, filter 0.18s ease;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 10px rgba(29, 234, 255, 0.34));
    }
  }

  &__back-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    svg { width: 40px; height: 40px; display: block; }
  }

  &__back-text {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
    white-space: nowrap;
  }
}

@keyframes pin-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(6px);
}
</style>
