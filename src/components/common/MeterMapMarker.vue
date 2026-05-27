<template>
  <MapPinMarker
    :x="x"
    :y="y"
    :label="label"
    :active="active"
    class="meter-map-marker"
    :class="{ 'meter-map-marker--dimmed': dimmed }"
    @select="$emit('select')"
  >
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="7.72" y1="0" x2="7.72" y2="16.63" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`"
        transform="translate(12.28 11.69)"
        d="M0.59375 0L14.8438 0C15.1717 0 15.4375 0.265831 15.4375 0.59375L15.4375 16.0312C15.4375 16.3592 15.1717 16.625 14.8438 16.625L0.59375 16.625C0.265831 16.625 0 16.3592 0 16.0312L0 0.59375C0 0.265831 0.265831 0 0.59375 0ZM6.93975 7.71875L4.75 11.0901L7.71875 11.9065L6.18094 15.3182L10.6875 10.7415L7.71875 10.2558L9.44656 7.71875L6.93975 7.71875ZM14.25 1.25875L1.1875 1.25281L1.1875 5.9375L14.25 5.9375L14.25 1.25875ZM3.71094 2.375L4.89844 2.375L4.89844 4.75L3.71094 4.75L3.71094 2.375ZM7.27344 2.375L8.46094 2.375L8.46094 4.75L7.27344 4.75L7.27344 2.375ZM10.8359 2.375L12.0234 2.375L12.0234 4.75L10.8359 4.75L10.8359 2.375Z"
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
.meter-map-marker {
  &--dimmed {
    opacity: 0.32;
    filter: grayscale(0.4);
    pointer-events: none;
  }
}
</style>
