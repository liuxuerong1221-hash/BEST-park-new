<template>
  <svg :width="size * 68 / 60" :height="size" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="water-online-grad" x1="0.181" y1="0.213" x2="0.819" y2="0.787">
        <stop offset="10%" stop-color="#44B5F2"/>
        <stop offset="52%" stop-color="#44B5F2"/>
        <stop offset="93%" stop-color="#A9E1FF"/>
      </linearGradient>
      <linearGradient id="water-online-base-y" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="29%" stop-color="#44B5F2"/>
        <stop offset="100%" stop-color="#169CE4"/>
      </linearGradient>
      <linearGradient id="water-online-base-d" x1="0.05" y1="0.293" x2="0.95" y2="0.707">
        <stop offset="18%" stop-color="#44B5F2"/>
        <stop offset="77%" stop-color="#005481"/>
      </linearGradient>
      <linearGradient id="water-online-top-light" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#7CD1FF"/>
        <stop offset="100%" stop-color="#005380"/>
      </linearGradient>
      <linearGradient id="water-online-top-rect" x1="0.358" y1="0.022" x2="0.642" y2="0.978">
        <stop offset="26%" stop-color="#44B5F2"/>
        <stop offset="85%" stop-color="#0A8ACF"/>
      </linearGradient>
      <linearGradient id="water-online-glow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#F3FAFF" stop-opacity="0"/>
        <stop offset="100%" stop-color="#E3F2FF"/>
      </linearGradient>
      <linearGradient id="water-online-drop" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#A9E1FF"/>
        <stop offset="100%" stop-color="#005481"/>
      </linearGradient>
    </defs>

    <g transform="translate(0.13 28.62)">
      <path opacity="0.158" fill="#44B5F2"
        d="M68.58 15.69 L33.94 -0.33 L33.81 -0.27 L-0.71 15.69 L33.94 31.71 L68.58 15.69 Z M33.94 0.33 L0.71 15.69 L33.94 31.05 L67.16 15.69 L33.94 0.33 Z"/>
    </g>

    <path transform="translate(29.82 28.62)" fill="#44B5F2"
      d="M9.05 -0.40 L8.78 -0.27 L4.35 1.77 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.43 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    <path transform="translate(29.71 57.90)" fill="#44B5F2"
      d="M9.05 -0.40 L8.78 -0.27 L4.35 1.77 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.43 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    <path transform="translate(0 42.72)" fill="#00CCD6"
      d="M3.87 -0.40 L3.59 -0.27 L-0.71 1.72 L3.74 3.78 L4.01 3.91 L4.27 3.36 L3.99 3.24 L0.71 1.72 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>
    <path transform="translate(63.76 42.88)" fill="#44B5F2"
      d="M3.87 -0.40 L3.59 -0.27 L-0.71 1.72 L3.74 3.78 L4.01 3.91 L4.27 3.36 L3.99 3.24 L0.71 1.72 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>

    <path transform="translate(9.38 27.19)" fill="url(#water-online-base-d)"
      d="M24.68 0 L49.36 11.41 L24.68 22.82 L0 11.41 L24.68 0 Z"/>
    <path transform="translate(9.38 38.25)" fill="url(#water-online-base-y)"
      d="M49.36 3.21 L24.68 14.62 L0 3.21 L0 0 L24.68 11.05 L49.36 0 L49.36 3.21 Z"/>

    <path transform="translate(13.5 25.05)" fill="url(#water-online-base-d)"
      d="M20.57 0 L41.13 9.51 L20.57 19.02 L0 9.51 L20.57 0 Z"/>
    <path transform="translate(13.5 34.27)" fill="url(#water-online-base-y)"
      d="M41.13 2.67 L20.57 12.18 L0 2.67 L0 0 L20.57 9.21 L41.13 0 L41.13 2.67 Z"/>

    <path transform="translate(20.12 23.16)" fill="url(#water-online-top-rect)"
      d="M13.71 0 L27.42 6.34 L13.71 12.68 L0 6.34 L13.71 0 Z"/>
    <path transform="translate(20.12 29.30)" fill="url(#water-online-top-light)"
      d="M27.42 1.78 L13.71 8.12 L0 1.78 L0 0 L13.71 6.14 L27.42 0 L27.42 1.78 Z"/>

    <path transform="translate(33.73 0.94)" fill="rgba(255,255,255,0.4)"
      d="M0.47 16.92 L0.77 16.92 L0.77 0 L0.17 0 L0.17 16.92 L0.47 16.92 Z"/>

    <!-- 水表图标：表体 + 表盘刻度 + 水滴 -->
    <g transform="translate(26 4.5)">
      <!-- 表体外框 -->
      <path fill="url(#water-online-grad)"
        d="M1.2 0 L14.8 0 Q16 0 16 1.2 L16 14.8 Q16 16 14.8 16 L1.2 16 Q0 16 0 14.8 L0 1.2 Q0 0 1.2 0 Z M14 2 L2 2 L2 5.6 L14 5.6 L14 2 Z"/>
      <!-- 表盘刻度 -->
      <rect x="3.3" y="3.1" width="0.9" height="1.4" fill="#005481"/>
      <rect x="6.3" y="3.1" width="0.9" height="1.4" fill="#005481"/>
      <rect x="9.3" y="3.1" width="0.9" height="1.4" fill="#005481"/>
      <rect x="11.5" y="3.1" width="1.2" height="1.4" fill="#005481"/>
      <!-- 水滴 -->
      <path fill="url(#water-online-drop)"
        d="M8 7.2 C 6.4 9.4 5.6 10.7 5.6 11.5 C 5.6 12.66 6.67 13.6 8 13.6 C 9.33 13.6 10.4 12.66 10.4 11.5 C 10.4 10.7 9.6 9.4 8 7.2 Z"/>
    </g>

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

    <g transform="translate(13.38 0)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M0 9.48 L20.5 0 L41 9.48 L0 9.48 Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
        d="M20.5 -0.33 L-1.36 9.78 L42.37 9.78 L20.5 -0.33 Z M1.36 9.18 L39.64 9.18 L20.5 0.33 L1.36 9.18 Z"/>
    </g>

    <g transform="translate(33.88 21.40) rotate(-15.1)">
      <ellipse cx="0" cy="0" rx="28.53" ry="7.84"
        fill="none" stroke="url(#water-online-glow)" stroke-width="0.6"/>
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
