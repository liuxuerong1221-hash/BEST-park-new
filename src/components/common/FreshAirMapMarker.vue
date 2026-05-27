<template>
  <MapPinMarker :x="x" :y="y" :label="label" :active="active" :alert="alert" @select="$emit('select')">
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="20" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`" transform="translate(10 11.5)"
        d="M8.22 16.94C12.88 17.11 16.8 13.43 16.94 8.75C16.94 8.16 16.89 7.57 16.77 7.01L20 7.01V0H8.47C3.9 0 0.17 3.65 0 8.22C-0.14 12.9 3.54 16.8 8.22 16.94ZM1.85 8.64C1.91 4.99 4.88 2.08 8.5 2.08C12.2 2.1 15.2 5.13 15.18 8.86C15.12 12.54 12.09 15.48 8.39 15.42C4.72 15.34 1.77 12.31 1.85 8.64ZM3.31 8.83C3.37 11.69 5.73 13.99 8.59 13.94C11.47 13.88 13.77 11.53 13.72 8.67C13.66 5.83 11.36 3.56 8.53 3.56C5.64 3.56 3.31 5.95 3.31 8.83Z"
      />
    </template>
  </MapPinMarker>
</template>

<script setup lang="ts">
import MapPinMarker from './MapPinMarker.vue'

defineProps<{ x: number; y: number; label?: string; active?: boolean; alert?: boolean }>()
defineEmits<{ select: [] }>()
</script>
