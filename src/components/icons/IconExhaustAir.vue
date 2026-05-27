<template>
  <svg :width="size" :height="size * 1.039" viewBox="0 0 56 58.2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ea-base" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#06396A"/>
        <stop offset="50%" stop-color="#ACE8FF"/>
        <stop offset="100%" stop-color="#06396A"/>
      </linearGradient>
      <linearGradient id="ea-body" x1="0.5" y1="0.04" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(0,174,255,0)"/>
        <stop offset="100%" stop-color="rgba(0,174,255,0.6)"/>
      </linearGradient>
      <linearGradient id="ea-edge" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(77,242,255,0)"/>
        <stop offset="100%" stop-color="#4DF2FF"/>
      </linearGradient>
      <linearGradient id="ea-icon" x1="0.35" y1="0.11" x2="0.65" y2="0.88">
        <stop offset="11%" stop-color="#FEFFFF"/>
        <stop offset="88%" stop-color="#B0DFFF"/>
      </linearGradient>
      <linearGradient id="ea-ellipse" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#7ECDFA"/>
        <stop offset="100%" stop-color="#7FCDFA"/>
      </linearGradient>
    </defs>
    <!-- 底座 -->
    <rect x="0" y="53" width="56" height="5.2" fill="url(#ea-base)" stroke="#1F2A6A" stroke-width="0.5"/>
    <!-- 梯形 -->
    <path d="M5.09 0L50.91 0L56 19.75L0 19.75Z" transform="translate(0,33.78)" fill="url(#ea-body)"/>
    <path d="M55.87 19.25L50.91 0L5.09 0L0.13 19.25L0 19.75L56 19.75ZM0.65 19.25L5.48 0.5L50.52 0.5L55.35 19.25Z" transform="translate(0,33.78)" fill="url(#ea-edge)"/>
    <!-- 主体半透明 -->
    <path d="M0 0L50.91 0L44.29 32.74C44.29 33.62 43.32 34.44 41.62 35.14C39.92 35.84 37.5 36.4 34.5 36.75C31.5 37.1 28 37.25 25.45 37.42C22.9 37.25 19.5 37.1 16.5 36.75C13.5 36.4 11.08 35.84 9.29 35.14C7.64 34.46 6.68 33.67 6.62 32.82L0 0Z" transform="translate(2.55,11.95)" fill="url(#ea-body)" opacity="0.5"/>
    <!-- 椭圆光效 -->
    <ellipse cx="28" cy="47.85" rx="11.7" ry="3.12" fill="url(#ea-ellipse)" opacity="0.6"/>
    <!-- 中心图标：排风机（圆形扇叶） -->
    <g transform="translate(18,9)">
      <path d="M19.77 10.44C19.86 7.38 18.58 4.6 16.5 2.67L12.7 6.8C12.13 6.3 11.43 5.94 10.67 5.79V0.02C10.47 0.01 10.28 0 10.09 0C7.02 0.01 4.27 1.36 2.4 3.5L6.59 7.14C5.96 7.82 5.55 8.7 5.46 9.67L0.09 9.51C0.02 9.71 0.01 9.89 0 10.09C-0.08 13.16 1.2 15.94 3.28 17.87L7.21 13.6C7.75 14 8.45 14.3 9.2 14.41V19.98C9.4 19.99 9.58 20 9.78 20C12.85 19.99 15.6 18.64 17.46 16.5L13.22 12.81C13.68 12.25 13.98 11.58 14.11 10.87L19.69 11.03C19.76 10.83 19.77 10.65 19.78 10.45ZM6.97 10.08C6.97 8.51 8.24 7.24 9.81 7.24C11.38 7.24 12.65 8.51 12.65 10.08C12.65 11.65 11.38 12.92 9.81 12.92C8.24 12.92 6.97 11.65 6.97 10.08Z" fill="url(#ea-icon)" style="filter: drop-shadow(0px 2px 3px #26739A)"/>
      <circle cx="9.81" cy="10.08" r="1.55" fill="none" stroke="url(#ea-icon)" stroke-width="0.8"/>
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
