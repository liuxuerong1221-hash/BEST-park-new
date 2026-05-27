<template>
  <div class="security-camera">
    <!-- 背景图层 -->
    <div class="security-camera__bg" />

    <!-- 左右边框装饰 -->
    <img class="security-camera__frame security-camera__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="security-camera__frame security-camera__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="security-camera__header" />

    <!-- 主内容区 -->
    <main class="security-camera__body">
      <!-- 左侧：监控设备列表（含统计） -->
      <aside class="security-camera__left">
        <CameraListPanel
          :cameras="cameras"
          :selected-id="selectedCameraId"
          @select="selectCamera"
          @visible-change="updateVisibleIds"
        />
      </aside>

      <!-- 返回入口 -->
      <button class="security-camera__back" type="button" @click="goBack">
        <span class="security-camera__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sec-camera-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#sec-camera-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="security-camera__back-text">返回</span>
      </button>

      <!-- 中间：地图区 -->
      <section class="security-camera__center">
        <div class="security-camera__map">
          <CameraMapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :label="marker.name"
            :active="selectedCameraId === marker.id"
            @select="selectCamera(marker.id)"
          />

          <!-- 楼栋聚合点位：复用指南针 + 楼层选择器 -->
          <div class="security-camera__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧：摄像头详情 -->
      <aside v-if="detailVisible" class="security-camera__right">
        <CameraDetailPanel :device="selectedCamera" @close="detailVisible = false" />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="security-camera__bottom" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNav from '@/components/common/BottomNav.vue'
import Compass from '@/components/common/Compass.vue'
import FloorSelector from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import CameraMapMarker from '@/components/common/CameraMapMarker.vue'
import CameraListPanel from '@/components/panels/CameraListPanel.vue'
import CameraDetailPanel from '@/components/panels/CameraDetailPanel.vue'

const router = useRouter()

type CameraStatus = 'online' | 'offline'
type CameraType = '枪机' | '球机' | '半球机'

interface Camera {
  id: number
  name: string
  location: string
  type: CameraType
  ip: string
  status: CameraStatus
  x: number
  y: number
}

const cameras: Camera[] = Array.from({ length: 150 }, (_, i) => {
  const types: CameraType[] = ['枪机', '球机', '半球机']
  return {
    id: i + 1,
    name: `摄像头${String(i + 1).padStart(3, '0')}`,
    location: `${(i % 5) + 1}号楼-${(i % 8) + 1}层`,
    type: types[i % 3],
    ip: `192.168.${Math.floor(i / 255) + 1}.${(i % 255) + 1}`,
    status: (i < 142 ? 'online' : 'offline') as CameraStatus,
    x: 200 + (i * 37 % 800),
    y: 150 + (i * 53 % 400),
  }
})

const selectedCameraId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleIds = ref<number[]>(cameras.slice(0, 10).map(c => c.id))
const selectedFloor = ref('1F')

function onFloorChange(floor: string) {
  selectedFloor.value = floor
}

const selectedCamera = computed(() => {
  if (!selectedCameraId.value) return undefined
  return cameras.find(c => c.id === selectedCameraId.value)
})

const visibleMarkers = computed(() =>
  cameras.filter(c => visibleIds.value.includes(c.id)),
)

function updateVisibleIds(ids: number[]) {
  visibleIds.value = ids
}

function selectCamera(id: number) {
  selectedCameraId.value = id
  detailVisible.value = true
}

function goBack() {
  router.push({ name: 'security' })
}
</script>

<style lang="scss" scoped>
.security-camera {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/大屏背景@2x.png');
    background-size: 100% 100%;
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
    grid-template-columns: $panel-left-w 1fr $panel-right-w;
    height: calc($screen-height - $header-h - $bottom-nav-h);
    padding: 0 40px;
    gap: 8px;
  }

  &__left,
  &__right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    padding: 24px 0 8px;
  }

  &__right {
    position: relative;
    z-index: 20;
  }

  &__center {
    display: flex;
    flex-direction: column;
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

    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
    }
  }

  &__back-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;

    svg {
      width: 40px;
      height: 40px;
      display: block;
    }
  }

  &__back-text {
    font-size: $font-size-xs;
    font-weight: 600;
    line-height: 20px;
    color: $color-text-1;
    white-space: nowrap;
  }

  &__map {
    flex: 1;
    position: relative;
  }

  &__map-controls {
    position: absolute;
    right: 8px;
    bottom: 8px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__bottom {
    position: relative;
    z-index: 10;
    height: $bottom-nav-h;
    padding-bottom: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .security-camera__back {
    transition: none;
  }
}
</style>
