<template>
  <svg :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- 背景圆渐变 -->
      <linearGradient id="ib-bg" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(0,189,249,0.5)" />
        <stop offset="50%"  stop-color="#003055" />
        <stop offset="100%" stop-color="rgba(0,189,249,0.5)" />
      </linearGradient>

      <!-- 背景圆描边渐变 -->
      <linearGradient id="ib-bg-stroke" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(1,172,242,0)" />
        <stop offset="52%"  stop-color="#DFF7FF" />
        <stop offset="100%" stop-color="rgba(1,172,242,0)" />
      </linearGradient>

      <!-- 腰带渐变 -->
      <linearGradient id="ib-belt" x1="24" y1="19.38" x2="24" y2="29.54" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(0,189,249,0.2)" />
        <stop offset="100%" stop-color="rgba(0,136,240,0.384)" />
      </linearGradient>

      <!-- 腰带描边渐变 -->
      <linearGradient id="ib-belt-stroke" x1="24" y1="19.38" x2="24" y2="29.54" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgba(98,179,255,0)" />
        <stop offset="52%"  stop-color="#1CF5F2" />
        <stop offset="100%" stop-color="rgba(1,172,242,0)" />
      </linearGradient>

      <!-- 楼宇路径渐变（坐标为路径本地空间 0~22） -->
      <linearGradient id="ib-path" x1="11" y1="0" x2="11" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="#FFFFFF" />
        <stop offset="21%"  stop-color="#FFFFFF" />
        <stop offset="99%"  stop-color="#00AEFF" />
      </linearGradient>

      <!-- 背景圆内阴影滤镜（inset，限制在圆形区域内不溢出） -->
      <filter id="ib-circle-fx" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        <!-- 上内阴影：dy=+6, blur=6, rgba(0,98,255,0.4) -->
        <feFlood flood-color="rgba(0,98,255,0.4006)" result="c1"/>
        <feComposite operator="out" in="c1" in2="SourceAlpha" result="m1"/>
        <feGaussianBlur stdDeviation="6" in="m1" result="b1"/>
        <feOffset dy="6" in="b1" result="o1"/>
        <feComposite operator="in" in="o1" in2="SourceAlpha" result="s1"/>
        <!-- 下内阴影：dy=-6, blur=7, rgba(0,201,255,0.52) -->
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

      <!-- 粒子发光滤镜 -->
      <filter id="ib-particle-glow" x="-150%" y="-150%" width="400%" height="400%">
        <feGaussianBlur stdDeviation="1.2" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- 路径投影滤镜 -->
      <filter id="ib-path-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,65,137,0.4)" />
      </filter>

      <!-- 裁切圆（所有内容限制在圆内） -->
      <clipPath id="ib-clip">
        <circle cx="24" cy="24" r="23.3" />
      </clipPath>
    </defs>

    <!-- 背景圆 -->
    <circle cx="24" cy="24" r="23.3"
      fill="url(#ib-bg)"
      stroke="url(#ib-bg-stroke)"
      stroke-width="1.4"
      filter="url(#ib-circle-fx)"
    />

    <!-- 圆内所有内容裁切在圆形区域内 -->
    <g clip-path="url(#ib-clip)">
      <!-- 腰带高光椭圆 -->
      <ellipse cx="24" cy="24.46" rx="24" ry="5.077"
        fill="url(#ib-belt)"
        stroke="url(#ib-belt-stroke)"
        stroke-width="1.4"
      />

      <!-- 粒子1：赤道轨道，3s，青色，最大 -->
      <circle r="1.8" fill="#4DF2FF" opacity="0.9" filter="url(#ib-particle-glow)">
        <animateMotion dur="3s" repeatCount="indefinite"
          path="M 46,24 A 22,4.5 0 1 1 2,24 A 22,4.5 0 1 1 46,24"/>
      </circle>

      <!-- 楼宇路径 -->
      <g transform="translate(11,11)" filter="url(#ib-path-shadow)">
        <path
          fill="url(#ib-path)"
          d="M7.38408 6.74147e-06L18.3628 6.74147e-06C20.371 0.000957787 21.999 1.62545 22 3.62985L22 18.333C21.998 20.3383 20.3686 21.9629 18.3593 21.9629L12.7017 21.9629L12.7017 11.4356L5.51061 5.21858L3.73984 6.75605L3.73984 3.62809C3.74081 1.6213 5.37326 -0.00390129 7.38408 6.74147e-06ZM18.099 6.49804L18.1025 6.49804C18.5498 6.49612 18.9118 6.13369 18.9118 5.68689C18.9118 5.2389 18.5479 4.87574 18.099 4.87574L11.3541 4.87574C10.9052 4.87574 10.5414 5.2389 10.5414 5.68689C10.5414 6.13487 10.9052 6.49804 11.3541 6.49804L18.099 6.49804ZM0.664038 11.4674L5.51063 7.27562L11.0283 12.0418L11.0283 21.9929L8.25177 21.9929L8.25177 17.3399C8.25177 16.1594 7.40181 15.1998 6.35705 15.1998L4.60754 15.1998C3.56278 15.1998 2.71281 16.1594 2.71281 17.3399L2.71281 21.9947L2.42595 21.9947C1.08711 21.9957 0.000976779 20.9133 0 19.5772L0 12.9183C0.000416786 12.3616 0.242642 11.8323 0.664038 11.4674ZM15.7067 11.8774L18.1025 11.8774C18.5514 11.8774 18.9153 11.5143 18.9153 11.0663C18.9153 10.6183 18.5514 10.2551 18.1025 10.2551L15.7067 10.2551C15.2578 10.2551 14.8939 10.6183 14.8939 11.0663C14.8939 11.5143 15.2578 11.8774 15.7067 11.8774ZM15.7067 16.8981L18.1025 16.8981C18.5372 16.8778 18.8791 16.5203 18.8791 16.086C18.8791 15.6518 18.5372 15.2942 18.1025 15.274L15.7067 15.274C15.2424 15.2524 14.8542 15.6222 14.8542 16.086C14.8542 16.5499 15.2424 16.9197 15.7067 16.8981ZM4.60574 16.8291L6.35526 16.8291L6.35526 16.8221C6.44557 16.8221 6.62265 17.0253 6.62265 17.3399L6.62265 22L4.33836 22L4.33836 17.3469C4.33836 17.0306 4.51366 16.8291 4.60574 16.8291Z"
        />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 48 })
</script>
