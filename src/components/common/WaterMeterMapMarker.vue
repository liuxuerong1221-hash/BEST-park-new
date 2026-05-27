<template>
  <MapPinMarker
    :x="x"
    :y="y"
    :label="label"
    :active="active"
    class="water-meter-map-marker"
    :class="{ 'water-meter-map-marker--dimmed': dimmed }"
    @select="$emit('select')"
  >
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="11.06" y1="10.38" x2="11.06" y2="29.63" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`"
        transform="translate(11.06 10.38)"
        d="M17.1875 0L0.6875 0C0.307804 -1.04904e-07 0 0.307804 0 0.6875L0 18.5625C0 18.9422 0.307804 19.25 0.6875 19.25L17.1875 19.25C17.5672 19.25 17.875 18.9422 17.875 18.5625L17.875 0.6875C17.875 0.307804 17.5672 0 17.1875 0ZM1.375 1.45062L16.5 1.4575L16.5 6.875L1.375 6.875L1.375 1.45062ZM5.67188 2.75L4.29688 2.75L4.29688 5.5L5.67188 5.5L5.67188 2.75ZM9.79688 2.75L8.42188 2.75L8.42188 5.5L9.79688 5.5L9.79688 2.75ZM13.9219 2.75L12.5469 2.75L12.5469 5.5L13.9219 5.5L13.9219 2.75ZM8.9375 16.5C7.41675 16.5 6.1875 15.4756 6.1875 14.2065C6.1875 13.365 7.10325 11.8387 8.9375 9.625C10.7718 11.8346 11.6875 13.365 11.6875 14.2065C11.6875 15.4756 10.4541 16.5 8.9375 16.5Z"
      />
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
.water-meter-map-marker {
  &--dimmed {
    opacity: 0.32;
    filter: grayscale(0.4);
    pointer-events: none;
  }
}
</style>
