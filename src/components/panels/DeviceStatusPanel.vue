<template>
  <BasePanel class="device-panel" title="设备运营统计">
    <div class="device-panel__body" ref="bodyRef">

      <!-- 连线涟漪覆盖层 -->
      <svg v-if="lines.length" class="body-lines"
           :width="bodyW" :height="bodyH"
           :viewBox="`0 0 ${bodyW} ${bodyH}`">
        <defs>
          <filter id="dp-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g v-for="(ln, i) in lines" :key="i">
          <!-- 流动虚线 -->
          <line :x1="ln.x1" :y1="ln.y1" :x2="ln.x2" :y2="ln.y2"
            stroke="rgba(0,174,255,0.22)" stroke-width="1" stroke-dasharray="4 4">
            <animate attributeName="stroke-dashoffset"
              from="0" to="-8" :dur="`${0.5 + i * 0.04}s`" repeatCount="indefinite"/>
          </line>
        </g>
      </svg>

      <!-- 左侧设备列（info在左，图标在右） -->
      <div class="device-panel__col">
        <div v-for="(d, i) in devicesLeft" :key="d.name"
             class="device-item device-item--left">
          <div class="device-item__info">
            <span class="device-item__name">{{ d.name }}</span>
            <span class="device-item__stat">总数<em>{{ d.total }}</em></span>
            <span class="device-item__stat device-item__stat--online">在线<em>{{ d.online }}</em></span>
          </div>
          <component
            :is="d.icon"
            class="device-item__icon"
            :ref="(el: any) => { leftIconRefs[i] = getElement(el) }"
          />
        </div>
      </div>

      <!-- 中间3D模型 -->
      <div class="device-panel__center">
        <div class="model-wrap" ref="centerRef">
          <img class="device-panel__model" src="@/assets/images/设备运营统计@2x.png" alt="" />
          <i v-for="n in 8" :key="n" class="model-particle" :style="particleStyle(n)" />
        </div>
      </div>

      <!-- 右侧设备列（图标在左，info在右） -->
      <div class="device-panel__col device-panel__col--right">
        <div v-for="(d, i) in devicesRight" :key="d.name"
             class="device-item device-item--right">
          <component
            :is="d.icon"
            class="device-item__icon"
            :ref="(el: any) => { rightIconRefs[i] = getElement(el) }"
          />
          <div class="device-item__info">
            <span class="device-item__name">{{ d.name }}</span>
            <span class="device-item__stat">总数<em>{{ d.total }}</em></span>
            <span class="device-item__stat device-item__stat--online">在线<em>{{ d.online }}</em></span>
          </div>
        </div>
      </div>

    </div>
  </BasePanel>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import BasePanel from '@/components/common/BasePanel.vue'
import IconBuilding  from '@/components/icons/IconBuilding.vue'
import IconAccess    from '@/components/icons/IconAccess.vue'
import IconEnergy    from '@/components/icons/IconEnergy.vue'
import IconCamera    from '@/components/icons/IconCamera.vue'
import IconDisplayScreen from '@/components/icons/IconDisplayScreen.vue'
import IconBroadcast from '@/components/icons/IconBroadcast.vue'

// ── 连线计算 ──────────────────────────────────────────
const bodyRef   = ref<HTMLElement>()
const centerRef = ref<HTMLElement>()
const leftIconRefs:  (HTMLElement | null)[] = [null, null, null]
const rightIconRefs: (HTMLElement | null)[] = [null, null, null]

interface Line { x1: number; y1: number; x2: number; y2: number }
const lines = ref<Line[]>([])
const bodyW = ref(0)
const bodyH = ref(0)
let resizeObserver: ResizeObserver | undefined

function getElement(el: Element | { $el?: Element } | null): HTMLElement | null {
  if (!el) return null
  const target = '$el' in el ? el.$el : el
  return target instanceof HTMLElement || target instanceof SVGElement
    ? target as HTMLElement
    : null
}

function getCenter(el: HTMLElement, baseRect: DOMRect) {
  const rect = el.getBoundingClientRect()
  return {
    x: rect.left - baseRect.left + rect.width / 2,
    y: rect.top - baseRect.top + rect.height / 2,
  }
}

function computeLines() {
  if (!bodyRef.value || !centerRef.value) return
  const bRect = bodyRef.value.getBoundingClientRect()
  bodyW.value = bRect.width
  bodyH.value = bRect.height
  const center = getCenter(centerRef.value, bRect)
  const result: Line[] = []

  ;[...leftIconRefs, ...rightIconRefs].forEach(icon => {
    if (!icon) return
    const target = getCenter(icon, bRect)
    result.push({
      x1: center.x,
      y1: center.y,
      x2: target.x,
      y2: target.y,
    })
  })

  lines.value = result
}

onMounted(async () => {
  await nextTick()
  computeLines()
  window.addEventListener('resize', computeLines)
  if (window.ResizeObserver && bodyRef.value) {
    resizeObserver = new ResizeObserver(computeLines)
    resizeObserver.observe(bodyRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', computeLines)
  resizeObserver?.disconnect()
})

// ── 模型粒子 ──────────────────────────────────────────
const PARTICLES = [
  { x: 18, size: 3, dur: 2.2, delay: 0.0, color: '#4DF2FF' },
  { x: 33, size: 2, dur: 1.8, delay: 0.6, color: '#00AEFF' },
  { x: 50, size: 4, dur: 2.6, delay: 1.2, color: '#4DF2FF' },
  { x: 64, size: 2, dur: 2.0, delay: 0.3, color: '#00AEFF' },
  { x: 78, size: 3, dur: 2.4, delay: 1.6, color: '#4DF2FF' },
  { x: 42, size: 2, dur: 1.6, delay: 0.9, color: '#00AEFF' },
  { x: 26, size: 3, dur: 2.9, delay: 1.9, color: '#4DF2FF' },
  { x: 58, size: 2, dur: 2.1, delay: 0.5, color: '#00AEFF' },
]

function particleStyle(n: number) {
  const p = PARTICLES[n - 1]
  return {
    left:              `${p.x}%`,
    width:             `${p.size}px`,
    height:            `${p.size}px`,
    background:        p.color,
    boxShadow:         `0 0 ${p.size * 2}px ${p.color}`,
    animationDuration: `${p.dur}s`,
    animationDelay:    `${p.delay}s`,
  }
}

// ── 数据 ─────────────────────────────────────────────
const devicesLeft = [
  { name: '楼宇', icon: IconBuilding, total: 24, online: 22 },
  { name: '通行', icon: IconAccess,   total: 24, online: 22 },
  { name: '能耗', icon: IconEnergy,   total: 24, online: 22 },
]
const devicesRight = [
  { name: '摄像头', icon: IconCamera,    total: 24, online: 22 },
  { name: '电子班牌', icon: IconDisplayScreen, total: 24, online: 22 },
  { name: '广播',   icon: IconBroadcast, total: 24, online: 22 },
]
</script>

<style lang="scss" scoped>
.device-panel {
  flex: 1;
  min-height: 0;
  gap: $spacing-md;

  &__body {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
  }

  &__col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
    gap: 40px;
  }

  &__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
  }

  &__model {
    width: 100%;
    max-width: 130px;
    object-fit: contain;
    filter: drop-shadow(0 0 14px rgba(0, 174, 255, 0.45));
  }
}

// 连线 SVG 覆盖层
.body-lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
  z-index: 0;
}

.model-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 130px;
}

.model-particle {
  position: absolute;
  bottom: 18%;
  border-radius: 50%;
  opacity: 0;
  animation: particle-rise linear infinite;
  pointer-events: none;
}

@keyframes particle-rise {
  0%   { transform: translateY(0);      opacity: 0; }
  12%  { opacity: 0.9; }
  100% { transform: translateY(-150px); opacity: 0; }
}

.device-item {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;

  &--left  { flex-direction: row; }
  &--right { flex-direction: row; }

  &__icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .device-item--right & { text-align: left; }
    .device-item--left  & { text-align: right; }
  }

  &__name {
    font-size: $font-size-xs;
    color: $color-text-1;
    white-space: nowrap;
  }

  &__stat {
    font-size: 10px;
    color: $color-text-3;
    white-space: nowrap;

    em {
      font-style: normal;
      font-family: $font-number;
      font-size: $font-size-xs;
      font-weight: bold;
      color: $color-text-num;
      margin-left: 2px;
    }

    &--online em { color: $color-success; }
  }
}
</style>
