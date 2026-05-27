<template>
  <svg :width="size" :height="size * 1.039" viewBox="0 0 56 58.2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="fa-base" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#06396A"/>
        <stop offset="50%" stop-color="#ACE8FF"/>
        <stop offset="100%" stop-color="#06396A"/>
      </linearGradient>
      <linearGradient id="fa-body" x1="0.5" y1="0.04" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(0,174,255,0)"/>
        <stop offset="100%" stop-color="rgba(0,174,255,0.6)"/>
      </linearGradient>
      <linearGradient id="fa-edge" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(77,242,255,0)"/>
        <stop offset="100%" stop-color="#4DF2FF"/>
      </linearGradient>
      <linearGradient id="fa-icon" x1="0.35" y1="0.11" x2="0.65" y2="0.88">
        <stop offset="11%" stop-color="#FEFFFF"/>
        <stop offset="88%" stop-color="#B0DFFF"/>
      </linearGradient>
      <linearGradient id="fa-ellipse" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#7ECDFA"/>
        <stop offset="100%" stop-color="#7FCDFA"/>
      </linearGradient>
    </defs>
    <!-- 底座 -->
    <rect x="0" y="53" width="56" height="5.2" fill="url(#fa-base)" stroke="#1F2A6A" stroke-width="0.5"/>
    <!-- 梯形 -->
    <path d="M5.09 0L50.91 0L56 19.75L0 19.75Z" transform="translate(0,33.78)" fill="url(#fa-body)"/>
    <path d="M55.87 19.25L50.91 0L5.09 0L0.13 19.25L0 19.75L56 19.75ZM0.65 19.25L5.48 0.5L50.52 0.5L55.35 19.25Z" transform="translate(0,33.78)" fill="url(#fa-edge)"/>
    <!-- 主体半透明 -->
    <path d="M0 0L50.91 0L44.29 32.74C44.29 33.62 43.32 34.44 41.62 35.14C39.92 35.84 37.5 36.4 34.5 36.75C31.5 37.1 28 37.25 25.45 37.42C22.9 37.25 19.5 37.1 16.5 36.75C13.5 36.4 11.08 35.84 9.29 35.14C7.64 34.46 6.68 33.67 6.62 32.82L0 0Z" transform="translate(2.55,11.95)" fill="url(#fa-body)" opacity="0.5"/>
    <!-- 椭圆光效 -->
    <ellipse cx="28" cy="47.85" rx="11.7" ry="3.12" fill="url(#fa-ellipse)" opacity="0.6"/>
    <!-- 中心图标：新风机（风扇叶片） -->
    <g transform="translate(18,12)">
      <path d="M8.22 16.94C12.88 17.11 16.8 13.43 16.94 8.75C16.94 8.16 16.89 7.57 16.77 7.01L20 7.01V0H8.47C3.9 0 0.17 3.65 0 8.22C-0.14 12.9 3.54 16.8 8.22 16.94ZM1.85 8.64C1.91 4.99 4.88 2.08 8.5 2.08C12.2 2.1 15.2 5.13 15.18 8.86C15.12 12.54 12.09 15.48 8.39 15.42C4.72 15.34 1.77 12.31 1.85 8.64ZM3.31 8.83C3.37 11.69 5.73 13.99 8.59 13.94C11.47 13.88 13.77 11.53 13.72 8.67C13.66 5.83 11.36 3.56 8.53 3.56C5.64 3.56 3.31 5.95 3.31 8.83Z" fill="url(#fa-icon)" style="filter: drop-shadow(0px 2px 3px #26739A)"/>
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
