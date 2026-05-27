<template>
  <div class="display-screen">
    <!-- 背景图层 -->
    <div class="display-screen__bg" />

    <!-- 左右边框装饰 -->
    <img class="display-screen__frame display-screen__frame--left" src="@/assets/images/left-左.png" alt="" />
    <img class="display-screen__frame display-screen__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="display-screen__header" />

    <!-- 主内容区 -->
    <main class="display-screen__body">
      <!-- 左侧 -->
      <aside class="display-screen__left">
        <DisplayScreenStatsPanel />
        <DisplayScreenListPanel
          :devices="screens"
          :selected-id="selectedId"
          @select="selectScreen"
          @visible-change="updateVisibleIds"
        />
      </aside>

      <!-- 返回按钮 -->
      <button class="display-screen__back" type="button" @click="goBack">
        <span class="display-screen__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dscreen-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#dscreen-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="display-screen__back-text">返回</span>
      </button>

      <!-- 中间：地图区 -->
      <section class="display-screen__center">
        <div class="display-screen__map">
          <DisplayScreenMapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :label="marker.name"
            :active="selectedId === marker.id"
            :dimmed="false"
            @select="selectScreen(marker.id)"
          />

          <div class="display-screen__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧：详情 -->
      <aside v-if="detailVisible && selectedScreen" class="display-screen__right">
        <DisplayScreenDetailPanel :device="selectedScreen" @close="detailVisible = false" />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="display-screen__bottom" />
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
import DisplayScreenListPanel from '@/components/panels/DisplayScreenListPanel.vue'
import DisplayScreenDetailPanel from '@/components/panels/DisplayScreenDetailPanel.vue'
import DisplayScreenStatsPanel from '@/components/panels/DisplayScreenStatsPanel.vue'
import DisplayScreenMapMarker from '@/components/common/DisplayScreenMapMarker.vue'

const router = useRouter()

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
  x: number
  y: number
}

const selectedFloor = ref('1F')
function onFloorChange(floor: string) { selectedFloor.value = floor }

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const BUILDINGS = ['1号楼', '2号楼', '3号楼', '4号楼']
const CONTENTS = ['企业宣传片', '安全须知', '园区公告', '节能提示', '活动通知']

const screens = ref<DisplayScreenDevice[]>(
  Array.from({ length: 48 }, (_, i) => {
    const id = i + 1
    const building = BUILDINGS[i % 4]
    const floor = `${(i % 3) + 1}F`
    return {
      id,
      name: `信息屏${String(id).padStart(3, '0')}`,
      building,
      floor,
      location: `${building}${floor}走廊`,
      ip: `192.168.10.${100 + id}`,
      status: (i < 42 ? 'online' : 'offline') as DeviceStatus,
      currentContent: CONTENTS[i % 5],
      contentImage: `https://picsum.photos/seed/screen${id}/640/360`,
      x: 160 + Math.floor(pseudoRandom(id * 12.9898) * 760),
      y: 100 + Math.floor(pseudoRandom(id * 78.233) * 460),
    }
  }),
)

const selectedId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleIds = ref<number[]>(screens.value.slice(0, 10).map(s => s.id))

const selectedScreen = computed(() => {
  if (selectedId.value == null) return undefined
  return screens.value.find(s => s.id === selectedId.value)
})

const visibleMarkers = computed(() => screens.value.filter(s => visibleIds.value.includes(s.id)))

function updateVisibleIds(ids: number[]) { visibleIds.value = ids }

function selectScreen(id: number) {
  selectedId.value = id
  detailVisible.value = true
}

function goBack() { router.push({ name: 'energy' }) }
</script>

<style lang="scss" scoped>
.display-screen {
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
    svg { width: 40px; height: 40px; display: block; }
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
  .display-screen__back {
    transition: none;
  }
}
</style>
