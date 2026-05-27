<template>
  <svg :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dei-light-grad" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#00AEFF"/>
      </linearGradient>
    </defs>
    <!-- 灯泡轮廓 -->
    <path d="M24 8c-6.6 0-12 5.4-12 12 0 4.3 2.2 8 5.6 10.1V34c0 1.1.9 2 2 2h8.8c1.1 0 2-.9 2-2v-3.9C33.8 28 36 24.3 36 20c0-6.6-5.4-12-12-12z"
          fill="url(#dei-light-grad)" opacity="0.95"/>
    <!-- 底座 -->
    <rect x="19" y="37" width="10" height="2.6" rx="1" fill="#4DF2FF"/>
    <rect x="20.5" y="40.5" width="7" height="2" rx="1" fill="#4DF2FF" opacity="0.7"/>
    <!-- 光线 -->
    <g stroke="#4DF2FF" stroke-width="1.4" stroke-linecap="round" opacity="0.8">
      <line x1="24" y1="2" x2="24" y2="5"/>
      <line x1="4" y1="20" x2="7" y2="20"/>
      <line x1="41" y1="20" x2="44" y2="20"/>
      <line x1="9" y1="6" x2="11" y2="8"/>
      <line x1="37" y1="8" x2="39" y2="6"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 42 })
</script>
