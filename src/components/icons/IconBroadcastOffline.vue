<template>
  <svg :width="size * 68 / 60" :height="size" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="broadcast-offline-grad" x1="0.123" y1="0.172" x2="0.877" y2="0.828">
        <stop offset="10%" stop-color="#FEF27D"/>
        <stop offset="74%" stop-color="#CF8905"/>
      </linearGradient>
      <linearGradient id="broadcast-offline-base-y" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#F1DD04"/>
        <stop offset="100%" stop-color="#B74F07"/>
      </linearGradient>
      <linearGradient id="broadcast-offline-base-d1" x1="0.04" y1="0.305" x2="0.96" y2="0.695">
        <stop offset="18%" stop-color="#BD983D"/>
        <stop offset="77%" stop-color="#401D01"/>
      </linearGradient>
      <linearGradient id="broadcast-offline-base-d2" x1="0.04" y1="0.305" x2="0.96" y2="0.695">
        <stop offset="18%" stop-color="#BD983D"/>
        <stop offset="77%" stop-color="#7F5300"/>
      </linearGradient>
      <linearGradient id="broadcast-offline-glow" x1="0.5" y1="0" x2="0.5" y2="1">
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

    <path transform="translate(9.38 27.43)" fill="url(#broadcast-offline-base-d1)"
      d="M24.68 0 L49.36 11.33 L24.68 22.65 L0 11.33 L24.68 0 Z"/>
    <path transform="translate(9.38 38.41)" fill="url(#broadcast-offline-base-y)"
      d="M49.36 3.19 L24.68 14.51 L0 3.19 L0 0 L24.68 10.97 L49.36 0 L49.36 3.19 Z"/>

    <path transform="translate(13.5 25.31)" fill="url(#broadcast-offline-base-d2)"
      d="M20.57 0 L41.13 9.44 L20.57 18.88 L0 9.44 L20.57 0 Z"/>
    <path transform="translate(13.5 34.45)" fill="url(#broadcast-offline-base-y)"
      d="M41.13 2.65 L20.57 12.09 L0 2.65 L0 0 L20.57 9.14 L41.13 0 L41.13 2.65 Z"/>

    <path transform="translate(20.12 23.43)" fill="url(#broadcast-offline-base-d2)"
      d="M13.71 0 L27.42 6.29 L13.71 12.58 L0 6.29 L13.71 0 Z"/>
    <path transform="translate(20.12 29.53)" fill="url(#broadcast-offline-base-y)"
      d="M27.42 1.77 L13.71 8.06 L0 1.77 L0 0 L13.71 6.10 L27.42 0 L27.42 1.77 Z"/>

    <path transform="translate(33.73 0.93)" fill="rgba(255,255,255,0.4)"
      d="M0.47 16.80 L0.77 16.80 L0.77 0 L0.17 0 L0.17 16.80 L0.47 16.80 Z"/>

    <!-- 广播图标（离线，黄色）：喇叭 + 声波 -->
    <g transform="translate(26 4.5)">
      <path fill="url(#broadcast-offline-grad)"
        d="M11.29 0.81C11.13 -0.08 10.53 0 10.53 0L4.25 4.17C4.18 4.16 4.1 4.16 4.03 4.16L1.94 4.16C0.99 4.16 0.21 4.83 0.04 5.73L0 5.73L0 10.37L0.04 10.37C0.23 11.24 1.01 11.9 1.94 11.9L4.03 11.9C4.26 11.9 4.48 11.86 4.7 11.78L9.92 15.57C11.33 15.97 11.29 14.8 11.29 14.8L11.29 0.81Z M14.48 5.02L18.74 1.72C18.93 1.57 18.91 1.21 18.68 0.92C18.46 0.63 18.12 0.52 17.92 0.67L13.67 3.96C13.47 4.11 13.5 4.47 13.72 4.76C13.95 5.05 14.29 5.17 14.48 5.02Z M19.17 7.29L13.79 7.31C13.55 7.31 13.35 7.61 13.35 7.98C13.35 8.34 13.55 8.64 13.8 8.64L19.18 8.62C19.42 8.62 19.62 8.32 19.62 7.95C19.62 7.59 19.42 7.29 19.17 7.29Z M18.57 14.18L14.22 11C14.02 10.86 13.69 10.98 13.47 11.28C13.25 11.57 13.24 11.93 13.44 12.08L17.78 15.25C17.98 15.4 18.32 15.27 18.53 14.98C18.75 14.68 18.76 14.32 18.57 14.18Z"/>
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
        fill="none" stroke="url(#broadcast-offline-glow)" stroke-width="0.6"/>
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
