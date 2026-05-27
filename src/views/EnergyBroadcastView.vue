<template>
  <div class="broadcast">
    <!-- 背景图层 -->
    <div class="broadcast__bg" />

    <!-- 左右边框装饰 -->
    <img class="broadcast__frame broadcast__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="broadcast__frame broadcast__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="broadcast__header" />

    <!-- 主内容区 -->
    <main class="broadcast__body">
      <!-- 左侧 -->
      <aside class="broadcast__left">
        <BroadcastStatsPanel />
        <BroadcastListPanel
          :meters="devices"
          :selected-id="selectedDeviceId"
          :filter-building-id="selectedBuildingId"
          @select="selectDevice"
          @visible-change="updateVisibleDeviceIds"
        />
      </aside>

      <!-- 返回按钮 -->
      <button class="broadcast__back" type="button" @click="goBack">
        <span class="broadcast__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="broadcast-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#broadcast-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="broadcast__back-text">返回</span>
      </button>

      <!-- 中间：地图区 -->
      <section class="broadcast__center">
        <div class="broadcast__map">
          <BroadcastMapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :label="marker.name"
            :active="selectedDeviceId === marker.id"
            :dimmed="selectedBuildingId != null && marker.buildingId !== selectedBuildingId"
            @select="selectDevice(marker.id)"
          />

          <!-- 楼栋聚合点位：复用指南针 + 楼层选择器 -->
          <div class="broadcast__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧：广播详情 -->
      <aside v-if="detailVisible && selectedDevice" class="broadcast__right">
        <BroadcastDetailPanel :device="selectedDevice" @close="detailVisible = false" />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="broadcast__bottom" />
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
import BroadcastStatsPanel from '@/components/panels/BroadcastStatsPanel.vue'
import BroadcastListPanel from '@/components/panels/BroadcastListPanel.vue'
import BroadcastDetailPanel from '@/components/panels/BroadcastDetailPanel.vue'
import BroadcastMapMarker from '@/components/common/BroadcastMapMarker.vue'

const router = useRouter()

type BroadcastStatus = 'online' | 'offline'
interface BroadcastDevice {
  id: number
  name: string
  location: string
  ip: string
  status: BroadcastStatus
  buildingId: number
  currentValue: number
  x: number
  y: number
}

const selectedFloor = ref('1F')

function onFloorChange(floor: string) {
  selectedFloor.value = floor
}

const LOCATION_BY_BUILDING: Record<number, string> = {
  1: '建筑1一楼大厅',
  2: '建筑2二楼走廊',
  3: '建筑3三楼会议室',
  4: '建筑4负一层车库',
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const TOTAL_DEVICES = 88
const ONLINE_COUNT = 79

const devices: BroadcastDevice[] = Array.from({ length: TOTAL_DEVICES }, (_, i) => {
  const id = i + 1
  const buildingId = (i % 4) + 1
  return {
    id,
    name: `广播${id}`,
    location: LOCATION_BY_BUILDING[buildingId],
    ip: `SD-BCAST${String(id).padStart(3, '0')}`,
    status: (i < ONLINE_COUNT ? 'online' : 'offline') as BroadcastStatus,
    buildingId,
    currentValue: 20 + ((i * 7) % 60),
    x: 160 + Math.floor(pseudoRandom(id * 12.9898) * 760),
    y: 100 + Math.floor(pseudoRandom(id * 78.233) * 460),
  }
})

const selectedDeviceId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleDeviceIds = ref<number[]>(devices.slice(0, 10).map(m => m.id))
const selectedBuildingId = ref<number | null>(null)
const selectedDevice = computed(() => {
  if (selectedDeviceId.value == null) return undefined
  return devices.find(m => m.id === selectedDeviceId.value)
})

const visibleMarkers = computed(() => devices.filter(m => visibleDeviceIds.value.includes(m.id)))

function updateVisibleDeviceIds(ids: number[]) {
  visibleDeviceIds.value = ids
}

function selectDevice(id: number) {
  selectedDeviceId.value = id
  detailVisible.value = true
}

function goBack() {
  router.push({ name: 'energy' })
}
</script>

<style lang="scss" scoped>
.broadcast {
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
    align-self: start;
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
  }

  &__back-icon svg {
    width: 40px;
    height: 40px;
    display: block;
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
  .broadcast__back {
    transition: none;
  }
}
</style>
