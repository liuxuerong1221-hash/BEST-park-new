<template>
  <svg :width="size" :height="size * 1.039" viewBox="0 0 56 58.2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sa-base" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#06396A"/>
        <stop offset="50%" stop-color="#ACE8FF"/>
        <stop offset="100%" stop-color="#06396A"/>
      </linearGradient>
      <linearGradient id="sa-body" x1="0.5" y1="0.04" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(0,174,255,0)"/>
        <stop offset="100%" stop-color="rgba(0,174,255,0.6)"/>
      </linearGradient>
      <linearGradient id="sa-edge" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="rgba(77,242,255,0)"/>
        <stop offset="100%" stop-color="#4DF2FF"/>
      </linearGradient>
      <linearGradient id="sa-icon" x1="0.35" y1="0.11" x2="0.65" y2="0.88">
        <stop offset="11%" stop-color="#FEFFFF"/>
        <stop offset="88%" stop-color="#B0DFFF"/>
      </linearGradient>
      <linearGradient id="sa-ellipse" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#7ECDFA"/>
        <stop offset="100%" stop-color="#7FCDFA"/>
      </linearGradient>
    </defs>
    <!-- 底座 -->
    <rect x="0" y="53" width="56" height="5.2" fill="url(#sa-base)" stroke="#1F2A6A" stroke-width="0.5"/>
    <!-- 梯形 -->
    <path d="M5.09 0L50.91 0L56 19.75L0 19.75Z" transform="translate(0,33.78)" fill="url(#sa-body)"/>
    <path d="M55.87 19.25L50.91 0L5.09 0L0.13 19.25L0 19.75L56 19.75ZM0.65 19.25L5.48 0.5L50.52 0.5L55.35 19.25Z" transform="translate(0,33.78)" fill="url(#sa-edge)"/>
    <!-- 主体半透明 -->
    <path d="M0 0L50.91 0L44.29 32.74C44.29 33.62 43.32 34.44 41.62 35.14C39.92 35.84 37.5 36.4 34.5 36.75C31.5 37.1 28 37.25 25.45 37.42C22.9 37.25 19.5 37.1 16.5 36.75C13.5 36.4 11.08 35.84 9.29 35.14C7.64 34.46 6.68 33.67 6.62 32.82L0 0Z" transform="translate(2.55,11.95)" fill="url(#sa-body)" opacity="0.5"/>
    <!-- 椭圆光效 -->
    <ellipse cx="28" cy="47.85" rx="11.7" ry="3.12" fill="url(#sa-ellipse)" opacity="0.6"/>
    <!-- 中心图标：送风机（花瓣叶片） -->
    <g transform="translate(18.5,9)">
      <path d="M8.17 14.58C10.08 12.64 9.46 10.01 9.46 10.01C9.46 10.01 11.85 12.03 10.06 14.48C9.42 15.37 8.46 16.07 7.99 17.21C7.57 18.23 7.84 19.55 8.07 20C8.07 20 8.33 20.04 9.27 19.74C10.53 19.35 13.94 17.32 12.82 13.39C12.08 10.8 9.46 10.01 9.46 10.01C9.46 10.01 12.43 8.97 13.69 11.73C14.14 12.71 14.29 13.89 15.04 14.86C15.73 15.73 17.02 16.17 17.53 16.19C17.53 16.19 17.7 15.99 17.91 15.04C18.2 13.77 18.12 9.83 14.12 8.82C11.47 8.16 9.46 10.01 9.46 10.01C9.46 10.01 10.04 6.95 13.08 7.25C14.18 7.36 15.28 7.82 16.51 7.66C17.61 7.51 18.65 6.62 18.92 6.2C18.92 6.2 18.83 5.95 18.09 5.29C17.14 4.42 13.63 2.51 10.76 5.43C8.85 7.37 9.46 10.01 9.46 10.01C9.46 10.01 7.08 7.98 8.86 5.52C9.49 4.64 10.46 3.93 10.93 2.79C11.35 1.78 11.09 0.45 10.86 0C10.86 0 10.59-0.04 9.64 0.25C8.4 0.65 4.98 2.69 6.1 6.61C6.84 9.2 9.46 10.01 9.46 10.01C9.46 10.01 6.5 11.03 5.23 8.28C4.78 7.3 4.64 6.12 3.88 5.14C3.2 4.27 1.9 3.83 1.4 3.81C1.4 3.81 1.23 4.02 1.01 4.97C0.72 6.24 0.8 10.18 4.81 11.18C7.45 11.84 9.46 10.01 9.46 10.01C9.46 10.01 8.88 13.05 5.84 12.76C4.75 12.65 3.64 12.19 2.41 12.35C1.3 12.5 0.28 13.38 0 13.81C0 13.81 0.1 14.06 0.83 14.71C1.79 15.6 5.29 17.5 8.17 14.58Z" fill="url(#sa-icon)" style="filter: drop-shadow(0px 2px 3px #26739A)"/>
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
