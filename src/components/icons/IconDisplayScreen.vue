<template>
  <DeviceIconBase idPrefix="ids-" :size="size">
    <template #defs>
      <linearGradient id="ids-path" x1="0.5" y1="0.2848" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#00AEFF"/>
      </linearGradient>
      <filter id="ids-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,65,137,0.4)"/>
      </filter>
    </template>
    <!-- 显示器外框 -->
    <rect x="11" y="12" width="26" height="17" rx="1.8" fill="url(#ids-path)" filter="url(#ids-shadow)"/>
    <!-- 屏幕内容区 -->
    <rect x="12.8" y="13.8" width="22.4" height="13.4" rx="0.8" fill="rgba(0,60,100,0.75)"/>
    <!-- 屏幕内容线条 -->
    <rect x="15.5" y="16.5" width="9" height="1.3" rx="0.65" fill="rgba(68,181,242,0.9)"/>
    <rect x="15.5" y="19.2" width="14" height="1.3" rx="0.65" fill="rgba(68,181,242,0.65)"/>
    <rect x="15.5" y="21.9" width="11" height="1.3" rx="0.65" fill="rgba(68,181,242,0.45)"/>
    <!-- 支架 -->
    <rect x="21.5" y="29" width="5" height="3.2" rx="0.5" fill="url(#ids-path)" filter="url(#ids-shadow)"/>
    <!-- 底座 -->
    <rect x="17.5" y="32.2" width="13" height="2.2" rx="1.1" fill="url(#ids-path)" filter="url(#ids-shadow)"/>
  </DeviceIconBase>
</template>

<script setup lang="ts">
import DeviceIconBase from './DeviceIconBase.vue'
withDefaults(defineProps<{ size?: number }>(), { size: 48 })
</script>
