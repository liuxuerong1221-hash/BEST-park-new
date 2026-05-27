<template>
  <svg :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <slot name="defs"/>
      <linearGradient :id="`${p}bg`" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(0,189,249,0.5)"/>
        <stop offset="50%"  stop-color="#003055"/>
        <stop offset="100%" stop-color="rgba(0,189,249,0.5)"/>
      </linearGradient>

      <linearGradient :id="`${p}bg-stroke`" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(1,172,242,0)"/>
        <stop offset="52%"  stop-color="#DFF7FF"/>
        <stop offset="100%" stop-color="rgba(1,172,242,0)"/>
      </linearGradient>

      <linearGradient :id="`${p}belt`" x1="24" y1="19.38" x2="24" y2="29.54" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(0,189,249,0.2)"/>
        <stop offset="100%" stop-color="rgba(0,136,240,0.384)"/>
      </linearGradient>

      <linearGradient :id="`${p}belt-stroke`" x1="24" y1="19.38" x2="24" y2="29.54" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(98,179,255,0)"/>
        <stop offset="52%"  stop-color="#1CF5F2"/>
        <stop offset="100%" stop-color="rgba(1,172,242,0)"/>
      </linearGradient>

      <filter :id="`${p}circle-fx`" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feFlood flood-color="rgba(0,98,255,0.4006)" result="c1"/>
        <feComposite operator="out" in="c1" in2="SourceAlpha" result="m1"/>
        <feGaussianBlur stdDeviation="6" in="m1" result="b1"/>
        <feOffset dy="6" in="b1" result="o1"/>
        <feComposite operator="in" in="o1" in2="SourceAlpha" result="s1"/>
        <feFlood flood-color="rgba(0,201,255,0.5185)" result="c2"/>
        <feComposite operator="out" in="c2" in2="SourceAlpha" result="m2"/>
        <feGaussianBlur stdDeviation="7" in="m2" result="b2"/>
        <feOffset dy="-6" in="b2" result="o2"/>
        <feComposite operator="in" in="o2" in2="SourceAlpha" result="s2"/>
        <feMerge>
          <feMergeNode in="SourceGraphic"/>
          <feMergeNode in="s1"/>
          <feMergeNode in="s2"/>
        </feMerge>
      </filter>

      <filter :id="`${p}particle-glow`" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="1.2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <clipPath :id="`${p}clip`">
        <circle cx="24" cy="24" r="23.3"/>
      </clipPath>
    </defs>

    <!-- 背景圆 -->
    <circle cx="24" cy="24" r="23.3"
      :fill="`url(#${p}bg)`"
      :stroke="`url(#${p}bg-stroke)`"
      stroke-width="1.4"
      :filter="`url(#${p}circle-fx)`"
    />

    <!-- 圆内内容 -->
    <g :clip-path="`url(#${p}clip)`">
      <!-- 腰带 -->
      <ellipse cx="24" cy="24.46" rx="24" ry="5.077"
        :fill="`url(#${p}belt)`"
        :stroke="`url(#${p}belt-stroke)`"
        stroke-width="1.4"
      />

      <!-- 粒子1 -->
      <circle r="1.8" fill="#4DF2FF" opacity="0.9" :filter="`url(#${p}particle-glow)`">
        <animateMotion dur="3s" repeatCount="indefinite"
          path="M 46,24 A 22,4.5 0 1 1 2,24 A 22,4.5 0 1 1 46,24"/>
      </circle>

      <!-- 中心 icon 插槽 -->
      <slot/>
    </g>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ idPrefix: string; size?: number }>(), { size: 48 })
const p = props.idPrefix
</script>
