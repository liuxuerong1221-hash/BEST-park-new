<template>
  <div class="meter-water">
    <!-- 背景图层 -->
    <div class="meter-water__bg" />

    <!-- 左右边框装饰 -->
    <img class="meter-water__frame meter-water__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="meter-water__frame meter-water__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="meter-water__header" />

    <!-- 主内容区 -->
    <main class="meter-water__body">
      <!-- 左侧 -->
      <aside class="meter-water__left">
        <WaterMeterStatsPanel />
        <WaterMeterListPanel
          :meters="meters"
          :selected-id="selectedMeterId"
          :filter-building-id="selectedBuildingId"
          @select="selectMeter"
          @visible-change="updateVisibleMeterIds"
        />
      </aside>

      <!-- 返回按钮 -->
      <button class="meter-water__back" type="button" @click="goBack">
        <span class="meter-water__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="meter-water-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#meter-water-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="meter-water__back-text">返回</span>
      </button>

      <!-- 中间：地图区 -->
      <section class="meter-water__center">
        <div class="meter-water__map">
          <WaterMeterMapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :label="marker.name"
            :active="selectedMeterId === marker.id"
            :dimmed="selectedBuildingId != null && marker.buildingId !== selectedBuildingId"
            @select="selectMeter(marker.id)"
          />

          <!-- 楼栋聚合点位：复用指南针 + 楼层选择器 -->
          <div class="meter-water__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧：水表详情 -->
      <aside v-if="detailVisible && selectedMeter" class="meter-water__right">
        <WaterMeterDetailPanel :device="selectedMeter" @close="detailVisible = false" />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="meter-water__bottom" />
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
import WaterMeterStatsPanel from '@/components/panels/WaterMeterStatsPanel.vue'
import WaterMeterListPanel from '@/components/panels/WaterMeterListPanel.vue'
import WaterMeterDetailPanel from '@/components/panels/WaterMeterDetailPanel.vue'
import WaterMeterMapMarker from '@/components/common/WaterMeterMapMarker.vue'

const router = useRouter()

type WaterMeterStatus = 'online' | 'offline'

interface WaterMeter {
  id: number
  name: string
  location: string
  ip: string
  status: WaterMeterStatus
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
  1: '建筑1一楼水井间',
  2: '建筑2二楼公共卫生间',
  3: '建筑3一楼茶水间',
  4: '建筑4三楼水泵房',
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const TOTAL_METERS = 232
const ONLINE_COUNT = 214

const meters: WaterMeter[] = Array.from({ length: TOTAL_METERS }, (_, i) => {
  const id = i + 1
  const buildingId = (i % 4) + 1
  return {
    id,
    name: `水表${id}`,
    location: LOCATION_BY_BUILDING[buildingId],
    ip: `SD-WTRIN${String(id).padStart(3, '0')}`,
    status: (i < ONLINE_COUNT ? 'online' : 'offline') as WaterMeterStatus,
    buildingId,
    currentValue: 30 + ((i * 13) % 480),
    x: 160 + Math.floor(pseudoRandom(id * 12.9898) * 760),
    y: 100 + Math.floor(pseudoRandom(id * 78.233) * 460),
  }
})

const selectedMeterId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleMeterIds = ref<number[]>(meters.slice(0, 10).map(m => m.id))
const selectedBuildingId = ref<number | null>(null)

const selectedMeter = computed(() => {
  if (selectedMeterId.value == null) return undefined
  return meters.find(m => m.id === selectedMeterId.value)
})

const visibleMarkers = computed(() => meters.filter(m => visibleMeterIds.value.includes(m.id)))

function updateVisibleMeterIds(ids: number[]) {
  visibleMeterIds.value = ids
}

function selectMeter(id: number) {
  selectedMeterId.value = id
  detailVisible.value = true
}

function goBack() {
  router.push({ name: 'energy' })
}
</script>

<style lang="scss" scoped>
.meter-water {
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
  .meter-water__back {
    transition: none;
  }
}
</style>
