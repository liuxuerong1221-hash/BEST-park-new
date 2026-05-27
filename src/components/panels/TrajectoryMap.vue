<template>
  <div class="trajectory-map">
    <!-- 轨迹层（折线 + 端点圆 + 光点） -->
    <svg
      v-if="points.length"
      class="trajectory-map__lines"
      :viewBox="`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <polyline
        v-if="points.length > 1"
        :points="polylinePoints"
        fill="none"
        stroke="#1DEAFF"
        stroke-width="2"
        stroke-dasharray="6 4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-if="lightPoint"
        :cx="lightPoint.cx"
        :cy="lightPoint.cy"
        r="9"
        fill="#FFFFFF"
        stroke="#1DEAFF"
        stroke-width="2"
        class="trajectory-map__light"
      />
      <circle
        v-for="(p, idx) in points"
        :key="`pt-${idx}`"
        :cx="p.px"
        :cy="p.py"
        r="6"
        fill="rgba(29,234,255,0.85)"
        stroke="#0C84FF"
        stroke-width="1.5"
      />
    </svg>

    <!-- 点位层（HTML 绝对定位，复用 MapPinMarker） -->
    <div class="trajectory-map__pins">
      <MapPinMarker
        v-for="(p, idx) in points"
        :key="`pin-${idx}`"
        :x="p.x * 100"
        :y="p.y * 100"
        unit="%"
        :active="idx === 0 || idx === points.length - 1"
        @select="emit('pin-click', p)"
        @mouseenter="hoveredIdx = idx"
        @mouseleave="hoveredIdx = -1"
      >
        <template #icon="{ gradientId }">
          <!-- 摄像头（与 CameraMapMarker 一致） -->
          <template v-if="p.device === '监控'">
            <defs>
              <linearGradient :id="gradientId" x1="20" y1="11" x2="20" y2="29" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FFFFFF" />
                <stop offset="1" stop-color="#0083CC" />
              </linearGradient>
            </defs>
            <g transform="translate(12 11) scale(1)">
              <path fill-rule="evenodd" :fill="`url(#${gradientId})`"
                d="M3.9820631,13.931384C5.2017937,14.607118,6.5530643,14.933722,8,14.933722C9.4469366,14.933722,10.77429,14.607118,12.00598,13.931384C13.225711,13.255651,14.218236,12.365932,14.923768,11.217185C15.641256,10.068439,16,8.8295918,16,7.4668612C16,6.1041307,15.641256,4.8652849,14.923768,3.7165372C14.206278,2.5677893,13.225711,1.6668108,12.00598,1.0023389C10.77429,0.32660478,9.4469366,0,8,0C6.5530643,0,5.2017937,0.32660478,3.9820631,1.0023389C2.7623317,1.6668108,1.7937222,2.5677893,1.0762333,3.7165372C0.35874438,4.8652849,0,6.1041307,0,7.4668612C0,8.8295918,0.35874438,10.068439,1.0762333,11.217185C1.7937222,12.365932,2.7503738,13.266912,3.9820631,13.931384ZM3.9702125,5.3044071C4.3887477,4.6286731,4.9268641,4.1331348,5.6682692,3.7276943C6.3618422,3.3335161,7.1271634,3.1533203,8.0001087,3.1533203C8.8610954,3.1533203,9.6144581,3.3447783,10.319989,3.7276943C11.073353,4.1331348,11.623427,4.6511974,12.030005,5.3044071C12.44854,5.9914036,12.651828,6.6784,12.651828,7.4667559C12.651828,8.2551126,12.44854,8.9421082,12.030005,9.6291046C11.623427,10.282314,11.073353,10.800378,10.319989,11.205818C9.6144581,11.588735,8.8610954,11.780191,8.0001087,11.780191C7.1271634,11.780191,6.3618422,11.588735,5.6682692,11.205818C4.9268641,10.800378,4.3887477,10.293577,3.9702125,9.6291046C3.5516772,8.9421082,3.3483887,8.2551126,3.3483887,7.4667559C3.3483887,6.6784,3.5516772,5.9914036,3.9702125,5.3044071ZM9.8080273,9.4851131C9.289896,9.973218,8.6775579,10.211595,7.959239,10.211595C7.2409196,10.211595,6.628582,9.973218,6.1104498,9.4851131Q5.333252,8.7529583,5.333252,7.7143164C5.333252,7.0218892,5.5805421,6.4316235,6.1104498,5.9435191C6.628582,5.4440637,7.2409196,5.1943359,7.959239,5.1943359C8.6775579,5.1943359,9.289896,5.4327126,9.8080273,5.9435191Q10.585226,6.6756754,10.585226,7.7143164C10.585226,8.406744,10.337935,8.9970093,9.8080273,9.4851131ZM8.058588,16.215086C10.163709,16.214771,12.192632,15.42119,13.746776,13.990239C14.129744,13.63835,14.737985,13.661053,15.087161,14.046995C15.436337,14.444289,15.41381,15.045906,15.019579,15.409147C13.104743,17.168592,10.637984,18.13345,8.0473251,18.13345C5.4003463,18.13345,2.8885324,17.123188,0.96243304,15.295634C0.57946593,14.932394,0.5682022,14.319426,0.9286418,13.933482C1.2890815,13.54754,1.8973233,13.536188,2.2802906,13.899428C3.8459499,15.397796,5.8959508,16.215086,8.058588,16.215086Z"
              />
            </g>
          </template>
          <!-- 门禁设备（与 GateMapMarker 一致） -->
          <template v-else-if="p.device === '门禁设备'">
            <defs>
              <linearGradient :id="gradientId" x1="20" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FFFFFF" />
                <stop offset="1" stop-color="#0083CC" />
              </linearGradient>
            </defs>
            <path :fill="`url(#${gradientId})`"
              d="M20.57 25.63H24V26.68C24 27.23 23.23 28 22.29 28H13.71C12.77 28 12 27.24 12 26.32V13.68C12 12.76 12.77 12 13.71 12H22.29C23.23 12 24 12.76 24 13.68V15.05H20.57C19.37 15.05 18.43 15.98 18.43 17.16V23.53C18.43 24.71 19.37 25.63 20.57 25.63ZM17.14 23.53C17.14 23.19 16.84 22.89 16.50 22.89C16.16 22.89 15.86 23.19 15.86 23.53C15.86 26.10 17.96 28.16 20.57 28.16C20.91 28.16 21.21 27.86 21.21 27.53C21.21 27.19 20.91 26.89 20.57 26.89C18.69 26.89 17.14 25.37 17.14 23.53ZM27.14 26.71L20.29 26.71C19.81 26.71 19.43 26.35 19.43 25.90V25.08H28V25.90C28 26.35 27.62 26.71 27.14 26.71ZM19.43 20.39C19.43 19.94 19.81 19.58 20.29 19.58H27.14C27.62 19.58 28 19.94 28 20.39V22.84H19.43V20.39Z"
            />
          </template>
          <!-- 摆闸（与 TurnstileMapMarker 一致） -->
          <template v-else>
            <defs>
              <linearGradient :id="gradientId" x1="20" y1="11" x2="20" y2="29" gradientUnits="userSpaceOnUse">
                <stop stop-color="#FFFFFF" />
                <stop offset="1" stop-color="#0083CC" />
              </linearGradient>
            </defs>
            <path :fill="`url(#${gradientId})`"
              d="M15.61 12H19.80C20.45 12 21 12.52 21 13.2V30H14.40V20.4H12V16.8H14.40V13.2C14.40 12.55 14.96 12 15.61 12ZM19.21 15.60H16.22V14.40H19.21V15.60ZM22.20 16.80H30V20.40H22.20V16.80Z"
            />
          </template>
        </template>
      </MapPinMarker>

      <!-- hover 多行 tooltip：作为 siblings 单独定位 -->
      <div
        v-for="(p, idx) in points"
        :key="`tip-${idx}`"
        class="trajectory-map__tooltip"
        :class="{ 'trajectory-map__tooltip--visible': hoveredIdx === idx }"
        :style="{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }"
        role="tooltip"
      >
        <p class="trajectory-map__tooltip-row trajectory-map__tooltip-row--title">{{ p.location }}</p>
        <p class="trajectory-map__tooltip-row">时间：{{ p.firstTime }}</p>
        <p class="trajectory-map__tooltip-row">设备：{{ p.device }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import MapPinMarker from '@/components/common/MapPinMarker.vue'

export interface Waypoint {
  location: string
  x: number
  y: number
  seqRange: string
  firstTime: string
  device: string
}

const props = defineProps<{
  waypoints: Waypoint[]
  playState: 'idle' | 'playing' | 'paused'
}>()

const emit = defineEmits<{
  'play-end': []
  'pin-click': [waypoint: Waypoint]
}>()

const hoveredIdx = ref(-1)

const VIEWBOX_W = 1200
const VIEWBOX_H = 720

const points = computed(() =>
  props.waypoints.map(w => ({
    ...w,
    px: w.x * VIEWBOX_W,
    py: w.y * VIEWBOX_H,
  }))
)

const polylinePoints = computed(() =>
  points.value.map(p => `${p.px},${p.py}`).join(' ')
)

const segLengths = computed(() => {
  const arr: number[] = []
  for (let i = 1; i < points.value.length; i++) {
    const a = points.value[i - 1]
    const b = points.value[i]
    arr.push(Math.hypot(b.px - a.px, b.py - a.py))
  }
  return arr
})

const totalLength = computed(() =>
  segLengths.value.reduce((s, v) => s + v, 0)
)

const DURATION_MS = 7000
const progress = ref(0)
let rafId = 0
let lastTs = 0

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const lightPoint = computed<{ cx: number; cy: number } | null>(() => {
  if (props.playState === 'idle') return null
  if (points.value.length < 2) {
    const p = points.value[0]
    return p ? { cx: p.px, cy: p.py } : null
  }
  const target = progress.value * totalLength.value
  let acc = 0
  for (let i = 0; i < segLengths.value.length; i++) {
    const segLen = segLengths.value[i]
    if (target <= acc + segLen || i === segLengths.value.length - 1) {
      const ratio = segLen === 0 ? 0 : Math.min(1, (target - acc) / segLen)
      const a = points.value[i]
      const b = points.value[i + 1]
      return { cx: a.px + (b.px - a.px) * ratio, cy: a.py + (b.py - a.py) * ratio }
    }
    acc += segLen
  }
  return null
})

function step(ts: number) {
  const dt = ts - lastTs
  lastTs = ts
  progress.value = Math.min(1, progress.value + dt / DURATION_MS)
  if (progress.value >= 1) {
    cancelRaf()
    emit('play-end')
    return
  }
  rafId = requestAnimationFrame(step)
}

function cancelRaf() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

watch(() => props.playState, (s, prev) => {
  if (s === 'playing') {
    if (points.value.length < 2 || prefersReduced) {
      progress.value = 1
      emit('play-end')
      return
    }
    if (prev === 'idle' || progress.value >= 1) progress.value = 0
    lastTs = performance.now()
    rafId = requestAnimationFrame(step)
  } else if (s === 'paused') {
    cancelRaf()
  } else {
    cancelRaf()
    progress.value = 0
  }
})

watch(() => props.waypoints, () => {
  const wasRunning = rafId !== 0 || props.playState !== 'idle'
  cancelRaf()
  progress.value = 0
  if (wasRunning && props.playState !== 'idle') emit('play-end')
})

onUnmounted(() => cancelRaf())
</script>

<style lang="scss" scoped>
.trajectory-map {
  position: relative;
  width: 100%;
  height: 100%;
}

.trajectory-map__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: drop-shadow(0 0 6px rgba(29, 234, 255, 0.6));
}

.trajectory-map__pins {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}

.trajectory-map__tooltip {
  position: absolute;
  transform: translate(-50%, calc(-100% - 80px));
  min-width: 140px;
  padding: 8px 12px;
  border: 1px solid rgba(77, 242, 255, 0.55);
  border-radius: 8px;
  background: rgba(5, 25, 49, 0.92);
  box-shadow: 0 0 12px rgba(0, 174, 255, 0.32);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 5;

  &--visible {
    opacity: 1;
    transform: translate(-50%, calc(-100% - 84px));
  }
}

.trajectory-map__tooltip-row {
  margin: 0;
  padding: 2px 0;
  color: $color-text-2;
  font-size: $font-size-xxs;
  line-height: 1.4;

  &--title {
    color: $color-text-1;
    font-weight: 600;
    font-size: $font-size-xs;
  }
}

.trajectory-map__light {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))
          drop-shadow(0 0 14px rgba(29, 234, 255, 0.8));
}
</style>
