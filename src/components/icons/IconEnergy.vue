<template>
  <DeviceIconBase idPrefix="ien-" :size="size">
    <template #defs>
      <linearGradient id="ien-path" x1="0.5" y1="0.2848" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#00AEFF"/>
      </linearGradient>
      <filter id="ien-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,65,137,0.4)"/>
      </filter>
    </template>
    <path fill-rule="evenodd" fill="url(#ien-path)" filter="url(#ien-shadow)"
      d="M35.2941,13L12.706,13C12.5188,13,12.3392,13.0744,12.2068,13.2067C12.0744,13.3391,12,13.5187,12,13.7059L12,29.9410C12,30.1283,12.0744,30.3078,12.2068,30.4402C12.3392,30.5726,12.5188,30.6469,12.706,30.6469L35.2941,30.6469C35.6839,30.6469,36,30.3309,36,29.9411L36,13.7059C36,13.316,35.684,13,35.2941,13ZM14.1177,15.1176L16.2343,15.1176L14.1177,17.2342L14.1177,15.1176ZM18,15.1176L21,15.1176L14.1177,21.9995L14.1177,18.9999L18,15.1176ZM23.4705,15.1176L25.2349,15.1176L14.1177,26.235L14.1177,24.4708L23.4705,15.1176ZM29.9976,32.0587L18.002,32.0587L17.2939,34.1763L30.7056,34.1763L29.9976,32.0587Z"
    />
  </DeviceIconBase>
</template>

<script setup lang="ts">
import DeviceIconBase from './DeviceIconBase.vue'
withDefaults(defineProps<{ size?: number }>(), { size: 48 })
</script>
