<template>
  <svg :width="size" :height="size * 1.039" viewBox="0 0 56 58.2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ac-base" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#06396A"/>
        <stop offset="50%" stop-color="#ACE8FF"/>
        <stop offset="100%" stop-color="#06396A"/>
      </linearGradient>
      <linearGradient id="ac-body" x1="0.5" y1="0.04" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(0,174,255,0)"/>
        <stop offset="100%" stop-color="rgba(0,174,255,0.6)"/>
      </linearGradient>
      <linearGradient id="ac-edge" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(77,242,255,0)"/>
        <stop offset="100%" stop-color="#4DF2FF"/>
      </linearGradient>
      <linearGradient id="ac-icon" x1="0.35" y1="0.11" x2="0.65" y2="0.88">
        <stop offset="11%" stop-color="#FEFFFF"/>
        <stop offset="88%" stop-color="#B0DFFF"/>
      </linearGradient>
      <linearGradient id="ac-ellipse" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#7ECDFA"/>
        <stop offset="100%" stop-color="#7FCDFA"/>
      </linearGradient>
    </defs>
    <!-- 底座 -->
    <rect x="0" y="53" width="56" height="5.2" fill="url(#ac-base)" stroke="#1F2A6A" stroke-width="0.5"/>
    <!-- 梯形 -->
    <path d="M5.09 0L50.91 0L56 19.75L0 19.75Z" transform="translate(0,33.78)" fill="url(#ac-body)"/>
    <path d="M55.87 19.25L50.91 0L5.09 0L0.13 19.25L0 19.75L56 19.75ZM0.65 19.25L5.48 0.5L50.52 0.5L55.35 19.25Z" transform="translate(0,33.78)" fill="url(#ac-edge)"/>
    <!-- 主体半透明 -->
    <path d="M0 0L50.91 0L44.29 32.74C44.29 33.62 43.32 34.44 41.62 35.14C39.92 35.84 37.5 36.4 34.5 36.75C31.5 37.1 28 37.25 25.45 37.42C22.9 37.25 19.5 37.1 16.5 36.75C13.5 36.4 11.08 35.84 9.29 35.14C7.64 34.46 6.68 33.67 6.62 32.82L0 0Z" transform="translate(2.55,11.95)" fill="url(#ac-body)" opacity="0.5"/>
    <!-- 椭圆光效 -->
    <ellipse cx="28" cy="47.85" rx="11.7" ry="3.12" fill="url(#ac-ellipse)" opacity="0.6"/>
    <!-- 中心图标：空调 -->
    <g transform="translate(18,13)">
      <path d="M19.29 0H0.71C0.32 0 0 0.32 0 0.71V8.57C0 8.97 0.32 9.29 0.71 9.29H19.29C19.68 9.29 20 8.97 20 8.57V0.71C20 0.32 19.68 0 19.29 0ZM8.93 4.64H12.5C13.09 4.64 13.57 4.16 13.57 3.57C13.57 2.98 13.09 2.5 12.5 2.5H8.93C8.34 2.5 7.86 2.98 7.86 3.57C7.86 4.16 8.34 4.64 8.93 4.64ZM16.07 4.64H16.79C17.38 4.64 17.86 4.16 17.86 3.57C17.86 2.98 17.38 2.5 16.79 2.5H16.07C15.48 2.5 15 2.98 15 3.57C15 4.16 15.48 4.64 16.07 4.64ZM2.14 12.5C2.14 11.91 2.62 11.43 3.21 11.43C3.81 11.43 4.29 11.91 4.29 12.5V14.64C4.29 15.23 3.81 15.71 3.21 15.71C2.62 15.71 2.14 15.23 2.14 14.64V12.5ZM8.93 12.5C8.93 11.91 9.41 11.43 10 11.43C10.59 11.43 11.07 11.91 11.07 12.5V14.64C11.07 15.23 10.59 15.71 10 15.71C9.41 15.71 8.93 15.23 8.93 14.64V12.5ZM16.79 11.43C16.19 11.43 15.71 11.91 15.71 12.5V14.64C15.71 15.23 16.19 15.71 16.79 15.71C17.38 15.71 17.86 15.23 17.86 14.64V12.5C17.86 11.91 17.38 11.43 16.79 11.43Z" fill="url(#ac-icon)" style="filter: drop-shadow(0px 2px 3px #26739A)"/>
    </g>
    <!-- 装饰粒子 -->
    <ellipse cx="38.18" cy="33.78" rx="0.76" ry="0.78" fill="#EDD505"/>
    <ellipse cx="41.24" cy="31.7" rx="0.51" ry="0.52" fill="#EDD505"/>
    <ellipse cx="14.76" cy="33.78" rx="0.76" ry="0.78" fill="#EDD505"/>
    <ellipse cx="19.85" cy="15.59" rx="0.25" ry="0.26" fill="#FFFFFF"/>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 56 })
</script>
