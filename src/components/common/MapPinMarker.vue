<template>
  <div
    class="map-pin-marker"
    :class="{ 'map-pin-marker--active': active }"
    :style="{ left: `${x}${unit}`, top: `${y}${unit}` }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keydown.enter.prevent="$emit('select')"
    @keydown.space.prevent="$emit('select')"
  >
    <span
      v-if="label"
      class="map-pin-marker__label"
      :class="{ 'map-pin-marker__label--alert': alert }"
    >{{ label }}</span>

    <!-- 主体：圆形 + 三角指针 -->
    <div class="map-pin-marker__body" :class="{ 'map-pin-marker__body--alert': alert }">
      <svg class="map-pin-marker__pin" viewBox="0 0 40 52.5" fill="none">
        <defs>
          <linearGradient :id="`pin-stroke-${uid}`" x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
            <stop :stop-color="alert ? '#FF4848' : '#0C84FF'"/>
            <stop offset="1" :stop-color="alert ? '#FF1414' : '#1DEAFF'"/>
          </linearGradient>
          <linearGradient :id="`pin-tri-${uid}`" x1="7.25" y1="42" x2="7.25" y2="52.5" gradientUnits="userSpaceOnUse">
            <stop :stop-color="alert ? '#FF4848' : '#0C84FF'"/>
            <stop offset="1" :stop-color="alert ? '#FF1414' : '#1DEAFF'"/>
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="19.5" :fill="alert ? 'rgba(79, 2, 2, 0.7)' : 'rgba(2, 37, 79, 0.6)'" :stroke="`url(#pin-stroke-${uid})`"/>
        <!-- 中心图标通过 slot 插入，接收 iconGradientId 作为渐变色 ID -->
        <slot name="icon" :gradient-id="`pin-icon-${uid}`">
          <!-- 默认渐变定义 -->
          <defs>
            <linearGradient :id="`pin-icon-${uid}`" x1="20" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FFFFFF"/>
              <stop offset="1" stop-color="#0083CC"/>
            </linearGradient>
          </defs>
        </slot>
        <!-- 底部三角指针 -->
        <path d="M12.75 42 L19.75 52.5 L27.25 42 Q19.75 46 12.75 42 Z" :fill="`url(#pin-tri-${uid})`"/>
      </svg>
    </div>

    <!-- 地面光圈：双层椭圆 -->
    <svg class="map-pin-marker__base" viewBox="0 0 49 24" fill="none">
      <ellipse cx="24.5" cy="12" rx="24.2" ry="11.7" fill="rgba(10, 15, 21, 0.502)" fill-opacity="0.8" :stroke="alert ? 'rgba(255,68,68,0.7)' : '#00AEFF'" stroke-width="0.6"/>
      <ellipse cx="24.5" cy="12" rx="18.2" ry="7.7" fill="rgba(10, 15, 21, 0.502)" :stroke="alert ? 'rgba(255,68,68,0.7)' : '#00AEFF'" stroke-width="0.6"/>
    </svg>

    <!-- 涟漪扩散（仅激活时显示） -->
    <span class="map-pin-marker__ripple" />
    <span class="map-pin-marker__ripple map-pin-marker__ripple--delayed" />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  /** 地图区域内的横向位置（px 或 %） */
  x: number | string
  /** 地图区域内的纵向位置（px 或 %） */
  y: number | string
  /** hover 时显示的标签 */
  label?: string
  /** 是否为当前激活点 */
  active?: boolean
  /** 是否告警状态（红色） */
  alert?: boolean
  /** 定位单位：'px' 或 '%' */
  unit?: 'px' | '%'
}>(), {
  unit: 'px',
})

defineEmits<{
  select: []
}>()

// 让每个实例的 SVG defs id 唯一
const uid = Math.random().toString(36).slice(2, 8)

defineExpose({ uid })
</script>

<style lang="scss" scoped>
.map-pin-marker {
  position: absolute;
  width: 49px;
  height: 71px;
  transform: translate(-50%, calc(-100% + 12px));
  pointer-events: auto;
  cursor: pointer;
  z-index: 3;
  outline: none;

  &__label {
    position: absolute;
    left: 50%;
    top: -25px;
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

    &--alert {
      border-color: rgba(255, 68, 68, 0.7);
      background: rgba(60, 5, 5, 0.9);
      box-shadow: 0 0 12px rgba(255, 20, 20, 0.35);
      color: #FF4848;
    }
  }

  &__body {
    position: absolute;
    top: 5px;
    left: 4px;
    width: 40px;
    height: 52.5px;
    filter: drop-shadow(0 0 8px rgba(0, 174, 255, 0.45));
    animation: pin-marker-float 3s ease-in-out infinite;

    &--alert {
      filter: drop-shadow(0 0 10px rgba(255, 20, 20, 0.7));
    }
  }

  &__pin {
    width: 100%;
    height: 100%;
    display: block;
  }

  &__base {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 49px;
    height: 24px;
  }

  &__ripple {
    position: absolute;
    bottom: 6px;
    left: 50%;
    width: 49px;
    height: 24px;
    transform: translate(-50%, 0);
    border: 1px solid rgba(0, 174, 255, 0.55);
    border-radius: 50%;
    opacity: 0;
    pointer-events: none;
    animation: none;

    &--delayed {
      animation-delay: 1.2s;
    }
  }

  &--alert &__ripple {
    border-color: rgba(255, 68, 68, 0.55);
    animation: pin-marker-ripple-alert 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;

    &--delayed {
      animation-delay: 1.2s;
    }
  }

  &--active &__body {
    filter: drop-shadow(0 0 14px rgba(77, 242, 255, 0.85));
    animation-duration: 1.6s;
  }

  &--active &__ripple {
    border-color: rgba(77, 242, 255, 0.9);
    animation: pin-marker-ripple 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;

    &--delayed {
      animation-delay: 1.2s;
    }
  }

  &:hover &__body {
    transform: translateY(-2px);
    transition: transform 0.18s ease;
  }

  &:hover &__label,
  &:focus-visible &__label {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  &:focus-visible &__body {
    filter: drop-shadow(0 0 14px rgba(77, 242, 255, 0.85));
  }
}

@keyframes pin-marker-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-3px); }
}

@keyframes pin-marker-ripple {
  0%   { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
  20%  { opacity: 0.7; }
  100% { opacity: 0; transform: translate(-50%, 0) scale(1.8); }
}

@keyframes pin-marker-ripple-alert {
  0%   { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
  20%  { opacity: 0.7; }
  100% { opacity: 0; transform: translate(-50%, 0) scale(1.8); }
}

@media (prefers-reduced-motion: reduce) {
  .map-pin-marker__body,
  .map-pin-marker__ripple {
    animation: none;
  }

  .map-pin-marker__label {
    transition: none;
  }
}
</style>
