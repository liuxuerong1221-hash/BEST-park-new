<template>
  <DeviceIconBase idPrefix="icm-" :size="size">
    <template #defs>
      <linearGradient id="icm-path" x1="0.5" y1="0.2848" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#00AEFF"/>
      </linearGradient>
      <filter id="icm-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,65,137,0.4)"/>
      </filter>
      <clipPath id="icm-path-clip">
        <rect x="11.5" y="11" width="26" height="26"/>
      </clipPath>
    </template>
    <g clip-path="url(#icm-path-clip)">
      <path fill-rule="evenodd" fill="url(#icm-path)" filter="url(#icm-shadow)"
        d="M36.0525,25.9319L22.646,12.4411C22.6101,12.405,22.5725,12.3707,22.5332,12.3385C21.8872,11.808,20.9422,11.9124,20.4225,12.5721L16.9685,16.9559L30.8432,31.4137L35.7822,28.3315C35.8864,28.2664,35.9826,28.1884,36.0686,28.0995C36.6501,27.4965,36.6431,26.5259,36.0525,25.9319ZM15.2232,19.1701C14.7544,19.7644,14.7855,20.6204,15.2961,21.178L18.7136,24.9095L26.4027,33.2201C26.8822,33.5145,27.4822,33.5121,27.9595,33.2141L29.5358,32.2309L16.0254,18.1524L15.2232,19.1701ZM16.8722,28.0938L18.3133,25.6006L20.4886,27.9475L19.0903,30.3646C18.8782,30.7326,18.525,30.9933,18.1162,31.0836C18.0095,31.109,17.8984,31.1219,17.7843,31.1219L15.5024,31.1219L15.5024,33.4671C15.5024,34.3138,14.8304,35,14.0013,35C13.1721,35,12.5,34.3138,12.5,33.4671L12.5,27.3359C12.5,26.4892,13.1721,25.803,14.0013,25.803C14.8304,25.803,15.5024,26.4892,15.5024,27.3357L15.5024,28.0938L16.8722,28.0938Z"
      />
    </g>
  </DeviceIconBase>
</template>

<script setup lang="ts">
import DeviceIconBase from './DeviceIconBase.vue'
withDefaults(defineProps<{ size?: number }>(), { size: 48 })
</script>
