<template>
  <MapPinMarker :x="x" :y="y" :label="label" :active="active" @select="$emit('select')">
    <template #icon="{ gradientId }">
      <defs>
        <linearGradient :id="gradientId" x1="20" y1="12" x2="20" y2="28" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="#0083CC"/>
        </linearGradient>
      </defs>
      <path :fill="`url(#${gradientId})`"
        d="M20.57 25.63H24V26.68C24 27.23 23.23 28 22.29 28H13.71C12.77 28 12 27.24 12 26.32V13.68C12 12.76 12.77 12 13.71 12H22.29C23.23 12 24 12.76 24 13.68V15.05H20.57C19.37 15.05 18.43 15.98 18.43 17.16V23.53C18.43 24.71 19.37 25.63 20.57 25.63ZM17.14 23.53C17.14 23.19 16.84 22.89 16.50 22.89C16.16 22.89 15.86 23.19 15.86 23.53C15.86 26.10 17.96 28.16 20.57 28.16C20.91 28.16 21.21 27.86 21.21 27.53C21.21 27.19 20.91 26.89 20.57 26.89C18.69 26.89 17.14 25.37 17.14 23.53ZM27.14 26.71L20.29 26.71C19.81 26.71 19.43 26.35 19.43 25.90V25.08H28V25.90C28 26.35 27.62 26.71 27.14 26.71ZM19.43 20.39C19.43 19.94 19.81 19.58 20.29 19.58H27.14C27.62 19.58 28 19.94 28 20.39V22.84H19.43V20.39Z"/>
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
