<template>
  <DeviceIconBase idPrefix="ilt-" :size="size">
    <template #defs>
      <linearGradient id="ilt-path" x1="0.5" y1="0.2848" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#00AEFF"/>
      </linearGradient>
      <filter id="ilt-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,65,137,0.4)"/>
      </filter>
      <clipPath id="ilt-path-clip">
        <rect x="11.5" y="11" width="26" height="26"/>
      </clipPath>
    </template>
    <g clip-path="url(#ilt-path-clip)">
      <path fill="url(#ilt-path)" filter="url(#ilt-shadow)"
        d="M26.4501,21.5301L26.4501,19.4501C26.4501,18.5401,25.9301,17.8901,25.1501,17.6301L25.1501,12.5601C25.1501,12.4301,25.0201,12.3001,24.8901,12.3001L24.1101,12.3001C23.9801,12.3001,23.8501,12.4301,23.8501,12.5601L23.8501,17.6301C23.0701,17.8901,22.5501,18.6701,22.5501,19.4501L22.5501,21.5301C18.0001,22.4401,14.3601,26.3401,14.1001,31.1501C14.1001,31.5401,14.3601,31.8001,14.7501,31.8001L34.2501,31.8001C34.6401,31.8001,34.9001,31.5401,34.9001,31.1501C34.6401,26.3401,31.0001,22.4401,26.4501,21.5301ZM30.2201,33.1001L18.7801,33.1001C18.5201,33.1001,18.3901,33.3601,18.6501,33.4901C20.2101,34.7901,22.2901,35.7001,24.5001,35.7001C26.7101,35.7001,28.7901,34.9201,30.3501,33.4901C30.6101,33.3601,30.4801,33.1001,30.2201,33.1001Z"
      />
    </g>
  </DeviceIconBase>
</template>

<script setup lang="ts">
import DeviceIconBase from './DeviceIconBase.vue'
withDefaults(defineProps<{ size?: number }>(), { size: 48 })
</script>
