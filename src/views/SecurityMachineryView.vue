<template>
  <div class="security-mach">
    <div class="security-mach__bg" />
    <img class="security-mach__frame security-mach__frame--left"  src="@/assets/images/left-左.png" alt="" />
    <img class="security-mach__frame security-mach__frame--right" src="@/assets/images/left-右.png" alt="" />

    <AppHeader class="security-mach__header" />

    <main class="security-mach__body">
      <!-- 左侧数据面板 -->
      <aside class="security-mach__left">
        <MachineryMonitorPanel />
        <MachineryAlertTrendPanel />
        <MachineryAlertRecordPanel />
      </aside>

      <!-- 返回 -->
      <button class="security-mach__back" type="button" @click="goBack">
        <span class="security-mach__back-icon" aria-hidden="true">
          <svg viewBox="0 0 40 40" fill="none">
            <defs>
              <linearGradient id="mach-back-stroke" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0C84FF" />
                <stop offset="1" stop-color="#1DEAFF" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="19.5" fill="rgba(2,37,79,0.6)" stroke="url(#mach-back-stroke)" />
            <path d="M22.5 13L15.5 20L22.5 27" stroke="#4DF2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="security-mach__back-text">返回</span>
      </button>

      <!-- 中间：传感器状态 + 打点区 -->
      <section class="security-mach__center">
        <!-- 传感器状态卡片 -->
        <div class="security-mach__sensors">
          <div class="security-mach__sensor-card" v-for="s in sensors" :key="s.id">
            <div class="security-mach__sensor-icon">
              <img :src="s.icon" :alt="s.label" />
            </div>
            <div class="security-mach__sensor-info">
              <template v-if="s.type === 'status'">
                <span class="security-mach__sensor-label">{{ s.label }}</span>
                <span class="security-mach__sensor-badge" :class="`security-mach__sensor-badge--${s.status}`">
                  {{ s.status === 'normal' ? '正常' : '告警' }}
                </span>
              </template>
              <template v-else>
                <span v-for="(row, i) in s.rows" :key="i" class="security-mach__sensor-row">
                  <span class="security-mach__sensor-key">{{ row.key }}</span>
                  <span class="security-mach__sensor-val">{{ row.val }}</span>
                </span>
              </template>
            </div>
          </div>
        </div>
        <!-- 打点区域（传感器卡片下方） -->
        <div class="security-mach__pins-area">
          <!-- 机柜打点（原始圆形图标） -->
          <div
            v-for="pin in mapPins"
            :key="'cabinet-' + pin.id"
            class="security-mach__pin"
            :style="{ left: pin.x + 'px', top: pin.y + 'px' }"
            @click="router.push({ name: 'security-cabinet', query: { name: pin.name } })"
          >
            <span class="security-mach__pin-label">{{ pin.name }}</span>
            <img class="security-mach__pin-icon" src="@/assets/images/机房打点.svg" alt="" />
          </div>
          <!-- 空调打点（可点击） -->
          <AcMapMarker
            v-for="pin in acPins"
            :key="'ac-' + pin.id"
            :x="pin.x"
            :y="pin.y"
            :label="pin.label"
            :active="acDetailVisible && selectedAcDevice?.name === acDeviceData[pin.id]?.name"
            :alert="pin.alert"
            @select="selectAcPin(pin.id)"
          />
          <!-- UPS打点（可点击） -->
          <UpsMapMarker
            v-for="pin in upsPins"
            :key="'ups-' + pin.id"
            :x="pin.x"
            :y="pin.y"
            :label="pin.label"
            :active="upsDetailVisible && selectedUpsDevice?.name === upsDeviceData[pin.id]?.name"
            :alert="pin.alert"
            @select="selectUpsPin(pin.id)"
          />
          <!-- 新风机打点（可点击） -->
          <FreshAirMapMarker
            v-for="pin in freshAirPins"
            :key="'fa-' + pin.id"
            :x="pin.x"
            :y="pin.y"
            :label="pin.label"
            :active="freshAirDetailVisible && selectedFreshAirDevice?.location === freshAirDeviceData[pin.id]?.location"
            :alert="pin.alert"
            @select="selectFreshAirPin(pin.id)"
          />
          <!-- 动力配电柜打点（可点击） -->
          <PowerDistMapMarker
            v-for="pin in powerDistPins"
            :key="'pd-' + pin.id"
            :x="pin.x"
            :y="pin.y"
            :label="pin.label"
            :active="powerDistDetailVisible && selectedPowerDistDevice?.name === powerDistDeviceData[pin.id]?.name"
            :alert="pin.alert"
            @select="selectPowerDistPin(pin.id)"
          />
          <!-- 其他设备打点 -->
          <component
            v-for="pin in otherPins"
            :key="'device-' + pin.id"
            :is="markerMap[pin.type]"
            :x="pin.x"
            :y="pin.y"
            :label="pin.label"
          />
        </div>
      </section>

      <!-- 右侧：设备详情面板 -->
      <aside v-if="activePanel" class="security-mach__right">
        <AcDetailPanel
          v-if="acDetailVisible && selectedAcDevice"
          :device="selectedAcDevice"
          :alert="selectedPinAlert"
          @close="closeDetail"
        />
        <UpsDetailPanel
          v-if="upsDetailVisible && selectedUpsDevice"
          :device="selectedUpsDevice"
          :alert="selectedPinAlert"
          @close="closeDetail"
        />
        <FreshAirDetailPanel
          v-if="freshAirDetailVisible && selectedFreshAirDevice"
          :device="selectedFreshAirDevice"
          :alert="selectedPinAlert"
          @close="closeDetail"
        />
        <PowerDistDetailPanel
          v-if="powerDistDetailVisible && selectedPowerDistDevice"
          :device="selectedPowerDistDevice"
          :alert="selectedPinAlert"
          @close="closeDetail"
        />
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader           from '@/components/common/AppHeader.vue'
import MachineryMonitorPanel     from '@/components/panels/MachineryMonitorPanel.vue'
import MachineryAlertTrendPanel  from '@/components/panels/MachineryAlertTrendPanel.vue'
import MachineryAlertRecordPanel from '@/components/panels/MachineryAlertRecordPanel.vue'
import AcMapMarker         from '@/components/common/AcMapMarker.vue'
import FreshAirMapMarker   from '@/components/common/FreshAirMapMarker.vue'
import UpsMapMarker        from '@/components/common/UpsMapMarker.vue'
import PowerDistMapMarker  from '@/components/common/PowerDistMapMarker.vue'
import AcDetailPanel,        { type AcDevice }        from '@/components/panels/AcDetailPanel.vue'
import UpsDetailPanel,       { type UpsDevice }       from '@/components/panels/UpsDetailPanel.vue'
import FreshAirDetailPanel,  { type FreshAirDevice }  from '@/components/panels/FreshAirDetailPanel.vue'
import PowerDistDetailPanel, { type PowerDistDevice } from '@/components/panels/PowerDistDetailPanel.vue'
import smokeIcon from '@/assets/images/烟感.svg'
import leakIcon  from '@/assets/images/漏水.svg'
import tempIcon  from '@/assets/images/温度 2.svg'
import h2Icon    from '@/assets/images/氢气浓度.svg'

const router = useRouter()
function goBack() { router.push({ name: 'security' }) }

// 机柜打点（原始样式）
const mapPins = [
  { id: 1,  name: '机柜A', x: 150,  y: 130 },
  { id: 2,  name: '机柜B', x: 340,  y: 200 },
  { id: 3,  name: '机柜C', x: 500,  y: 110 },
  { id: 4,  name: '机柜D', x: 680,  y: 260 },
  { id: 5,  name: '机柜E', x: 860,  y: 100 },
  { id: 6,  name: '机柜F', x: 920,  y: 195 },
  { id: 7,  name: '机柜G', x: 860,  y: 145 },
  { id: 8,  name: '机柜H', x: 240,  y: 370 },
  { id: 9,  name: '机柜I', x: 480,  y: 430 },
  { id: 10, name: '机柜J', x: 760,  y: 360 },
  { id: 11, name: '机柜K', x: 960,  y: 430 },
  { id: 12, name: '机柜L', x: 900,  y: 375 },
]

// 设备打点（MapPinMarker 样式）
type DevicePinType = 'ac' | 'fresh-air' | 'ups' | 'power-dist'
interface DevicePin { id: number; label: string; x: number; y: number; type: DevicePinType; alert?: boolean }

const devicePins: DevicePin[] = [
  { id: 1, label: '精密空调-1',   x: 280,  y: 165, type: 'ac',         alert: false },
  { id: 2, label: '精密空调-2',   x: 730,  y: 175, type: 'ac',         alert: true  },
  { id: 3, label: '新风机-1',     x: 550,  y: 325, type: 'fresh-air',  alert: true  },
  { id: 4, label: '新风机-2',     x: 820,  y: 295, type: 'fresh-air',  alert: false },
  { id: 5, label: 'UPS主机-1',   x: 390,  y: 490, type: 'ups',        alert: false },
  { id: 6, label: 'UPS主机-2',   x: 850,  y: 465, type: 'ups',        alert: true  },
  { id: 7, label: '动力配电柜-1', x: 185,  y: 500, type: 'power-dist', alert: true  },
  { id: 8, label: '动力配电柜-2', x: 940,  y: 495, type: 'power-dist', alert: false },
]

const markerMap = {
  'ac':         AcMapMarker,
  'fresh-air':  FreshAirMapMarker,
  'ups':        UpsMapMarker,
  'power-dist': PowerDistMapMarker,
} as const

// 空调设备详情数据
const acDeviceData: Record<number, AcDevice> = {
  1: { name: '精密空调1', ip: '192.168.1.101', location: '机房A区北侧', status: 'normal', supplyTemp: 25, returnTemp: 25, supplyHumidity: 35, returnHumidity: 35 },
  2: { name: '精密空调2', ip: '192.168.1.102', location: '机房B区南侧', status: 'normal', supplyTemp: 23, returnTemp: 24, supplyHumidity: 40, returnHumidity: 38 },
}

// UPS设备详情数据
const upsDeviceData: Record<number, UpsDevice> = {
  5: { name: 'UPS主机1', location: '机房1', ip: '192.168.1.201', status: 'normal', power: 18, powerMode: '电池供电', batteryLevel: 76.3, batteryTemp: 35.6, voltageInputA: 228, voltageOutputA: 232, voltageInputB: 229, voltageOutputB: 222, voltageInputC: 231, voltageOutputC: 208 },
  6: { name: 'UPS主机2', location: '机房2', ip: '192.168.1.202', status: 'normal', power: 20, powerMode: '市电供电', batteryLevel: 91.0, batteryTemp: 28.4, voltageInputA: 220, voltageOutputA: 221, voltageInputB: 222, voltageOutputB: 220, voltageInputC: 221, voltageOutputC: 219 },
}

// 动力配电柜详情数据
const powerDistDeviceData: Record<number, PowerDistDevice> = {
  7: { name: '动力配电柜01', location: '机房1', ip: '11.1.1.1', status: 'normal', load: 27, voltageA: 227, voltageB: 229, voltageC: 231, currentA: 42, currentB: 38, currentC: 45 },
  8: { name: '动力配电柜02', location: '机房2', ip: '11.1.1.2', status: 'normal', load: 24, voltageA: 225, voltageB: 228, voltageC: 226, currentA: 36, currentB: 40, currentC: 38 },
}

// 新风机设备详情数据
const freshAirDeviceData: Record<number, FreshAirDevice> = {
  3: { name: '新风机', location: '机房1', ip: '192.168.1.101', status: 'normal', temperature: 65, humidity: 66 },
  4: { name: '新风机', location: '机房2', ip: '192.168.1.102', status: 'normal', temperature: 62, humidity: 60 },
}

type PanelType = 'ac' | 'ups' | 'fresh-air' | 'power-dist' | null

const activePanel              = ref<PanelType>(null)
const selectedPinAlert         = ref(false)
const selectedAcDevice         = ref<AcDevice | null>(null)
const selectedUpsDevice        = ref<UpsDevice | null>(null)
const selectedFreshAirDevice   = ref<FreshAirDevice | null>(null)
const selectedPowerDistDevice  = ref<PowerDistDevice | null>(null)

const acDetailVisible        = computed(() => activePanel.value === 'ac'         && !!selectedAcDevice.value)
const upsDetailVisible       = computed(() => activePanel.value === 'ups'        && !!selectedUpsDevice.value)
const freshAirDetailVisible  = computed(() => activePanel.value === 'fresh-air'  && !!selectedFreshAirDevice.value)
const powerDistDetailVisible = computed(() => activePanel.value === 'power-dist' && !!selectedPowerDistDevice.value)

function clearAll() {
  selectedAcDevice.value        = null
  selectedUpsDevice.value       = null
  selectedFreshAirDevice.value  = null
  selectedPowerDistDevice.value = null
  selectedPinAlert.value        = false
}

function selectAcPin(pinId: number) {
  clearAll()
  selectedAcDevice.value = acDeviceData[pinId] ?? null
  selectedPinAlert.value = devicePins.find(p => p.id === pinId)?.alert ?? false
  activePanel.value = selectedAcDevice.value ? 'ac' : null
}

function selectUpsPin(pinId: number) {
  clearAll()
  selectedUpsDevice.value = upsDeviceData[pinId] ?? null
  selectedPinAlert.value = devicePins.find(p => p.id === pinId)?.alert ?? false
  activePanel.value = selectedUpsDevice.value ? 'ups' : null
}

function selectFreshAirPin(pinId: number) {
  clearAll()
  selectedFreshAirDevice.value = freshAirDeviceData[pinId] ?? null
  selectedPinAlert.value = devicePins.find(p => p.id === pinId)?.alert ?? false
  activePanel.value = selectedFreshAirDevice.value ? 'fresh-air' : null
}

function selectPowerDistPin(pinId: number) {
  clearAll()
  selectedPowerDistDevice.value = powerDistDeviceData[pinId] ?? null
  selectedPinAlert.value = devicePins.find(p => p.id === pinId)?.alert ?? false
  activePanel.value = selectedPowerDistDevice.value ? 'power-dist' : null
}

function closeDetail() {
  activePanel.value = null
  clearAll()
}

const sensors = [
  { id: 1, type: 'status', label: '烟感',     icon: smokeIcon, status: 'normal' },
  { id: 2, type: 'status', label: '漏水',     icon: leakIcon,  status: 'normal' },
  { id: 3, type: 'rows',   label: '温湿度',   icon: tempIcon,  rows: [{ key: '温度：', val: '20℃' }, { key: '湿度：', val: '20%' }] },
  { id: 4, type: 'rows',   label: '氢气浓度', icon: h2Icon,    rows: [{ key: '氢气浓度：', val: '25%' }] },
]

const acPins        = computed(() => devicePins.filter(p => p.type === 'ac'))
const upsPins       = computed(() => devicePins.filter(p => p.type === 'ups'))
const freshAirPins  = computed(() => devicePins.filter(p => p.type === 'fresh-air'))
const powerDistPins = computed(() => devicePins.filter(p => p.type === 'power-dist'))
const otherPins     = computed(() => devicePins.filter(p => !['ac', 'ups', 'fresh-air', 'power-dist'].includes(p.type)))
</script>

<style lang="scss" scoped>
.security-mach {
  width: $screen-width;
  height: $screen-height;
  position: relative;
  overflow: hidden;
  background-color: $color-bg;
  font-family: $font-body;

  &__bg {
    position: absolute;
    inset: 0;
    background-image: url('@/assets/images/bg-机房动环.jpg');
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
  }

  // 打点容器，偏移至传感器卡片下方
  &__pins-area {
    position: absolute;
    top: 110px;
    left: 0;
    right: 0;
    bottom: 0;
  }

  // 传感器状态卡片行
  &__sensors {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 15;
  }

  &__sensor-card {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 17px 20px;
    background: linear-gradient(117deg, rgba(8, 38, 74, 0.352) 0%, rgba(3, 21, 43, 0.368) 97%);
    border: 1px solid rgba(11, 182, 255, 0.3);
    border-radius: $radius-sm;
    backdrop-filter: blur(6px);
    min-width: 140px;
  }

  &__sensor-icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    img { width: 44px; height: 44px; object-fit: contain; transform-origin: center; }
  }

  &__sensor-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__sensor-label {
    font-size: $font-size-xs;
    color: $color-text-2;
    line-height: 1;
  }

  &__sensor-badge {
    font-size: $font-size-xs;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    line-height: 1.4;
    white-space: nowrap;

    &--normal {
      color: #0CF92C;
      background: rgba(12, 249, 44, 0.12);
    }

    &--alert {
      color: #FF4848;
      background: rgba(255, 72, 72, 0.15);
    }
  }

  &__sensor-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  &__sensor-key {
    font-size: $font-size-xs;
    color: $color-text-2;
    white-space: nowrap;
  }

  &__sensor-val {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-text-1;
  }

  &__right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
    padding: 24px 0 8px;
    position: relative;
    z-index: 20;
  }

  &__pin {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(-50%, -100%);
    cursor: pointer;
    z-index: 5;
  }

  &__pin:hover &__pin-label {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  &__pin-icon {
    width: 40px;
    height: 52.5px;
    display: block;
    filter: drop-shadow(0 0 8px rgba(0, 174, 255, 0.5));
  }

  &__pin-label {
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    min-width: 96px;
    height: 24px;
    padding: 0 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(77, 242, 255, 0.55);
    border-radius: 12px;
    background: rgba(5, 25, 49, 0.86);
    box-shadow: 0 0 12px rgba(0, 174, 255, 0.28);
    color: $color-text-1;
    font-size: $font-size-xxs;
    line-height: 1;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.18s ease, transform 0.18s ease;
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
    color: $color-text-1;
    white-space: nowrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .security-mach__back { transition: none; }
}
</style>
