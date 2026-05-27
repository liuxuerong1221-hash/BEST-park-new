<template>
  <BasePanel class="mach-monitor" title="机房监控">
    <div class="mach-monitor__body">
      <!-- 左侧机房列表 -->
      <aside class="mach-monitor__locations">
        <button
          class="mach-monitor__locations-arrow mach-monitor__locations-arrow--up"
          type="button"
          aria-label="向上滚动"
          :disabled="!canScrollUp"
          @click="scrollLocations(-1)"
        >
          <svg viewBox="0 0 12 8" fill="none">
            <path d="M1 7L6 2L11 7" stroke="#4DF2FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div ref="locationsScrollRef" class="mach-monitor__locations-scroll" @scroll="onLocationsScroll">
          <button
            v-for="loc in locations"
            :key="loc.id"
            class="mach-monitor__location"
            :class="{ 'mach-monitor__location--active': loc.id === activeLocation }"
            type="button"
            @click="selectLocation(loc.id)"
          >{{ loc.name }}</button>
        </div>
        <button
          class="mach-monitor__locations-arrow mach-monitor__locations-arrow--down"
          type="button"
          aria-label="向下滚动"
          :disabled="!canScrollDown"
          @click="scrollLocations(1)"
        >
          <svg viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="#4DF2FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </aside>

      <!-- 右侧主视图 -->
      <div class="mach-monitor__main">
        <!-- 摄像头选择 + 轮播开关 -->
        <header class="mach-monitor__header">
          <div
            ref="cameraSelectRef"
            class="mach-monitor__camera-select"
            @click="toggleCameraMenu"
          >
            <span class="mach-monitor__camera-label">{{ activeCameraName }}</span>
            <svg
              class="mach-monitor__camera-arrow"
              :class="{ 'mach-monitor__camera-arrow--open': cameraMenuOpen }"
              viewBox="0 0 10 6"
              fill="none"
            >
              <path d="M1 1L5 5L9 1" stroke="#4DF2FF" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="mach-monitor__carousel-toggle">
            <span class="mach-monitor__carousel-label">轮播</span>
            <button
              class="mach-monitor__carousel-switch"
              :class="{ 'mach-monitor__carousel-switch--on': carouselEnabled }"
              type="button"
              @click="toggleCarousel"
            >
              <span class="mach-monitor__carousel-switch-dot" />
            </button>
            <span class="mach-monitor__carousel-status">{{ carouselEnabled ? '开启' : '关闭' }}</span>
          </div>
        </header>

        <!-- 视频区 -->
        <div class="mach-monitor__video">
          <div class="mach-monitor__video-grid" />
          <div class="mach-monitor__video-scan" />
          <button class="mach-monitor__play" type="button" aria-label="播放">
            <svg viewBox="0 0 39 38" fill="none">
              <circle cx="19.5" cy="19" r="18.5" fill="rgba(2,37,79,0.6)" stroke="#4DF2FF"/>
              <path d="M16 12L26 19L16 26V12Z" fill="#4DF2FF"/>
            </svg>
          </button>
          <button class="mach-monitor__expand" type="button" aria-label="放大" @click="toggleFullscreen">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M3 7V3H7M13 3H17V7M17 13V17H13M7 17H3V13"
                    stroke="#4DF2FF" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-if="currentCameras.length > 1" class="mach-monitor__dots">
            <button
              v-for="cam in currentCameras"
              :key="cam.id"
              class="mach-monitor__dot"
              :class="{ 'mach-monitor__dot--active': cam.id === activeCameraId }"
              type="button"
              :aria-label="cam.name"
              @click="selectCameraDirect(cam.id)"
            />
          </div>
        </div>

        <!-- 底部进度条 -->
        <footer class="mach-monitor__footer">
          <span class="mach-monitor__time">14:12</span>
          <div class="mach-monitor__progress">
            <div class="mach-monitor__progress-fill" :style="{ width: progress + '%' }" />
          </div>
          <span class="mach-monitor__time">23:59</span>
        </footer>
      </div>
    </div>

    <!-- 摄像头下拉菜单 -->
    <Teleport to="body">
      <div
        v-if="cameraMenuOpen"
        class="mach-monitor-camera-menu"
        :style="cameraMenuStyle"
        @click.stop
      >
        <button
          v-for="cam in currentCameras"
          :key="cam.id"
          class="mach-monitor-camera-menu__item"
          :class="{ 'mach-monitor-camera-menu__item--active': cam.id === activeCameraId }"
          type="button"
          @click="selectCamera(cam.id)"
        >{{ cam.name }}</button>
      </div>
    </Teleport>

    <!-- 全屏视图 -->
    <Teleport to="body">
      <div v-if="fullscreen" class="mach-monitor-fullscreen" @click="toggleFullscreen">
        <div class="mach-monitor-fullscreen__content" @click.stop>
          <header class="mach-monitor-fullscreen__header">
            <span class="mach-monitor-fullscreen__title">{{ currentLocationName }} - {{ activeCameraName }}</span>
            <div class="mach-monitor-fullscreen__actions">
              <div class="mach-monitor__carousel-toggle">
                <span class="mach-monitor__carousel-label">轮播</span>
                <button
                  class="mach-monitor__carousel-switch"
                  :class="{ 'mach-monitor__carousel-switch--on': carouselEnabled }"
                  type="button"
                  @click="toggleCarousel"
                >
                  <span class="mach-monitor__carousel-switch-dot" />
                </button>
                <span class="mach-monitor__carousel-status">{{ carouselEnabled ? '开启' : '关闭' }}</span>
              </div>
              <button class="mach-monitor-fullscreen__close" type="button" @click="toggleFullscreen">
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </header>
          <div class="mach-monitor-fullscreen__video">
            <div class="mach-monitor__video-grid" />
            <div class="mach-monitor__video-scan" />
            <button class="mach-monitor__play" type="button" aria-label="播放">
              <svg viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="29" fill="rgba(2,37,79,0.6)" stroke="#4DF2FF" stroke-width="2"/>
                <path d="M24 18L42 30L24 42V18Z" fill="#4DF2FF"/>
              </svg>
            </button>
            <div v-if="currentCameras.length > 1" class="mach-monitor__dots">
              <button
                v-for="cam in currentCameras"
                :key="cam.id"
                class="mach-monitor__dot"
                :class="{ 'mach-monitor__dot--active': cam.id === activeCameraId }"
                type="button"
                :aria-label="cam.name"
                @click="selectCameraDirect(cam.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </BasePanel>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'

export interface MachRoom { id: number; name: string; cameraCount: number }

interface Location { id: number; name: string; cameras: Camera[] }
interface Camera    { id: string; name: string }

const locations: Location[] = [
  { id: 1, name: '机房1', cameras: [{ id: '1-1', name: '机房1-摄像头1' }, { id: '1-2', name: '机房1-摄像头2' }] },
  { id: 2, name: '机房2', cameras: [{ id: '2-1', name: '机房2-摄像头1' }] },
  { id: 3, name: '机房3', cameras: [{ id: '3-1', name: '机房3-摄像头1' }, { id: '3-2', name: '机房3-摄像头2' }, { id: '3-3', name: '机房3-摄像头3' }] },
  { id: 4, name: '机房4', cameras: [{ id: '4-1', name: '机房4-摄像头1' }, { id: '4-2', name: '机房4-摄像头2' }] },
  { id: 5, name: '机房5', cameras: [{ id: '5-1', name: '机房5-摄像头1' }] },
]

const activeLocation   = ref(1)
const activeCameraId   = ref('1-1')
const carouselEnabled  = ref(true)
const progress         = ref(58)
const fullscreen       = ref(false)
const locationsScrollRef = ref<HTMLElement | null>(null)
const canScrollUp      = ref(false)
const canScrollDown    = ref(true)
const cameraMenuOpen   = ref(false)
const cameraSelectRef  = ref<HTMLElement | null>(null)
const cameraMenuPos    = ref({ top: 0, left: 0 })

const currentLocation     = computed(() => locations.find(l => l.id === activeLocation.value) ?? locations[0])
const currentLocationName = computed(() => currentLocation.value.name)
const currentCameras      = computed(() => currentLocation.value.cameras)
const activeCamera        = computed(() => currentCameras.value.find(c => c.id === activeCameraId.value) ?? currentCameras.value[0])
const activeCameraName    = computed(() => activeCamera.value?.name ?? '摄像头1')

const cameraMenuStyle = computed(() => ({
  top: `${cameraMenuPos.value.top}px`,
  left: `${cameraMenuPos.value.left}px`,
  transform: 'scale(var(--app-scale, 1))',
  transformOrigin: 'top left',
}))

function selectLocation(id: number) {
  activeLocation.value = id
  activeCameraId.value = currentCameras.value[0]?.id ?? ''
}

function scrollLocations(direction: number) {
  locationsScrollRef.value?.scrollBy({ top: direction * 56, behavior: 'smooth' })
}

function updateScrollState() {
  const el = locationsScrollRef.value
  if (!el) return
  canScrollUp.value   = el.scrollTop > 1
  canScrollDown.value = el.scrollTop < el.scrollHeight - el.clientHeight - 1
}

function onLocationsScroll() { updateScrollState() }

function toggleCameraMenu() {
  cameraMenuOpen.value = !cameraMenuOpen.value
  if (cameraMenuOpen.value) {
    const el = cameraSelectRef.value
    if (el) {
      const r = el.getBoundingClientRect()
      cameraMenuPos.value = { top: r.bottom + 4, left: r.left }
    }
  }
}

function selectCamera(id: string) { activeCameraId.value = id; cameraMenuOpen.value = false }

function selectCameraDirect(id: string) {
  activeCameraId.value = id
  if (carouselEnabled.value) { stopCarousel(); startCarousel() }
}

function onDocClick(e: MouseEvent) {
  if (!cameraMenuOpen.value) return
  const menu    = document.querySelector('.mach-monitor-camera-menu')
  const trigger = cameraSelectRef.value
  const target  = e.target as Node
  if (trigger?.contains(target)) return
  if (menu?.contains(target)) return
  cameraMenuOpen.value = false
}

let carouselTimer: ReturnType<typeof setInterval> | null = null

function toggleCarousel() { carouselEnabled.value = !carouselEnabled.value }

function startCarousel() {
  stopCarousel()
  carouselTimer = setInterval(() => {
    const cams = currentCameras.value
    const idx  = cams.findIndex(c => c.id === activeCameraId.value)
    activeCameraId.value = cams[(idx + 1) % cams.length].id
  }, 30000)
}

function stopCarousel() {
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null }
}

function toggleFullscreen() { fullscreen.value = !fullscreen.value }

watch(carouselEnabled, (on) => { on ? startCarousel() : stopCarousel() }, { immediate: true })
watch(activeLocation, () => { if (carouselEnabled.value) { stopCarousel(); startCarousel() } })

onMounted(() => {
  document.addEventListener('click', onDocClick)
  updateScrollState()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  stopCarousel()
})
</script>

<style lang="scss" scoped>
.mach-monitor {
  flex: 0 0 auto;
  height: 283px;
  gap: $spacing-xs;

  &__body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 86px 1fr;
    gap: 0;
  }

  &__locations {
    display: flex;
    flex-direction: column;
    background: rgba(5, 25, 49, 0.64);
    border-right: 1px solid #0B2C52;
    min-height: 0;
  }

  &__locations-arrow {
    width: 100%;
    height: 20px;
    flex-shrink: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;

    svg { width: 12px; height: 8px; }

    &:hover:not(:disabled) { background: rgba(0, 174, 255, 0.12); }
    &:disabled { cursor: not-allowed; opacity: 0.3; }

    &--up   { border-bottom: 1px solid rgba(0, 174, 255, 0.15); }
    &--down { border-top:    1px solid rgba(0, 174, 255, 0.15); }
  }

  &__locations-scroll {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 4px 0;

    &::-webkit-scrollbar { width: 0; }
  }

  &__location {
    width: 100%;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    color: $color-text-2;
    font-size: $font-size-xs;
    font-family: $font-body;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.2s ease, color 0.2s ease;
    position: relative;

    &:hover { background: rgba(0, 174, 255, 0.08); color: $color-text-1; }

    &--active {
      background: linear-gradient(90deg, rgba(0, 174, 255, 0.2) 0%, rgba(0, 174, 255, 0.05) 100%);
      color: $color-primary-bright;

      &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 4px;
        height: 12px;
        background: $color-primary-bright;
        border-radius: 2px;
      }
      &::before { left: 0;  transform: translateY(-50%); }
      &::after  { right: 0; transform: translateY(-50%); }
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  &__header {
    height: 27px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    background: linear-gradient(89deg, #09284D 2%, rgba(5, 25, 49, 0) 98%);
    border-bottom: 1px solid rgba(0, 174, 255, 0.25);
    flex-shrink: 0;
  }

  &__camera-select {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: rgba(12, 31, 54, 0.38);
    border: 1px solid #14578F;
    border-radius: 2px;
    cursor: pointer;
  }

  &__camera-label {
    font-size: $font-size-xxs;
    color: $color-primary-bright;
    line-height: 1;
  }

  &__camera-arrow {
    width: 10px;
    height: 6px;
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &--open { transform: rotate(180deg); }
  }

  &__carousel-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__carousel-label, &__carousel-status {
    font-size: $font-size-xxs;
    color: $color-text-2;
  }

  &__carousel-switch {
    position: relative;
    width: 32px;
    height: 18px;
    border-radius: 999px;
    background: rgba(0, 174, 255, 0.18);
    border: 1px solid rgba(0, 174, 255, 0.3);
    cursor: pointer;
    padding: 0;
    transition: background 0.2s ease, border-color 0.2s ease;

    &--on { background: rgba(77, 242, 255, 0.35); border-color: $color-primary-bright; }
    &:hover { border-color: $color-primary-bright; }
  }

  &__carousel-switch-dot {
    position: absolute;
    top: 1px;
    left: 1px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #D1EDFF;
    transition: transform 0.2s ease, background 0.2s ease;

    .mach-monitor__carousel-switch--on & { transform: translateX(14px); background: #fff; }
  }

  &__video {
    flex: 1;
    min-height: 0;
    position: relative;
    background:
      radial-gradient(circle at 50% 60%, rgba(0, 60, 120, 0.55) 0%, rgba(2, 12, 28, 0.85) 70%),
      #02101e;
    overflow: hidden;
  }

  &__video-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(77, 242, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(77, 242, 255, 0.06) 1px, transparent 1px);
    background-size: 28px 28px;
  }

  &__video-scan {
    position: absolute;
    left: 0; right: 0; top: -2px;
    height: 60px;
    background: linear-gradient(180deg, rgba(77, 242, 255, 0) 0%, rgba(77, 242, 255, 0.18) 50%, rgba(77, 242, 255, 0) 100%);
    animation: mach-scan 4s linear infinite;
    pointer-events: none;
  }

  &__play {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 39px;
    height: 38px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 0;

    svg { width: 100%; height: 100%; filter: drop-shadow(0 0 8px rgba(77, 242, 255, 0.55)); }
    &:hover svg { filter: drop-shadow(0 0 12px rgba(77, 242, 255, 0.85)); }
  }

  &__expand {
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 22px;
    height: 22px;
    background: rgba(2, 37, 79, 0.6);
    border: 1px solid rgba(77, 242, 255, 0.4);
    border-radius: 3px;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg { width: 14px; height: 14px; }
    &:hover { border-color: $color-primary-bright; box-shadow: 0 0 6px rgba(77, 242, 255, 0.5); }
  }

  &__dots {
    position: absolute;
    left: 50%;
    bottom: 9px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 9px;
    z-index: 2;
  }

  &__dot {
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.35);
    border: 0;
    padding: 0;
    cursor: pointer;
    transition: width 0.3s ease, background 0.3s ease;

    &:hover { background: rgba(255, 255, 255, 0.6); }
    &--active { width: 20px; background: rgba(77, 242, 255, 0.85); box-shadow: 0 0 6px rgba(77, 242, 255, 0.6); }
  }

  &__footer {
    height: 25px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    background: rgba(0, 30, 58, 0.5);
    flex-shrink: 0;
  }

  &__time {
    font-family: $font-number;
    font-size: 10px;
    color: $color-text-2;
    flex-shrink: 0;
  }

  &__progress {
    flex: 1;
    height: 3px;
    background: rgba(0, 174, 255, 0.18);
    border-radius: 2px;
    overflow: hidden;
    position: relative;
  }

  &__progress-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: linear-gradient(90deg, #00AEFF 0%, #4DF2FF 100%);
    border-radius: 2px;
    box-shadow: 0 0 6px rgba(77, 242, 255, 0.6);

    &::after {
      content: '';
      position: absolute;
      right: -3px;
      top: 50%;
      width: 8px;
      height: 8px;
      background: $color-primary-bright;
      border-radius: 50%;
      transform: translateY(-50%);
      box-shadow: 0 0 6px $color-primary-bright;
    }
  }
}

.mach-monitor-camera-menu {
  position: fixed;
  min-width: 140px;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(5, 25, 49, 0.95);
  border: 1px solid $color-border;
  border-radius: 4px;
  box-shadow: $shadow-panel;
  backdrop-filter: blur(12px);
  z-index: 9999;
  padding: 4px 0;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(77, 242, 255, 0.3); border-radius: 2px; }

  &__item {
    width: 100%;
    padding: 6px 12px;
    border: 0;
    background: transparent;
    color: $color-text-2;
    font-size: $font-size-xs;
    font-family: $font-body;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &:hover { background: rgba(0, 174, 255, 0.12); color: $color-text-1; }
    &--active { background: rgba(77, 242, 255, 0.18); color: $color-primary-bright; }
  }
}

.mach-monitor-fullscreen {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);

  &__content {
    width: 90vw;
    height: 85vh;
    max-width: 1600px;
    max-height: 900px;
    display: flex;
    flex-direction: column;
    background: rgba(5, 25, 49, 0.95);
    border: 1px solid $color-border;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
    overflow: hidden;
  }

  &__header {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background: linear-gradient(89deg, #09284D 2%, rgba(5, 25, 49, 0) 98%);
    border-bottom: 1px solid rgba(0, 174, 255, 0.25);
    flex-shrink: 0;
  }

  &__title {
    font-size: $font-size-md;
    color: $color-text-1;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__close {
    width: 32px;
    height: 32px;
    border: 0;
    background: rgba(2, 37, 79, 0.6);
    border-radius: 4px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    svg { width: 20px; height: 20px; }
    &:hover { background: rgba(77, 242, 255, 0.2); }
  }

  &__video {
    flex: 1;
    min-height: 0;
    position: relative;
    background:
      radial-gradient(circle at 50% 60%, rgba(0, 60, 120, 0.55) 0%, rgba(2, 12, 28, 0.85) 70%),
      #02101e;
    overflow: hidden;

    .mach-monitor__play { width: 60px; height: 60px; }
  }
}

@keyframes mach-scan {
  0%   { transform: translateY(0); }
  100% { transform: translateY(260px); }
}

@media (prefers-reduced-motion: reduce) {
  .mach-monitor__video-scan { animation: none; }
}
</style>
