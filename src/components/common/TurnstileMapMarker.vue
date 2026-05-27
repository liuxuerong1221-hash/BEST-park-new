<template>
  <MapPinMarker :x="x" :y="y" :label="label" :active="active" @select="$emit('select')">
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="20" y1="11" x2="20" y2="29" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`"
        d="M15.61 12H19.80C20.45 12 21 12.52 21 13.2V30H14.40V20.4H12V16.8H14.40V13.2C14.40 12.55 14.96 12 15.61 12ZM19.21 15.60H16.22V14.40H19.21V15.60ZM22.20 16.80H30V20.40H22.20V16.80Z"/>
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
}>()

defineEmits<{
  select: []
}>()
</script>
