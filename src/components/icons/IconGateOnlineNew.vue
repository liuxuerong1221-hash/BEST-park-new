<template>
  <svg :width="size * 68 / 60" :height="size" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 蓝色渐变 -->
      <linearGradient id="gate-online-grad" x1="0.181" y1="0.213" x2="0.819" y2="0.787">
        <stop offset="10%" stop-color="#44B5F2"/>
        <stop offset="52%" stop-color="#44B5F2"/>
        <stop offset="93%" stop-color="#A9E1FF"/>
      </linearGradient>
      <!-- 底座渐变 -->
      <linearGradient id="gate-online-base-y" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="29%" stop-color="#44B5F2"/>
        <stop offset="100%" stop-color="#169CE4"/>
      </linearGradient>
      <linearGradient id="gate-online-base-d" x1="0.05" y1="0.293" x2="0.95" y2="0.707">
        <stop offset="18%" stop-color="#44B5F2"/>
        <stop offset="77%" stop-color="#005481"/>
      </linearGradient>
      <linearGradient id="gate-online-top-light" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#7CD1FF"/>
        <stop offset="100%" stop-color="#005380"/>
      </linearGradient>
      <linearGradient id="gate-online-top-rect" x1="0.358" y1="0.022" x2="0.642" y2="0.978">
        <stop offset="26%" stop-color="#44B5F2"/>
        <stop offset="85%" stop-color="#0A8ACF"/>
      </linearGradient>
      <!-- 光晕渐变 -->
      <linearGradient id="gate-online-glow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#F3FAFF" stop-opacity="0"/>
        <stop offset="100%" stop-color="#E3F2FF"/>
      </linearGradient>
    </defs>

    <!-- 底座描边 -->
    <g transform="translate(0.13 28.62)">
      <path opacity="0.158" fill="#44B5F2"
        d="M68.58 15.69 L33.94 -0.33 L33.81 -0.27 L-0.71 15.69 L33.94 31.71 L68.58 15.69 Z M33.94 0.33 L0.71 15.69 L33.94 31.05 L67.16 15.69 L33.94 0.33 Z"/>
    </g>

    <!-- 底座标记线 -->
    <path transform="translate(29.82 28.62)" fill="#44B5F2"
      d="M9.05 -0.40 L8.78 -0.27 L4.35 1.77 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.43 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    <path transform="translate(29.71 57.90)" fill="#44B5F2"
      d="M9.05 -0.40 L8.78 -0.27 L4.35 1.77 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.43 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    <path transform="translate(0 42.72)" fill="#00CCD6"
      d="M3.87 -0.40 L3.59 -0.27 L-0.71 1.72 L3.74 3.78 L4.01 3.91 L4.27 3.36 L3.99 3.24 L0.71 1.72 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>
    <path transform="translate(63.76 42.88)" fill="#44B5F2"
      d="M3.87 -0.40 L3.59 -0.27 L-0.71 1.72 L3.74 3.78 L4.01 3.91 L4.27 3.36 L3.99 3.24 L0.71 1.72 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>

    <!-- 底座第一层 -->
    <path transform="translate(9.38 27.19)" fill="url(#gate-online-base-d)"
      d="M24.68 0 L49.36 11.41 L24.68 22.82 L0 11.41 L24.68 0 Z"/>
    <path transform="translate(9.38 38.25)" fill="url(#gate-online-base-y)"
      d="M49.36 3.21 L24.68 14.62 L0 3.21 L0 0 L24.68 11.05 L49.36 0 L49.36 3.21 Z"/>

    <!-- 底座第二层 -->
    <path transform="translate(13.5 25.05)" fill="url(#gate-online-base-d)"
      d="M20.57 0 L41.13 9.51 L20.57 19.02 L0 9.51 L20.57 0 Z"/>
    <path transform="translate(13.5 34.27)" fill="url(#gate-online-base-y)"
      d="M41.13 2.67 L20.57 12.18 L0 2.67 L0 0 L20.57 9.21 L41.13 0 L41.13 2.67 Z"/>

    <!-- 底座第三层 -->
    <path transform="translate(20.12 23.16)" fill="url(#gate-online-top-rect)"
      d="M13.71 0 L27.42 6.34 L13.71 12.68 L0 6.34 L13.71 0 Z"/>
    <path transform="translate(20.12 29.30)" fill="url(#gate-online-top-light)"
      d="M27.42 1.78 L13.71 8.12 L0 1.78 L0 0 L13.71 6.14 L27.42 0 L27.42 1.78 Z"/>

    <!-- 中央立柱 -->
    <path transform="translate(33.73 0.94)" fill="rgba(255,255,255,0.4)"
      d="M0.47 16.92 L0.77 16.92 L0.77 0 L0.17 0 L0.17 16.92 L0.47 16.92 Z"/>

    <!-- 在线图标 -->
    <g transform="translate(26 7)">
      <path fill="url(#gate-online-grad)"
        d="M3.66664 6.16672C3.66664 6.6267 4.03995 7.00003 4.50005 7.00003C4.96004 7.00003 5.33335 6.6267 5.33335 6.16672C5.33335 3.68001 7.34665 1.66674 9.83329 1.66674C12.3199 1.66674 14.3333 3.68001 14.3333 6.16672C14.3333 6.6267 14.7067 7.00003 15.1667 7.00003C15.6267 7.00003 16 6.6267 16 6.16672C16 2.76004 13.2403 0 9.83331 0C6.42669 0 3.66664 2.76004 3.66664 6.16672ZM6.33338 6.1668C6.33338 6.62678 6.70669 7.00011 7.16668 7.00011C7.62669 7.00011 7.99998 6.62678 7.99998 6.1668C7.99998 5.15342 8.82002 4.33346 9.8334 4.33346C10.8467 4.33346 11.6666 5.15342 11.6666 6.1668C11.6666 6.62678 12.04 7.00011 12.5 7.00011C12.96 7.00011 13.3333 6.62678 13.3333 6.1668C13.3334 4.23343 11.7667 2.66671 9.83331 2.66671C7.89995 2.66671 6.33338 4.23343 6.33338 6.1668ZM1.33332 16L14.6667 16C15.4032 16 16 15.4032 16 14.6667L16 10.9999C16 10.2633 15.4032 9.66658 14.6667 9.66658L10.6666 9.66658L10.6666 6.16664C10.6666 5.70664 10.2933 5.3332 9.83333 5.3332C9.37335 5.3332 9.00003 5.70664 9.00003 6.16664L9.00003 9.66658L1.33332 9.66658C0.596748 9.66658 0 10.2633 0 11L0 14.6667C0 15.4032 0.59662 16 1.33332 16Z"/>
      <!-- 两个小圆点 - 深蓝色 -->
      <circle cx="2.5" cy="12.833" r="0.833" fill="#005481"/>
      <circle cx="5.5" cy="12.833" r="0.833" fill="#005481"/>
    </g>

    <!-- 侧面投影 -->
    <g transform="translate(13.69 9.4)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M0 0 L20.5 9.56 L20.5 34.94 L0 25.38 L0 0 Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
        d="M20.80 9.37 L-0.3 -0.47 L-0.3 0 L-0.3 25.57 L20.80 35.41 L20.80 9.37 Z M0.3 0.47 L0.3 25.19 L20.20 34.47 L20.20 9.75 L0.3 0.47 Z"/>
    </g>
    <g transform="translate(33.27 9.4)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M20.5 34.94 L0 25.38 L0 0 L20.5 9.56 L20.5 34.94 Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
        d="M-0.3 25.57 L20.80 35.41 L20.80 9.37 L-0.3 -0.47 L-0.3 25.57 Z M20.20 34.47 L0.3 25.19 L0.3 0.47 L20.20 9.75 L20.20 34.47 Z"/>
    </g>

    <!-- 顶部投影 -->
    <g transform="translate(13.38 0)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M0 9.48 L20.5 0 L41 9.48 L0 9.48 Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
        d="M20.5 -0.33 L-1.36 9.78 L42.37 9.78 L20.5 -0.33 Z M1.36 9.18 L39.64 9.18 L20.5 0.33 L1.36 9.18 Z"/>
    </g>

    <!-- 光晕椭圆 + 动画光点 -->
    <g transform="translate(33.88 21.40) rotate(-15.1)">
      <ellipse cx="0" cy="0" rx="28.53" ry="7.84"
        fill="none" stroke="url(#gate-online-glow)" stroke-width="0.6"/>
      <circle r="2.4" fill="#E3F2FF" opacity="0.4">
        <animateMotion dur="3.6s" repeatCount="indefinite"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
      <circle r="1.1" fill="#FFFFFF">
        <animateMotion dur="3.6s" repeatCount="indefinite"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
      <circle r="2" fill="#A9E1FF" opacity="0.35">
        <animateMotion dur="3.6s" repeatCount="indefinite" begin="-1.8s"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
      <circle r="0.9" fill="#A9E1FF">
        <animateMotion dur="3.6s" repeatCount="indefinite" begin="-1.8s"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 60 })
</script>
