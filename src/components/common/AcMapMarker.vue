<template>
  <MapPinMarker :x="x" :y="y" :label="label" :active="active" :alert="alert" @select="$emit('select')">
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="20" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`" transform="translate(10 12)"
        d="M19.29 0H0.71C0.32 0 0 0.32 0 0.71V8.57C0 8.97 0.32 9.29 0.71 9.29H19.29C19.68 9.29 20 8.97 20 8.57V0.71C20 0.32 19.68 0 19.29 0ZM8.93 4.64H12.5C13.09 4.64 13.57 4.16 13.57 3.57C13.57 2.98 13.09 2.5 12.5 2.5H8.93C8.34 2.5 7.86 2.98 7.86 3.57C7.86 4.16 8.34 4.64 8.93 4.64ZM16.07 4.64H16.79C17.38 4.64 17.86 4.16 17.86 3.57C17.86 2.98 17.38 2.5 16.79 2.5H16.07C15.48 2.5 15 2.98 15 3.57C15 4.16 15.48 4.64 16.07 4.64ZM2.14 12.5C2.14 11.91 2.62 11.43 3.21 11.43C3.81 11.43 4.29 11.91 4.29 12.5V14.64C4.29 15.23 3.81 15.71 3.21 15.71C2.62 15.71 2.14 15.23 2.14 14.64V12.5ZM8.93 12.5C8.93 11.91 9.41 11.43 10 11.43C10.59 11.43 11.07 11.91 11.07 12.5V14.64C11.07 15.23 10.59 15.71 10 15.71C9.41 15.71 8.93 15.23 8.93 14.64V12.5ZM16.79 11.43C16.19 11.43 15.71 11.91 15.71 12.5V14.64C15.71 15.23 16.19 15.71 16.79 15.71C17.38 15.71 17.86 15.23 17.86 14.64V12.5C17.86 11.91 17.38 11.43 16.79 11.43Z"
      />
    </template>
  </MapPinMarker>
</template>

<script setup lang="ts">
import MapPinMarker from './MapPinMarker.vue'

defineProps<{ x: number; y: number; label?: string; active?: boolean; alert?: boolean }>()
defineEmits<{ select: [] }>()
</script>
