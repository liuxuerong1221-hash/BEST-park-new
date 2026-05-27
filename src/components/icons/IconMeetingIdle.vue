<template>
  <svg :width="size * 68 / 60" :height="size" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 蓝色面（180deg #44B5F2 29% → #169CE4） -->
      <linearGradient id="imi-y" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="29%"  stop-color="#44B5F2"/>
        <stop offset="100%" stop-color="#169CE4"/>
      </linearGradient>
      <!-- 主体（114deg #44B5F2 → #005481） -->
      <linearGradient id="imi-d1" x1="0.05" y1="0.293" x2="0.95" y2="0.707">
        <stop offset="18%" stop-color="#44B5F2"/>
        <stop offset="77%" stop-color="#005481"/>
      </linearGradient>
      <!-- 顶层（180deg #7CD1FF → #005380） -->
      <linearGradient id="imi-top-light" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%"   stop-color="#7CD1FF"/>
        <stop offset="100%" stop-color="#005380"/>
      </linearGradient>
      <!-- 顶层（164deg #44B5F2 → #0A8ACF） -->
      <linearGradient id="imi-top-rect" x1="0.358" y1="0.022" x2="0.642" y2="0.978">
        <stop offset="26%" stop-color="#44B5F2"/>
        <stop offset="85%" stop-color="#0A8ACF"/>
      </linearGradient>
      <!-- 中央图形（145deg #44B5F2 → #A9E1FF） -->
      <linearGradient id="imi-c" x1="0.181" y1="0.213" x2="0.819" y2="0.787">
        <stop offset="10%" stop-color="#44B5F2"/>
        <stop offset="52%" stop-color="#44B5F2"/>
        <stop offset="95%" stop-color="#A9E1FF"/>
      </linearGradient>
      <!-- 椭圆光晕 -->
      <linearGradient id="imi-glow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%"   stop-color="#F3FAFF" stop-opacity="0"/>
        <stop offset="100%" stop-color="#E3F2FF"/>
      </linearGradient>
    </defs>

    <!-- 底座最大菱形描边 -->
    <g transform="translate(0.13 28.62)">
      <path opacity="0.158" fill="#44B5F2"
        d="M68.58 15.69 L33.94 -0.33 L33.81 -0.27 L-0.71 15.69 L33.94 31.71 L68.58 15.69 Z M33.94 0.33 L0.71 15.69 L33.94 31.05 L67.16 15.69 L33.94 0.33 Z"/>
    </g>

    <!-- 底座两侧的小亮带 -->
    <g transform="translate(29.82 28.62)">
      <path fill="#44B5F2"
        d="M9.05 -0.40 L8.78 -0.27 L4.35 1.77 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.43 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    </g>
    <g transform="translate(29.71 57.90)">
      <path fill="#44B5F2"
        d="M9.05 -0.40 L8.78 -0.27 L4.35 1.77 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.43 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    </g>
    <g transform="translate(0 42.72)">
      <path fill="#00CCD6"
        d="M3.87 -0.40 L3.59 -0.27 L-0.71 1.72 L3.74 3.78 L4.01 3.91 L4.27 3.36 L3.99 3.24 L0.71 1.72 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>
    </g>
    <g transform="translate(63.76 42.88)">
      <path fill="#44B5F2"
        d="M3.87 -0.40 L3.59 -0.27 L-0.71 1.72 L3.74 3.78 L4.01 3.91 L4.27 3.36 L3.99 3.24 L0.71 1.72 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>
    </g>

    <!-- 第一层（底） -->
    <g transform="translate(9.38 27.19)">
      <path fill="url(#imi-d1)"
        d="M24.68 0 L49.36 11.41 L24.68 22.82 L0 11.41 L24.68 0 Z"/>
    </g>
    <g transform="translate(9.38 38.25)">
      <path fill="url(#imi-y)"
        d="M49.36 3.21 L24.68 14.62 L0 3.21 L0 0 L24.68 11.05 L49.36 0 L49.36 3.21 Z"/>
    </g>

    <!-- 第二层（中） -->
    <g transform="translate(13.5 25.05)">
      <path fill="url(#imi-d1)"
        d="M20.57 0 L41.13 9.51 L20.57 19.02 L0 9.51 L20.57 0 Z"/>
    </g>
    <g transform="translate(13.5 34.27)">
      <path fill="url(#imi-y)"
        d="M41.13 2.67 L20.57 12.18 L0 2.67 L0 0 L20.57 9.21 L41.13 0 L41.13 2.67 Z"/>
    </g>

    <!-- 第三层（顶） -->
    <g transform="translate(20.12 23.16)">
      <path fill="url(#imi-top-rect)"
        d="M13.71 0 L27.42 6.34 L13.71 12.68 L0 6.34 L13.71 0 Z"/>
    </g>
    <g transform="translate(20.12 29.30)">
      <path fill="url(#imi-top-light)"
        d="M27.42 1.78 L13.71 8.12 L0 1.78 L0 0 L13.71 6.14 L27.42 0 L27.42 1.78 Z"/>
    </g>

    <!-- 中央立柱 -->
    <g transform="translate(33.73 0.94)">
      <path fill="rgba(255,255,255,0.4022)"
        d="M0.47 16.92 L0.77 16.92 L0.77 0 L0.17 0 L0.17 16.92 L0.47 16.92 Z"/>
    </g>

    <!-- 顶部"会议室-空"图形 -->
    <g transform="translate(26 6.04)">
      <path fill="url(#imi-c)" fill-rule="evenodd"
        d="M9.0248 0.022 L0.891 2.085 C0.373 2.206 0.012 2.667 0 3.201 L0 17.493 C0.012 18.039 0.410 18.500 0.940 18.609 L9.073 20.126 C9.121 20.138 9.170 20.138 9.218 20.138 C9.615 20.138 9.929 19.810 9.917 19.41 L9.917 0.738 C9.917 0.665 9.904 0.592 9.892 0.532 C9.796 0.156 9.410 -0.075 9.025 0.022 Z M11.832 18.379 L15.122 18.379 C15.833 18.379 16.411 17.796 16.411 17.081 L16.411 3.019 C16.411 2.303 15.833 1.721 15.122 1.721 L11.832 1.721 L11.832 18.379 Z M6.988 8.527 C6.495 8.527 6.049 9.194 6.049 10.044 C6.049 10.893 6.446 11.560 6.988 11.560 C7.531 11.560 7.928 10.893 7.928 10.044 C7.916 9.206 7.471 8.527 6.988 8.527 Z"/>
    </g>

    <!-- 半透明侧面投影（左/右） -->
    <g transform="translate(13.69 9.4)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M0 0 L20.5 9.56 L20.5 34.94 L0 25.38 L0 0 Z"/>
      <path fill="rgba(255,255,255,0.4022)" fill-rule="evenodd"
        d="M20.80 9.37 L-0.3 -0.47 L-0.3 0 L-0.3 25.57 L20.80 35.41 L20.80 9.37 Z M0.3 0.47 L0.3 25.19 L20.20 34.47 L20.20 9.75 L0.3 0.47 Z"/>
    </g>
    <g transform="translate(33.27 9.4)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M20.5 34.94 L0 25.38 L0 0 L20.5 9.56 L20.5 34.94 Z"/>
      <path fill="rgba(255,255,255,0.4022)" fill-rule="evenodd"
        d="M-0.3 25.57 L20.80 35.41 L20.80 9.37 L-0.3 -0.47 L-0.3 25.57 Z M20.20 34.47 L0.3 25.19 L0.3 0.47 L20.20 9.75 L20.20 34.47 Z"/>
    </g>

    <!-- 顶部三角投影 -->
    <g transform="translate(13.38 0)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M0 9.48 L20.5 0 L41 9.48 L0 9.48 Z"/>
      <path fill="rgba(255,255,255,0.4022)" fill-rule="evenodd"
        d="M20.5 -0.33 L-1.36 9.78 L42.37 9.78 L20.5 -0.33 Z M1.36 9.18 L39.64 9.18 L20.5 0.33 L1.36 9.18 Z"/>
    </g>

    <!-- 倾斜光晕椭圆 + 环绕光点 -->
    <g transform="translate(33.88 21.40) rotate(-15.1)">
      <ellipse cx="0" cy="0" rx="28.53" ry="7.84"
        fill="none" stroke="url(#imi-glow)" stroke-width="0.6"/>

      <!-- 光点 1：冷白色 -->
      <circle r="2.4" fill="#E3F2FF" opacity="0.4">
        <animateMotion dur="3.6s" repeatCount="indefinite"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
      <circle r="1.1" fill="#FFFFFF">
        <animateMotion dur="3.6s" repeatCount="indefinite"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>

      <!-- 光点 2：天蓝色，相位偏移 180° -->
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
