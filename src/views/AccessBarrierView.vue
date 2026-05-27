<template>
  <div class="access-barrier">
    <!-- 背景图层 -->
    <div class="access-barrier__bg" />

    <!-- 左右边框装饰 -->
    <img class="access-barrier__frame access-barrier__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="access-barrier__frame access-barrier__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="access-barrier__header" />

    <!-- 主内容区 -->
    <main class="access-barrier__body">
      <!-- 左侧：道闸数据面板 -->
      <aside class="access-barrier__left">
        <BarrierStatsPanel />
        <BarrierListPanel
          :barriers="barrierDevices"
          :selected-id="selectedBarrierId"
          @select="selectBarrier"
          @visible-change="updateVisibleBarrierIds"
        />
      </aside>

      <!-- 返回入口（位于左侧栏右侧、地图区上方） -->
      <button class="access-barrier__back" type="button" @click="goBack">
        <span class="access-barrier__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="access-barrier-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#access-barrier-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="access-barrier__back-text">返回</span>
      </button>

      <!-- 中间：地图区 -->
      <section class="access-barrier__center">
        <div class="access-barrier__map">
          <BarrierMapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :label="marker.name"
            :active="selectedBarrierId === marker.id"
            @select="selectBarrier(marker.id)"
          />

          <!-- 楼栋聚合点位：复用指南针 + 楼层选择器 -->
          <div class="access-barrier__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧：道闸详情面板 -->
      <aside v-if="detailVisible" class="access-barrier__right">
        <VehicleDetailPanel :device="selectedBarrier" @close="detailVisible = false" />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="access-barrier__bottom" />
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
import BarrierMapMarker from '@/components/common/BarrierMapMarker.vue'
import VehicleDetailPanel from '@/components/panels/VehicleDetailPanel.vue'
import BarrierStatsPanel from '@/components/panels/BarrierStatsPanel.vue'
import BarrierListPanel from '@/components/panels/BarrierListPanel.vue'

const router = useRouter()

type BarrierStatus = 'online' | 'offline'

interface Barrier {
  id: number
  name: string
  location: string
  ip: string
  status: BarrierStatus
  x: number
  y: number
}

const barrierDevices: Barrier[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `道闸设备${String(i + 1).padStart(3, '0')}`,
  location: `${(i % 5) + 1}号楼-${(i % 8) + 1}层`,
  ip: `192.168.2.${(i % 255) + 1}`,
  status: (i < 28 ? 'online' : 'offline') as BarrierStatus,
  x: 200 + Math.random() * 800,
  y: 150 + Math.random() * 400,
}))

const selectedBarrierId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleBarrierIds = ref<number[]>(barrierDevices.slice(0, 10).map(item => item.id))
const selectedFloor = ref('1F')

function onFloorChange(floor: string) {
  selectedFloor.value = floor
}

const selectedBarrier = computed(() => {
  if (!selectedBarrierId.value) return undefined
  return barrierDevices.find(d => d.id === selectedBarrierId.value)
})

const visibleMarkers = computed(() =>
  barrierDevices.filter(item => visibleBarrierIds.value.includes(item.id)),
)

function updateVisibleBarrierIds(ids: number[]) {
  visibleBarrierIds.value = ids
}

function selectBarrier(id: number) {
  selectedBarrierId.value = id
  detailVisible.value = true
}

function goBack() {
  router.push({ name: 'access' })
}
</script>

<style lang="scss" scoped>
.access-barrier {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/大屏背景@2x.jpg');
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
  .access-barrier__back {
    transition: none;
  }
}
</style>
