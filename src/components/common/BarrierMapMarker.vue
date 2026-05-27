<template>
  <MapPinMarker :x="x" :y="y" :label="label" :active="active" @select="$emit('select')">
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="20" y1="13" x2="20" y2="26" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`"
        d="M19.33 16.92H15.32V14.50C15.33 14.22 15.09 13.99 14.80 14H12.50C12.22 14 12 14.22 12 14.49V26.51C12 26.78 12.22 27 12.50 27H14.80C15.07 27 15.30 26.78 15.30 26.51V24.09H19.31C19.88 24.11 20.35 23.66 20.35 23.11V17.90C20.35 17.36 19.89 16.91 19.33 16.92ZM15.99 23.06L15.32 22.41L17.85 20.57L15.31 18.73L15.89 18L19.36 20.51L15.99 23.06ZM29.53 14H27.24C26.96 14 26.74 14.22 26.74 14.49V16.91H22.72C22.15 16.89 21.67 17.34 21.69 17.90V23.11C21.69 23.65 22.13 24.09 22.69 24.09H26.70V26.51C26.70 26.78 26.93 27 27.20 27H29.50C29.78 27 30 26.78 30 26.51V14.50C30.01 14.24 29.80 14.02 29.53 14ZM26.66 22.40L26 23.05L22.65 20.52L26.12 17.98L26.70 18.67L24.11 20.55L26.66 22.40Z"/>
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
