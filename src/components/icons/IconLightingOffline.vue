<template>
  <svg :width="size * 68 / 60" :height="size" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lighting-offline-grad" x1="0.123" y1="0.172" x2="0.877" y2="0.828">
        <stop offset="10%" stop-color="#FEF27D"/>
        <stop offset="74%" stop-color="#CF8905"/>
      </linearGradient>
      <linearGradient id="lighting-offline-base-y" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#F1DD04"/>
        <stop offset="100%" stop-color="#B74F07"/>
      </linearGradient>
      <linearGradient id="lighting-offline-base-d1" x1="0.04" y1="0.305" x2="0.96" y2="0.695">
        <stop offset="18%" stop-color="#BD983D"/>
        <stop offset="77%" stop-color="#401D01"/>
      </linearGradient>
      <linearGradient id="lighting-offline-base-d2" x1="0.04" y1="0.305" x2="0.96" y2="0.695">
        <stop offset="18%" stop-color="#BD983D"/>
        <stop offset="77%" stop-color="#7F5300"/>
      </linearGradient>
      <linearGradient id="lighting-offline-glow" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#FFD308" stop-opacity="0"/>
        <stop offset="100%" stop-color="#FFF1C0"/>
      </linearGradient>
    </defs>

    <g transform="translate(0.13 28.85)">
      <path opacity="0.2" fill="#F3DA33"
        d="M68.59 15.57 L33.94 -0.33 L33.81 -0.27 L-0.72 15.57 L33.94 31.48 L68.59 15.57 Z M33.94 0.33 L0.72 15.57 L33.94 30.82 L67.15 15.57 L33.94 0.33 Z"/>
    </g>

    <path transform="translate(29.82 28.85)" fill="#F3DA33"
      d="M9.05 -0.40 L8.78 -0.27 L4.35 1.76 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.42 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    <path transform="translate(29.71 57.91)" fill="#F3DA33"
      d="M9.05 -0.40 L8.78 -0.27 L4.35 1.76 L0.13 -0.18 L-0.15 -0.31 L-0.40 0.24 L-0.13 0.36 L4.35 2.42 L9.03 0.27 L9.30 0.15 L9.05 -0.40 Z"/>
    <path transform="translate(0 42.85)" fill="#F3DA33"
      d="M3.87 -0.40 L3.59 -0.27 L-0.72 1.71 L3.74 3.75 L4.01 3.88 L4.26 3.33 L3.99 3.21 L0.72 1.71 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>
    <path transform="translate(63.76 43.01)" fill="#F3DA33"
      d="M3.87 -0.40 L3.59 -0.27 L-0.72 1.71 L3.74 3.75 L4.01 3.88 L4.26 3.33 L3.99 3.21 L0.72 1.71 L3.84 0.27 L4.12 0.15 L3.87 -0.40 Z"/>

    <path transform="translate(9.38 27.43)" fill="url(#lighting-offline-base-d1)"
      d="M24.68 0 L49.36 11.33 L24.68 22.65 L0 11.33 L24.68 0 Z"/>
    <path transform="translate(9.38 38.41)" fill="url(#lighting-offline-base-y)"
      d="M49.36 3.19 L24.68 14.51 L0 3.19 L0 0 L24.68 10.97 L49.36 0 L49.36 3.19 Z"/>

    <path transform="translate(13.5 25.31)" fill="url(#lighting-offline-base-d2)"
      d="M20.57 0 L41.13 9.44 L20.57 18.88 L0 9.44 L20.57 0 Z"/>
    <path transform="translate(13.5 34.45)" fill="url(#lighting-offline-base-y)"
      d="M41.13 2.65 L20.57 12.09 L0 2.65 L0 0 L20.57 9.14 L41.13 0 L41.13 2.65 Z"/>

    <path transform="translate(20.12 23.43)" fill="url(#lighting-offline-base-d2)"
      d="M13.71 0 L27.42 6.29 L13.71 12.58 L0 6.29 L13.71 0 Z"/>
    <path transform="translate(20.12 29.53)" fill="url(#lighting-offline-base-y)"
      d="M27.42 1.77 L13.71 8.06 L0 1.77 L0 0 L13.71 6.10 L27.42 0 L27.42 1.77 Z"/>

    <path transform="translate(33.73 0.93)" fill="rgba(255,255,255,0.4)"
      d="M0.47 16.80 L0.77 16.80 L0.77 0 L0.17 0 L0.17 16.80 L0.47 16.80 Z"/>

    <!-- 灯泡图标（离线，黄色） -->
    <g transform="translate(26 4)">
      <!-- 灯泡主体（无光圈，表示离线未亮） -->
      <path fill="url(#lighting-offline-grad)"
        d="M8 0.5 C4.96 0.5 2.5 2.96 2.5 6 C2.5 8.05 3.56 9.85 5.18 10.88 L5.18 12.2 C5.18 12.75 5.63 13.2 6.18 13.2 L9.82 13.2 C10.37 13.2 10.82 12.75 10.82 12.2 L10.82 10.88 C12.44 9.85 13.5 8.05 13.5 6 C13.5 2.96 11.04 0.5 8 0.5 Z"/>
      <!-- 灯泡基座 -->
      <rect x="5.5" y="13.8" width="5" height="1" rx="0.5" fill="url(#lighting-offline-grad)"/>
      <rect x="6" y="15.1" width="4" height="1" rx="0.5" fill="url(#lighting-offline-grad)"/>
    </g>

    <g transform="translate(13.7 9.33)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M0 0 L20.5 9.49 L20.5 34.68 L0 25.19 L0 0 Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
        d="M20.80 9.29 L-0.3 -0.47 L-0.3 0 L-0.3 25.39 L20.80 35.15 L20.80 9.29 Z M0.3 0.47 L0.3 25.00 L20.20 34.18 L20.20 9.67 L0.3 0.47 Z"/>
    </g>
    <g transform="translate(33.27 9.33)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M20.5 34.68 L0 25.19 L0 0 L20.5 9.49 L20.5 34.68 Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
        d="M-0.3 25.39 L20.80 35.15 L20.80 9.29 L-0.3 -0.47 L-0.3 25.39 Z M20.20 34.18 L0.3 25.00 L0.3 0.47 L20.20 9.67 L20.20 34.18 Z"/>
    </g>

    <g transform="translate(13.38 0)" opacity="0.6">
      <path fill="rgba(255,255,255,0.08)"
        d="M0 9.41 L20.5 0 L41 9.41 L0 9.41 Z"/>
      <path fill="rgba(255,255,255,0.4)" fill-rule="evenodd"
        d="M20.5 -0.33 L-1.36 9.71 L42.37 9.71 L20.5 -0.33 Z M1.36 9.11 L39.64 9.11 L20.5 0.33 L1.36 9.11 Z"/>
    </g>

    <g transform="translate(33.88 21.40) rotate(-15.1)">
      <ellipse cx="0" cy="0" rx="28.53" ry="7.84"
        fill="none" stroke="url(#lighting-offline-glow)" stroke-width="0.6"/>
      <circle r="2.4" fill="#FFF1C0" opacity="0.4">
        <animateMotion dur="3.6s" repeatCount="indefinite"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
      <circle r="1.1" fill="#FFFFFF">
        <animateMotion dur="3.6s" repeatCount="indefinite"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
      <circle r="2" fill="#FFE48A" opacity="0.35">
        <animateMotion dur="3.6s" repeatCount="indefinite" begin="-1.8s"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
      <circle r="0.9" fill="#FFE48A">
        <animateMotion dur="3.6s" repeatCount="indefinite" begin="-1.8s"
          path="M 28.53,0 A 28.53,7.84 0 1,1 -28.53,0 A 28.53,7.84 0 1,1 28.53,0"/>
      </circle>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 60 })
</script>
