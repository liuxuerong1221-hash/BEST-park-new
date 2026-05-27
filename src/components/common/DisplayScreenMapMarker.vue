<template>
  <MapPinMarker
    :x="x"
    :y="y"
    :label="label"
    :active="active"
    class="dscreen-map-marker"
    :class="{ 'dscreen-map-marker--dimmed': dimmed }"
    @select="$emit('select')"
  >
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="9" y1="0" x2="9" y2="16" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <g :fill="`url(#${gradientId})`" transform="translate(11 11)">
        <!-- 显示器 -->
        <rect x="0" y="0" width="18" height="12" rx="1.2"/>
        <rect x="7.5" y="12" width="3" height="2" fill="currentColor"/>
        <rect x="5" y="14" width="8" height="1.5" rx="0.5"/>
      </g>
    </template>
  </MapPinMarker>
</template>

<script setup lang="ts">
import MapPinMarker from './MapPinMarker.vue'

defineProps<{
  x: number
  y: number
  label?: string
  active?: boolean
  dimmed?: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<style lang="scss" scoped>
.dscreen-map-marker {
  &--dimmed {
    opacity: 0.32;
    filter: grayscale(0.4);
    pointer-events: none;
  }
}
</style>
