<template>
  <div class="building">
    <div class="building__bg" />
    <img class="building__frame building__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="building__frame building__frame--right" src="@/assets/images/left-右.png" alt="" />

    <AppHeader class="building__header" />

    <main class="building__body">
      <aside class="building__left">
        <HvacStatsPanel :online-count="onlineCount" :offline-count="offlineCount" />
        <HvacListPanel
          :devices="devicesOnFloor"
          :selected-id="selectedDeviceId"
          :filter-building-id="selectedBuildingId"
          @select="selectDevice"
          @visible-change="updateVisibleDeviceIds"
        />
      </aside>

      <button class="building__back" type="button" @click="goBack">
        <span class="building__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="building-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2, 37, 79, 0.6)" stroke="url(#building-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="building__back-text">返回</span>
      </button>

      <section class="building__center">
        <div class="building__map">
          <HvacMapMarker
            v-for="marker in floorMarkers"
            :key="marker.id"
            :x="marker.x"
            :y="marker.y"
            :type="marker.type"
            :label="marker.name"
            :active="selectedDeviceId === marker.id"
            :dimmed="!isMarkerHighlighted(marker)"
            @select="selectDevice(marker.id)"
          />

          <div class="building__map-controls">
            <Compass />
            <FloorSelector
              :selected-floor="selectedFloor"
              @floor-change="onFloorChange"
            />
            <FirstPersonRoamButton />
          </div>
        </div>
      </section>

      <aside v-if="detailVisible && selectedDevice" class="building__right">
        <HvacDetailPanel
          :device="selectedDevice"
          @close="detailVisible = false"
          @control="handleControl"
        />
      </aside>
    </main>

    <BottomNav class="building__bottom" />
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
import HvacStatsPanel from '@/components/panels/HvacStatsPanel.vue'
import HvacListPanel from '@/components/panels/HvacListPanel.vue'
import HvacDetailPanel from '@/components/panels/HvacDetailPanel.vue'
import HvacMapMarker from '@/components/common/HvacMapMarker.vue'

const router = useRouter()

type HvacType = 'air-conditioner' | 'fresh-air' | 'supply-air' | 'exhaust-air'
type HvacStatus = 'online' | 'offline'
type AcMode = '制冷' | '制热' | '通风'

type HvacControlAction =
  | { kind: 'power'; running: boolean }
  | { kind: 'mode'; mode: AcMode }
  | { kind: 'targetTemp'; targetTemp: number }
  | { kind: 'humidity'; humidity: number }
  | { kind: 'waterValve'; waterValve: number }

interface HvacDevice {
  id: number
  name: string
  type: HvacType
  location: string
  ip: string
  status: HvacStatus
  buildingId: number
  floor: string
  x: number
  y: number
  temperature?: number
  targetTemp?: number
  mode?: AcMode
  windSpeed?: number
  power?: number
  filterStatus?: string
  running?: boolean
  humidity?: number
  waterValve?: number
}

const FLOORS = ['5F', '4F', '3F', '2F', '1F', 'B1F'] as const

const selectedFloor = ref<string>('1F')

const LOCATION_BY_BUILDING: Record<number, string> = {
  1: '建筑1一楼大厅',
  2: '建筑2二楼办公区',
  3: '建筑3三楼会议区',
  4: '建筑4一楼机房',
}

const TYPE_PREFIX: Record<HvacType, string> = {
  'air-conditioner': '空调',
  'fresh-air': '新风机',
  'supply-air': '送风机',
  'exhaust-air': '排风机',
}

const TYPE_IP_PREFIX: Record<HvacType, string> = {
  'air-conditioner': 'AC',
  'fresh-air': 'FA',
  'supply-air': 'SA',
  'exhaust-air': 'EA',
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

const TYPE_COUNTS: Array<{ type: HvacType; count: number }> = [
  { type: 'air-conditioner', count: 40 },
  { type: 'fresh-air', count: 30 },
  { type: 'supply-air', count: 25 },
  { type: 'exhaust-air', count: 25 },
]

function buildDevices(): HvacDevice[] {
  const list: HvacDevice[] = []
  let id = 1
  for (const { type, count } of TYPE_COUNTS) {
    for (let i = 0; i < count; i++) {
      const buildingId = (i % 4) + 1
      const floor = FLOORS[i % FLOORS.length]
      const isOnline = i % 10 !== 0
      const dev: HvacDevice = {
        id,
        name: `${TYPE_PREFIX[type]}${i + 1}`,
        type,
        location: `${LOCATION_BY_BUILDING[buildingId]} · ${floor}`,
        ip: `SD-${TYPE_IP_PREFIX[type]}${String(id).padStart(3, '0')}`,
        status: isOnline ? 'online' : 'offline',
        buildingId,
        floor,
        x: 160 + Math.floor(pseudoRandom(id * 12.9898) * 760),
        y: 100 + Math.floor(pseudoRandom(id * 78.233) * 460),
        power: 80 + ((id * 13) % 600),
      }
      if (type === 'air-conditioner') {
        const modes: AcMode[] = ['制冷', '制热', '通风']
        dev.mode = modes[id % 3]
        dev.targetTemp = 22 + (id % 6)
        dev.temperature = 20 + (id % 10)
        dev.humidity = 40 + ((id * 5) % 30)
        dev.running = isOnline ? id % 4 !== 0 : false
      } else if (type === 'fresh-air') {
        dev.windSpeed = 1 + (id % 3)
        dev.filterStatus = id % 7 === 0 ? '需更换' : '正常'
        dev.targetTemp = 22 + (id % 6)
        dev.humidity = 40 + ((id * 5) % 30)
        dev.waterValve = (id * 7) % 100
        dev.running = isOnline ? id % 4 !== 0 : false
      } else {
        dev.windSpeed = 1 + (id % 3)
        dev.running = isOnline ? i % 3 !== 0 : false
      }
      list.push(dev)
      id++
    }
  }
  return list
}

const devices = reactive<HvacDevice[]>(buildDevices())

const selectedDeviceId = ref<number | null>(null)
const detailVisible = ref(false)
const visibleDeviceIds = ref<number[]>([])
const selectedBuildingId = ref<number | null>(null)

const devicesOnFloor = computed(() =>
  devices.filter(d => d.floor === selectedFloor.value),
)

const selectedDevice = computed(() => {
  if (selectedDeviceId.value == null) return undefined
  return devices.find(d => d.id === selectedDeviceId.value)
})

const floorMarkers = computed(() => devicesOnFloor.value)

function isMarkerHighlighted(marker: HvacDevice): boolean {
  if (selectedBuildingId.value != null && marker.buildingId !== selectedBuildingId.value) {
    return false
  }
  if (visibleDeviceIds.value.length === 0) return true
  return visibleDeviceIds.value.includes(marker.id)
}

const onlineCount = computed(
  () => devicesOnFloor.value.filter(d => d.status === 'online').length,
)
const offlineCount = computed(
  () => devicesOnFloor.value.filter(d => d.status === 'offline').length,
)

function updateVisibleDeviceIds(ids: number[]) {
  visibleDeviceIds.value = ids
}

function selectDevice(id: number) {
  selectedDeviceId.value = id
  detailVisible.value = true
}

function handleControl(payload: { id: number; action: HvacControlAction }) {
  const target = devices.find(d => d.id === payload.id)
  if (!target) return
  if (target.status !== 'online') return

  const action = payload.action
  switch (action.kind) {
    case 'power':
      target.running = action.running
      break
    case 'mode':
      if (target.type !== 'air-conditioner') return
      target.mode = action.mode
      break
    case 'targetTemp':
      if (target.type !== 'air-conditioner' && target.type !== 'fresh-air') return
      target.targetTemp = action.targetTemp
      break
    case 'humidity':
      if (target.type !== 'air-conditioner' && target.type !== 'fresh-air') return
      target.humidity = action.humidity
      break
    case 'waterValve':
      if (target.type !== 'fresh-air') return
      target.waterValve = action.waterValve
      break
  }
}

function onFloorChange(floor: string) {
  selectedFloor.value = floor
  selectedDeviceId.value = null
  detailVisible.value = false
}

function goBack() {
  router.push({ name: 'energy' })
}
</script>

<style lang="scss" scoped>
.building {
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
  .building__back { transition: none; }
}
</style>
