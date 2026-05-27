<template>
  <svg :width="size * 68 / 60" :height="size" viewBox="0 0 68 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hvac-offline-grad" x1="0.123" y1="0.172" x2="0.877" y2="0.828">
        <stop offset="10%" stop-color="#FEF27D"/>
        <stop offset="74%" stop-color="#CF8905"/>
      </linearGradient>
      <linearGradient id="hvac-offline-base-y" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="#F1DD04"/>
        <stop offset="100%" stop-color="#B74F07"/>
      </linearGradient>
      <linearGradient id="hvac-offline-base-d1" x1="0.04" y1="0.305" x2="0.96" y2="0.695">
        <stop offset="18%" stop-color="#BD983D"/>
        <stop offset="77%" stop-color="#401D01"/>
      </linearGradient>
      <linearGradient id="hvac-offline-base-d2" x1="0.04" y1="0.305" x2="0.96" y2="0.695">
        <stop offset="18%" stop-color="#BD983D"/>
        <stop offset="77%" stop-color="#7F5300"/>
      </linearGradient>
      <linearGradient id="hvac-offline-glow" x1="0.5" y1="0" x2="0.5" y2="1">
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

    <path transform="translate(9.38 27.43)" fill="url(#hvac-offline-base-d1)"
      d="M24.68 0 L49.36 11.33 L24.68 22.65 L0 11.33 L24.68 0 Z"/>
    <path transform="translate(9.38 38.41)" fill="url(#hvac-offline-base-y)"
      d="M49.36 3.19 L24.68 14.51 L0 3.19 L0 0 L24.68 10.97 L49.36 0 L49.36 3.19 Z"/>

    <path transform="translate(13.5 25.31)" fill="url(#hvac-offline-base-d2)"
      d="M20.57 0 L41.13 9.44 L20.57 18.88 L0 9.44 L20.57 0 Z"/>
    <path transform="translate(13.5 34.45)" fill="url(#hvac-offline-base-y)"
      d="M41.13 2.65 L20.57 12.09 L0 2.65 L0 0 L20.57 9.14 L41.13 0 L41.13 2.65 Z"/>

    <path transform="translate(20.12 23.43)" fill="url(#hvac-offline-base-d2)"
      d="M13.71 0 L27.42 6.29 L13.71 12.58 L0 6.29 L13.71 0 Z"/>
    <path transform="translate(20.12 29.53)" fill="url(#hvac-offline-base-y)"
      d="M27.42 1.77 L13.71 8.06 L0 1.77 L0 0 L13.71 6.10 L27.42 0 L27.42 1.77 Z"/>

    <path transform="translate(33.73 0.93)" fill="rgba(255,255,255,0.4)"
      d="M0.47 16.80 L0.77 16.80 L0.77 0 L0.17 0 L0.17 16.80 L0.47 16.80 Z"/>

    <!-- 空调图标（故障黄色） -->
    <g transform="translate(24 4)">
      <path fill="url(#hvac-offline-grad)"
        d="M1.2 0 L18.8 0 Q20 0 20 1.2 L20 14.8 Q20 16 18.8 16 L1.2 16 Q0 16 0 14.8 L0 1.2 Q0 0 1.2 0 Z"/>
      <path fill="#7F5300"
        d="M19.29 0H0.71C0.32 0 0 0.32 0 0.71V8.57C0 8.97 0.32 9.29 0.71 9.29H19.29C19.68 9.29 20 8.97 20 8.57V0.71C20 0.32 19.68 0 19.29 0ZM8.93 4.64H12.5C13.09 4.64 13.57 4.16 13.57 3.57C13.57 2.98 13.09 2.5 12.5 2.5H8.93C8.34 2.5 7.86 2.98 7.86 3.57C7.86 4.16 8.34 4.64 8.93 4.64ZM16.07 4.64H16.79C17.38 4.64 17.86 4.16 17.86 3.57C17.86 2.98 17.38 2.5 16.79 2.5H16.07C15.48 2.5 15 2.98 15 3.57C15 4.16 15.48 4.64 16.07 4.64ZM2.14 12.5C2.14 11.91 2.62 11.43 3.21 11.43C3.81 11.43 4.29 11.91 4.29 12.5V14.64C4.29 15.23 3.81 15.71 3.21 15.71C2.62 15.71 2.14 15.23 2.14 14.64V12.5ZM8.93 12.5C8.93 11.91 9.41 11.43 10 11.43C10.59 11.43 11.07 11.91 11.07 12.5V14.64C11.07 15.23 10.59 15.71 10 15.71C9.41 15.71 8.93 15.23 8.93 14.64V12.5ZM16.79 11.43C16.19 11.43 15.71 11.91 15.71 12.5V14.64C15.71 15.23 16.19 15.71 16.79 15.71C17.38 15.71 17.86 15.23 17.86 14.64V12.5C17.86 11.91 17.38 11.43 16.79 11.43Z"/>
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
        fill="none" stroke="url(#hvac-offline-glow)" stroke-width="0.6"/>
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
