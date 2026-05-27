<template>
  <div class="meeting-room">
    <!-- 背景图层 -->
    <div class="meeting-room__bg" />

    <!-- 左右边框装饰 -->
    <img class="meeting-room__frame meeting-room__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="meeting-room__frame meeting-room__frame--right" src="@/assets/images/left-右.png" alt="" />

    <!-- 顶部头部 -->
    <AppHeader class="meeting-room__header" />

    <!-- 主内容区 -->
    <main class="meeting-room__body">
      <!-- 左侧：会议室面板 -->
      <aside class="meeting-room__left">
        <MeetingStatsPanel />
        <MeetingListPanel
          :meetings="meetingMarkers"
          :selected-id="selectedMeetingId"
          @select="selectMeeting"
        />
      </aside>

      <!-- 返回入口（位于左侧栏右侧、地图区上方） -->
      <button class="meeting-room__back" type="button" @click="goBack">
        <span class="meeting-room__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="meeting-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#meeting-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="meeting-room__back-text">返回</span>
      </button>

      <!-- 中间：地图区 -->
      <section class="meeting-room__center">
        <div class="meeting-room__map">
          <MapMarker
            v-for="marker in visibleMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :label="marker.name"
            :active="selectedMeetingId === marker.id"
            @select="selectMeeting(marker.id)"
          />
          <div class="meeting-room__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="selectFloor"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <!-- 右侧：摄像头数据看板 -->
      <aside v-if="cameraVisible" class="meeting-room__right">
        <CameraViewPanel :room="selectedMeeting" @close="cameraVisible = false" />
      </aside>
    </main>

    <!-- 底部导航 -->
    <BottomNav class="meeting-room__bottom" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader         from '@/components/common/AppHeader.vue'
import BottomNav         from '@/components/common/BottomNav.vue'
import Compass           from '@/components/common/Compass.vue'
import FloorSelector     from '@/components/common/FloorSelector.vue'
import FirstPersonRoamButton from '@/components/common/FirstPersonRoamButton.vue'
import MapMarker         from '@/components/common/MapMarker.vue'
import MeetingStatsPanel from '@/components/panels/MeetingStatsPanel.vue'
import MeetingListPanel  from '@/components/panels/MeetingListPanel.vue'
import CameraViewPanel   from '@/components/panels/CameraViewPanel.vue'

const router = useRouter()

type RoomStatus = 'in-use' | 'idle' | 'reserved'

interface MeetingMarker {
  id: number
  name: string
  capacity: number
  location: string
  status: RoomStatus
  floor: string
  x: number
  y: number
}

const meetingMarkers = [
  { id: 1, name: '一楼203会议室', capacity: 272, location: '1号楼2层', status: 'in-use', floor: '2F', x: 44, y: 46 },
  { id: 2, name: '二楼会议厅', capacity: 86, location: '2号楼4层', status: 'idle', floor: '4F', x: 57, y: 38 },
  { id: 3, name: '三楼小会议室', capacity: 24, location: '3号楼3层', status: 'reserved', floor: '3F', x: 63, y: 58 },
  { id: 4, name: '一楼101会议室', capacity: 32, location: '1号楼1层', status: 'idle', floor: '1F', x: 39, y: 60 },
  { id: 5, name: '一楼105洽谈室', capacity: 12, location: '1号楼1层', status: 'reserved', floor: '1F', x: 49, y: 64 },
  { id: 6, name: '二楼201会议室', capacity: 48, location: '1号楼2层', status: 'in-use', floor: '2F', x: 52, y: 51 },
  { id: 7, name: '二楼208培训室', capacity: 120, location: '2号楼2层', status: 'idle', floor: '2F', x: 68, y: 45 },
  { id: 8, name: '三楼301会议室', capacity: 36, location: '3号楼3层', status: 'in-use', floor: '3F', x: 59, y: 69 },
  { id: 9, name: '四楼401多功能厅', capacity: 160, location: '4号楼4层', status: 'reserved', floor: '4F', x: 72, y: 61 },
  { id: 10, name: '五楼501董事会议室', capacity: 28, location: '5号楼5层', status: 'idle', floor: '5F', x: 47, y: 33 },
] satisfies MeetingMarker[]

const selectedMeetingId = ref<number | null>(null)
const selectedFloor = ref(meetingMarkers[0].floor)
const cameraVisible = ref(false)
const visibleMarkers = computed(() =>
  meetingMarkers.filter(marker => marker.floor === selectedFloor.value),
)
const selectedMeeting = computed(() =>
  meetingMarkers.find(marker => marker.id === selectedMeetingId.value),
)

function selectMeeting(id: number) {
  selectedMeetingId.value = id
  selectedFloor.value = selectedMeeting.value.floor
  cameraVisible.value = true
}

function selectFloor(floor: string) {
  selectedFloor.value = floor
  // 切换楼层时不自动选中第一个会议室
  // 如果当前选中的会议室不在新楼层，则清空选中状态
  if (selectedMeetingId.value) {
    const currentMeeting = meetingMarkers.find(m => m.id === selectedMeetingId.value)
    if (currentMeeting && currentMeeting.floor !== floor) {
      selectedMeetingId.value = null
      cameraVisible.value = false
    }
  }
}

function goBack() {
  router.push({ name: 'dashboard' })
}
</script>

<style lang="scss" scoped>
.meeting-room {
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
</style>
