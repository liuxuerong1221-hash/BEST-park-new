<template>
  <div class="lighting">
    <!-- 背景图层 -->
    <div class="lighting__bg" />

    <!-- 左右边框装饰 -->
    <img class="lighting__frame lighting__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="lighting__frame lighting__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="lighting__header" />

    <!-- 主内容区 -->
    <main class="lighting__body">
      <!-- 左侧 -->
      <aside class="lighting__left">
        <LightingStatsPanel />
        <LightingListPanel
          :meters="devices"
          :selected-id="selectedDeviceId"
          :filter-building-id="selectedBuildingId"
          @select="selectDevice"
          @visible-change="updateVisibleDeviceIds"
        />
      </aside>

      <!-- 返回按钮 -->
      <button class="lighting__back" type="button" @click="goBack">
        <span class="lighting__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lighting-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#lighting-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="lighting__back-text">返回</span>
      </button>

      <!-- 中间：地图区 -->
      <section class="lighting__center">
        <div class="lighting__map">
          <LightingMapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :label="marker.name"
            :active="selectedDeviceId === marker.id"
            :dimmed="selectedBuildingId != null && marker.buildingId !== selectedBuildingId"
            @select="selectDevice(marker.id)"
          />

          <!-- 一键照明（地图左下角） -->
          <button class="lighting__batch" type="button" @click="batchVisible = true">
            <span class="lighting__batch-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M10 2 L10 4 M10 16 L10 18 M2 10 L4 10 M16 10 L18 10 M4.2 4.2 L5.6 5.6 M14.4 14.4 L15.8 15.8 M4.2 15.8 L5.6 14.4 M14.4 5.6 L15.8 4.2" stroke="#4DF2FF" stroke-width="1.4" stroke-linecap="round"/>
                <circle cx="10" cy="10" r="3.2" fill="#4DF2FF" fill-opacity="0.85"/>
              </svg>
            </span>
            <span class="lighting__batch-text">一键照明</span>
          </button>

          <!-- 楼栋聚合点位：复用指南针 + 楼层选择器 -->
          <div class="lighting__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧：照明回路详情 -->
      <aside v-if="detailVisible && selectedDevice" class="lighting__right">
        <LightingDetailPanel
          :device="selectedDevice"
          @close="detailVisible = false"
          @control="handleControl"
        />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="lighting__bottom" />

    <!-- 一键照明 Modal -->
    <LightingBatchControlPanel
      :visible="batchVisible"
      :devices="devices"
      :buildings="BUILDING_LIST"
      :floors="FLOOR_LIST"
      @close="batchVisible = false"
      @apply="handleBatchApply"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomNav from '@/components/common/BottomNav.vue'
import Compass from '@/components/common/Compass.vue'
import FloorSelector from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import LightingStatsPanel from '@/components/panels/LightingStatsPanel.vue'
import LightingListPanel from '@/components/panels/LightingListPanel.vue'
import LightingDetailPanel from '@/components/panels/LightingDetailPanel.vue'
import LightingMapMarker from '@/components/common/LightingMapMarker.vue'
import LightingBatchControlPanel from '@/components/panels/LightingBatchControlPanel.vue'

const router = useRouter()

type LightingStatus = 'online' | 'offline'
type PowerState = 'on' | 'off'
type FloorId = 'B1F' | '1F' | '2F' | '3F'

interface LightingDevice {
  id: number
  name: string
  location: string
  ip: string
  status: LightingStatus
  powerState: PowerState
  buildingId: number
  floorId: FloorId
  currentValue: number
  x: number
  y: number
}

const FLOOR_LIST: FloorId[] = ['B1F', '1F', '2F', '3F']
const BUILDING_LIST = [1, 2, 3, 4]

const selectedFloor = ref('1F')

function onFloorChange(floor: string) {
  selectedFloor.value = floor
}

const LOCATION_BY_BUILDING: Record<number, string> = {
  1: '建筑1一楼大厅',
  2: '建筑2二楼走廊',
  3: '建筑3三楼办公区',
  4: '建筑4地下车库',
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const TOTAL_DEVICES = 156
const ONLINE_COUNT = 142

const devices = reactive<LightingDevice[]>(
  Array.from({ length: TOTAL_DEVICES }, (_, i) => {
    const id = i + 1
    const buildingId = (i % 4) + 1
    const floorId = FLOOR_LIST[Math.floor(i / 4) % FLOOR_LIST.length]
    const status: LightingStatus = i < ONLINE_COUNT ? 'online' : 'offline'
    // 离线设备一律 off；在线设备每 4 个有 1 个为 off，便于区分视觉态
    const powerState: PowerState = status === 'offline' || i % 4 === 3 ? 'off' : 'on'
    return {
      id,
      name: `照明回路${id}`,
      location: LOCATION_BY_BUILDING[buildingId],
      ip: `SD-LIGHT${String(id).padStart(3, '0')}`,
      status,
      powerState,
      buildingId,
      floorId,
      currentValue: 50 + ((i * 11) % 350),
      x: 160 + Math.floor(pseudoRandom(id * 12.9898) * 760),
      y: 100 + Math.floor(pseudoRandom(id * 78.233) * 460),
    }
  }),
)

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

function handleControl({ id, action }: { id: number; action: PowerState }) {
  const dev = devices.find(d => d.id === id)
  if (dev) dev.powerState = action
}

const batchVisible = ref(false)

function handleBatchApply({ ids, action }: { ids: number[]; action: PowerState }) {
  const set = new Set(ids)
  for (const dev of devices) {
    if (set.has(dev.id)) dev.powerState = action
  }
}

function goBack() {
  router.push({ name: 'energy' })
}
</script>

<style lang="scss" scoped>
.lighting {
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

  &__batch {
    position: absolute;
    left: 16px;
    bottom: 16px;
    z-index: 6;
    height: 40px;
    padding: 0 18px 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid rgba(77, 242, 255, 0.55);
    border-radius: 20px;
    background: linear-gradient(90deg, rgba(12, 132, 255, 0.45) 0%, rgba(29, 234, 255, 0.18) 100%);
    color: $color-text-1;
    cursor: pointer;
    outline: none;
    transition: transform 0.18s ease, filter 0.18s ease, background 0.18s ease;

    &:hover {
      transform: translateY(-1px);
      filter: drop-shadow(0 0 10px rgba(29, 234, 255, 0.45));
      background: linear-gradient(90deg, rgba(12, 132, 255, 0.6) 0%, rgba(29, 234, 255, 0.32) 100%);
    }

    &:focus-visible {
      box-shadow: 0 0 0 2px rgba(77, 242, 255, 0.45);
    }
  }

  &__batch-icon {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg { width: 20px; height: 20px; display: block; }
  }

  &__batch-text {
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
  .lighting__back,
  .lighting__batch {
    transition: none;
  }
}
</style>